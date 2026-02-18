// Service Worker for ITG Jadwal Connect
/* eslint-disable no-restricted-globals */

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// State
let schedule = [];
let settings = {
    enabled: true,
    midnightSummary: true,
    beforeMinutes: [15],
    soundEnabled: true
};

// Sync Data
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_SCHEDULE') {
        schedule = event.data.schedule;
    }
    if (event.data && event.data.type === 'SYNC_SETTINGS') {
        settings = event.data.settings;
    }
});

// Helper: Show Notification
const showNotification = (title, body, tag) => {
    if (!settings.enabled) return;

    self.registration.showNotification(title, {
        body: body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: tag, // Prevent duplicate notifications
        vibrate: [200, 100, 200],
        requireInteraction: true
    });
};

// Interval Check (Running approximately every minute)
let lastMidnightNotifiedDate = '';
let notifiedAlerts = new Set(); // To prevent double notifications within the same minute/day

setInterval(() => {
    if (!settings.enabled || schedule.length === 0) return;

    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const currentDay = days[now.getDay()];
    const dateStr = now.toDateString();

    const h = now.getHours();
    const m = now.getMinutes();
    const timeInMinutes = h * 60 + m;

    // 1. Midnight Summary (00:00)
    if (settings.midnightSummary && h === 0 && m === 0 && lastMidnightNotifiedDate !== dateStr) {
        const todaySchedule = schedule.filter(s => s.day === currentDay);
        if (todaySchedule.length > 0) {
            const list = todaySchedule.map(s => `- ${s.startTime}: ${s.subject}`).join('\n');
            showNotification(
                `Jadwal ${currentDay} Hari Ini`,
                `Kamu punya ${todaySchedule.length} mata kuliah:\n${list}`,
                'midnight-summary'
            );
        }
        lastMidnightNotifiedDate = dateStr;
    }

    // 2. Before Schedule Alerts (X minutes before)
    schedule.forEach(item => {
        if (item.day !== currentDay) return;

        const [startH, startM] = item.startTime.split('.').map(Number);
        const startTimeInMinutes = startH * 60 + startM;
        const diff = startTimeInMinutes - timeInMinutes;

        // Check if current diff is in settings.beforeMinutes
        settings.beforeMinutes.forEach(remMin => {
            const alertTag = `${item.id}-${remMin}-${dateStr}`;

            if (diff === remMin && !notifiedAlerts.has(alertTag)) {
                showNotification(
                    `Peringatan ${remMin} Menit!`,
                    `Mata kuliah "${item.subject}" di ${item.room} akan dimulai pukul ${item.startTime}.`,
                    alertTag
                );
                notifiedAlerts.add(alertTag);
            }
        });

        // Exact Start Alert
        const exactTag = `${item.id}-0-${dateStr}`;
        if (diff === 0 && !notifiedAlerts.has(exactTag)) {
            showNotification(
                'Kuliah Dimulai!',
                `Sekarang waktunya "${item.subject}" di ${item.room}.`,
                exactTag
            );
            notifiedAlerts.add(exactTag);
        }
    });

    // Clean up old notified alerts 
    if (m === 59 && h === 23) notifiedAlerts.clear();

}, 45000); // Check every 45 seconds
