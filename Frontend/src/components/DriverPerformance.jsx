import React, { useState } from 'react';
import { Search, Layers, Filter, ArrowUpDown } from 'lucide-react';

const DriverPerformance = () => {
    const [drivers] = useState([
        { initials: 'JA', name: 'John Anderson', license: '23223', expiry: '22/36', completion: 92, score: 89, complaints: 4, colorBg: '#3B82F6', statusColor: 'green' },
        { initials: 'SM', name: 'Sarah Miller', license: '45109', expiry: '11/28', completion: 98, score: 95, complaints: 0, colorBg: '#10B981', statusColor: 'green' },
        { initials: 'RT', name: 'Robert Taylor', license: '33921', expiry: '05/25', completion: 76, score: 72, complaints: 12, colorBg: '#F59E0B', statusColor: 'orange' },
        { initials: 'EC', name: 'Emma Chen', license: '88231', expiry: '09/30', completion: 88, score: 91, complaints: 2, colorBg: '#3B82F6', statusColor: 'green' },
        { initials: 'DK', name: 'David Kim', license: '10928', expiry: '12/24', completion: 61, score: 58, complaints: 21, colorBg: '#EF4444', statusColor: 'red' },
    ]);

    const getScoreStyle = (color) => {
        if (color === 'green') return { bg: '#D1FAE5', text: '#065F46', bar: '#10B981' };
        if (color === 'orange') return { bg: '#FEF3C7', text: '#92400E', bar: '#F59E0B' };
        if (color === 'red') return { bg: '#FEE2E2', text: '#991B1B', bar: '#EF4444' };
        return { bg: '#E5E7EB', text: '#374151', bar: '#6B7280' };
    };

    return (
        <div style={{ padding: '0px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Driver Performance & Safety Profiles</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Monitor and manage your fleet's driver safety metrics and performance ratings.</p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', flex: '1', minWidth: '300px' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search drivers, license numbers..." style={{ border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Layers size={16} /> Group by</button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Filter size={16} /> Filter</button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><ArrowUpDown size={16} /> Sort by</button>
                </div>
            </div>

            {/* Drivers Table */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                    <thead>
                        <tr>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', width: '25%' }}>NAME</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', width: '15%' }}>LICENSE #</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', width: '10%' }}>EXPIRY</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', width: '15%', textAlign: 'center' }}>COMPLETION RATE</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', width: '15%', textAlign: 'center' }}>SAFETY SCORE</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', width: '10%', textAlign: 'center' }}>COMPLAINTS</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', width: '10%', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((drv, idx) => {
                            const style = getScoreStyle(drv.statusColor);
                            return (
                                <tr key={idx} style={{ borderBottom: idx === drivers.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: drv.colorBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                                                {drv.initials}
                                            </div>
                                            <span style={{ color: '#1E293B', fontSize: '0.875rem', fontWeight: '500' }}>{drv.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{drv.license}</td>
                                    <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{drv.expiry}</td>
                                    <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1E293B' }}>{drv.completion}%</span>
                                            <div style={{ width: '80%', height: '4px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                                                <div style={{ width: `${drv.completion}%`, height: '100%', background: style.bar }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                                        <span style={{ display: 'inline-block', background: style.bg, color: style.text, padding: '4px 12px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>
                                            {drv.score}%
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 16px', textAlign: 'center', color: '#475569', fontSize: '0.875rem', fontWeight: '500' }}>{drv.complaints}</td>
                                    <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>View Details</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#64748B' }}>
                    <span>Showing 1 to 5 of 42 drivers</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '6px', color: '#94A3B8', cursor: 'pointer' }}>Previous</button>
                        <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '6px', color: '#475569', cursor: 'pointer' }}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverPerformance;
