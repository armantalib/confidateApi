const express = require('express');
const router = express.Router();
const confiDatesController = require('../controllers/ConfiDatesController');
const authMiddleWare = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const admin = require('../middleware/admin');

router.post('/create', confiDatesController.create);
router.get('/get', confiDatesController.getDatesApp);
router.delete('/:id', confiDatesController.deleteContact);
router.get('/admin/get/:id',[authMiddleWare, admin], confiDatesController.getDatesAdmin);
router.delete('/admin/delete/:id',[authMiddleWare, admin], confiDatesController.deleteAdminDate);
// router.put('/update/:id/:status', emergencyContactController.deactivateMessage);

module.exports = router;
