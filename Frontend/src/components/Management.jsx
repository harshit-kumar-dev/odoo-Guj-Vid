import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Layers, Filter, ArrowUpDown, CarFront } from 'lucide-react';
import './Management.css';

const Management = () => {
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        vehicle_name: '',
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

            const mergedLogs = [
                { id: 101, vehicle_name: 'Toyota Prius (DL-101)', description: 'Engine Tune-up', service_date: '2026-01-15', cost: 1500, status: 'Completed' },
                { id: 102, vehicle_name: 'Ford Transit (MH-404)', description: 'Brake Pad Replacement', service_date: '2026-02-02', cost: 3200, status: 'Completed' },
                { id: 103, vehicle_name: 'Honda Civic (KA-221)', description: 'Oil Change', service_date: '2026-02-18', cost: 800, status: 'Completed' },
                { id: 104, vehicle_name: 'Tesla Model 3 (TS-001)', description: 'Tire Rotation', service_date: '2026-02-20', cost: 1200, status: 'Completed' },
                { id: 105, vehicle_name: 'Volvo FH16 (UP-999)', description: 'Transmission Check', service_date: '2026-02-21', cost: 5000, status: 'Completed' },
                ...logsRes.data
            ];
            setLogs(mergedLogs);
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

    // Table State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5;

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
            setFormData({ vehicle_name: '', description: 'Engine Issue', cost: '', service_date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Error recording maintenance check");
        }
    };

    const handleCancel = () => {
        setFormData({ vehicle_name: '', description: 'Engine Issue', cost: '', service_date: new Date().toISOString().split('T')[0] });
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    // Filter, Sort, and Paginate logic
    // Using mapping helper for vehicle name
    const getVehicleName = (vId) => {
        const v = vehicles.find(veh => veh.id === vId);
        return v ? `${v.license_plate} (${v.model_name})` : `Veh #${vId}`;
    };

    const filteredLogs = logs.filter(log =>
        (log.vehicle_name || getVehicleName(log.vehicle_id)).toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(log.id).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        // Simple string/number comparison on ID for sorting
        if (sortOrder === 'asc') return a.id - b.id;
        return b.id - a.id;
    });

    const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="management-container">
            <main className="management-main" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Maintenance & Service Logs</h1>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Schedule services and track repair costs.</p>
                </div>

                <div className="content-box">

                    {/* Top Log Header & Search */}
                    <div className="log-header-section">
                        <h2>Maintenance & Service Logs</h2>
                        <div className="toolbar">
                            <div className="search-bar">
                                <Search size={18} color="#9CA3AF" />
                                <input
                                    type="text"
                                    placeholder="Search logs, vehicles, or issues..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <div className="filter-group">
                                <button className="toolbar-btn" onClick={() => alert("Group by feature coming soon")}><Layers size={16} /> Group by</button>
                                <button className="toolbar-btn" onClick={() => alert("Multi-filter coming soon")}><Filter size={16} /> Filter</button>
                                <button className="toolbar-btn" onClick={toggleSort}>
                                    <ArrowUpDown size={16} /> Sort ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Split Form & Table Container */}
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
                                    <input
                                        type="text"
                                        required
                                        name="vehicle_name"
                                        placeholder="- Enter Vehicle Name -"
                                        value={formData.vehicle_name}
                                        onChange={handleChange}
                                        style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                                    />
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
                                    <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                                </div>
                            </form>
                        </div>

                        {/* Table Listing Side */}
                        <div className="management-table-panel">
                            {loading ? <p style={{ padding: '20px' }}>Loading logs data...</p> : (
                                <>
                                    <table className="management-table">
                                        <thead>
                                            <tr>
                                                <th>LOG ID</th>
                                                <th>VEHICLE</th>
                                                <th>ISSUE/SERVICE</th>
                                                <th>DATE</th>
                                                <th>COST</th>
                                                <th>STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentLogs.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="cost-bold" style={{ color: '#6B7280' }}>#{log.id}</td>
                                                    <td>
                                                        <div className="vehicle-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div className="vehicle-icon-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', backgroundColor: '#EFF6FF', borderRadius: '8px' }}>
                                                                <CarFront size={14} color="#3B82F6" />
                                                            </div>
                                                            <span className="vehicle-name">{log.vehicle_name || getVehicleName(log.vehicle_id)}</span>
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
                                            {currentLogs.length === 0 && (
                                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No records found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {/* Pagination row */}
                                    <div className="pagination">
                                        <span>Showing {sortedLogs.length > 0 ? indexOfFirstLog + 1 : 0} to {Math.min(indexOfLastLog, sortedLogs.length)} of {sortedLogs.length} logs</span>
                                        <div className="page-controls">
                                            <button className="page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>{'<'}</button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                                <button
                                                    key={number}
                                                    className={`page-btn ${currentPage === number ? 'active-purple' : ''}`}
                                                    onClick={() => goToPage(number)}
                                                >
                                                    {number}
                                                </button>
                                            ))}

                                            <button className="page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>{'>'}</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <p className="card-lbl">Monthly Cost</p>
                        <h3>$24,320</h3>
                        <p className="card-trend text-green">↗ +12% from last month</p>
                    </div>
                    <div className="summary-card">
                        <p className="card-lbl">Total Logs</p>
                        <h3>1,248</h3>
                        <p className="card-trend text-gray">Fleet lifetime active records</p>
                    </div>
                    <div className="summary-card p-bar-card">
                        <div className="p-bar-labels">
                            <span className="card-lbl">Pending Services</span>
                            <h3>14</h3>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill fill-orange" style={{ width: '35%' }}></div>
                        </div>
                    </div>
                    <div className="summary-card p-bar-card">
                        <div className="p-bar-labels">
                            <span className="card-lbl">Completion Rate</span>
                            <h3>92.4%</h3>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill fill-purple" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Management;
