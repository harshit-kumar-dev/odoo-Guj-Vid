import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CarFront, Navigation, PenTool, Users, Banknote, LineChart, LogOut, Package } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import './MainLayout.css';

const MainLayout = () => {
    const navigate = useNavigate();

    // Safety check for role-based sidebar items
    let role = 'Manager';
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            role = decodedToken.role;
        }
    } catch (err) {
        // use default Manager
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="main-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="logo-icon blue-logo">
                        <Package size={24} color="#ffffff" />
                    </div>
                    <span className="logo-text">Shipzo</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* Manager & Dispatcher Only */}
                    {['Manager', 'Dispatcher'].includes(role) && (
                        <>
                            <NavLink to="/vehicle-registry" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <CarFront size={20} />
                                <span>Vehicle Registry</span>
                            </NavLink>
                            <NavLink to="/dispatcher" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <Navigation size={20} />
                                <span>Trip Dispatcher</span>
                            </NavLink>
                        </>
                    )}

                    {/* Manager & Safety Officer Only */}
                    {['Manager', 'SafetyOfficer'].includes(role) && (
                        <>
                            <NavLink to="/maintenance" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <PenTool size={20} />
                                <span>Maintenance Logs</span>
                            </NavLink>
                            <NavLink to="/driver-performance" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <Users size={20} />
                                <span>Drivers & Safety</span>
                            </NavLink>
                        </>
                    )}

                    {/* Manager & Financial Analyst Only */}
                    {['Manager', 'FinancialAnalyst'].includes(role) && (
                        <>
                            <NavLink to="/trip-expense" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <Banknote size={20} />
                                <span>Trip Expenses</span>
                            </NavLink>
                            <NavLink to="/financial-analytics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                                <LineChart size={20} />
                                <span>Analytics</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">{role.substring(0, 2).toUpperCase()}</div>
                        <div className="user-info">
                            <span className="user-role">{role}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="layout-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
