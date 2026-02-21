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
    const [logs] = useState([
        { id: '#321', vehicle: 'TATA Truck 04', issue: 'Engine Issue', date: '20/02/2024', cost: '$10,450', status: 'NEW', statusClass: 'status-new' },
        { id: '#320', vehicle: 'Eicher XL 400', issue: 'Brake Pad Replacement', date: '18/02/2024', cost: '$1,200', status: 'PENDING', statusClass: 'status-pending' },
        { id: '#319', vehicle: 'Mahindra Bolero', issue: 'Oil Change', date: '15/02/2024', cost: '$450', status: 'COMPLETED', statusClass: 'status-completed' },
        { id: '#318', vehicle: 'Force Traveller', issue: 'AC Compressor Repair', date: '12/02/2024', cost: '$3,200', status: 'COMPLETED', statusClass: 'status-completed' },
        { id: '#317', vehicle: 'Ashok Leyland 12', issue: 'Clutch Overhaul', date: '10/02/2024', cost: '$8,900', status: 'CRITICAL', statusClass: 'status-critical' },
    ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="management-container">
            {/* Header mapped structurally the same as Expense */}
            <header className="management-header">
                <div className="brand-logo">
                    <div className="logo-icon blue-logo">
                        <Package size={24} color="#ffffff" />
                    </div>
                    <span className="logo-text">Shipzo</span>
                </div>
                <div className="header-actions">
                    <Moon className="icon-action moon-icon" size={20} />
                    <div className="avatar">JD</div>
                </div>
            </header>

            {/* Main Content View Container */}
            <main className="management-main">
                <div className="content-box">

                    {/* Top Log Header & Search */}
                    <div className="log-header-section">
                        <h2>Maintenance & Service Logs</h2>
                        <div className="toolbar">
                            <div className="search-bar">
                                <Search size={18} color="#9CA3AF" />
                                <input type="text" placeholder="Search logs, vehicles, or issues..." className="search-input" />
                            </div>
                            <div className="filter-group">
                                <button className="toolbar-btn"><Layers size={16} /> Group by</button>
                                <button className="toolbar-btn"><Filter size={16} /> Filter</button>
                                <button className="toolbar-btn"><ArrowUpDown size={16} /> Sort by</button>
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
                                    <button type="button" className="btn-primary" style={{ backgroundColor: '#059669' }}>Create Log</button>
                                    <button type="button" className="btn-secondary">Cancel</button>
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
                                    {logs.map((log, i) => (
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
                                </tbody>
                            </table>
                            {/* Pagination row */}
                            <div className="pagination">
                                <span>Showing 1 to 5 of 42 logs</span>
                                <div className="page-controls">
                                    <button className="page-btn">{'<'}</button>
                                    <button className="page-btn active-purple">1</button>
                                    <button className="page-btn">2</button>
                                    <button className="page-btn">3</button>
                                    <button className="page-btn">{'>'}</button>
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
