import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ShieldAlert, Users, Briefcase, Calendar, Search } from 'lucide-react';

// Hooks
import { useSchedule } from './hooks/useSchedule';
import { checkConflict } from './utils/helpers';

// Components
import Login from './components/Login';
import Header from './components/Header';
import Filters from './components/Filters';
import ScheduleCard from './components/ScheduleCard';
import PersonalCard from './components/PersonalCard';
import ConflictSummary from './components/ConflictSummary';
import SettingsModal from './components/SettingsModal';

const App = () => {
  const {
    user,
    mySchedule,
    handleLogin,
    handleLogout,
    addToMySchedule,
    removeFromMySchedule,
    scheduleData
  } = useSchedule();

  const [activeTab, setActiveTab] = useState('umum');
  const [searchQuery, setSearchQuery] = useState('');

  // Set default filters based on user data
  const [filterDay, setFilterDay] = useState('Semua');
  const [filterSemester, setFilterSemester] = useState(user?.semester || 'Semua');
  const [filterClass, setFilterClass] = useState(user?.userClass || 'Semua');

  // Settings & Theme
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('itg_theme') || 'dark');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('itg_notif_settings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      midnightSummary: true,
      beforeMinutes: [15],
      soundEnabled: true
    };
  });

  const days = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const semesters = ['Semua', '2', '4', '6', '8'];
  const classes = ['Semua', 'A', 'B', 'C', 'D', 'E'];

  // Update filters if user changes (e.g. after login)
  useEffect(() => {
    if (user) {
      setFilterSemester(user.semester);
      setFilterClass(user.userClass);
    }
  }, [user]);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('itg_theme', theme);
  }, [theme]);

  // Save Settings & Sync SW
  useEffect(() => {
    localStorage.setItem('itg_notif_settings', JSON.stringify(settings));
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_SETTINGS',
        settings: settings
      });
    }
  }, [settings]);

  // Notification Reminder Logic & SW Sync
  useEffect(() => {
    // Sync with Service Worker for background notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_SCHEDULE',
        schedule: mySchedule
      });
    }

    const timer = setInterval(() => {
      const now = new Date();
      const currentDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      mySchedule.forEach(item => {
        if (item.day === currentDay && item.startTime === currentTime) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Kuliah Akan Dimulai!`, {
              body: `${item.subject} di ${item.room} dimulai sekarang.`,
              icon: '/vite.svg'
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(timer);
  }, [mySchedule]);

  const filteredSchedule = scheduleData.filter(s => {
    const matchesSearch = s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = filterDay === 'Semua' || s.day === filterDay;

    // Extract semester from ID (e.g., IFLWN2203-A -> 2)
    const semMatch = s.id.match(/\d/);
    const itemSemester = semMatch ? semMatch[0] : '';
    const matchesSemester = filterSemester === 'Semua' || itemSemester === filterSemester;

    const matchesClass = filterClass === 'Semua' || s.class === filterClass;

    return matchesSearch && matchesDay && matchesSemester && matchesClass;
  });

  const conflictsCount = mySchedule.filter((s, idx) =>
    mySchedule.some((other, oIdx) => idx !== oIdx && checkConflict(s, other))
  ).length;

  if (!user) {
    return <Login onLogin={handleLogin} semesters={semesters} classes={classes} />;
  }

  return (
    <div className="container">
      <Header user={user} onLogout={handleLogout} onOpenSettings={() => setIsSettingsOpen(true)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="tab-container no-scrollbar stack-3-mobile" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            className={`btn ${activeTab === 'umum' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('umum')}
          >
            Jadwal Umum
          </button>
          <button
            className={`btn ${activeTab === 'pribadi' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('pribadi')}
          >
            Jadwal Saya ({mySchedule.length})
          </button>
          <button
            className={`btn ${activeTab === 'bentrok' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('bentrok')}
          >
            Info Bentrok ({conflictsCount > 0 ? conflictsCount / 2 : 0})
          </button>
        </div>

        {activeTab === 'umum' ? (
          <section>
            <Filters
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              filterDay={filterDay} setFilterDay={setFilterDay}
              filterSemester={filterSemester} setFilterSemester={setFilterSemester}
              filterClass={filterClass} setFilterClass={setFilterClass}
              days={days} semesters={semesters} classes={classes}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <AnimatePresence>
                {days.filter(d => (filterDay === 'Semua' ? d !== 'Semua' : d === filterDay)).map(day => {
                  const daySchedule = filteredSchedule
                    .filter(s => s.day === day)
                    .sort((a, b) => (a?.startTime || '').localeCompare(b?.startTime || ''));
                  if (daySchedule.length === 0) return null;

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginBottom: '1rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                          background: 'var(--accent)',
                          color: 'white',
                          padding: '8px 24px',
                          borderRadius: '30px',
                          fontSize: '1rem',
                          fontWeight: 800,
                          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                        }}>
                          {day.toUpperCase()}
                        </div>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{daySchedule.length} Matkul Tersedia</span>
                      </div>

                      <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {daySchedule.map((item) => {
                          const conflict = mySchedule.find(s => s.id !== item.id && checkConflict(s, item));
                          const isAddedAsStudent = mySchedule.some(s => s.subject === item.subject && s.role === 'mahasiswa');
                          const isAddedAsAssistant = mySchedule.some(s => s.id === item.id && s.role === 'asisten');

                          return (
                            <ScheduleCard
                              key={item.id}
                              item={item}
                              isConflicting={!!conflict}
                              isAddedAsStudent={isAddedAsStudent}
                              isAddedAsAssistant={isAddedAsAssistant}
                              onAdd={addToMySchedule}
                              conflictInfo={conflict}
                            />
                          );
                        })}
                      </div >
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredSchedule.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--glass-border)', borderRadius: '24px', background: 'var(--glass-bg)' }}>
                  <Search size={48} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>Hasil Tidak Ditemukan</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Tidak ada jadwal yang sesuai dengan kriteria pencarian Anda.</p>
                </div>
              )}
            </div>
          </section>
        ) : activeTab === 'pribadi' ? (
          <section>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <AnimatePresence>
                {days.filter(d => d !== 'Semua').map(day => {
                  const daySchedule = mySchedule
                    .filter(s => s.day === day)
                    .sort((a, b) => (a?.startTime || '').localeCompare(b?.startTime || ''));
                  if (daySchedule.length === 0) return null;

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginBottom: '1rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                          background: 'var(--primary)',
                          color: 'white',
                          padding: '8px 24px',
                          borderRadius: '30px',
                          fontSize: '1rem',
                          fontWeight: 800,
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                        }}>
                          {day.toUpperCase()}
                        </div>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{daySchedule.length} Matkul</span>
                      </div>

                      <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {daySchedule.map(item => (
                          <PersonalCard key={`${item.id}-${item.role}`} item={item} onRemove={removeFromMySchedule} />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {mySchedule.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--glass-border)', borderRadius: '24px', background: 'var(--glass-bg)' }}>
                  <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', padding: '24px', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <Calendar size={48} color="var(--primary)" style={{ opacity: 0.5 }} />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Belum Ada Jadwal</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Silahkan kembali ke tab Jadwal Umum untuk menyusun rencana semester Anda.</p>
                  <button onClick={() => setActiveTab('umum')} className="btn btn-primary">Lihat Jadwal Umum</button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <ConflictSummary mySchedule={mySchedule} />
        )}
      </div>

      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
        <button className="btn glass" style={{ padding: '12px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)' }}>
          <Bell size={24} color="var(--primary)" />
        </button>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default App;
