import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, BellOff, Clock, ShieldCheck } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, setSettings, theme, setTheme }) => {
    if (!isOpen) return null;

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggleBeforeMinute = (min) => {
        const newMinutes = settings.beforeMinutes.includes(min)
            ? settings.beforeMinutes.filter(m => m !== min)
            : [...settings.beforeMinutes, min];
        updateSetting('beforeMinutes', newMinutes);
    };

    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="glass"
                    style={{
                        width: '100%',
                        maxWidth: '450px',
                        padding: '1.5rem',
                        position: 'relative',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', color: 'white' }}>
                                <ShieldCheck size={20} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem' }}>Pengaturan</h2>
                        </div>
                        <button onClick={onClose} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Theme Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '1rem' }}>TAMPILAN</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setTheme('light')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: `2px solid ${theme === 'light' ? 'var(--primary)' : 'var(--glass-border)'}`,
                                    background: theme === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Sun size={24} color={theme === 'light' ? 'var(--primary)' : 'var(--text-muted)'} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: theme === 'light' ? 'var(--text-main)' : 'var(--text-muted)' }}>Light</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: `2px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--glass-border)'}`,
                                    background: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Moon size={24} color={theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)'} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: theme === 'dark' ? 'var(--text-main)' : 'var(--text-muted)' }}>Night</span>
                            </button>
                        </div>
                    </div>

                    {/* Notification Section */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>NOTIFIKASI JADWAL</p>
                            <button
                                onClick={() => updateSetting('enabled', !settings.enabled)}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    background: settings.enabled ? '#22c55e' : 'var(--text-muted)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {settings.enabled ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: settings.enabled ? 1 : 0.5, pointerEvents: settings.enabled ? 'auto' : 'none' }}>

                            {/* Midnight Summary */}
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '12px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Clock size={18} color="var(--primary)" />
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ringkasan Hari Ini</p>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Kirim notifikasi daftar matkul jam 00:00</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.midnightSummary}
                                    onChange={(e) => updateSetting('midnightSummary', e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </label>

                            {/* Before Class Alerts */}
                            <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                    <Bell size={18} color="var(--accent)" />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ingatkan Sebelum Kuliah</p>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {[5, 10, 15, 30, 60, 120, 180].map(min => (
                                        <button
                                            key={min}
                                            onClick={() => toggleBeforeMinute(min)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                background: settings.beforeMinutes.includes(min) ? 'var(--accent)' : 'transparent',
                                                color: settings.beforeMinutes.includes(min) ? 'white' : 'var(--text-muted)',
                                                border: `1px solid ${settings.beforeMinutes.includes(min) ? 'transparent' : 'var(--glass-border)'}`,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {min} Menit
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Custom Settings */}
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '12px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div style={{ background: 'var(--secondary)', width: '8px', height: '8px', borderRadius: '50%' }} />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Bunyi Notifikasi</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.soundEnabled}
                                    onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                            </label>

                        </div>
                    </div>

                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Versi 1.1.0 • PWA Enabled
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SettingsModal;
