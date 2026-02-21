import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import './Login.css';

const Login = () => {
    // Mode state
    const [showOtpStep, setShowOtpStep] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Manager');
    const [showPassword, setShowPassword] = useState(false);

    // OTP state
    const [otp, setOtp] = useState('');
    const [tempToken, setTempToken] = useState('');

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
            const response = await axios.post('http://localhost:3000/api/auth/login', payload);

            // If login has OTP flow from backend, it will send requiresOtp
            if (response.data.requiresOtp && response.data.tempToken) {
                setTempToken(response.data.tempToken);
                setShowOtpStep(true);
                setSuccessMsg('OTP sent to your email.');
            } else if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Custom routing based on role
                if (role === 'FinancialAnalyst') {
                    navigate('/expense');
                } else if (role === 'Dispatcher') {
                    navigate('/management');
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

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/verify-otp', {
                otp,
                tempToken
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (role === 'FinancialAnalyst') {
                    navigate('/expense');
                } else if (role === 'Dispatcher') {
                    navigate('/management');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Invalid server response during OTP verification.');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            {/* Left Panel */}
            <div className="login-left-panel">
                <div className="brand-logo">
                    <div className="logo-icon">
                        <Package size={36} color="#2F80ED" />
                    </div>
                    <span className="logo-text">Shipzo</span>
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
                    <h2>{showOtpStep ? 'Verify OTP' : 'Welcome back'}</h2>
                    <p className="subtitle">
                        {showOtpStep ? 'Security verification required' : 'Sign in to your account to continue'}
                    </p>

                    {error && <div className="error-message">{error}</div>}
                    {successMsg && <div className="success-message" style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem', border: '1px solid #10B981' }}>{successMsg}</div>}

                    {!showOtpStep ? (
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
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="login-form">
                            <p className="otp-instructions">
                                An OTP has been sent to your registered device/email.
                            </p>

                            <div className="input-group">
                                <label>Enter OTP</label>
                                <div className="input-with-icon">
                                    <span className="icon"><KeyRound size={18} /></span>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                style={{ marginTop: '1.25rem' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                className="back-btn"
                                onClick={() => {
                                    setShowOtpStep(false);
                                    setOtp('');
                                    setError('');
                                    setSuccessMsg('');
                                }}
                                disabled={isLoading}
                            >
                                Back to Login
                            </button>
                        </form>
                    )}

                    {!showOtpStep && (
                        <div className="form-footer">
                            <p>
                                Don't have an account?{' '}
                                <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
                                    Contact Admin
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
