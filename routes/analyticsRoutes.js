const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middlewares/authMiddleware');

router.use(auth);

// e.g. /api/analytics/vehicle/1
router.get('/vehicle/:vehicle_id', analyticsController.getVehicleAnalytics);

module.exports = router;
