const express = require('express');
const router = express.Router();
const voiceCodesController = require('../controllers/voiceCodesController');

router.post('/create', voiceCodesController.create);
router.get('/get', voiceCodesController.getAllVoiceCodes);
router.delete('/:id', voiceCodesController.deleteVoiceCode);
router.put('/update/:id/:status', voiceCodesController.deactivateMessage);

module.exports = router;
