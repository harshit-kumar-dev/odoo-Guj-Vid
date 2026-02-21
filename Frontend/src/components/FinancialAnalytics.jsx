import React from 'react';
import { Fuel, TrendingUp, Activity, Download } from 'lucide-react';

const FinancialAnalytics = () => {
    return (
        <div style={{ padding: '0px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Operational Analytics & Financial Reports</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Real-time overview of your fleet's performance and financial health.</p>
            </div>

            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>TOTAL FUEL COST</span>
                        <Fuel size={20} color="#3B82F6" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>Rs. 2.6 L</h2>
                        <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '500' }}>↗ 4.2% from last month</span>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>FLEET ROI</span>
                        <TrendingUp size={20} color="#3B82F6" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>+ 12.5%</h2>
                        <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '500' }}>↗ 1.8% from last month</span>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>UTILIZATION RATE</span>
                        <Activity size={20} color="#3B82F6" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: '0 0 8px 0' }}>82%</h2>
                        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: '82%', height: '100%', background: '#2563EB', borderRadius: '9999px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>Fuel Efficiency Trend (km/L)</h3>
                    {/* SVG Line Chart Placeholder */}
                    <div style={{ position: 'relative', height: '200px', width: '100%', display: 'flex' }}>
                        {/* y-axis labels */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', paddingRight: '10px' }}>
                            <span>20</span>
                            <span>15</span>
                            <span>10</span>
                            <span>5</span>
                            <span>0</span>
                        </div>
                        {/* chart area */}
                        <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                            {/* Grid lines */}
                            <div style={{ position: 'absolute', width: '100%', height: '25%', borderTop: '1px dashed #E2E8F0', bottom: '25%' }}></div>
                            <div style={{ position: 'absolute', width: '100%', height: '25%', borderTop: '1px dashed #E2E8F0', bottom: '50%' }}></div>
                            <div style={{ position: 'absolute', width: '100%', height: '25%', borderTop: '1px dashed #E2E8F0', bottom: '75%' }}></div>

                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute' }}>
                                <path d="M 0,60 L 20,50 L 40,70 L 60,30 L 80,40 L 100,20" fill="none" stroke="#2563EB" strokeWidth="2" />
                                <circle cx="0" cy="60" r="2" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                                <circle cx="20" cy="50" r="2" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                                <circle cx="40" cy="70" r="2" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                                <circle cx="60" cy="30" r="2" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                                <circle cx="80" cy="40" r="2" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                                <circle cx="100" cy="20" r="2" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                    {/* x-axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', marginLeft: '25px', marginTop: '10px' }}>
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>Top 5 Costliest Vehicles</h3>
                    {/* SVG Bar Chart Placeholder */}
                    <div style={{ position: 'relative', height: '200px', width: '100%', display: 'flex' }}>
                        {/* y-axis labels */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', paddingRight: '10px' }}>
                            <span>60000</span>
                            <span>45000</span>
                            <span>30000</span>
                            <span>15000</span>
                            <span>0</span>
                        </div>
                        {/* chart area */}
                        <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 5%' }}>
                            {/* Grid lines */}
                            <div style={{ position: 'absolute', width: '100%', height: '25%', top: 0, left: 0, borderBottom: '1px dashed #E2E8F0' }}></div>
                            <div style={{ position: 'absolute', width: '100%', height: '25%', top: '25%', left: 0, borderBottom: '1px dashed #E2E8F0' }}></div>
                            <div style={{ position: 'absolute', width: '100%', height: '25%', top: '50%', left: 0, borderBottom: '1px dashed #E2E8F0' }}></div>

                            {/* Bars */}
                            <div style={{ width: '12%', height: '20%', background: '#2563EB', zIndex: 1, borderRadius: '2px 2px 0 0' }}></div>
                            <div style={{ width: '12%', height: '40%', background: '#2563EB', zIndex: 1, borderRadius: '2px 2px 0 0' }}></div>
                            <div style={{ width: '12%', height: '55%', background: '#2563EB', zIndex: 1, borderRadius: '2px 2px 0 0' }}></div>
                            <div style={{ width: '12%', height: '70%', background: '#2563EB', zIndex: 1, borderRadius: '2px 2px 0 0' }}></div>
                            <div style={{ width: '12%', height: '90%', background: '#2563EB', zIndex: 1, borderRadius: '2px 2px 0 0' }}></div>
                        </div>
                    </div>
                    {/* x-axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', color: '#94A3B8', fontSize: '0.75rem', marginLeft: '35px', marginTop: '10px' }}>
                        <span>VAN-03</span>
                        <span>TRK-12</span>
                        <span>TRK-01</span>
                        <span>BUS-05</span>
                        <span>TRK-09</span>
                    </div>
                </div>
            </div>

            {/* Bottom Table */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1E293B', margin: 0 }}>Financial Summary of Month</h3>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#2563EB', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                        Export Report <Download size={16} />
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>MONTH</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>REVENUE</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>FUEL COST</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>MAINTENANCE</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>NET PROFIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>January</td>
                            <td style={{ padding: '16px 16px', color: '#1E293B', fontSize: '0.875rem', fontWeight: '500' }}>Rs. 17 L</td>
                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>Rs. 6 L</td>
                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>Rs. 2 L</td>
                            <td style={{ padding: '16px 16px', color: '#10B981', fontSize: '0.875rem', fontWeight: '600', textAlign: 'right' }}>Rs. 9 L</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>February</td>
                            <td style={{ padding: '16px 16px', color: '#1E293B', fontSize: '0.875rem', fontWeight: '500' }}>Rs. 19.5 L</td>
                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>Rs. 7 L</td>
                            <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>Rs. 2.5 L</td>
                            <td style={{ padding: '16px 16px', color: '#10B981', fontSize: '0.875rem', fontWeight: '600', textAlign: 'right' }}>Rs. 10 L</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancialAnalytics;
