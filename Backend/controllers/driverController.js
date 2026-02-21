const db = require('../config/db');

exports.getAllDrivers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Drivers ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching drivers' });
    }
};

exports.getDriverById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM Drivers WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Driver not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching driver' });
    }
};

exports.createDriver = async (req, res) => {
    try {
        const { name, license_number, license_expiry_date, safety_score, status } = req.body;

        if (!name || !license_number || !license_expiry_date) {
            return res.status(400).json({ error: 'Missing required driver fields' });
        }

        const result = await db.query(
            `INSERT INTO Drivers (name, license_number, license_expiry_date, safety_score, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, license_number, license_expiry_date, safety_score ?? 100, status || 'OffDuty']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') return res.status(400).json({ error: 'License number already exists' });
        res.status(500).json({ error: 'Server error creating driver' });
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, license_number, license_expiry_date, safety_score, status } = req.body;

        const result = await db.query(
            `UPDATE Drivers 
       SET name = $1, license_number = $2, license_expiry_date = $3, safety_score = $4, status = $5
       WHERE id = $6 RETURNING *`,
            [name, license_number, license_expiry_date, safety_score, status, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Driver not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') return res.status(400).json({ error: 'License number already exists' });
        res.status(500).json({ error: 'Server error updating driver' });
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM Drivers WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Driver not found' });
        res.json({ message: 'Driver deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error deleting driver' });
    }
};
