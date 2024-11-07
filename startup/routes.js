const express = require('express');
const error = require('../middleware/error');
const auth = require('../routes/auth');
const users = require('../routes/users');
const authMiddleWare = require('../middleware/auth');

const messageRoutes = require('../routes/messageRoutes');
const notificationRoute = require('../routes/notificationRoute');
const ratingRoutes = require('../routes/ratingRoutes');

const catRoute = require('../routes/catRoute');
const walletRoute = require('../routes/walletRoute');
// const supportRoute = require('../routes/supportRoute');
// const payment = require('../routes/PayRoute');

const emergencyMessagesRoute =  require('../routes/emergencyMessagesRoute')
const emergencyContactRoute =  require('../routes/emergencyContactRoute')
const confiDatesRoute =  require('../routes/ConfiDatesRoute')
const voiceCodesRoute =  require('../routes/voiceCodesRoute')
const safetyResourcesRoute =  require('../routes/safetyResourcesRoute')
const testResultRoute =  require('../routes/testResultRoute')
const quizRoute =  require('../routes/quizRoute')

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/cat', catRoute);
  // app.use('/api/image', uploadImages);
  // app.use('/api/training', trainingRoute);
  app.use('/api/msg', authMiddleWare, messageRoutes);
  app.use('/api/notification', authMiddleWare, notificationRoute);
  app.use('/api/wallet',authMiddleWare, walletRoute);
  app.use('/api/rating', ratingRoutes);
  // app.use('/api/support', supportRoute);
  // app.use('/api/payment', payment);

  app.use('/api/emergency', authMiddleWare, emergencyMessagesRoute);
  app.use('/api/contacts', authMiddleWare, emergencyContactRoute);
  app.use('/api/dates', authMiddleWare, confiDatesRoute);
  app.use('/api/voice', authMiddleWare, voiceCodesRoute);
  app.use('/api/resources', authMiddleWare, safetyResourcesRoute);
  app.use('/api/tests', authMiddleWare, testResultRoute);
  app.use('/api/quiz', authMiddleWare, quizRoute);

  app.use(error);
}