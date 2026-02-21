import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fuel, DollarSign, Activity, FileText } from 'lucide-react';

const FinancialAnalytics = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/api/vehicles', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setVehicles(res.data);
                if (res.data.length > 0) {
                    setSelectedVehicle(res.data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch vehicles:", err);
            }
        };
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (!selectedVehicle) return;

        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:3000/api/analytics/vehicle/${selectedVehicle}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAnalytics(res.data);
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                setAnalytics(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [selectedVehicle]);

    return (
        <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Operational Analytics & Financial Reports</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Real-time overview of your fleet's performance and financial health.</p>
            </div>

            <div style={{ marginBottom: '24px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontWeight: '600', color: '#334155' }}>Select Vehicle to Analyze:</label>
                <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                >
                    {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.license_plate} - {v.model_name}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading analytics data...</p>}

            {!loading && analytics && (
                <>
                    {/* Top Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>TOTAL FUEL COST</span>
                                <Fuel size={20} color="#3B82F6" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>₹{analytics.total_fuel_cost}</h2>
                                <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '500' }}>For {analytics.total_liters_used} Liters logged</span>
                            </div>
                        </div>

                        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>MAINTENANCE COST</span>
                                <FileText size={20} color="#3B82F6" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>₹{analytics.total_maintenance_cost}</h2>
                                <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '500' }}>Total repair expenses</span>
                            </div>
                        </div>

                        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>FUEL EFFICIENCY (KM/L)</span>
                                <Activity size={20} color="#10B981" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#10B981', margin: '0 0 8px 0' }}>{analytics.fuel_efficiency_km_per_liter} km/L</h2>
                                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Based on reading: {analytics.odometer_km} km</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Summary List */}
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>Total Vehicle Cost Summary</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                                <span style={{ color: '#475569', fontWeight: '500' }}>Acquisition Cost (Est)</span>
                                <span style={{ color: '#1E293B', fontWeight: '600' }}>₹{analytics.acquisition_cost || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                                <span style={{ color: '#475569', fontWeight: '500' }}>Operational Cost (Fuel + Maintenance)</span>
                                <span style={{ color: '#1E293B', fontWeight: '600' }}>₹{analytics.total_operational_cost}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                                <span style={{ color: '#0F172A', fontWeight: '700' }}>Total Cost of Ownership (TCO)</span>
                                <span style={{ color: '#0F172A', fontWeight: '700', fontSize: '1.125rem' }}>₹{analytics.total_cost_of_ownership}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FinancialAnalytics;
