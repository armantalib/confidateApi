const express = require('express');
const router = express.Router();
const emergencyMessageController = require('../controllers/emergencyMessageController');

router.post('/create', emergencyMessageController.create);
router.get('/get', emergencyMessageController.getAllMessagesApp);
router.delete('/:id', emergencyMessageController.deleteMessages);
router.put('/update/:id/:status', emergencyMessageController.deactivateMessage);

module.exports = router;
