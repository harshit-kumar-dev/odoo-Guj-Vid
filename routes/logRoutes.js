const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middlewares/authMiddleware');

router.use(auth);

router.post('/maintenance', logController.createMaintenanceLog);
router.post('/fuel', logController.createFuelLog);
router.get('/vehicle/:vehicle_id', logController.getLogsByVehicle);

module.exports = router;
