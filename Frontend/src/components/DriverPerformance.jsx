import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Award, FileText } from 'lucide-react';

const DriverPerformance = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/drivers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDrivers(response.data);
            } catch (err) {
                console.error("Failed to fetch drivers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    // Helper functions
    const isLicenseExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date();
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading driver profiles...</div>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>Driver Performance & Safety Profiles</h1>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Active Fleet Roster</h2>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F9FAFB', color: '#4B5563', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '1rem 1.5rem' }}>Driver Name</th>
                            <th style={{ padding: '1rem 1.5rem' }}>License Info</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Safety Score</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                                    {driver.name}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FileText size={16} color="#6B7280" />
                                        <span>{driver.license_number}</span>
                                        {isLicenseExpired(driver.license_expiry_date) ? (
                                            <span style={{ color: '#EF4444', fontSize: '0.75rem', background: '#FEF2F2', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <ShieldAlert size={12} /> EXPIRED
                                            </span>
                                        ) : (
                                            <span style={{ color: '#10B981', fontSize: '0.75rem', background: '#F0FDF4', padding: '2px 6px', borderRadius: '4px' }}>
                                                Valid until {new Date(driver.license_expiry_date).getFullYear()}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {driver.safety_score > 90 ? <ShieldCheck size={18} color="#10B981" /> : <Award size={18} color="#F59E0B" />}
                                        <div style={{ width: '100px', background: '#E5E7EB', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.max(0, Math.min(100, driver.safety_score))}%`, background: driver.safety_score > 90 ? '#10B981' : (driver.safety_score > 60 ? '#F59E0B' : '#EF4444'), height: '100%' }}></div>
                                        </div>
                                        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{driver.safety_score}/100</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500',
                                        backgroundColor: driver.status === 'OnDuty' ? '#DBEAFE' : (driver.status === 'OffDuty' ? '#F3F4F6' : '#FEE2E2'),
                                        color: driver.status === 'OnDuty' ? '#1E40AF' : (driver.status === 'OffDuty' ? '#4B5563' : '#991B1B')
                                    }}>
                                        {driver.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default DriverPerformance;
