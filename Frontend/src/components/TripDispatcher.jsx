import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Layers, Filter, ArrowUpDown, MoreHorizontal, MapPin, Zap } from 'lucide-react';

const TripDispatcher = () => {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        vehicle_id: '',
        driver_id: '',
        cargo_weight: '',
        start_location: '',
        end_location: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const [tripRes, vehRes, driRes] = await Promise.all([
                axios.get('http://localhost:3000/api/trips', config),
                axios.get('http://localhost:3000/api/vehicles', config),
                axios.get('http://localhost:3000/api/drivers', config),
            ]);

            setTrips(tripRes.data);
            setVehicles(vehRes.data.filter(v => v.status === 'Available'));
            setDrivers(driRes.data.filter(d => d.status === 'OnDuty'));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDispatch = async () => {
        try {
            const token = localStorage.getItem('token');
            // Basic Frontend Validation (Cargo > Max Capacity)
            const selectedVehicle = vehicles.find(v => v.id == formData.vehicle_id);
            if (selectedVehicle && Number(formData.cargo_weight) > selectedVehicle.max_capacity_kg) {
                alert(`Error: Cargo weight (${formData.cargo_weight}kg) exceeds vehicle capacity (${selectedVehicle.max_capacity_kg}kg)!`);
                return;
            }

            await axios.post('http://localhost:3000/api/trips', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Trip dispatched successfully!');
            setFormData({ vehicle_id: '', driver_id: '', cargo_weight: '', start_location: '', end_location: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Error dispatching trip");
        }
    };

    const updateTripStatus = async (id, currentStatus) => {
        let newStatus = 'Dispatched';
        // Simple linear flow Draft -> Dispatched -> Completed
        if (currentStatus === 'Draft') newStatus = 'Dispatched';
        else if (currentStatus === 'Dispatched') newStatus = 'Completed';
        else return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/trips/${id}/status`, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert("Error updating status");
        }
    }

    const getStatusStyle = (status) => {
        if (status === 'Completed') return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
        if (status === 'Dispatched') return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
        if (status === 'Draft') return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' };
        return { bg: '#E5E7EB', text: '#374151', dot: '#6B7280' };
    };

    return (
        <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Trip Dispatcher</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Manage and dispatch new trips.</p>
            </div>

            {/* Active Trips Table */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} color="#F59E0B" fill="#F59E0B" /> Active Trips
                    </h3>
                </div>
                {loading ? <p>Loading trips...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '10%' }}>TRIP ID</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>VEHICLE ID</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>DRIVER ID</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>ORIGIN</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>DESTINATION</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '10%' }}>STATUS</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map((trip, idx) => {
                                const style = getStatusStyle(trip.status);
                                return (
                                    <tr key={trip.id} style={{ borderBottom: idx === trips.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 0', color: '#2563EB', fontWeight: '500', fontSize: '0.875rem' }}>#{trip.id}</td>
                                        <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>Veh #{trip.vehicle_id}</td>
                                        <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>Driver #{trip.driver_id}</td>
                                        <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>{trip.start_location}</td>
                                        <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>{trip.end_location}</td>
                                        <td style={{ padding: '16px 0' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: style.bg, color: style.text, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }}></div>
                                                {trip.status}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 0', color: '#94A3B8' }}>
                                            {trip.status === 'Draft' && <button onClick={() => updateTripStatus(trip.id, 'Draft')} style={{ padding: '4px 8px', cursor: 'pointer' }}>Mark Dispatched</button>}
                                            {trip.status === 'Dispatched' && <button onClick={() => updateTripStatus(trip.id, 'Dispatched')} style={{ padding: '4px 8px', cursor: 'pointer' }}>Mark Completed</button>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* New Trip Dispatch Form */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#334155', display: 'flex', alignItems: 'center' }}>⛭</span> New Trip Dispatch
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Assign available vehicles and drivers for new delivery assignments.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Select Available Vehicle</label>
                        <select
                            value={formData.vehicle_id}
                            onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                            style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', background: '#fff' }}
                        >
                            <option value="">- Choose Vehicle -</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.license_plate} - {v.model_name} ({v.max_capacity_kg}kg capacity)</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Cargo Weight (Kg)</label>
                        <input
                            type="number"
                            placeholder="e.g. 12000"
                            value={formData.cargo_weight}
                            onChange={(e) => setFormData({ ...formData, cargo_weight: e.target.value })}
                            style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Select OnDuty Driver</label>
                        <select
                            value={formData.driver_id}
                            onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                            style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', background: '#fff' }}
                        >
                            <option value="">- Choose Driver -</option>
                            {drivers.map(d => <option key={d.id} value={d.id}>{d.name} (License: {d.license_number})</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Origin Address</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', gap: '8px' }}>
                        <MapPin size={16} color="#94A3B8" />
                        <input
                            type="text"
                            value={formData.start_location}
                            onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                            placeholder="Enter pickup location details" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Destination Address</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', gap: '8px' }}>
                        <MapPin size={16} color="#94A3B8" />
                        <input
                            type="text"
                            value={formData.end_location}
                            onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                            placeholder="Enter drop-off location details" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleDispatch} style={{ background: '#2563EB', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer' }}>Dispatch Trip</button>
                    <button style={{ background: '#fff', color: '#475569', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TripDispatcher;
