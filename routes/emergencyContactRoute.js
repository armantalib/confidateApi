const express = require('express');
const router = express.Router();
const emergencyContactController = require('../controllers/emergencyContactController');

router.post('/create', emergencyContactController.create);
router.get('/get', emergencyContactController.getContactsApp);
router.delete('/:id', emergencyContactController.deleteContact);
router.put('/update/:id/:status', emergencyContactController.deactivateMessage);

module.exports = router;
