import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirect to login if no token
            return;
        }

        const fetchVehicles = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/vehicles`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setVehicles(response.data);
            } catch (err) {
                setError('Failed to fetch vehicles. Please login again.');
                localStorage.removeItem('token');
                setTimeout(() => navigate('/'), 2000);
            }
        };

        fetchVehicles();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Fleet Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/analytics')}
                        style={{ padding: '8px 16px', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        View Financial Analytics
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2>Your Vehicles</h2>
                {vehicles.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>No vehicles found or loading...</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>ID</th>
                                <th style={{ padding: '12px' }}>Model</th>
                                <th style={{ padding: '12px' }}>License Plate</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map(v => (
                                <tr key={v.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px' }}>{v.id}</td>
                                    <td style={{ padding: '12px' }}>{v.model_name}</td>
                                    <td style={{ padding: '12px' }}>{v.license_plate}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '9999px', fontSize: '0.875rem',
                                            background: v.status === 'Available' ? '#d1fae5' : '#fee2e2',
                                            color: v.status === 'Available' ? '#065f46' : '#991b1b'
                                        }}>
                                            {v.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
