import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PenTool, CarFront } from 'lucide-react';
import './Management.css';

const Management = () => {
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        vehicle_id: '',
        description: 'Engine Issue',
        cost: '',
        service_date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [logsRes, vehRes] = await Promise.all([
                axios.get('http://localhost:3000/api/logs/maintenance', config),
                axios.get('http://localhost:3000/api/vehicles', config)
            ]);

            setLogs(logsRes.data);
            setVehicles(vehRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateLog = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/logs/maintenance', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Maintenance log recorded - Vehicle is now marked InShop!');
            setFormData({ vehicle_id: '', description: 'Engine Issue', cost: '', service_date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Error recording maintenance check");
        }
    }

    return (
        <div className="management-container">
            <main className="management-main" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Maintenance & Service Logs</h1>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Schedule services and track repair costs.</p>
                </div>

                <div className="content-box">
                    <div className="management-content-split">
                        {/* New Service Form Side */}
                        <div className="management-form-panel">
                            <div className="panel-header">
                                <h3>New Service Request</h3>
                                <p>Add a new maintenance log to the fleet.</p>
                            </div>

                            <form className="management-form" onSubmit={handleCreateLog}>
                                <div className="input-group">
                                    <label>Vehicle Name</label>
                                    <select required name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                                        <option value="">- Select Vehicle -</option>
                                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.license_plate} ({v.model_name})</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Issue / Service Type</label>
                                    <select name="description" value={formData.description} onChange={handleChange} style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                                        <option value="Engine Issue">Engine Issue</option>
                                        <option value="Brake Pad">Brake Pad Replacement</option>
                                        <option value="Oil Change">Oil Change</option>
                                        <option value="Tire Replacement">Tire Replacement</option>
                                        <option value="Accident Repair">Accident Repair</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Estimated Cost (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        name="cost"
                                        placeholder="e.g. 1500"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Service Date</label>
                                    <input
                                        type="date"
                                        required
                                        name="service_date"
                                        value={formData.service_date}
                                        onChange={handleChange}
                                        style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    />
                                </div>

                                <div className="form-actions" style={{ marginTop: '16px' }}>
                                    <button type="submit" className="btn-primary" style={{ backgroundColor: '#059669', border: 'none', padding: '10px 16px', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Create Log</button>
                                </div>
                            </form>
                        </div>

                        {/* Table Listing Side */}
                        <div className="management-table-panel">
                            {loading ? <p>Loading logs...</p> : (
                                <table className="management-table">
                                    <thead>
                                        <tr>
                                            <th>LOG ID</th>
                                            <th>VEHICLE ID</th>
                                            <th>ISSUE/SERVICE</th>
                                            <th>DATE</th>
                                            <th>COST</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => (
                                            <tr key={log.id}>
                                                <td className="cost-bold" style={{ color: '#6B7280' }}>#{log.id}</td>
                                                <td>
                                                    <div className="vehicle-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <CarFront size={16} color="#3B82F6" />
                                                        <span className="vehicle-name">Veh #{log.vehicle_id}</span>
                                                    </div>
                                                </td>
                                                <td>{log.description}</td>
                                                <td>{new Date(log.service_date).toLocaleDateString()}</td>
                                                <td className="cost-bold" style={{ color: '#D97706' }}>₹{log.cost}</td>
                                                <td>
                                                    <span className="status-pill status-completed">COMPLETED</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Management;
