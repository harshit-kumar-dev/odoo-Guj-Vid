import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Layers, Filter, ArrowUpDown, Edit2, Plus, Info } from 'lucide-react';

const VehicleRegistry = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        license_plate: '',
        max_capacity_kg: '',
        odometer: '',
        vehicle_type: 'Truck',
        model_name: ''
    });

    const [isLicenseFocused, setIsLicenseFocused] = useState(false);
    const [isPayloadFocused, setIsPayloadFocused] = useState(false);
    const [isOdometerFocused, setIsOdometerFocused] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/vehicles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            // Assuming acquisition_cost defaults in db or not required, and status defaults to Available
            const payload = { ...formData, acquisition_cost: 0 };

            await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/vehicles`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Clear form
            setFormData({
                license_plate: '',
                max_capacity_kg: '',
                odometer: '',
                vehicle_type: 'Truck',
                model_name: ''
            });

            // Refresh list
            fetchVehicles();
            alert("Vehicle registered successfully!");
        } catch (err) {
            alert(err.response?.data?.error || "Error saving vehicle");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Available' ? 'Retired' : 'Available';
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/vehicles/${id}/status`, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchVehicles();
        } catch (err) {
            alert(err.response?.data?.error || "Error updating status");
        }
    }

    const getStatusStyle = (status) => {
        if (status === 'Available') return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
        if (status === 'OnTrip') return { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' };
        if (status === 'InShop') return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
        return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' }; // Retired
    };

    return (
        <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Vehicle Registry</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Manage your fleet assets.</p>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Form side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '0 0 320px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#1E293B' }}>✦</span> New Vehicle Registration
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '24px' }}>Add a new asset to your fleet registry.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>License Plate</label>
                            <input
                                type="text"
                                placeholder="e.g. MH 00 AA 1234"
                                value={formData.license_plate}
                                onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                                onFocus={() => setIsLicenseFocused(true)}
                                onBlur={() => setIsLicenseFocused(false)}
                                style={{
                                    padding: '10px 14px',
                                    border: `1px solid ${isLicenseFocused ? '#3B82F6' : '#E2E8F0'}`,
                                    boxShadow: isLicenseFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Max Payload (kg)</label>
                            <input
                                type="number"
                                placeholder="5000"
                                value={formData.max_capacity_kg}
                                onChange={(e) => setFormData({ ...formData, max_capacity_kg: e.target.value })}
                                onFocus={() => setIsPayloadFocused(true)}
                                onBlur={() => setIsPayloadFocused(false)}
                                style={{
                                    padding: '10px 14px',
                                    border: `1px solid ${isPayloadFocused ? '#3B82F6' : '#E2E8F0'}`,
                                    boxShadow: isPayloadFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Initial Odometer (km)</label>
                            <input
                                type="number"
                                placeholder="79000"
                                value={formData.odometer}
                                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                                onFocus={() => setIsOdometerFocused(true)}
                                onBlur={() => setIsOdometerFocused(false)}
                                style={{
                                    padding: '10px 14px',
                                    border: `1px solid ${isOdometerFocused ? '#3B82F6' : '#E2E8F0'}`,
                                    boxShadow: isOdometerFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Type</label>
                                <select
                                    value={formData.vehicle_type}
                                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                    style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', background: '#fff' }}
                                >
                                    <option value="Truck">Truck</option>
                                    <option value="Van">Van</option>
                                    <option value="Bike">Bike</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Model</label>
                                <input
                                    type="text"
                                    placeholder="TATA 407"
                                    value={formData.model_name}
                                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                                    style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', background: '#F8FAFC' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                        <button onClick={handleSave} style={{ background: '#2563EB', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer', flex: 1 }}>Save Vehicle</button>
                    </div>
                </div>

                {/* Table side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '1', minWidth: '600px', overflowX: 'auto' }}>
                    {loading ? <p>Loading vehicles...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>ID</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>PLATE</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>MODEL / TYPE</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>CAPACITY</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>ODOMETER</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>STATUS</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>TOGGLE STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((v, idx) => {
                                    const style = getStatusStyle(v.status);
                                    return (
                                        <tr key={v.id} style={{ borderBottom: idx === vehicles.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>#{v.id}</td>
                                            <td style={{ padding: '16px 16px', color: '#1E293B', fontSize: '0.875rem', fontWeight: '600' }}>{v.license_plate}</td>
                                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.model_name}<br /><small>{v.vehicle_type}</small></td>
                                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.max_capacity_kg} kg</td>
                                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.odometer}</td>
                                            <td style={{ padding: '16px 16px' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: style.bg, color: style.text, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }}></div>
                                                    {v.status}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 16px', color: '#94A3B8' }}>
                                                {(v.status === 'Available' || v.status === 'Retired') && (
                                                    <button
                                                        onClick={() => toggleStatus(v.id, v.status)}
                                                        style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', border: '1px solid #E2E8F0', background: 'white', color: v.status === 'Available' ? '#EF4444' : '#10B981' }}
                                                    >
                                                        {v.status === 'Available' ? 'Retire' : 'Activate'}
                                                    </button>
                                                )}
                                                {v.status === 'OnTrip' && <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>On Trip</span>}
                                                {v.status === 'InShop' && <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>In Shop</span>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleRegistry;
