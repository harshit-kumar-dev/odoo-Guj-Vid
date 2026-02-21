const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middlewares/authMiddleware');

// Protect all driver routes
router.use(auth);

router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriverById);
router.post('/', driverController.createDriver);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

module.exports = router;
