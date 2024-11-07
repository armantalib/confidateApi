const EmergencyContacts = require('../models/EmergencyContacts');
const lang2 = require('../routes/lang2.json');
const lang = require('../routes/lang.json');

exports.create = async (req, res) => {
  try {
    const { contact,name} = req.body;
    const userId = req.user._id;
    const createRecord = new EmergencyContacts({
      user_id: userId,
      contact,
      name
    });
    await createRecord.save();

    res.status(201).json({ success: true, message: 'Emergency Contact Created Successfully',contact:createRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: lang["error"] });
  }
};


exports.getContactsApp = async (req, res) => {
  const userId = req.user._id;
  let query = {};
  if (req.params.id) {
    query._id = { $lt: req.params.id };
  }
  query.user_id = userId
  try {
    const contacts = await EmergencyContacts.find(query).sort({ _id: -1 }).lean();


    if (contacts.length > 0) {
      res.status(200).json({ success: true, contacts: contacts });
    } else {
      res.status(200).json({ success: false,contacts:[], message: 'Not Emergency Contact Found' });
    }
  } catch (error) {
    res.status(500).json({ message: lang['error'] });
  }
};


exports.editCategories = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user._id;

    const { name, image } = req.body;

    const service = await Category.findOneAndUpdate(
      { user: userId, _id: serviceId },
      {
        name, image,
        updated_at: Date.now()
      },
      { new: true }
    );

    if (service == null) {
      return res.status(404).json({ message:req.user.lang=='spanish'?lang2["not_cat"]:lang["not_cat"] });
    }

    res.status(200).json({ message: req.user.lang=='spanish'?lang2["catupdate"]:lang["catupdate"], Category: service });

  } catch (error) {
    res.status(500).json({ message: req.user.lang=='spanish'?lang2["error"]:lang["error"]});
  }
};

exports.deactivateMessage = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user._id;


    const service = await EmergencyMessages.findOneAndUpdate(
      { user_id: userId, _id: serviceId },
      {
        active: req.params.status,
      },
      { new: true }
    );

    if (service == null) {
      return res.status(404).json({ message: 'Something went wrong' });
    }

    res.status(200).json({ message: 'Message status updated successfully', message: service });

  } catch (error) {
    res.status(500).json({ message: lang["error"] });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await EmergencyContacts.findByIdAndDelete(serviceId);

    if (service == null) {
      return res.status(404).json({ message: 'Something went wrong on server' });
    }

    res.status(200).json({ message:'Message Deleted Successfully', contacts: service });

  } catch (error) {
    res.status(500).json({ message: req.user.lang=='spanish'?lang2["error"]:lang["error"] });
  }
};

