const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleWare = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const admin = require('../middleware/admin');

router.post('/create', quizController.create);
router.get('/admin/get/:id', quizController.getQuizAdmin);
router.get('/get/:id?', quizController.getQuizApp);
router.post('/submit', quizController.submitQuizForResult);
router.delete('/admin/delete/:id',[authMiddleWare, admin],  quizController.deleteQuiz);

router.post('/question/create', quizController.createQuestion);
router.get('/question/admin/get/:id/:quiz', quizController.getQuestionAdmin);
router.get('/question/get/:quiz_id/:id?', quizController.getQuizQuestionApp);
router.put('/question/admin/update/:id', quizController.editQuestion);
router.delete('/question/admin/delete/:id',[authMiddleWare, admin],  quizController.deleteQuestion);

router.post('/grade/create', quizController.createGrade);
router.get('/grade/admin/get/:id', quizController.getGradeAdmin);
router.put('/grade/admin/update/:id', quizController.editGrade);
router.delete('/grade/admin/delete/:id',[authMiddleWare, admin],  quizController.deleteGrade);

router.post('/grade/detail/create', quizController.createGradeDetail);
router.get('/grade/detail/admin/get/:id/:grade', quizController.getGradeDetailAdmin);
router.put('/grade/detail/admin/update/:id', quizController.editGradeDetail);
router.delete('/grade/detail/admin/delete/:id',[authMiddleWare, admin],  quizController.deleteGradeDetail);



// router.delete('/:id', confiDatesController.deleteContact);
// router.get('/admin/get/:id',[authMiddleWare, admin], confiDatesController.getDatesAdmin);
// router.delete('/admin/delete/:id',[authMiddleWare, admin], confiDatesController.deleteAdminDate);
// // router.put('/update/:id/:status', emergencyContactController.deactivateMessage);

module.exports = router;
