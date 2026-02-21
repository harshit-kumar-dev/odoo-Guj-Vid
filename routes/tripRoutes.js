const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middlewares/authMiddleware');

router.use(auth);

router.get('/', tripController.getAllTrips);
router.post('/', tripController.createTrip);
router.patch('/:id/status', tripController.updateTripStatus);

module.exports = router;
