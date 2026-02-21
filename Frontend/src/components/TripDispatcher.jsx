import React, { useState } from 'react';
import { Search, Layers, Filter, ArrowUpDown, MoreHorizontal, MapPin, Zap } from 'lucide-react';

const TripDispatcher = () => {
    const [trips] = useState([
        { id: '#TR-8821', fleetToken: 'Trailer Truck', origin: 'Mumbai, MH', dest: 'Pune, MH', status: 'On Way', statusColor: 'green' },
        { id: '#TR-8822', fleetToken: 'Semi-Truck', origin: 'Bangalore, KA', dest: 'Chennai, TN', status: 'Loading', statusColor: 'orange' },
        { id: '#TR-8820', fleetToken: 'Light Van', origin: 'Delhi, DL', dest: 'Gurgaon, HR', status: 'Delayed', statusColor: 'red' }
    ]);

    const getStatusStyle = (color) => {
        if (color === 'green') return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
        if (color === 'orange') return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
        if (color === 'red') return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' };
        return { bg: '#E5E7EB', text: '#374151', dot: '#6B7280' };
    };

    return (
        <div style={{ padding: '0px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Trip Dispatcher</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Manage and dispatch new trips.</p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', flex: '1', minWidth: '300px' }}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search by Trip ID, Fleet, or Location..." style={{ border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Layers size={16} /> Group by</button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Filter size={16} /> Filter</button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><ArrowUpDown size={16} /> Sort by</button>
                </div>
            </div>

            {/* Active Trips Table */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} color="#F59E0B" fill="#F59E0B" /> Active Trips
                    </h3>
                    <span style={{ fontSize: '0.875rem', color: '#64748B' }}>8 total trips</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>TRIP ID</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>FLEET TYPE</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>ORIGIN</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '20%' }}>DESTINATION</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0', width: '15%' }}>STATUS</th>
                            <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((trip, idx) => {
                            const style = getStatusStyle(trip.statusColor);
                            return (
                                <tr key={idx} style={{ borderBottom: idx === trips.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px 0', color: '#2563EB', fontWeight: '500', fontSize: '0.875rem' }}>{trip.id}</td>
                                    <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>{trip.fleetToken}</td>
                                    <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>{trip.origin}</td>
                                    <td style={{ padding: '16px 0', color: '#334155', fontSize: '0.875rem' }}>{trip.dest}</td>
                                    <td style={{ padding: '16px 0' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: style.bg, color: style.text, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }}></div>
                                            {trip.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 0', color: '#94A3B8' }}><MoreHorizontal size={18} style={{ cursor: 'pointer' }} /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* New Trip Dispatch Form */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#334155', display: 'flex', alignItems: 'center' }}>⛭</span> New Trip Dispatch
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Assign vehicles and drivers for new delivery assignments.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Select Vehicle</label>
                        <select style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', appearance: 'none', background: '#fff url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%2394A3B8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'m6 9 6 6 6-6\'/></svg>") no-repeat right 12px center', backgroundSize: '12px' }}>
                            <option>Trailer Truck - GJ 01 XX 1234</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Cargo Weight (Kg)</label>
                        <input type="text" placeholder="e.g. 12000" style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Select Driver</label>
                        <select style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', appearance: 'none', background: '#fff url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%2394A3B8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'m6 9 6 6 6-6\'/></svg>") no-repeat right 12px center', backgroundSize: '12px' }}>
                            <option>Rajesh Kumar (Available)</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Estimated Fuel Cost (₹)</label>
                        <input type="text" placeholder="Auto-calculated or Manual" style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', background: '#F8FAFC' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Origin Address</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', gap: '8px' }}>
                        <MapPin size={16} color="#94A3B8" />
                        <input type="text" placeholder="Enter pickup location details" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Destination Address</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', gap: '8px' }}>
                        <MapPin size={16} color="#94A3B8" />
                        <input type="text" placeholder="Enter drop-off location details" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ background: '#2563EB', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer' }}>Dispatch Trip</button>
                    <button style={{ background: '#fff', color: '#475569', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TripDispatcher;
