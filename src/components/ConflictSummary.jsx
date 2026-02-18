import React from 'react';
import { ShieldAlert, Bell } from 'lucide-react';
import { checkConflict } from '../utils/helpers';

const ConflictSummary = ({ mySchedule }) => {
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
                            <div key={`${item.id}-${other.id}-${cIdx}`} className="glass" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#ef4444', color: 'white', padding: '10px', borderRadius: '12px' }}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ color: '#ff6b6b', fontSize: '1rem', marginBottom: '0.5rem' }}>Konflik Waktu Terdeteksi</h4>
                                        <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem' }}>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.subject}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.role === 'asisten' ? '💼 Asprak' : '🎓 Kuliah'}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{item.time}</p>
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>VS</div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{other.subject}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{other.role === 'asisten' ? '💼 Asprak' : '🎓 Kuliah'}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{other.time}</p>
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
