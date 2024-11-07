const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validate, validateCodeUser, generateAuthToken, passwordApiBodyValidate, generateIdToken, phoneApiBodyValidate } = require('../models/user');
const express = require('express');
const { sendEmail } = require('../controllers/emailservice');
const passwordauth = require('../middleware/passwordauth');
const { generateCode } = require('../controllers/generateCode');
const router = express.Router();
const moment = require('moment');
const { TempUser } = require('../models/TempUser');
const Application = require('../models/EmergencyMessages');
const Notification = require('../models/Notification');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const admin = require('../middleware/admin');
const EmergencyContacts = require('../models/EmergencyContacts');
const ConfiDates = require('../models/ConfiDates');
const BankDetail = require('../models/BankDetail');
const lang2 = require('./lang2.json');
const lang = require('./lang.json');
const { phoneservice } = require('../controllers/phoneservice');
const VoiceCodes = require('../models/VoiceCodes');
const EmergencyMessages = require('../models/EmergencyMessages');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send({ success: true, user });
});

router.get('/dashboard', auth, async (req, res) => {
  // Calculate the start date (today)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  // Calculate the end date (one month ago)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  const oneMonthOrders = await Application.find({
    user: req.user._id, status: "completed",
    createdAt: { $gte: oneMonthAgo, $lte: today }
  }).lean()

  const completedOrders = await Application.countDocuments({
    user: req.user._id, status: "completed",
  })

  const pendingOrders = await Application.countDocuments({
    user: req.user._id, status: "pending",
  })

  const activeOrders = await Application.countDocuments({
    user: req.user._id, status: "accepted",
  })

  const totalOrders = await Application.find({
    user: req.user._id,
  }).lean()

  const totalPriceSum = totalOrders.reduce((sum, order) => sum + order.bid_price, 0);
  const oneMonthAgoSum = oneMonthOrders.reduce((sum, order) => sum + order.bid_price, 0);

  res.send({
    success: true,
    totalEarning: totalPriceSum,
    oneMonthAgoEarning: oneMonthAgoSum,
    totalOrders: totalOrders.length,
    completedOrders: completedOrders,
    pendingOrders: pendingOrders,
    activeOrders: activeOrders,
  });
});
router.get('/admin/dashboard', auth, async (req, res) => {
  const buyeruser = await User.countDocuments();
  const confidates = await ConfiDates.countDocuments();
  const constacts = await EmergencyContacts.countDocuments();
  res.send({
    success: true,
    totalUsers: buyeruser,
    totalDates: confidates,
    totalContacts: constacts,
    totalTest: 0
  });
});

router.get('/totalUnseens/:type', auth, async (req, res) => {
  const userId = req.user._id;

  const type = req.params.type

  let applicationCount = {}
  if (type !== 'seller') {
    applicationCount = await Application.find({ to_id: userId, seen: false, status: { $in: ['pending', 'rejected'] } }).lean()
  } else {
    applicationCount = await Application.find({ user: userId, seen: false, status: { $in: ['accepted', 'completed', 'cancelled',] } }).lean()
  }
  const notifications = await Notification.find({ to_id: userId, seen: false }).lean()

  const conversations = await Conversation.find({ participants: { $in: [userId] } })
    .sort({ _id: -1 })
    .lean()
  let messageCount = 0
  for (let conversation of conversations) {
    const otherId = conversation.participants.filter(id => id._id.toString() !== userId.toString())

    const unseenMessages = await Message.find({ conversationId: conversation._id, sender: otherId[0]?._id, seen: false }).lean()

    messageCount = Number(messageCount) + unseenMessages.length
  }

  res.send({
    success: true,
    orderCount: applicationCount.length,
    notiCount: notifications.length,
    unseenMessage: messageCount
  });
});

router.get('/all/:id', [auth, admin], async (req, res) => {
  const lastId = parseInt(req.params.id) || 1;
  const userId = req.user._id;
  // Check if lastId is a valid number
  if (isNaN(lastId) || lastId < 0) {
    return res.status(400).json({ error: req.user.lang == 'spanish' ? lang2["Invalid_last_id"] : lang["Invalid_last_id"] });
  }

  const pageSize = 10;

  const skip = Math.max(0, (lastId - 1)) * pageSize;
  let query = {};
  query._id = { $nin: userId }
  // query.type = type
  // if (req.params.search) {
  //   const searchRegex = new RegExp(req.params.search, 'i');
  //   const searchQuery = [
  //     { fname: { $regex: searchRegex } },
  //     { lname: { $regex: searchRegex } }
  //   ];
  //   query.$or = searchQuery
  // }

  const users = await User.find(query).select('-password').sort({ _id: -1 }).skip(skip)
    .limit(pageSize).lean();

  const totalCount = await User.countDocuments(query);
  const totalPages = Math.ceil(totalCount / pageSize);

  res.send({ success: true, users: users, count: { totalPage: totalPages, currentPageSize: users.length } });
});


router.get('/other/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate("profession")

  let query = {};
  if (user.type == 'buyer') {
    query.to_id = user._id
  } else {
    query.user = user._id
  }

  const totalOrder = await Application.find(query).lean()
  const completed = await Application.find({ ...query, status: "completed" }).lean()
  const active = await Application.find({ ...query, status: "accepted" }).lean()
  const cancelled = await Application.find({ ...query, status: "cancelled" }).lean()
  res.send({ success: true, user, total: totalOrder.length, completed: completed.length, active: active.length, cancelled: cancelled.length });
});

router.post('/forget-password', async (req, res) => {
  const { error } = validateCodeUser(req.body);


  if (error) return res.status(400).send({ message: error.details[0].message });

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send({ message: lang["nouser"] });

  if (user.status == 'deleted') return res.status(400).send({ message: lang["deleted"] });

  const verificationCode = generateCode();

  await sendEmail(email, verificationCode)

  await User.findOneAndUpdate({ email }, { code: verificationCode });

  const token = generateIdToken(user._id);

  res.send({ success: true, message: lang["sendcode"], token, code: verificationCode });
});

router.put('/update-password', passwordauth, async (req, res) => {

  const { error } = passwordApiBodyValidate(req.body);
  if (error) return res.status(400).send({ success: false, message: error.details[0].message });

  const { password } = req.body

  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).send({ success: false, message: lang["nouserfound"] });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;

  await user.save();

  res.send({ success: true, message: lang["passupdate"] });
});

router.put('/change-password', auth, async (req, res) => {

  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).send({ success: false, message: lang["nouserfound"] });

  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword) return res.status(400).send({ success: false, message: 'Invalid password' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;

  await user.save();

  res.send({ success: true, message: lang["passupdate"] });
});

router.post('/send-code', async (req, res) => {
  const { phone } = req.body;

  try {
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(409).json({ error: lang2["phonealready"] });
    }

    const verificationCode = generateCode();
    await phoneservice(phone, verificationCode)

    // const expiresAt = moment().add(60, 'minutes').toDate();
    const existingTempUser = await TempUser.findOne({ phone });
    if (existingTempUser) {
      await TempUser.findByIdAndUpdate(existingTempUser._id, { code: verificationCode, })
    } else {
      const tempVerification = new TempUser({ phone, code: verificationCode });
      await tempVerification.save();
    }

    return res.json({ message: lang2["sendcode"] });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return res.status(500).json({ error: lang2["error"] });
  }
});

router.post('/send-sms', async (req, res) => {
  const { phone, sms } = req.body;

  try {
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(409).json({ error: lang2["phonealready"] });
    }

    await phoneservice(phone, sms)

    return res.json({ message: 'Send Sms' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return res.status(500).json({ error: lang2["error"] });
  }
});

router.post('/verify-otp/registration', async (req, res) => {
  try {
    const { phone, code } = req.body;

    const verificationRecord = await TempUser.findOne({ phone });

    if (!verificationRecord || Number(verificationRecord.code) !== Number(code)) {
      return res.status(200).json({ success: false, message: lang2["incorrect"] });
    }

    return res.json({ success: true, message: lang2["codematch"] });
  } catch (error) {
    return res.status(500).json({ error: lang2["error"] });
  }
});

router.get('/get-all-voices-data', auth, async (req, res) => {
  const userId = req.user._id;
  let query = {};
  if (req.params.id) {
    query._id = { $lt: req.params.id };
  }
  query.user_id = userId
  try {
    const data = await VoiceCodes.find(query).sort({ _id: -1 }).lean();
    const contacts = await EmergencyContacts.find(query).sort({ _id: -1 }).lean();
    const messages = await EmergencyMessages.find(query).sort({ _id: -1 }).lean();


    if (data.length > 0) {
      res.status(200).json({ success: true, voiceData: data, messageData: messages, contactsData: contacts });
    } else {
      res.status(200).json({ success: false, voiceData: [], messageData: [], contactsData: [], message: 'Not Voice Codes Found' });
    }
  } catch (error) {
    res.status(500).json({ message: lang2['error'] });
  }
});

router.post('/signup', async (req, res) => {


  const {

    email,
    phone,
    password,
    name,
    fcmtoken
  } = req.body;

  // const verificationRecord = await TempUser.findOne({ phone });

  // if (!verificationRecord) {
  //   return res.status(200).json({ success: false, message: lang2["notcompleteverification"] });
  // }


  const user = await User.findOne({ email });

  if (user) return res.status(400).send({ success: false, message: lang["emailalready"] });

  const phoneUser = await User.findOne({ phone });

  if (phoneUser) return res.status(400).send({ success: false, message: lang["phonealready"] });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    password: hashedPassword,
    email,
    name,
    phone,
    fcmtoken
  });

  await newUser.save();
  // await TempUser.deleteOne({ phone });

  const verificationCode = generateCode();

  await sendEmail(email, verificationCode)

  await User.findOneAndUpdate({ email }, { code: verificationCode });

  const token = generateAuthToken(newUser._id, newUser.email);

  res.send({ success: true, message: lang["acc_create"], token: token, user: newUser, code: verificationCode });
});

router.post('/verify-otp/forget-password', passwordauth, async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(200).send({ success: false, message: lang["nouserfound"] });

    if (Number(user.code) !== Number(code)) return res.status(200).send({ success: false, message: lang["incorrect"] });

    return res.json({ success: true, message: 'Verification code match successfully' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return res.status(500).json({ error: lang2["error"] });
  }
});

router.post('/check-email', async (req, res) => {
  const { error } = validateCodeUser(req.body);
  if (error) return res.status(400).send({ success: false, message: error.details[0].message });

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) return res.status(400).send({ success: false, message: lang2['emailalready'] });

  res.send({ success: true, message: "Email doesn't existed" });
});

router.post('/check-phone', async (req, res) => {
  const { error } = phoneApiBodyValidate(req.body);
  if (error) return res.status(400).send({ success: false, message: error.details[0].message });

  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (user) return res.status(400).send({ success: false, message: lang2["phonealready"] });

  res.send({ success: true, message: "Phone doesn't existed" });
});

router.put('/update-user', auth, async (req, res) => {
  const {
    name,
    age,
    education,
    about,
    location,
    job_title,
    height,
    weight
  } = req.body;

  // Create an object to store the fields to be updated
  const updateFields = Object.fromEntries(
    Object.entries({
      name,
      age,
      education,
      about,
      location,
      job_title,
      height,
      weight,
    }).filter(([key, value]) => value !== undefined)
  );

  // Check if there are any fields to update
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).send({ success: false, message:lang["novalid"] });
  }
  const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true
  });

  if (!user) return res.status(404).send({ success: false, message:  lang["nouserfound"] });

  res.send({ success: true, message:  lang["userupdate"], user });
});

router.put('/update-img', auth, async (req, res) => {
  const { image } = req.body;

  const user = await User.findByIdAndUpdate(req.user._id, { image: image }, { new: true });

  if (!user) return res.status(404).send({ success: false, message:  lang["nouserfound"] });
 
  res.send({ success: true, message: lang["userupdate"], user });
});

router.post('/add-bank', auth, async (req, res) => {
  const { acc_title, bank_name, number } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).send({ success: false, message: req.user.lang == 'spanish' ? lang2["nouserfound"] : lang["nouserfound"] });

  const bankdetail = new BankDetail({
    user: req.user._id,
    acc_title: acc_title,
    bank_name, number
  });
  await bankdetail.save();

  res.send({ success: true, message: req.user.lang == 'spanish' ? lang2["bankadded"] : lang["bankadded"], bankdetail: bankdetail });
});

router.put('/update-bank/:id', auth, async (req, res) => {
  const { acc_title, bank_name, number } = req.body;

  const bankdetail = await BankDetail.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { acc_title: acc_title, bank_name, number }, { new: true });

  if (!bankdetail) return res.status(404).send({ success: false, message: req.user.lang == 'spanish' ? lang2["nouserfound"] : lang["nouserfound"] });

  res.send({ success: true, message: req.user.lang == 'spanish' ? lang2["bankupdate"] : lang["bankupdate"], bankdetail: bankdetail });
});
router.delete('/bank/:id', auth, async (req, res) => {
  const bankdetail = await BankDetail.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!bankdetail) return res.status(404).send({ success: false, message: req.user.lang == 'spanish' ? lang2["nouserfound"] : lang["nouserfound"] });

  res.send({ success: true, message: req.user.lang == 'spanish' ? lang2["bankdelete"] : lang["bankdelete"], bankdetail: bankdetail });
});

router.get('/bank-details', auth, async (req, res) => {

  const bankdetails = await BankDetail.find({ user: req.user._id });

  res.send({ success: bankdetails.length == 0 ? false : true, bankdetails: bankdetails });
});

router.put('/update/:id/:status', [auth, admin], async (req, res) => {

  const user = await User.findByIdAndUpdate(req.params.id, { status: req.params.status }, { new: true });

  if (!user) return res.status(404).send({ success: false, message: req.user.lang == 'spanish' ? lang2["nouserfound"] : lang["nouserfound"] });

  res.send({ success: true, message: req.user.lang == 'spanish' ? lang2["userupdate"] : lang["userupdate"], user });
});

router.delete('/', auth, async (req, res) => {

  const user = await User.findByIdAndUpdate(req.user._id, { status: 'deleted' }, { new: true });

  if (!user) return res.status(404).send({ success: false, message: req.user.lang == 'spanish' ? lang2["nouserfound"] : lang["nouserfound"] });

  res.send({ success: true, message: req.user.lang == 'spanish' ? lang2["userdelete"] : lang["userdelete"], user });
});

router.delete('/admin/delete/:id', [auth, admin], async (req, res) => {

  const u_id = req.params.id

  const user = await User.findOneAndDelete({ _id: u_id });

  if (!user) return res.status(404).send({ success: false, message: 'Not Found' });

  res.send({ success: true, message: 'User Deleted Successfully', user: user });
});


router.post('/payment-intent', async (req, res) => {
  console.log("DD",process.env.STRIPE_SECRET)
  const { amount } = req.body;
  let currency = 'USD';
  let finalAm = parseFloat(amount)*100
  try {
    const paymentIntent = await stripe.paymentIntents.create({
     amount:finalAm,
      currency,
    });

    res.status(200).send({
      success:true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});



module.exports = router; 
