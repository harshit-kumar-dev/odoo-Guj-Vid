const db = require('../config/db');

exports.getAllTrips = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Trips ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching trips' });
    }
};

exports.createTrip = async (req, res) => {
    try {
        const { vehicle_id, driver_id, cargo_weight, start_location, end_location, start_odometer } = req.body;

        // 1. Fetch vehicle and driver validations
        const vehicleRes = await db.query('SELECT * FROM Vehicles WHERE id = $1', [vehicle_id]);
        const driverRes = await db.query('SELECT * FROM Drivers WHERE id = $1', [driver_id]);

        if (vehicleRes.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        if (driverRes.rows.length === 0) return res.status(404).json({ error: 'Driver not found' });

        const vehicle = vehicleRes.rows[0];
        const driver = driverRes.rows[0];

        // Validation Logic
        if (cargo_weight > vehicle.max_capacity_kg) {
            return res.status(400).json({ error: 'Cargo weight exceeds vehicle capacity' });
        }
        if (vehicle.status !== 'Available') {
            return res.status(400).json({ error: 'Vehicle is not Available' });
        }
        if (driver.status !== 'OnDuty') {
            return res.status(400).json({ error: 'Driver is not OnDuty' });
        }

        const today = new Date();
        const expiryDate = new Date(driver.license_expiry_date);
        if (expiryDate < today) {
            return res.status(400).json({ error: 'Driver license is expired' });
        }

        // Insert Trip
        const result = await db.query(
            `INSERT INTO Trips (vehicle_id, driver_id, cargo_weight, start_location, end_location, start_odometer, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Draft') RETURNING *`,
            [vehicle_id, driver_id, cargo_weight, start_location, end_location, start_odometer || vehicle.odometer]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating trip' });
    }
};

exports.updateTripStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, end_odometer } = req.body;

        // valid statuses: 'Draft', 'Dispatched', 'Completed', 'Cancelled'
        if (!['Draft', 'Dispatched', 'Completed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const tripRes = await db.query('SELECT * FROM Trips WHERE id = $1', [id]);
        if (tripRes.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });
        const trip = tripRes.rows[0];

        // Transaction for cascade logic
        await db.query('BEGIN');

        const result = await db.query(
            'UPDATE Trips SET status = $1, end_odometer = $2 WHERE id = $3 RETURNING *',
            [status, end_odometer || trip.end_odometer, id]
        );

        if (status === 'Dispatched') {
            await db.query("UPDATE Vehicles SET status = 'OnTrip' WHERE id = $1", [trip.vehicle_id]);
            await db.query("UPDATE Drivers SET status = 'OnDuty' WHERE id = $1", [trip.driver_id]);
        } else if (status === 'Completed') {
            await db.query("UPDATE Vehicles SET status = 'Available' WHERE id = $1", [trip.vehicle_id]);
            await db.query("UPDATE Drivers SET status = 'OnDuty' WHERE id = $1", [trip.driver_id]);
            if (end_odometer) {
                await db.query('UPDATE Vehicles SET odometer = $1 WHERE id = $2', [end_odometer, trip.vehicle_id]);
            }
        }

        await db.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error updating trip status' });
    }
};
