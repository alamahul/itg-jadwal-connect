import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, BookOpen, Users } from 'lucide-react';

const Login = ({ onLogin, semesters, classes }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const semester = e.target.semester.value;
        const userClass = e.target.userClass.value;

        if (name && semester && userClass) {
            onLogin({ name, semester, userClass });
        }
    };

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ padding: '2.5rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}
            >
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', padding: '15px', borderRadius: '15px', marginBottom: '1rem' }}>
                        <Calendar size={40} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 800 }}>ITG Schedule</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Atur jadwal kuliah Anda dengan lebih mudah</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={14} /> NAMA LENGKAP
                        </label>
                        <input name="name" type="text" placeholder="Masukkan nama Anda" required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={14} /> SEMESTER
                            </label>
                            <select name="semester" required style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}>
                                {semesters.filter(s => s !== 'Semua').map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={14} /> KELAS
                            </label>
                            <select name="userClass" required style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}>
                                {classes.filter(c => c !== 'Semua').map(cls => (
                                    <option key={cls} value={cls}>Kelas {cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '14px' }}>
                        Masuk & Atur Jadwal
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
