const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('config');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
  code: {
    type: Number,
    minlength: 0,
    maxlength: 4,
  },
  age: {
    type: String,
  },
  education: {
    type: String,
  },
  about: {
    type: String,
  },
  location: {
    type: String,
  },
  job_title: {
    type: String,
  },
  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  image: {
    type: String,
  },

  status: {
    type: String,
    default: 'online',
    enum: ['online', 'deleted', "deactivated"]
  },

  fcmtoken: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
});

function generateAuthToken(_id, email) {
  const token = jwt.sign({ _id: _id, email: email }, config.get('jwtPrivateKey'));
  return token;
}
function generateIdToken(_id) {
  const expiresIn = 3600; // Token will expire in 1 hour (3600 seconds)
  const token = jwt.sign({ _id: _id }, config.get('jwtIDPrivateKey'), { expiresIn });
  return token;
}


const User = mongoose.model('user', userSchema);

function validateUser(user) {
  const commonSchema = {
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).email(),
    phone: Joi.string().min(5).max(255),
    code: Joi.string().min(1).max(4).required(),
    fcmtoken: Joi.string().min(0).max(1024).optional()
  };

  const schema = Joi.object({
    ...commonSchema
  });

  return schema.validate(user);
}
function passwordApiBodyValidate(body) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
    token: Joi.string().min(5).max(255).required(),
  })

  return schema.validate(body);
}

function phoneApiBodyValidate(body) {
  const schema = Joi.object({
    phone: Joi.string().min(4).max(50).required(),
  })

  return schema.validate(body);
}

function validateCodeUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  })

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.generateAuthToken = generateAuthToken;
exports.generateIdToken = generateIdToken;
exports.passwordApiBodyValidate = passwordApiBodyValidate;
exports.validateCodeUser = validateCodeUser;
exports.phoneApiBodyValidate = phoneApiBodyValidate;