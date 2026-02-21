const db = require('../config/db');

exports.getVehicleAnalytics = async (req, res) => {
    try {
        const { vehicle_id } = req.params;

        const vehicleRes = await db.query('SELECT odometer, acquisition_cost FROM Vehicles WHERE id = $1', [vehicle_id]);
        if (vehicleRes.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        const vehicle = vehicleRes.rows[0];

        const maintenanceRes = await db.query('SELECT SUM(cost) as total_maintenance FROM MaintenanceLogs WHERE vehicle_id = $1', [vehicle_id]);
        const fuelRes = await db.query('SELECT SUM(liters) as total_liters, SUM(cost) as total_fuel_cost FROM FuelLogs WHERE vehicle_id = $1', [vehicle_id]);

        const totalMaintenance = parseFloat(maintenanceRes.rows[0].total_maintenance || 0);
        const totalFuelCost = parseFloat(fuelRes.rows[0].total_fuel_cost || 0);
        const totalLiters = parseFloat(fuelRes.rows[0].total_liters || 0);

        // km / liters = efficiency
        const fuelEfficiency = totalLiters > 0 ? (vehicle.odometer / totalLiters).toFixed(2) : 0;

        // Total operational cost
        const totalOperationalCost = totalMaintenance + totalFuelCost;

        res.json({
            vehicle_id,
            odometer_km: vehicle.odometer,
            total_maintenance_cost: totalMaintenance,
            total_fuel_cost: totalFuelCost,
            total_operational_cost: totalOperationalCost,
            total_liters_used: totalLiters,
            fuel_efficiency_km_per_liter: fuelEfficiency,
            acquisition_cost: vehicle.acquisition_cost,
            total_cost_of_ownership: totalOperationalCost + parseFloat(vehicle.acquisition_cost || 0)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error retrieving analytics' });
    }
};
