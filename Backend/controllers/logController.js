const db = require('../config/db');

exports.createMaintenanceLog = async (req, res) => {
    try {
        const { vehicle_id, description, cost, service_date } = req.body;

        if (!vehicle_id || !description || cost === undefined) {
            return res.status(400).json({ error: 'Missing required maintenance fields' });
        }

        await db.query('BEGIN');

        const result = await db.query(
            `INSERT INTO MaintenanceLogs (vehicle_id, description, cost, service_date)
       VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE)) RETURNING *`,
            [vehicle_id, description, cost, service_date]
        );

        // Business Logic: Vehicle goes to InShop
        await db.query("UPDATE Vehicles SET status = 'InShop' WHERE id = $1", [vehicle_id]);

        await db.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error creating maintenance log' });
    }
};

exports.createFuelLog = async (req, res) => {
    try {
        const { vehicle_id, trip_id, liters, cost, log_date } = req.body;

        if (!vehicle_id || liters === undefined || cost === undefined) {
            return res.status(400).json({ error: 'Missing required fuel log fields' });
        }

        const result = await db.query(
            `INSERT INTO FuelLogs (vehicle_id, trip_id, liters, cost, log_date)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE)) RETURNING *`,
            [vehicle_id, trip_id || null, liters, cost, log_date]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating fuel log' });
    }
};

exports.getLogsByVehicle = async (req, res) => {
    try {
        const { vehicle_id } = req.params;

        const maintenanceRes = await db.query('SELECT * FROM MaintenanceLogs WHERE vehicle_id = $1 ORDER BY service_date DESC', [vehicle_id]);
        const fuelRes = await db.query('SELECT * FROM FuelLogs WHERE vehicle_id = $1 ORDER BY log_date DESC', [vehicle_id]);

        res.json({
            maintenance_logs: maintenanceRes.rows,
            fuel_logs: fuelRes.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching logs' });
    }
};
