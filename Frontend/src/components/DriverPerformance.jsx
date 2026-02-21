import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Award, FileText } from 'lucide-react';

const DriverPerformance = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        license_number: '',
        license_expiry_date: '',
        status: 'OnDuty'
    });

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

    const fetchDriversData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/drivers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDrivers(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            // Assuming default safety score of 100 on creation
            await axios.post('http://localhost:3000/api/drivers', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Clear form
            setFormData({
                name: '',
                license_number: '',
                license_expiry_date: '',
                status: 'OnDuty'
            });

            // Refresh list
            fetchDriversData();
            alert("Driver registered successfully!");
        } catch (err) {
            alert(err.response?.data?.error || "Error saving driver");
        }
    };

    // Helper functions
    const isLicenseExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date();
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading driver profiles...</div>;

    return (
        <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Driver Performance & Safety Profiles</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Monitor fleet drivers and compliance.</p>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Form side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '0 0 320px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#1E293B' }}>✦</span> New Driver Registration
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '24px' }}>Add a new driver to your fleet roster.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>License Number</label>
                            <input
                                type="text"
                                placeholder="e.g. DL-12345"
                                value={formData.license_number}
                                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                                style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>License Expiry Date</label>
                            <input
                                type="date"
                                value={formData.license_expiry_date}
                                onChange={(e) => setFormData({ ...formData, license_expiry_date: e.target.value })}
                                style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Initial Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', background: '#fff' }}
                            >
                                <option value="OnDuty">On Duty</option>
                                <option value="OffDuty">Off Duty</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                        <button onClick={handleSave} style={{ background: '#2563EB', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer', flex: 1 }}>Save Driver</button>
                    </div>
                </div>

                {/* Table side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '1', minWidth: '600px', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Active Fleet Roster</h2>
                    </div>

                    {loading ? <p>Loading drivers...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase' }}>Driver Name</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase' }}>License Info</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase' }}>Safety Score</th>
                                    <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((driver, idx) => (
                                    <tr key={driver.id} style={{ borderBottom: idx === drivers.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 16px', fontWeight: '500', color: '#1E293B', fontSize: '0.875rem' }}>
                                            {driver.name}
                                        </td>
                                        <td style={{ padding: '16px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FileText size={16} color="#64748B" />
                                                <span style={{ fontSize: '0.875rem', color: '#475569' }}>{driver.license_number}</span>
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
                                        <td style={{ padding: '16px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {driver.safety_score > 90 ? <ShieldCheck size={18} color="#10B981" /> : <Award size={18} color="#F59E0B" />}
                                                <div style={{ width: '100px', background: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${Math.max(0, Math.min(100, driver.safety_score))}%`, background: driver.safety_score > 90 ? '#10B981' : (driver.safety_score > 60 ? '#F59E0B' : '#EF4444'), height: '100%' }}></div>
                                                </div>
                                                <span style={{ fontWeight: '600', fontSize: '0.875rem', color: '#334155' }}>{driver.safety_score}/100</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 16px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500',
                                                backgroundColor: driver.status === 'OnDuty' ? '#DBEAFE' : (driver.status === 'OffDuty' ? '#F1F5F9' : '#FEE2E2'),
                                                color: driver.status === 'OnDuty' ? '#1E40AF' : (driver.status === 'OffDuty' ? '#475569' : '#991B1B')
                                            }}>
                                                {driver.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div >
    );
};

export default DriverPerformance;
