import React, { useState } from 'react';
import { Search, Layers, Filter, ArrowUpDown, Edit2, Plus } from 'lucide-react';

const VehicleRegistry = () => {
    const [vehicles] = useState([
        { id: 1, plate: 'MH 00', model: '2017', type: 'Mini', capacity: '5 tonn', odometer: '79,000 km', status: 'Idle', statusColor: 'green' },
        { id: 2, plate: 'DL 01', model: '2021', type: 'Standard', capacity: '12 tonn', odometer: '12,450 km', status: 'In Route', statusColor: 'blue' },
        { id: 3, plate: 'KA 05', model: '2019', type: 'Heavy Duty', capacity: '25 tonn', odometer: '45,200 km', status: 'Maintenance', statusColor: 'orange' },
    ]);

    const getStatusStyle = (color) => {
        if (color === 'green') return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
        if (color === 'blue') return { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' };
        if (color === 'orange') return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
        return { bg: '#E5E7EB', text: '#374151', dot: '#6B7280' };
    };

    return (
        <div style={{ padding: '0px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Vehicle Registry</h1>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Manage your fleet assets.</p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '16px', flex: '1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', flex: '1', minWidth: '300px' }}>
                        <Search size={18} color="#94A3B8" />
                        <input type="text" placeholder="Search vehicles by plate, model, or status..." style={{ border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.875rem' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Layers size={16} /> Group by</button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><Filter size={16} /> Filter</button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 16px', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}><ArrowUpDown size={16} /> Sort by</button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2563EB', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                    <Plus size={16} /> New Vehicle
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Form side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '0 0 320px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#1E293B' }}>✦</span> New Vehicle Registration
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '24px' }}>Add a new asset to your fleet registry.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>License Plate</label>
                            <input type="text" placeholder="e.g. MH 00 AA 1234" style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Max Payload</label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" placeholder="5" style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', width: '100%', boxSizing: 'border-box' }} />
                                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>TONS</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Initial Odometer</label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" placeholder="79000" style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', width: '100%', boxSizing: 'border-box' }} />
                                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>KM</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Type</label>
                                <select style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', color: '#334155', appearance: 'none', background: '#fff url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%2394A3B8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'m6 9 6 6 6-6\'/></svg>") no-repeat right 12px center', backgroundSize: '12px' }}>
                                    <option>Mini</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>Model Year</label>
                                <input type="text" placeholder="2017" style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', background: '#F8FAFC' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                        <button style={{ background: '#2563EB', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer', flex: 1 }}>Save Vehicle</button>
                        <button style={{ background: '#fff', color: '#475569', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: '500', fontSize: '0.875rem', cursor: 'pointer', flex: 1 }}>Cancel</button>
                    </div>
                </div>

                {/* Table side */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', flex: '1', minWidth: '600px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>NO</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>PLATE</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>MODEL</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>TYPE</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>CAPACITY</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>ODOMETER</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>STATUS</th>
                                <th style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '600', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((v, idx) => {
                                const style = getStatusStyle(v.statusColor);
                                return (
                                    <tr key={idx} style={{ borderBottom: idx === vehicles.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.id}</td>
                                        <td style={{ padding: '16px 16px', color: '#1E293B', fontSize: '0.875rem', fontWeight: '500' }}>{v.plate}</td>
                                        <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.model}</td>
                                        <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.type}</td>
                                        <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.capacity}</td>
                                        <td style={{ padding: '16px 16px', color: '#475569', fontSize: '0.875rem' }}>{v.odometer}</td>
                                        <td style={{ padding: '16px 16px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: style.bg, color: style.text, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }}></div>
                                                {v.status}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 16px', color: '#94A3B8' }}><Edit2 size={16} style={{ cursor: 'pointer' }} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#64748B' }}>
                        <span>Showing 3 of 12 vehicles</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '6px', color: '#94A3B8', cursor: 'pointer' }}>Previous</button>
                            <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: '6px', color: '#475569', cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleRegistry;
