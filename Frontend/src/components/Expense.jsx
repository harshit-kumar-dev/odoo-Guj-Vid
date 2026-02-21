import React, { useState } from 'react';
import { Package, Search, Layers, Filter, ArrowUpDown, MoreVertical, Moon } from 'lucide-react';
import './Expense.css';

const Expense = () => {
    const [formData, setFormData] = useState({
        tripId: '',
        driver: '',
        fuelCost: '',
        miscExpense: ''
    });

    const [expenses] = useState([
        { tripId: '321', initials: 'JD', driver: 'John Doe', distance: '1000 km', fuel: '$19,250', misc: '$3,400', status: 'Done', statusColor: 'green' },
        { tripId: '402', initials: 'SM', driver: 'Sarah Miller', distance: '850 km', fuel: '$15,800', misc: '$1,200', status: 'Pending', statusColor: 'orange' },
        { tripId: '558', initials: 'MW', driver: 'Mike Wilson', distance: '1,240 km', fuel: '$22,400', misc: '$5,800', status: 'Done', statusColor: 'green' },
        { tripId: '612', initials: 'AL', driver: 'Anna Lee', distance: '420 km', fuel: '$8,100', misc: '$0', status: 'Cancelled', statusColor: 'gray' },
    ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="expense-container">
            {/* Header */}
            <header className="expense-header">
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

            {/* Main Content Pane */}
            <main className="expense-main">
                {/* Search Bar Row */}
                <div className="toolbar">
                    <div className="search-bar">
                        <Search size={18} color="#9CA3AF" />
                        <input type="text" placeholder="Search logs, drivers, or trip IDs..." className="search-input" />
                    </div>
                    <div className="filter-group">
                        <button className="toolbar-btn"><Layers size={16} /> Group by</button>
                        <button className="toolbar-btn"><Filter size={16} /> Filter</button>
                        <button className="toolbar-btn"><ArrowUpDown size={16} /> Sort by</button>
                    </div>
                </div>

                {/* Content Split: Form & Table */}
                <div className="expense-content-split">
                    {/* Form Left Side */}
                    <div className="expense-form-panel">
                        <div className="panel-header">
                            <Layers size={20} color="#3B82F6" />
                            <h3>New Expense</h3>
                        </div>
                        <form className="expense-form">
                            <div className="input-group">
                                <label>Trip ID</label>
                                <input type="text" name="tripId" placeholder="e.g. TRP-321" value={formData.tripId} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Driver</label>
                                <select name="driver" value={formData.driver} onChange={handleChange}>
                                    <option value="" disabled>Search driver...</option>
                                    <option value="JD">John Doe</option>
                                    <option value="SM">Sarah Miller</option>
                                </select>
                            </div>
                            <div className="row-inputs">
                                <div className="input-group half">
                                    <label>Fuel Cost</label>
                                    <div className="currency-input">
                                        <span>$</span>
                                        <input type="number" name="fuelCost" placeholder="0.00" value={formData.fuelCost} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="input-group half">
                                    <label>Misc Expense</label>
                                    <div className="currency-input">
                                        <span>$</span>
                                        <input type="number" name="miscExpense" placeholder="0.00" value={formData.miscExpense} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-primary">Create Log</button>
                                <button type="button" className="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>

                    {/* Table Right Side */}
                    <div className="expense-table-panel">
                        <table className="expense-table">
                            <thead>
                                <tr>
                                    <th>TRIP ID</th>
                                    <th>DRIVER</th>
                                    <th>DISTANCE</th>
                                    <th>FUEL EXPENSE</th>
                                    <th>MISC. EXPEN</th>
                                    <th>STATUS</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((exp, i) => (
                                    <tr key={i}>
                                        <td className="fw-bold">{exp.tripId}</td>
                                        <td>
                                            <div className="driver-cell">
                                                <div className={`driver-avatar bg-${exp.initials.toLowerCase()}`}>
                                                    {exp.initials}
                                                </div>
                                                <span>{exp.driver}</span>
                                            </div>
                                        </td>
                                        <td>{exp.distance}</td>
                                        <td>{exp.fuel}</td>
                                        <td>{exp.misc}</td>
                                        <td>
                                            <span className={`status-badge stat-${exp.statusColor}`}>
                                                <span className="dot"></span> {exp.status}
                                            </span>
                                        </td>
                                        <td className="more-btn"><MoreVertical size={16} color="#9CA3AF" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination placeholder */}
                        <div className="pagination">
                            <span>Showing 1 to 4 of 24 entries</span>
                            <div className="page-controls">
                                <button className="page-btn">{'<'}</button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <button className="page-btn">{'>'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Expense;
