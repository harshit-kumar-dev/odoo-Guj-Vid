import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import './Login.css';

const Login = () => {
    // Basic form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Manager');
    const [showPassword, setShowPassword] = useState(false);

    // OTP specific state
    const [showOtpStep, setShowOtpStep] = useState(false);
    const [otp, setOtp] = useState('');
    const [tempToken, setTempToken] = useState('');

    // UI state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // 1. Handle Login
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
                role
            });

            if (response.data.requiresOtp && response.data.tempToken) {
                setTempToken(response.data.tempToken);
                setShowOtpStep(true);
            } else if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard'); // Will need react-router in App.jsx ultimately
            } else {
                setError('Unexpected response from server.');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Handle OTP Verification
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
                navigate('/dashboard');
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
            {/* Left Panel - Dark Theme Info Section */}
            <div className="login-left-panel">
                <div className="brand-logo">
                    <div className="logo-icon">
                        <Package size={36} color="#ffffff" />
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

            {/* Right Panel - Login Form */}
            <div className="login-right-panel">
                <div className="form-container">
                    <h2>{showOtpStep ? 'Verify OTP' : 'Welcome back'}</h2>
                    <p className="subtitle">
                        {showOtpStep ? 'Security verification required' : 'Sign in to your account to continue'}
                    </p>

                    {error && <div className="error-message">{error}</div>}

                    {!showOtpStep ? (
                        /* ----- STEP 1: INITIAL LOGIN FORM ----- */
                        <form onSubmit={handleLoginSubmit} className="login-form">
                            <div className="input-group">
                                <label>Select Role</label>
                                <select
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Manager">Fleet Managers</option>
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
                        /* ----- STEP 2: OTP VERIFICATION FORM ----- */
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
                                }}
                                disabled={isLoading}
                            >
                                Back to Login
                            </button>
                        </form>
                    )}

                    {!showOtpStep && (
                        <div className="form-footer">
                            <p>Don't have an account? <a href="#">Contact Admin</a></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
