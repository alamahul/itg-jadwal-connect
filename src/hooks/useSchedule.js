import { useState, useEffect } from 'react';
import { checkConflict } from '../utils/helpers';
import scheduleData from '../data/schedule.json';

export const useSchedule = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('itg_schedule_user')));
    const [mySchedule, setMySchedule] = useState(() => {
        const saved = localStorage.getItem(`itg_my_schedule_${user?.name}`);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem(`itg_my_schedule_${user.name}`, JSON.stringify(mySchedule));
        }
    }, [mySchedule, user]);

    const handleLogin = (userData) => {
        const newUser = {
            ...userData,
            loginAt: new Date().toISOString()
        };
        setUser(newUser);
        localStorage.setItem('itg_schedule_user', JSON.stringify(newUser));
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('itg_schedule_user');
    };

    const addToMySchedule = (item, role = 'mahasiswa') => {
        // Conflict Check
        const conflict = mySchedule.find(s => checkConflict(s, item));
        if (conflict) {
            if (!confirm(`Bentrok dideteksi! Jadwal ini bertabrakan dengan "${conflict.subject}" (${conflict.role}). Tetap tambahkan?`)) {
                return;
            }
        }

        // Role-based duplication check
        if (role === 'mahasiswa') {
            const alreadyAsStudent = mySchedule.find(s => s.subject === item.subject && s.role === 'mahasiswa');
            if (alreadyAsStudent) {
                alert(`Mata kuliah "${item.subject}" sudah ada di jadwal kuliah Anda. Anda tidak bisa mengambil mata kuliah yang sama di kelas lain sebagai mahasiswa.`);
                return;
            }
        } else if (role === 'asisten') {
            const alreadyAsAssistant = mySchedule.find(s => s.id === item.id && s.role === 'asisten');
            if (alreadyAsAssistant) {
                alert(`Anda sudah terdaftar sebagai asisten untuk mata kuliah dan kelas ini.`);
                return;
            }
        }

        setMySchedule([...mySchedule, { ...item, role }]);
    };

    const removeFromMySchedule = (id) => {
        setMySchedule(mySchedule.filter(s => s.id !== id));
    };

    return {
        user,
        mySchedule,
        handleLogin,
        handleLogout,
        addToMySchedule,
        removeFromMySchedule,
        scheduleData
    };
};
