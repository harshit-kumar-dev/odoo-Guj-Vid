import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Mail, Lock, Eye, EyeOff, KeyRound, CarFront } from 'lucide-react';
import './Login.css';

const Login = () => {


    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Manager');
    const [showPassword, setShowPassword] = useState(false);



    // UI state
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        const payload = { email, password, role };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/login`, payload);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', role);
                // Custom routing based on role
                if (role === 'FinancialAnalyst') {
                    navigate('/trip-expense');
                } else if (role === 'Dispatcher') {
                    navigate('/dispatcher');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Unexpected response from server.');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="login-wrapper">
            {/* Left Panel */}
            <div className="login-left-panel">
                <div className="brand-logo">
                    <div className="logo-icon blue-logo">
                        <CarFront size={24} color="#ffffff" />
                    </div>
                    <span className="logo-text" style={{ color: '#3B82F6' }}>Shipzo</span>
                </div>

                <div className="hero-text">
                    <h1>Manage your fleet<br />with confidence.</h1>
                    <p>
                        Replace manual logbooks with a centralized, rule-based
                        digital platform. Optimize vehicle lifecycle, monitor driver
                        safety, and track financial performance.
                    </p>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <h2>250+</h2>
                        <p>VEHICLES<br />MANAGED</p>
                    </div>
                    <div className="stat-card">
                        <h2>98%</h2>
                        <p>ON-TIME DELIVERY</p>
                    </div>
                    <div className="stat-card">
                        <h2>$2.4M</h2>
                        <p>COST SAVINGS</p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="login-right-panel">
                <div className="form-container">
                    <h2>Welcome back</h2>
                    <p className="subtitle">
                        Sign in to your account to continue
                    </p>

                    {error && <div className="error-message">{error}</div>}
                    {successMsg && <div className="success-message" style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem', border: '1px solid #10B981' }}>{successMsg}</div>}

                    <form onSubmit={handleAuthSubmit} className="login-form">
                        <div className="input-group">
                            <label>Role</label>
                            <select
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Manager">Fleet Manager</option>
                                <option value="Dispatcher">Dispatcher</option>
                                <option value="SafetyOfficer">Safety Officer</option>
                                <option value="FinancialAnalyst">Financial Analyst</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <div className="input-with-icon">
                                <span className="icon"><Mail size={18} /></span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label>Password</label>
                                <a href="#" className="forgot-password">Forgot Password?</a>
                            </div>
                            <div className="input-with-icon">
                                <span className="icon"><Lock size={18} /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="icon-right"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            style={{ marginTop: '1.25rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="form-footer">
                        <p>
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
                                Contact Admin
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
