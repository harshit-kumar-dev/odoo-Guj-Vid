import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    LayoutDashboard,
    Car,
    MapPin,
    Wrench,
    ShieldCheck,
    Receipt,
    PieChart,
    LogOut,
    Bell
} from 'lucide-react';
import './MainLayout.css';


const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    // Get role from localStorage
    const role = localStorage.getItem('userRole') || 'Manager';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo-section">
                        <div className="logo-icon blue-logo">
                            <Car size={24} color="#ffffff" />
                        </div>
                        {sidebarOpen && <span className="logo-text">Shipzo</span>}
                    </div>
                    {sidebarOpen && (
                        <button className="close-sidebar-btn d-mobile" onClick={toggleSidebar}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="sidebar-role-badge">
                    {sidebarOpen && <span className="role-text">{role}</span>}
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <LayoutDashboard size={20} />
                        {sidebarOpen && <span>Dashboard Overview</span>}
                    </NavLink>

                    {role === 'Manager' && (
                        <NavLink to="/vehicle-registry" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Car size={20} />
                            {sidebarOpen && <span>Vehicle Registry</span>}
                        </NavLink>
                    )}

                    {role === 'Dispatcher' && (
                        <NavLink to="/dispatcher" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <MapPin size={20} />
                            {sidebarOpen && <span>Trip Dispatcher</span>}
                        </NavLink>
                    )}

                    {role === 'SafetyOfficer' && (
                        <>
                            <NavLink to="/maintenance" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <Wrench size={20} />
                                {sidebarOpen && <span>Maintenance Logs</span>}
                            </NavLink>
                            <NavLink to="/driver-performance" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <ShieldCheck size={20} />
                                {sidebarOpen && <span>Driver Performance</span>}
                            </NavLink>
                        </>
                    )}

                    {role === 'FinancialAnalyst' && (
                        <>
                            <NavLink to="/trip-expense" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <Receipt size={20} />
                                {sidebarOpen && <span>Trip & Expense</span>}
                            </NavLink>
                            <NavLink to="/financial-analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <PieChart size={20} />
                                {sidebarOpen && <span>Operational Analytics</span>}
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-content-area">
                <header className="top-header">
                    <div className="header-left">
                        <button className="hamburger-btn" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                    </div>
                    <div className="header-right">
                        <button className="icon-btn">
                            <Bell size={20} />
                        </button>
                        <div className="user-profile">
                            <span className="user-name">Alex Johnson</span>
                            <div className="avatar">AJ</div>
                        </div>
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
