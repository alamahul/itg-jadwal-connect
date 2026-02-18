import React from 'react';
import { Calendar, LogOut, Settings } from 'lucide-react';

const Header = ({ user, onLogout, onOpenSettings }) => {
    return (
        <header className="glass stack-on-mobile" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
                    <Calendar color="white" size={20} />
                </div>
                <div>
                    <h2 className="header-logo-text" style={{ fontSize: '1.1rem' }}>ITG Jadwal</h2>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Semester Genap 2025/2026</p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', width: 'auto' }} className="full-width-mobile">
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Smtr {user?.semester} • Kls {user?.userClass}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onOpenSettings} className="btn btn-ghost" style={{ padding: '8px' }}>
                        <Settings size={18} />
                    </button>
                    <button onClick={onLogout} className="btn btn-ghost" style={{ padding: '8px' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
