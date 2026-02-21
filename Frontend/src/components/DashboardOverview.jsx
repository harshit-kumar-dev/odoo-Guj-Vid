import React, { useState } from 'react';
import { Search, Layers, Filter, ArrowUpDown, MoreVertical, Truck, AlertTriangle, PackageOpen } from 'lucide-react';

const DashboardOverview = () => {
    const [trips] = useState([
        { id: 'TR-9821', vehicle: 'Volvo FH16 (CA-1234)', type: 'Heavy Duty', driver: 'John Doe', status: 'On Trip', statusColor: 'green' },
        { id: 'TR-9822', vehicle: 'Scania R450 (NY-5678)', type: 'Long Haul', driver: 'Sarah Smith', status: 'Completed', statusColor: 'blue' },
        { id: 'TR-9823', vehicle: 'Mercedes Actros (TX-9012)', type: 'Heavy Duty', driver: 'Michael Brown', status: 'Dispatched', statusColor: 'orange' },
        { id: 'TR-9824', vehicle: 'Freightliner Cascadia (FL-3456)', type: 'Express Delivery', driver: 'Emily Davis', status: 'Delayed', statusColor: 'red' },
    ]);

    const getStatusStyle = (color) => {
        if (color === 'green') return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
        if (color === 'blue') return { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' };
        if (color === 'orange') return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
        if (color === 'red') return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' };
        return { bg: '#E5E7EB', text: '#374151', dot: '#6B7280' };
    };

    return (
        <div style={{ padding: '0px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Dashboard Overview</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Welcome back, here's what's happening with your fleet today.</p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', flex: '1', minWidth: '300px' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search trips, vehicles, or drivers..." style={{ border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Layers size={16} /> Group by</button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Filter size={16} /> Filter</button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><ArrowUpDown size={16} /> Sort by</button>
                </div>
            </div>

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* Card 1 */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '8px', color: '#3B82F6' }}>
                            <Truck size={24} />
                        </div>
                        <span style={{ color: '#2563EB', fontSize: '0.875rem', fontWeight: '600' }}>+12%</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '4px' }}>Active Fleet</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>220</h2>
                    </div>
                </div>

                {/* Card 2 */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: '#FFF7ED', padding: '10px', borderRadius: '8px', color: '#F59E0B' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <span style={{ color: '#F59E0B', fontSize: '0.875rem', fontWeight: '600' }}>+5%</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '4px' }}>Maintenance Alerts</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>180</h2>
                    </div>
                </div>

                {/* Card 3 */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '8px', color: '#64748B' }}>
                            <PackageOpen size={24} />
                        </div>
                        <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '500' }}>Stable</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '4px' }}>Pending Cargo</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>20</h2>
                    </div>
                </div>
            </div>

            {/* Recent Trips Table */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1E293B', margin: 0 }}>Recent Trips</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ background: '#fff', color: '#475569', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            + New Vehicle
                        </button>
                        <button style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Truck size={16} /> New Trip
                        </button>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>TRIP ID</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '30%' }}>VEHICLE</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>DRIVER</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>STATUS</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((trip, idx) => {
                            const style = getStatusStyle(trip.statusColor);
                            return (
                                <tr key={idx} style={{ borderBottom: idx === trips.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px 0', color: '#475569', fontSize: '0.875rem' }}>{trip.id}</td>
                                    <td style={{ padding: '16px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Truck size={18} color="#94A3B8" />
                                            <div>
                                                <div style={{ color: '#1E293B', fontSize: '0.875rem', fontWeight: '500' }}>{trip.vehicle}</div>
                                                <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{trip.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>{trip.driver}</td>
                                    <td style={{ padding: '16px 0' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: style.bg, color: style.text, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }}></div>
                                            {trip.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 0', color: '#94A3B8' }}><MoreVertical size={18} style={{ cursor: 'pointer' }} /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#64748B' }}>
                    <span>Showing 1 to 4 of 24 trips</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '6px', color: '#94A3B8', cursor: 'pointer' }}>Previous</button>
                        <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '6px', color: '#475569', cursor: 'pointer' }}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
