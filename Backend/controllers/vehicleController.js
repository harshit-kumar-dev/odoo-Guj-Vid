const db = require('../config/db');

exports.getAllVehicles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Vehicles ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching vehicles' });
    }
};

exports.getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM Vehicles WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching vehicle' });
    }
};

exports.createVehicle = async (req, res) => {
    try {
        const { model_name, license_plate, vehicle_type, max_capacity_kg, odometer, status, acquisition_cost } = req.body;

        // Some validation
        if (!model_name || !license_plate || !vehicle_type || !max_capacity_kg) {
            return res.status(400).json({ error: 'Missing required vehicle fields' });
        }

        const result = await db.query(
            `INSERT INTO Vehicles (model_name, license_plate, vehicle_type, max_capacity_kg, odometer, status, acquisition_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [model_name, license_plate, vehicle_type, max_capacity_kg, odometer || 0, status || 'Available', acquisition_cost || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        // Unique constraint violation for license plate
        if (err.code === '23505') return res.status(400).json({ error: 'License plate already exists' });
        res.status(500).json({ error: 'Server error creating vehicle' });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { model_name, license_plate, vehicle_type, max_capacity_kg, odometer, status, acquisition_cost } = req.body;

        const result = await db.query(
            `UPDATE Vehicles 
       SET model_name = $1, license_plate = $2, vehicle_type = $3, max_capacity_kg = $4, odometer = $5, status = $6, acquisition_cost = $7
       WHERE id = $8 RETURNING *`,
            [model_name, license_plate, vehicle_type, max_capacity_kg, odometer, status, acquisition_cost, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') return res.status(400).json({ error: 'License plate already exists' });
        res.status(500).json({ error: 'Server error updating vehicle' });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM Vehicles WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error deleting vehicle' });
    }
};
