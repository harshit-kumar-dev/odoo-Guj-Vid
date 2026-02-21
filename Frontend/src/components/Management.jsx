import React, { useState } from 'react';
import { Package, Search, Layers, Filter, ArrowUpDown, Moon, CarFront } from 'lucide-react';
import './Management.css';

const Management = () => {
    // Form logic placeholder
    const [formData, setFormData] = useState({
        vehicleName: '',
        issueType: 'Engine Issue',
        serviceDate: ''
    });

    // Dummy data to match the screenshot table
    const [logs, setLogs] = useState([
        { id: '#321', vehicle: 'TATA Truck 04', issue: 'Engine Issue', date: '20/02/2024', cost: '$10,450', status: 'NEW', statusClass: 'status-new' },
        { id: '#320', vehicle: 'Eicher XL 400', issue: 'Brake Pad Replacement', date: '18/02/2024', cost: '$1,200', status: 'PENDING', statusClass: 'status-pending' },
        { id: '#319', vehicle: 'Mahindra Bolero', issue: 'Oil Change', date: '15/02/2024', cost: '$450', status: 'COMPLETED', statusClass: 'status-completed' },
        { id: '#318', vehicle: 'Force Traveller', issue: 'AC Compressor Repair', date: '12/02/2024', cost: '$3,200', status: 'COMPLETED', statusClass: 'status-completed' },
        { id: '#317', vehicle: 'Ashok Leyland 12', issue: 'Clutch Overhaul', date: '10/02/2024', cost: '$8,900', status: 'CRITICAL', statusClass: 'status-critical' },
        { id: '#316', vehicle: 'Maruti Suzuki', issue: 'Tire Replacement', date: '08/02/2024', cost: '$800', status: 'COMPLETED', statusClass: 'status-completed' },
        { id: '#315', vehicle: 'TATA Ace', issue: 'General Service', date: '05/02/2024', cost: '$300', status: 'PENDING', statusClass: 'status-pending' },
    ]);

    // Table State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateLog = () => {
        if (!formData.vehicleName || !formData.serviceDate) return;

        const newLog = {
            id: `#${Math.floor(Math.random() * 900) + 100}`,
            vehicle: formData.vehicleName,
            issue: formData.issueType,
            date: formData.serviceDate,
            cost: 'TBD',
            status: 'NEW',
            statusClass: 'status-new'
        };

        setLogs([newLog, ...logs]);
        setFormData({ vehicleName: '', issueType: 'Engine Issue', serviceDate: '' });
    };

    const handleCancel = () => {
        setFormData({ vehicleName: '', issueType: 'Engine Issue', serviceDate: '' });
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    // Filter, Sort, and Paginate logic
    const filteredLogs = logs.filter(log =>
        log.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        // Simple string comparison on ID for dummy sorting
        if (sortOrder === 'asc') return a.id.localeCompare(b.id);
        return b.id.localeCompare(a.id);
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


            {/* Main Content View Container */}
            <main className="management-main">
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

                            <form className="management-form">
                                <div className="input-group">
                                    <label>Vehicle Name</label>
                                    <input
                                        type="text"
                                        name="vehicleName"
                                        placeholder="e.g. TATA Truck 04"
                                        value={formData.vehicleName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Issue / Service Type</label>
                                    <select name="issueType" value={formData.issueType} onChange={handleChange}>
                                        <option value="Engine Issue">Engine Issue</option>
                                        <option value="Brake Pad">Brake Pad</option>
                                        <option value="Oil Change">Oil Change</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Service Date</label>
                                    <input
                                        type="text"
                                        name="serviceDate"
                                        placeholder="mm/dd/yyyy"
                                        value={formData.serviceDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-primary" style={{ backgroundColor: '#059669' }} onClick={handleCreateLog}>Create Log</button>
                                    <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                                </div>
                            </form>
                        </div>

                        {/* Table Listing Side */}
                        <div className="management-table-panel">
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
                                    {currentLogs.map((log, i) => (
                                        <tr key={i}>
                                            <td className="cost-bold" style={{ color: '#6B7280' }}>{log.id}</td>
                                            <td>
                                                <div className="vehicle-cell">
                                                    <div className="vehicle-icon-bg">
                                                        <CarFront size={14} color="#3B82F6" />
                                                    </div>
                                                    <span className="vehicle-name">{log.vehicle}</span>
                                                </div>
                                            </td>
                                            <td>{log.issue}</td>
                                            <td>{log.date}</td>
                                            <td className="cost-bold">{log.cost}</td>
                                            <td>
                                                <span className={`status-pill ${log.statusClass}`}>
                                                    {log.status}
                                                </span>
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
