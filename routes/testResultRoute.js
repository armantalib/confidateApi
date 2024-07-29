const express = require('express');
const router = express.Router();
const testResultsController = require('../controllers/testResultsController');
const admin = require('../middleware/admin');
const authMiddleWare = require('../middleware/auth');

router.post('/create', testResultsController.create);
router.get('/user', testResultsController.getTestUser);
router.get('/count', testResultsController.testCountUser);
router.get('/admin/get/:id',[authMiddleWare, admin], testResultsController.getTestAdmin);
router.delete('/admin/delete/:id',[authMiddleWare, admin], testResultsController.deleteAdminTest);

// router.get('/get', emergencyMessageController.getAllMessagesApp);
// router.delete('/:id', emergencyMessageController.deleteMessages);
// router.put('/update/:id/:status', emergencyMessageController.deactivateMessage);

module.exports = router;
