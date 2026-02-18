import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { checkConflict } from '../utils/helpers';
import scheduleData from '../data/schedule.json';

const themeSwal = {
    background: '#1e293b',
    color: '#f8fafc',
    confirmButtonColor: '#6366f1',
    cancelButtonColor: '#ef4444',
};

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

    const handleLogout = async () => {
        const result = await Swal.fire({
            ...themeSwal,
            title: 'Keluar?',
            text: "Apakah Anda yakin ingin keluar?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            setUser(null);
            localStorage.removeItem('itg_schedule_user');
            Swal.fire({
                ...themeSwal,
                title: 'Logged Out',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false
            });
        }
    };

    const addToMySchedule = async (item, role = 'mahasiswa') => {
        // Conflict Check
        const conflict = mySchedule.find(s => checkConflict(s, item));
        if (conflict) {
            const result = await Swal.fire({
                ...themeSwal,
                title: 'Bentrok Dideteksi!',
                text: `Jadwal ini bertabrakan dengan "${conflict.subject}" (${conflict.role === 'asisten' ? 'Asprak' : 'Kuliah'}). Tetap tambahkan?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Tetap Tambahkan',
                cancelButtonText: 'Batal'
            });

            if (!result.isConfirmed) return;
        }

        // Role-based duplication check
        if (role === 'mahasiswa') {
            const alreadyAsStudent = mySchedule.find(s => s.subject === item.subject && s.role === 'mahasiswa');
            if (alreadyAsStudent) {
                Swal.fire({
                    ...themeSwal,
                    title: 'Ops!',
                    text: `Mata kuliah "${item.subject}" sudah ada di jadwal kuliah Anda.`,
                    icon: 'error'
                });
                return;
            }
        } else if (role === 'asisten') {
            const alreadyAsAssistant = mySchedule.find(s => s.id === item.id && s.role === 'asisten');
            if (alreadyAsAssistant) {
                Swal.fire({
                    ...themeSwal,
                    title: 'Ops!',
                    text: `Anda sudah terdaftar sebagai asisten untuk mata kuliah dan kelas ini.`,
                    icon: 'error'
                });
                return;
            }
        }

        setMySchedule([...mySchedule, { ...item, role }]);

        Swal.fire({
            ...themeSwal,
            title: 'Berhasil!',
            text: `Berhasil menambahkan "${item.subject}" ke jadwal.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const removeFromMySchedule = async (id, subject) => {
        const result = await Swal.fire({
            ...themeSwal,
            title: 'Hapus Mata Kuliah?',
            text: `Apakah Anda yakin ingin menghapus "${subject}" dari jadwal?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            setMySchedule(mySchedule.filter(s => s.id !== id));
            Swal.fire({
                ...themeSwal,
                title: 'Terhapus!',
                text: 'Mata kuliah telah dihapus dari jadwal.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
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
