const ConfiDates = require('../models/ConfiDates');
const Quiz = require('../models/Quiz');
const Grade = require('../models/Grade');
const GradeDetail = require('../models/GradeDetail');
const Question = require('../models/Question');
const lang2 = require('../routes/lang2.json');
const lang = require('../routes/lang.json');

exports.create = async (req, res) => {
  try {
    const { title, description, cost, grade_system, title_t, description_t } = req.body;
    const userId = req.user._id;
    const createRecord = new Quiz({
      title,
      description,
      cost,
      grade_system,
      title_t,
      description_t
    });
    await createRecord.save();

    res.status(201).json({ success: true, message: 'Quiz Created Successfully', dates: createRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: lang["error"] });
  }
};

exports.createGrade = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;
    const createRecord = new Grade({
      title,
    });
    await createRecord.save();

    res.status(201).json({ success: true, message: 'Grade Created Successfully', dates: createRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: lang["error"] });
  }
};

exports.createGradeDetail = async (req, res) => {
  try {
    const { grade, title, title_t, desc, desc_t, points_min,points_max } = req.body;
    const userId = req.user._id;
    const createRecord = new GradeDetail({
      grade, title, title_t, desc, desc_t, points_min,points_max
    });
    await createRecord.save();

    res.status(201).json({ success: true, message: 'Grade Created Successfully', dates: createRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: lang["error"] });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { title, title_t, type, options, quiz } = req.body;
    const userId = req.user._id;
    const createRecord = new Question({
      title,
      title_t,
      type,
      options,
      quiz
    });
    await createRecord.save();

    res.status(201).json({ success: true, message: 'Question Created Successfully', dates: createRecord });
  } catch (error) {
    // console.log(error);

    res.status(500).json({ success: false, message: lang["error"] });
  }
};

exports.editQuestion = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user._id;

    const { title, type, options, } = req.body;

    const service = await Question.findOneAndUpdate(
      { _id: serviceId },
      {
        title,
        type,
        options,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (service == null) {
      return res.status(404).json({ message: 'Please send correct id' });
    }

    res.status(200).json({ message: 'Updated Successfully', data: service });

  } catch (error) {
    res.status(500).json({ message: lang["error"] });
  }
};

exports.editGradeDetail = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user._id;

    const { title, title_t, desc, desc_t, points } = req.body;

    const service = await GradeDetail.findOneAndUpdate(
      { _id: serviceId },
      {
       title, title_t, desc, desc_t, points,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (service == null) {
      return res.status(404).json({ message: 'Please send correct id' });
    }

    res.status(200).json({ message: 'Updated Successfully', data: service });

  } catch (error) {
    res.status(500).json({ message: lang["error"] });
  }
};

exports.editGrade = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user._id;

    const { title } = req.body;

    const service = await Grade.findOneAndUpdate(
      { _id: serviceId },
      {
        title,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (service == null) {
      return res.status(404).json({ message: 'Please send correct id' });
    }

    res.status(200).json({ message: 'Updated Successfully', data: service });

  } catch (error) {
    res.status(500).json({ message: lang["error"] });
  }
};


exports.getQuizAdmin = async (req, res) => {
  let query = {};
  const lastId = parseInt(req.params.id) || 1;

  // Check if lastId is a valid number
  if (isNaN(lastId) || lastId < 0) {
    return res.status(400).json({ error: 'Invalid Last Id' });
  }
  const pageSize = 10;

  if (req.params.search) {
    query.title = { $regex: new RegExp(req.params.search, 'i') };
  }

  const skip = Math.max(0, (lastId - 1)) * pageSize;

  try {
    const data = await Quiz.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize).lean();

    const totalCount = await Quiz.find(query);
    const totalPages = Math.ceil(totalCount.length / pageSize);

    if (data.length > 0) {
      res.status(200).json({ success: true, data: data, count: { totalPage: totalPages, currentPageSize: data.length } });
    } else {
      res.status(200).json({ success: false, data: [], message: 'No more data found', count: { totalPage: totalPages, currentPageSize: data.length } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getGradeAdmin = async (req, res) => {
  let query = {};
  const lastId = parseInt(req.params.id) || 1;

  // Check if lastId is a valid number
  if (isNaN(lastId) || lastId < 0) {
    return res.status(400).json({ error: 'Invalid Last Id' });
  }
  const pageSize = 10;

  if (req.params.search) {
    query.title = { $regex: new RegExp(req.params.search, 'i') };
  }

  const skip = Math.max(0, (lastId - 1)) * pageSize;

  try {
    const data = await Grade.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize).lean();

    const totalCount = await Grade.find(query);
    const totalPages = Math.ceil(totalCount.length / pageSize);

    if (data.length > 0) {
      res.status(200).json({ success: true, data: data, count: { totalPage: totalPages, currentPageSize: data.length } });
    } else {
      res.status(200).json({ success: false, data: [], message: 'No more data found', count: { totalPage: totalPages, currentPageSize: data.length } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getGradeDetailAdmin = async (req, res) => {
  let query = {};
  const lastId = parseInt(req.params.id) || 1;
  const { grade } = req.params;
  
  // Check if lastId is a valid number
  if (isNaN(lastId) || lastId < 0) {
    return res.status(400).json({ error: 'Invalid Last Id' });
  }
  const pageSize = 10;

  if (req.params.search) {
    query.title = { $regex: new RegExp(req.params.search, 'i') };
  }
  query.grade = grade
  const skip = Math.max(0, (lastId - 1)) * pageSize;

  try {
    const data = await GradeDetail.find(query)
    .populate('grade')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize).lean();

    const totalCount = await GradeDetail.find(query);
    const totalPages = Math.ceil(totalCount.length / pageSize);

    if (data.length > 0) {
      res.status(200).json({ success: true, data: data, count: { totalPage: totalPages, currentPageSize: data.length } });
    } else {
      res.status(200).json({ success: false, data: [], message: 'No more data found', count: { totalPage: totalPages, currentPageSize: data.length } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getQuestionAdmin = async (req, res) => {
  let query = {};
  const lastId = parseInt(req.params.id) || 1;
  const { quiz } = req.params;
  // Check if lastId is a valid number
  if (isNaN(lastId) || lastId < 0) {
    return res.status(400).json({ error: 'Invalid Last Id' });
  }
  const pageSize = 10;

  if (req.params.search) {
    query.title = { $regex: new RegExp(req.params.search, 'i') };
  }
  query.quiz = quiz
  const skip = Math.max(0, (lastId - 1)) * pageSize;

  try {
    const data = await Question.find(query)
      .sort({ _id: -1 })
      .populate('quiz')
      .skip(skip)
      .limit(pageSize).lean();

    const totalCount = await Question.find(query);
    const totalPages = Math.ceil(totalCount.length / pageSize);

    if (data.length > 0) {
      res.status(200).json({ success: true, data: data, count: { totalPage: totalPages, currentPageSize: data.length } });
    } else {
      res.status(200).json({ success: false, data: [], message: 'No more data found', count: { totalPage: totalPages, currentPageSize: data.length } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getQuizQuestionApp = async (req, res) => {
  const userId = req.user._id;
  const quiz_id = req.params.quiz_id
  let query = {};
  if (req.params.id) {
    query._id = { $lt: req.params.id };
  }
  if(quiz_id){
    query.quiz = quiz_id
  }
  try {
    const questionData = await Question.find(query).sort({ _id: -1 }).populate('quiz').lean();
    const quizData = await Quiz.findOne({_id:quiz_id}).sort({ _id: -1 }).lean();
    const data = {
      quiz : quizData,
      questions_data : questionData
    }

    if (questionData.length > 0) {
      res.status(200).json({ success: true, data: data });
    } else {
      res.status(200).json({ success: false,data:[], message: 'Not Dates Found' });
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: lang['error'] });
  }
};

exports.getQuizApp = async (req, res) => {
  const userId = req.user._id;
  let query = {};
  if (req.params.id) {
    query._id = { $lt: req.params.id };
  }

  try {
    const data = await Quiz.find(query).sort({ _id: -1 }).lean();


    if (data.length > 0) {
      res.status(200).json({ success: true, data: data });
    } else {
      res.status(200).json({ success: false,data:[], message: 'Not Dates Found' });
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: lang['error'] });
  }
};

exports.submitQuizForResult = async (req, res) => {
  const userId = req.user._id;

  const { score,grade } = req.body;

  try {
    const data = await GradeDetail.find({grade:grade}).sort({ _id: -1 }).lean();
    let answer = null
    data.forEach((element,index) => {
      // console.log(element?.points_min,score,'min');
      // console.log(element?.points_max,score,'max');
      if(score >= element?.points_min && score <= element?.points_max ){
        console.log("Match",element);
        answer = element
      }
      
    });
    answer.points = score;

    if (answer) {
      res.status(200).json({ success: true, answer:answer,score:score });
    } else {
      res.status(200).json({ success: false,data:[], message: 'Not Dates Found' });
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: lang['error'] });
  }
};




exports.deleteQuiz = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await Quiz.findByIdAndDelete(serviceId);

    if (service == null) {
      return res.status(404).json({ message: 'Something went wrong on server' });
    }

    res.status(200).json({ message: 'Message Deleted Successfully', contacts: service });

  } catch (error) {
    res.status(500).json({ message: req.user.lang == 'spanish' ? lang2["error"] : lang["error"] });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await Question.findByIdAndDelete(serviceId);

    if (service == null) {
      return res.status(404).json({ message: 'Something went wrong on server' });
    }

    res.status(200).json({ message: 'Message Deleted Successfully', contacts: service });

  } catch (error) {
    res.status(500).json({ message: req.user.lang == 'spanish' ? lang2["error"] : lang["error"] });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await Grade.findByIdAndDelete(serviceId);
    await GradeDetail.deleteMany({
      grade:serviceId
    });

    if (service == null) {
      return res.status(404).json({ message: 'Something went wrong on server' });
    }

    res.status(200).json({ message: 'Message Deleted Successfully', contacts: service });

  } catch (error) {
    res.status(500).json({ message: req.user.lang == 'spanish' ? lang2["error"] : lang["error"] });
  }
};

exports.deleteGradeDetail = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await GradeDetail.findByIdAndDelete(serviceId);

    if (service == null) {
      return res.status(404).json({ message: 'Something went wrong on server' });
    }

    res.status(200).json({ message: 'Message Deleted Successfully', contacts: service });

  } catch (error) {
    res.status(500).json({ message: req.user.lang == 'spanish' ? lang2["error"] : lang["error"] });
  }
};

