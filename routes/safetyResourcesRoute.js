const express = require('express');
const router = express.Router();
const safetyResourcesController = require('../controllers/safetyResourcesController');
const admin = require('../middleware/admin');
const authMiddleWare = require('../middleware/auth');

router.post('/admin/create',[authMiddleWare,admin], safetyResourcesController.create);
router.get('/admin/get/:id/:type',[authMiddleWare,admin], safetyResourcesController.getResourcesAdmin);
router.delete('/admin/delete/:id',[authMiddleWare,admin], safetyResourcesController.deleteAdminResource);
// router.get('/get', emergencyMessageController.getAllMessagesApp);
// router.delete('/:id', emergencyMessageController.deleteMessages);
// router.put('/update/:id/:status', emergencyMessageController.deactivateMessage);

module.exports = router;
