const SafetyResources = require('../models/SafetyResources');
const lang2 = require('../routes/lang2.json');
const lang = require('../routes/lang.json');

exports.create = async (req, res) => {
  try {
    const { title,content,type} = req.body;
    const userId = req.user._id;
    const createRecord = new SafetyResources({
      title,
      content,
      type
    });
    await createRecord.save();

    res.status(201).json({ success: true, message: 'Resources Created Successfully',data:createRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: lang["error"] });
  }
};


exports.getAllResourceApp = async (req, res) => {
  const userId = req.user._id;
  let query = {};
  if (req.params.id) {
    query._id = { $lt: req.params.id };
  }
  query.user_id = userId
  try {
    const messages = await SafetyResources.find(query).sort({ _id: -1 }).lean();


    if (messages.length > 0) {
      res.status(200).json({ success: true, messages: messages });
    } else {
      res.status(200).json({ success: false,messages:[], message: 'Not Emergency Message Found' });
    }
  } catch (error) {
    res.status(500).json({ message: lang2['error'] });
  }
};

exports.getResourcesAdmin = async (req, res) => {
  let query = {};
  const lastId = parseInt(req.params.id)||1;
  const type = req.params.type

  // Check if lastId is a valid number
  if (isNaN(lastId) || lastId < 0) {
    return res.status(400).json({ error:  'Invalid Last Id'});
  }
  const pageSize = 10;

  if (req.params.search) {
    query.title = { $regex: new RegExp(req.params.search, 'i') };
  }
  query.type = type

  const skip = Math.max(0, (lastId - 1)) * pageSize;

  try {
    const data = await SafetyResources.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize).lean();    

  const totalCount = await SafetyResources.find(query);
  const totalPages = Math.ceil(totalCount.length / pageSize);

    if (data.length > 0) {
      res.status(200).json({ success: true, data: data,count: { totalPage: totalPages, currentPageSize: data.length }  });
    } else {
      res.status(200).json({ success: false, data:[],message:  'No more data found',count: { totalPage: totalPages, currentPageSize: data.length }  });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteAdminResource = async (req, res) => {
  try {
    const Id = req.params.id;

    const data = await SafetyResources.findByIdAndDelete(Id);

    if (data == null) {
      return res.status(404).json({ message: 'Something went wrong on server' });
    }

    res.status(200).json({ message:'Resources Deleted Successfully', data: data });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong on server' });
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

exports.deleteMessages = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await EmergencyMessages.findByIdAndDelete(serviceId);

    if (service == null) {
      return res.status(404).json({ message: 'Something went wrong on server' });
    }

    res.status(200).json({ message:'Message Deleted Successfully', messages: service });

  } catch (error) {
    res.status(500).json({ message: req.user.lang=='spanish'?lang2["error"]:lang["error"] });
  }
};

