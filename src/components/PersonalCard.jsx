import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Trash2, Briefcase, User } from 'lucide-react';

const PersonalCard = ({ item, onRemove }) => {
    const isAsisten = item.role === 'asisten';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass card-mobile-small"
            style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${isAsisten ? 'var(--secondary)' : 'var(--primary)'}`,
                position: 'relative',
                background: isAsisten ? 'rgba(236, 72, 153, 0.03)' : 'rgba(99, 102, 241, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <div style={{ position: 'absolute', top: 0, right: 35, padding: '4px 10px', background: isAsisten ? 'var(--secondary)' : 'var(--primary)', color: 'white', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', fontSize: '0.65rem', fontWeight: 700 }}>
                Kls {item.class}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, paddingRight: '20px', marginBottom: '0.25rem' }}>
                        {item.subject}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: isAsisten ? 'var(--secondary)' : 'var(--primary)', fontWeight: 600 }}>
                        {isAsisten ? <Briefcase size={12} /> : <User size={12} />}
                        {isAsisten ? 'ASISTEN PRAKTIKUM' : 'MAHASISWA'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: 'var(--glass-bg)', padding: '6px', borderRadius: '8px', color: 'var(--text-main)' }}>
                            <Clock size={16} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: 'var(--glass-bg)', padding: '6px', borderRadius: '8px', color: 'var(--text-main)' }}>
                            <MapPin size={16} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.room}</span>
                    </div>
                </div>

                <button
                    onClick={() => onRemove(item.id, item.subject)}
                    className="btn-ghost"
                    style={{
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '8px',
                        borderRadius: '10px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
};

export default PersonalCard;
