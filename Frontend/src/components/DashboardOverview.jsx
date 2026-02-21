import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Truck, AlertTriangle, Activity, PackageCheck, Search } from 'lucide-react';

const DashboardOverview = () => {
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };

                // Fetch vehicles and trips for KPIs
                const [vehRes, tripRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/vehicles', config),
                    axios.get('http://localhost:3000/api/trips', config)
                ]);

                setVehicles(vehRes.data);
                setTrips(tripRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();

    // Calculate KPIs
    const onTripVehicles = vehicles.filter(v => v.status === 'OnTrip').length;
    const inShopVehicles = vehicles.filter(v => v.status === 'InShop').length;
    const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
    const totalVehicles = vehicles.length;
    const utilRate = totalVehicles > 0 ? Math.round((onTripVehicles / (totalVehicles - inShopVehicles)) * 100) || 0 : 0;

    // Draft trips = Pending Cargo
    const pendingTrips = trips.filter(t => t.status === 'Draft').length;

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Command Center</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate('/vehicle-registry')} style={{ background: '#fff', color: '#475569', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        + New Vehicle
                    </button>
                    <button onClick={() => navigate('/dispatcher')} style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={16} /> New Trip
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: '50%' }}>
                        <Truck size={24} color="#3B82F6" />
                    </div>
                    <div>
                        <p style={{ color: '#000', fontSize: '0.875rem', fontWeight: '500' }}>Active Fleet</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#000' }}>{onTripVehicles}</h3>
                        <p style={{ color: '#10B981', fontSize: '0.75rem', marginTop: '4px' }}>On Route</p>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#FEF2F2', padding: '1rem', borderRadius: '50%' }}>
                        <AlertTriangle size={24} color="#EF4444" />
                    </div>
                    <div>
                        <p style={{ color: '#000', fontSize: '0.875rem', fontWeight: '500' }}>Maintenance Alerts</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#000' }}>{inShopVehicles}</h3>
                        <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>Vehicles In Shop</p>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '50%' }}>
                        <Activity size={24} color="#10B981" />
                    </div>
                    <div>
                        <p style={{ color: '#000', fontSize: '0.875rem', fontWeight: '500' }}>Utilization Rate</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#000' }}>{utilRate}%</h3>
                        <p style={{ color: '#000', fontSize: '0.75rem', marginTop: '4px' }}>Of Available Fleet</p>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '50%' }}>
                        <PackageCheck size={24} color="#D97706" />
                    </div>
                    <div>
                        <p style={{ color: '#000', fontSize: '0.875rem', fontWeight: '500' }}>Pending Cargo</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#000' }}>{pendingTrips}</h3>
                        <p style={{ color: '#D97706', fontSize: '0.75rem', marginTop: '4px' }}>Trips Awaiting Dispatch</p>
                    </div>
                </div>
            </div>

            {/* Quick Fleet Table */}
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#000' }}>Fleet Status Tracker</h2>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#000' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F9FAFB', color: '#000', fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: 600 }}>
                            <th style={{ padding: '1rem 1.5rem' }}>Vehicle ID</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Model / Type</th>
                            <th style={{ padding: '1rem 1.5rem' }}>License Plate</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Load Capacity</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(v => (
                            <tr key={v.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>#{v.id}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{v.model_name}<br /><span style={{ fontSize: '0.75rem', color: '#000' }}>{v.vehicle_type}</span></td>
                                <td style={{ padding: '1rem 1.5rem' }}>{v.license_plate}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{v.max_capacity_kg} kg</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500',
                                        backgroundColor: v.status === 'Available' ? '#D1FAE5' : (v.status === 'OnTrip' ? '#DBEAFE' : '#FEE2E2'),
                                        color: v.status === 'Available' ? '#065F46' : (v.status === 'OnTrip' ? '#1E40AF' : '#991B1B')
                                    }}>
                                        {v.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardOverview;
