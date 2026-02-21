import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Layers, Filter, ArrowUpDown, MoreHorizontal, MoreVertical, MapPin, Zap } from 'lucide-react';

const TripDispatcher = () => {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isGroupByOpen, setIsGroupByOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');

    const [isCargoFocused, setIsCargoFocused] = useState(false);
    const [isOriginFocused, setIsOriginFocused] = useState(false);
    const [isDestFocused, setIsDestFocused] = useState(false);

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
                axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/trips`, config),
                axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/vehicles`, config),
                axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/drivers`, config),
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

            await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/trips`, formData, {
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
            await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/trips/${id}/status`, { status: newStatus }, {
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
        return { bg: '#E5E7EB', text: '#000000', dot: '#000000' };
    };

    const filteredTrips = trips.filter(trip => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
            trip.id?.toString().toLowerCase().includes(query) ||
            trip.vehicle_id?.toString().toLowerCase().includes(query) ||
            trip.driver_id?.toString().toLowerCase().includes(query) ||
            trip.start_location?.toLowerCase().includes(query) ||
            trip.end_location?.toLowerCase().includes(query) ||
            trip.vehicle?.toLowerCase().includes(query) ||
            trip.driver?.toLowerCase().includes(query) ||
            trip.type?.toLowerCase().includes(query)
        );
        const matchesGroup = selectedGroup ? trip.type === selectedGroup : true;

        let matchesFilter = true;
        if (selectedFilter) {
            if (selectedFilter === 'On Trip') matchesFilter = trip.status === 'OnTrip' || trip.status === 'On Trip';
            else if (selectedFilter === 'Dispatch') matchesFilter = trip.status === 'Dispatched';
            else if (selectedFilter === 'Complete') matchesFilter = trip.status === 'Completed';
            else matchesFilter = trip.status === selectedFilter;
        }

        return matchesSearch && matchesGroup && matchesFilter;
    });

    return (
        <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000000', marginBottom: '4px' }}>Trip Dispatcher</h1>
                <p style={{ color: '#000000', fontSize: '0.875rem' }}>Manage and dispatch new trips.</p>
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
                        placeholder="Search trips, vehicles, or drivers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        style={{ border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent', color: '#000000' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsGroupByOpen(!isGroupByOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#000000', fontSize: '0.875rem', cursor: 'pointer' }}
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
                                            color: selectedGroup === option ? '#2563EB' : '#000000',
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
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#000000', fontSize: '0.875rem', cursor: 'pointer' }}
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
                                            color: selectedFilter === option ? '#2563EB' : '#000000',
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

            {/* Active Trips Table */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} color="#F59E0B" fill="#F59E0B" /> Active Trips
                    </h3>
                </div>
                {loading ? <p>Loading trips...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '10%' }}>TRIP ID</th>
                                <th style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>VEHICLE ID</th>
                                <th style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>DRIVER ID</th>
                                <th style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>ORIGIN</th>
                                <th style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>DESTINATION</th>
                                <th style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrips.map((trip, idx) => {
                                const style = getStatusStyle(trip.status);
                                return (
                                    <tr key={trip.id} style={{ borderBottom: idx === filteredTrips.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 0', color: '#2563EB', fontWeight: '500', fontSize: '0.875rem' }}>#{trip.id}</td>
                                        <td style={{ padding: '16px 0', color: '#000000', fontSize: '0.875rem' }}>Veh #{trip.vehicle_id}</td>
                                        <td style={{ padding: '16px 0', color: '#000000', fontSize: '0.875rem' }}>Driver #{trip.driver_id}</td>
                                        <td style={{ padding: '16px 0', color: '#000000', fontSize: '0.875rem' }}>{trip.start_location}</td>
                                        <td style={{ padding: '16px 0', color: '#000000', fontSize: '0.875rem' }}>{trip.end_location}</td>
                                        <td style={{ padding: '16px 0' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: style.bg, color: style.text, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }}></div>
                                                {trip.status}
                                            </div>
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
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#000000', display: 'flex', alignItems: 'center' }}>⛭</span> New Trip Dispatch
                    </h3>
                    <p style={{ color: '#000000', fontSize: '0.875rem' }}>Assign available vehicles and drivers for new delivery assignments.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#000000' }}>Select Available Vehicle</label>
                        <select
                            value={formData.vehicle_id}
                            onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                            style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#000000', background: '#fff' }}
                        >
                            <option value="">- Choose Vehicle -</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.license_plate} - {v.model_name} ({v.max_capacity_kg}kg capacity)</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#000000' }}>Cargo Weight (Kg)</label>
                        <input
                            type="number"
                            placeholder="e.g. 12000"
                            value={formData.cargo_weight}
                            onChange={(e) => setFormData({ ...formData, cargo_weight: e.target.value })}
                            onFocus={() => setIsCargoFocused(true)}
                            onBlur={() => setIsCargoFocused(false)}
                            style={{
                                padding: '10px 14px',
                                border: `1px solid ${isCargoFocused ? '#3B82F6' : '#E2E8F0'}`,
                                boxShadow: isCargoFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                backgroundColor: 'transparent',
                                outline: 'none',
                                transition: 'all 0.2s ease-in-out'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#000000' }}>Select OnDuty Driver</label>
                        <select
                            value={formData.driver_id}
                            onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                            style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#000000', background: '#fff' }}
                        >
                            <option value="">- Choose Driver -</option>
                            {drivers.map(d => <option key={d.id} value={d.id}>{d.name} (License: {d.license_number})</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#000000' }}>Origin Address</label>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        border: `1px solid ${isOriginFocused ? '#3B82F6' : '#E2E8F0'}`,
                        boxShadow: isOriginFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                        borderRadius: '8px', padding: '10px 14px', gap: '8px',
                        transition: 'all 0.2s ease-in-out'
                    }}>
                        <MapPin size={16} color={isOriginFocused ? '#3B82F6' : '#94A3B8'} />
                        <input
                            type="text"
                            value={formData.start_location}
                            onFocus={() => setIsOriginFocused(true)}
                            onBlur={() => setIsOriginFocused(false)}
                            onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                            placeholder="Enter pickup location details" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#000000' }}>Destination Address</label>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        border: `1px solid ${isDestFocused ? '#3B82F6' : '#E2E8F0'}`,
                        boxShadow: isDestFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                        borderRadius: '8px', padding: '10px 14px', gap: '8px',
                        transition: 'all 0.2s ease-in-out'
                    }}>
                        <MapPin size={16} color={isDestFocused ? '#3B82F6' : '#94A3B8'} />
                        <input
                            type="text"
                            value={formData.end_location}
                            onFocus={() => setIsDestFocused(true)}
                            onBlur={() => setIsDestFocused(false)}
                            onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                            placeholder="Enter drop-off location details" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleDispatch} style={{ background: '#2563EB', color: '#000000', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer' }}>Dispatch Trip</button>
                    <button style={{ background: '#fff', color: '#000000', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TripDispatcher;
