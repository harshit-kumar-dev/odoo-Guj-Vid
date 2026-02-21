import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Truck, AlertTriangle, Activity, PackageCheck, Search, Layers, Filter } from 'lucide-react';

const DashboardOverview = () => {
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isGroupByOpen, setIsGroupByOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };

                // Fetch vehicles and trips for KPIs
                const [vehRes, tripRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/vehicles`, config),
                    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/trips`, config)
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

    const filteredVehicles = vehicles.filter(v => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
            v.model_name?.toLowerCase().includes(query) ||
            v.license_plate?.toLowerCase().includes(query) ||
            v.id?.toString().toLowerCase().includes(query) ||
            v.vehicle_type?.toLowerCase().includes(query)
        );
        const matchesGroup = selectedGroup ? v.vehicle_type === selectedGroup : true;

        let matchesFilter = true;
        if (selectedFilter) {
            if (selectedFilter === 'On Trip') matchesFilter = v.status === 'OnTrip';
            else if (selectedFilter === 'Dispatch') matchesFilter = v.status === 'Available';
            else if (selectedFilter === 'Delayed') matchesFilter = v.status === 'InShop';
            else if (selectedFilter === 'Complete') matchesFilter = v.status === 'Available';
            else matchesFilter = v.status === selectedFilter;
        }

        return matchesSearch && matchesGroup && matchesFilter;
    });

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

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    border: `1px solid ${isSearchFocused ? '#3B82F6' : '#E2E8F0'}`,
                    boxShadow: isSearchFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    flex: '1',
                    minWidth: '300px',
                    transition: 'all 0.2s ease-in-out'
                }}>
                    <Search size={18} color={isSearchFocused ? '#3B82F6' : '#94A3B8'} />
                    <input
                        type="text"
                        placeholder="Search vehicles, drivers, or trips..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        style={{ border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent', color: '#1E293B' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsGroupByOpen(!isGroupByOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}
                        >
                            <Layers size={16} /> Group by
                        </button>
                        {isGroupByOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: '4px',
                                background: '#fff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                width: '160px',
                                zIndex: 10,
                                overflow: 'hidden'
                            }}>
                                {['Heavy Duty', 'Long Haul', 'Express Delivery'].map((option, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '8px 16px',
                                            fontSize: '0.875rem',
                                            color: selectedGroup === option ? '#2563EB' : '#374151',
                                            fontWeight: selectedGroup === option ? '600' : '400',
                                            cursor: 'pointer',
                                            borderBottom: idx !== 2 ? '1px solid #F1F5F9' : 'none',
                                            transition: 'all 0.2s',
                                            backgroundColor: selectedGroup === option ? '#EFF6FF' : 'transparent'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedGroup !== option) e.target.style.backgroundColor = '#F8FAFC';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedGroup !== option) e.target.style.backgroundColor = 'transparent';
                                        }}
                                        onClick={() => {
                                            setSelectedGroup(selectedGroup === option ? '' : option);
                                            setIsGroupByOpen(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}
                        >
                            <Filter size={16} /> Filter
                        </button>
                        {isFilterOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: '4px',
                                background: '#fff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                width: '160px',
                                zIndex: 10,
                                overflow: 'hidden'
                            }}>
                                {['On Trip', 'Dispatch', 'Delayed', 'Complete'].map((option, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '8px 16px',
                                            fontSize: '0.875rem',
                                            color: selectedFilter === option ? '#2563EB' : '#374151',
                                            fontWeight: selectedFilter === option ? '600' : '400',
                                            cursor: 'pointer',
                                            borderBottom: idx !== 3 ? '1px solid #F1F5F9' : 'none',
                                            transition: 'all 0.2s',
                                            backgroundColor: selectedFilter === option ? '#EFF6FF' : 'transparent'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedFilter !== option) e.target.style.backgroundColor = '#F8FAFC';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedFilter !== option) e.target.style.backgroundColor = 'transparent';
                                        }}
                                        onClick={() => {
                                            setSelectedFilter(selectedFilter === option ? '' : option);
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
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
                        {filteredVehicles.map(v => (
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
