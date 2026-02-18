import React from 'react';
import { Search } from 'lucide-react';

const Filters = ({
    searchQuery, setSearchQuery,
    filterDay, setFilterDay,
    filterSemester, setFilterSemester,
    filterClass, setFilterClass,
    days, semesters, classes
}) => {
    const pillBtn = (active) => ({
        padding: '7px 14px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: active ? 700 : 500,
        background: active ? undefined : 'transparent',
        border: `1px solid ${active ? 'transparent' : 'var(--glass-border)'}`,
        color: active ? 'white' : 'var(--text-muted)',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        cursor: 'pointer',
    });

    return (
        <div className="glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    placeholder="Cari Mata Kuliah atau Dosen..."
                    style={{ paddingLeft: '38px', fontSize: '0.875rem', width: '100%' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filter Groups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Day Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em' }}>HARI</span>
                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}
                        className="no-scrollbar">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => setFilterDay(day)}
                                style={{
                                    ...pillBtn(filterDay === day),
                                    background: filterDay === day ? 'var(--primary)' : 'transparent',
                                    boxShadow: filterDay === day ? '0 2px 10px rgba(99,102,241,0.4)' : 'none',
                                }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Semester Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em' }}>SEMESTER</span>
                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}
                        className="no-scrollbar">
                        {semesters.map(sem => (
                            <button
                                key={sem}
                                onClick={() => setFilterSemester(sem)}
                                style={{
                                    ...pillBtn(filterSemester === sem),
                                    background: filterSemester === sem ? 'var(--accent)' : 'transparent',
                                    boxShadow: filterSemester === sem ? '0 2px 10px rgba(139,92,246,0.4)' : 'none',
                                }}
                            >
                                {sem === 'Semua' ? 'Semua' : `Smtr ${sem}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Class Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em' }}>KELAS</span>
                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}
                        className="no-scrollbar">
                        {classes.map(cls => (
                            <button
                                key={cls}
                                onClick={() => setFilterClass(cls)}
                                style={{
                                    ...pillBtn(filterClass === cls),
                                    background: filterClass === cls ? 'var(--secondary)' : 'transparent',
                                    boxShadow: filterClass === cls ? '0 2px 10px rgba(236,72,153,0.4)' : 'none',
                                }}
                            >
                                {cls === 'Semua' ? 'Semua' : `Kls ${cls}`}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Filters;
