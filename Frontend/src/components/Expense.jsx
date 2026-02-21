import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Fuel, CreditCard, Calendar, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
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

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Done, Pending, Cancelled
    const [sortDistance, setSortDistance] = useState('Neutral'); // Neutral, Ascending, Descending

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const [isLitersFocused, setIsLitersFocused] = useState(false);
    const [isCostFocused, setIsCostFocused] = useState(false);
    const [isDateFocused, setIsDateFocused] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

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

    const getDistance = (t) => {
        if (t.start_odometer != null && t.end_odometer != null) {
            return Math.max(0, t.end_odometer - t.start_odometer);
        }
        return 0;
    };

    const getTripFuelCost = (tripId) => {
        return logs.filter(l => l.trip_id === tripId).reduce((sum, l) => sum + Number(l.cost), 0);
    };

    // Filter and Sort Trips
    let filteredTrips = trips.filter(t => {
        const q = debouncedSearch.toLowerCase();
        const matches = (
            t.start_location?.toLowerCase().includes(q) ||
            t.end_location?.toLowerCase().includes(q) ||
            t.id.toString().includes(q) ||
            t.status?.toLowerCase().includes(q)
        );
        if (!matches) return false;

        if (filterStatus === 'Done' && t.status !== 'Completed') return false;
        if (filterStatus === 'Pending' && t.status !== 'Draft' && t.status !== 'Dispatched') return false;
        if (filterStatus === 'Cancelled' && t.status !== 'Cancelled') return false;

        return true;
    });

    if (sortDistance === 'Ascending') {
        filteredTrips.sort((a, b) => getDistance(a) - getDistance(b));
    } else if (sortDistance === 'Descending') {
        filteredTrips.sort((a, b) => getDistance(b) - getDistance(a));
    }

    return (
        <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Trip Expenses & Fuel Logs</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Track operational costs, fuel consumption, and view trips data.</p>
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
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    border: `1px solid ${isLitersFocused ? '#3B82F6' : '#E2E8F0'}`,
                                    boxShadow: isLitersFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                    borderRadius: '8px', padding: '10px',
                                    transition: 'all 0.2s ease-in-out'
                                }}>
                                    <Fuel size={14} color={isLitersFocused ? '#3B82F6' : '#94A3B8'} style={{ marginRight: '8px' }} />
                                    <input
                                        type="number" step="0.1" required
                                        value={formData.liters}
                                        onFocus={() => setIsLitersFocused(true)}
                                        onBlur={() => setIsLitersFocused(false)}
                                        onChange={e => setFormData({ ...formData, liters: e.target.value })}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent' }}
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Cost (₹)</label>
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    border: `1px solid ${isCostFocused ? '#3B82F6' : '#E2E8F0'}`,
                                    boxShadow: isCostFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                    borderRadius: '8px', padding: '10px',
                                    transition: 'all 0.2s ease-in-out'
                                }}>
                                    <CreditCard size={14} color={isCostFocused ? '#3B82F6' : '#94A3B8'} style={{ marginRight: '8px' }} />
                                    <input
                                        type="number" step="0.01" required
                                        value={formData.cost}
                                        onFocus={() => setIsCostFocused(true)}
                                        onBlur={() => setIsCostFocused(false)}
                                        onChange={e => setFormData({ ...formData, cost: e.target.value })}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent' }}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Date</label>
                            <input
                                type="date"
                                required
                                value={formData.log_date}
                                onFocus={() => setIsDateFocused(true)}
                                onBlur={() => setIsDateFocused(false)}
                                onChange={e => setFormData({ ...formData, log_date: e.target.value })}
                                style={{
                                    padding: '10px',
                                    border: `1px solid ${isDateFocused ? '#3B82F6' : '#E2E8F0'}`,
                                    boxShadow: isDateFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            />
                        </div>

                        <button type="submit" style={{ background: '#2563EB', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '500', marginTop: '10px', cursor: 'pointer' }}>Save Fuel Log</button>
                    </form>
                </div>

                {/* Table side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '1', minWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', margin: 0 }}>Fleet Trip Expense Summary</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '300px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#ffffff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <Search size={18} color="#000" />
                                <input
                                    type="text"
                                    placeholder="Search details..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent', color: '#000' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <button
                                        onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Filter size={16} /> {filterStatus === 'All' ? 'Null' : filterStatus}</span>
                                        <ChevronDown size={14} />
                                    </button>
                                    {isFilterOpen && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden'
                                        }}>
                                            {['All', 'Done', 'Pending', 'Cancelled'].map((option) => (
                                                <div
                                                    key={option}
                                                    style={{ padding: '8px 16px', fontSize: '0.875rem', cursor: 'pointer', background: filterStatus === option ? '#EFF6FF' : '#fff', color: filterStatus === option ? '#2563EB' : '#334155' }}
                                                    onClick={() => { setFilterStatus(option); setIsFilterOpen(false); }}
                                                >
                                                    {option === 'All' ? 'Null' : option}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ position: 'relative', flex: 1 }}>
                                    <button
                                        onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowUpDown size={16} /> {sortDistance === 'Neutral' ? 'Neutral' : (sortDistance === 'Ascending' ? 'Asc' : 'Desc')}</span>
                                        <ChevronDown size={14} />
                                    </button>
                                    {isSortOpen && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden'
                                        }}>
                                            {['Neutral', 'Ascending', 'Descending'].map((option) => (
                                                <div
                                                    key={option}
                                                    style={{ padding: '8px 16px', fontSize: '0.875rem', cursor: 'pointer', background: sortDistance === option ? '#EFF6FF' : '#fff', color: sortDistance === option ? '#2563EB' : '#334155' }}
                                                    onClick={() => { setSortDistance(option); setIsSortOpen(false); }}
                                                >
                                                    {option === 'Neutral' ? 'Neutral' : (option === 'Ascending' ? 'Asc' : 'Desc')}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? <p>Loading data...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>TRIP ID</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>ROUTE & STATUS</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>DISTANCE</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>FUEL EXPENSE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrips.map((trip) => {
                                    const fuelCost = getTripFuelCost(trip.id);
                                    let statusColor = '#E2E8F0';
                                    let bgStatusColor = '#F8FAFC';
                                    if (trip.status === 'Completed') { statusColor = '#065F46'; bgStatusColor = '#D1FAE5'; }
                                    else if (trip.status === 'Draft' || trip.status === 'Dispatched') { statusColor = '#B45309'; bgStatusColor = '#FEF3C7'; }
                                    else if (trip.status === 'Cancelled') { statusColor = '#991B1B'; bgStatusColor = '#FEE2E2'; }

                                    return (
                                        <tr key={trip.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '16px 12px', color: '#1E293B', fontSize: '0.875rem', fontWeight: '500' }}>#{trip.id}</td>
                                            <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.875rem' }}>
                                                <div>{trip.start_location} → {trip.end_location}</div>
                                                <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', background: bgStatusColor, color: statusColor }}>
                                                    {trip.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 12px', color: '#475569', fontSize: '0.875rem' }}>{getDistance(trip)} km</td>
                                            <td style={{ padding: '16px 12px', color: '#10B981', fontSize: '0.875rem', fontWeight: '600' }}>
                                                {fuelCost > 0 ? `₹${fuelCost.toFixed(2)}` : '--'}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredTrips.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>No trips found matching the criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expense;
