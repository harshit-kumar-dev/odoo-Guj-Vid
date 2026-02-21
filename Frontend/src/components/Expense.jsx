import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Fuel, CreditCard, Calendar } from 'lucide-react';
import './Expense.css';

const Expense = () => {
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        vehicle_id: '',
        trip_id: '',
        liters: '',
        cost: '',
        log_date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [logsRes, vehRes, tripRes] = await Promise.all([
                axios.get('http://localhost:3000/api/logs/fuel', config),
                axios.get('http://localhost:3000/api/vehicles', config),
                axios.get('http://localhost:3000/api/trips', config)
            ]);

            setLogs(logsRes.data);
            setVehicles(vehRes.data);
            setTrips(tripRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                trip_id: formData.trip_id ? parseInt(formData.trip_id) : null
            };

            await axios.post('http://localhost:3000/api/logs/fuel', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Fuel log recorded successfully!');
            setFormData({ vehicle_id: '', trip_id: '', liters: '', cost: '', log_date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Error logging expense");
        }
    };

    return (
        <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Trip Expenses & Fuel Logs</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Track operational costs and fuel consumption per vehicle.</p>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Form side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '0 0 340px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>Log Fuel Expense</h3>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Vehicle</label>
                            <select
                                required
                                value={formData.vehicle_id}
                                onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                                style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }}
                            >
                                <option value="">Select a Vehicle...</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.license_plate} ({v.model_name})</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Associated Trip (Optional)</label>
                            <select
                                value={formData.trip_id}
                                onChange={e => setFormData({ ...formData, trip_id: e.target.value })}
                                style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }}
                            >
                                <option value="">None (General Refuel)</option>
                                {trips.map(t => <option key={t.id} value={t.id}>Trip #{t.id} ({t.start_location} → {t.end_location})</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Liters</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                                    <Fuel size={14} color="#94A3B8" style={{ marginRight: '8px' }} />
                                    <input type="number" step="0.1" required value={formData.liters} onChange={e => setFormData({ ...formData, liters: e.target.value })} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} placeholder="0.0" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Total Cost (₹)</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                                    <CreditCard size={14} color="#94A3B8" style={{ marginRight: '8px' }} />
                                    <input type="number" step="0.01" required value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} placeholder="0.00" />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Date</label>
                            <input
                                type="date"
                                required
                                value={formData.log_date}
                                onChange={e => setFormData({ ...formData, log_date: e.target.value })}
                                style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }}
                            />
                        </div>

                        <button type="submit" style={{ background: '#2563EB', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '500', marginTop: '10px', cursor: 'pointer' }}>Save Fuel Log</button>
                    </form>
                </div>

                {/* Table side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '1', minWidth: '500px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>Recent Fuel Transactions</h3>

                    {loading ? <p>Loading logs...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>DATE</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>VEHICLE</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>TRIP ID</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>VOLUME</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>TOTAL COST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.875rem' }}>{new Date(log.log_date).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px 12px', color: '#1E293B', fontSize: '0.875rem', fontWeight: '500' }}>Veh #{log.vehicle_id}</td>
                                        <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.875rem' }}>{log.trip_id ? `#TRP-${log.trip_id}` : '--'}</td>
                                        <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.875rem' }}>{log.liters} L</td>
                                        <td style={{ padding: '16px 12px', color: '#10B981', fontSize: '0.875rem', fontWeight: '600' }}>₹{log.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expense;
