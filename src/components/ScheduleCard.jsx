import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, MapPin, AlertTriangle, Plus, Briefcase } from 'lucide-react';

const ScheduleCard = ({ item, isConflicting, isAddedAsStudent, isAddedAsAssistant, onAdd, conflictInfo }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass"
            style={{
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
                border: isConflicting ? '1px solid #ef4444' : '1px solid var(--glass-border)'
            }}
        >
            <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex' }}>
                <div style={{ padding: '6px 12px', background: 'var(--primary)', color: 'white', borderBottomLeftRadius: '12px', fontSize: '0.65rem', fontWeight: 800 }}>
                    Kls {item.class}
                </div>
                {isConflicting && (
                    <div style={{ padding: '6px 12px', background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>
                        BENTROK
                    </div>
                )}
            </div>
            <h3 style={{ marginBottom: '0.75rem', paddingRight: '45px', fontSize: '1.1rem', lineHeight: 1.3 }}>{item.subject}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} color={isConflicting ? '#ef4444' : 'var(--text-muted)'} /> <span>{item.day}, {item.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Users size={14} /> <span>{item.lecturer}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} /> <span>{item.room}</span>
                </div>
            </div>

            {isConflicting && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>
                    <AlertTriangle size={14} /> Berbenturan dengan {conflictInfo?.subject}
                </div>
            )}

            <div className="stack-on-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    disabled={isAddedAsStudent}
                    onClick={() => onAdd(item, 'mahasiswa')}
                    className={`btn ${isAddedAsStudent ? 'btn-ghost' : 'btn-primary'}`}
                    style={{ flex: 1, fontSize: '0.75rem', opacity: isAddedAsStudent ? 0.7 : 1, padding: '10px' }}
                >
                    {isAddedAsStudent ? 'Sudah Ada' : 'Tambah Kuliah'}
                </button>

                {item.subject.toLowerCase().includes('praktikum') && (
                    <button
                        disabled={isAddedAsAssistant}
                        onClick={() => onAdd(item, 'asisten')}
                        className={`btn btn-ghost`}
                        style={{ flex: 1, fontSize: '0.75rem', borderColor: 'var(--secondary)', color: 'var(--secondary)', opacity: isAddedAsAssistant ? 0.7 : 1, padding: '10px' }}
                    >
                        <Briefcase size={14} /> {isAddedAsAssistant ? 'Sudah Jadi Asprak' : 'Jadi Asprak'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ScheduleCard;
