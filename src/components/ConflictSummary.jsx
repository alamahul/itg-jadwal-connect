import React from 'react';
import { ShieldAlert, Bell, Trash2 } from 'lucide-react';
import { checkConflict } from '../utils/helpers';

const ConflictSummary = ({ mySchedule, onRemove }) => {
    const hasConflicts = mySchedule.some((s, idx) =>
        mySchedule.some((other, oIdx) => idx !== oIdx && checkConflict(s, other))
    );

    return (
        <section className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <ShieldAlert color="#ef4444" /> Informasi Konflik Jadwal
            </h3>

            {mySchedule.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Tambahkan beberapa jadwal terlebih dahulu untuk mengecek bentrok.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mySchedule.map((item, idx) => {
                        const conflicts = mySchedule.filter((other, oIdx) =>
                            oIdx > idx &&
                            checkConflict(item, other)
                        );

                        if (conflicts.length === 0) return null;

                        return conflicts.map((other, cIdx) => (
                            <div key={`${item.id}-${other.id}-${cIdx}`} className="glass" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', position: 'relative', borderRadius: '20px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#ef4444', color: 'white', padding: '10px', borderRadius: '12px' }}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: '250px' }}>
                                        <h4 style={{ color: '#ff6b6b', fontSize: '1rem', marginBottom: '0.75rem' }}>Konflik Waktu Terdeteksi</h4>

                                        <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.subject}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{item.role === 'asisten' ? '💼 Asprak' : '🎓 Kuliah'}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.75rem' }}>{item.time}</p>
                                                <button
                                                    onClick={() => onRemove(item.id, item.subject)}
                                                    className="btn btn-ghost"
                                                    style={{ width: '100%', fontSize: '0.75rem', padding: '6px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                                >
                                                    <Trash2 size={14} style={{ marginRight: '4px' }} /> Hapus Ini
                                                </button>
                                            </div>

                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>VS</div>

                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{other.subject}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{other.role === 'asisten' ? '💼 Asprak' : '🎓 Kuliah'}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.75rem' }}>{other.time}</p>
                                                <button
                                                    onClick={() => onRemove(other.id, other.subject)}
                                                    className="btn btn-ghost"
                                                    style={{ width: '100%', fontSize: '0.75rem', padding: '6px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                                >
                                                    <Trash2 size={14} style={{ marginRight: '4px' }} /> Hapus Ini
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ));
                    })}

                    {!hasConflicts && (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <Bell color="var(--primary)" size={48} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Jadwal Aman!</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Tidak ada jadwal yang bentrok saat ini. Kamu bisa fokus kuliah dengan tenang.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default ConflictSummary;
