// Service Worker for ITG Jadwal Connect
/* eslint-disable no-restricted-globals */

// Ganti versi saat melakukan perubahan untuk memaksa update
const CACHE_NAME = 'itg-jadwal-v3';

// 1. Install Event
self.addEventListener('install', (event) => {
    // Paksa SW yang baru langsung aktif
    self.skipWaiting();
});

// 2. Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event
self.addEventListener('fetch', (event) => {
    // Hanya tangani request HTTP/HTTPS
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Balas dengan cache jika ada
            if (cachedResponse) {
                return cachedResponse;
            }

            // Jika tidak ada di cache, ambil dari network
            return fetch(event.request).then((response) => {
                // Pastikan response valid sebelum disimpan ke cache
                if (!response || response.status !== 200) {
                    return response;
                }

                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // FALLBACK: Jika benar-benar offline dan request adalah dokumen/page
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});

// --- Logic Notification (Existing) ---
let schedule = [];
let settings = {
    enabled: true,
    midnightSummary: true,
    beforeMinutes: [15],
    soundEnabled: true
};

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_SCHEDULE') {
        schedule = event.data.schedule;
    }
    if (event.data && event.data.type === 'SYNC_SETTINGS') {
        settings = event.data.settings;
    }
});

const showNotification = (title, body, tag) => {
    if (!settings.enabled) return;

    self.registration.showNotification(title, {
        body: body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: tag,
        vibrate: [200, 100, 200],
        requireInteraction: true
    });
};

let lastMidnightNotifiedDate = '';
let notifiedAlerts = new Set();

setInterval(() => {
    if (!settings.enabled || schedule.length === 0) return;

    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const currentDay = days[now.getDay()];
    const dateStr = now.toDateString();

    const h = now.getHours();
    const m = now.getMinutes();
    const timeInMinutes = h * 60 + m;

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

    schedule.forEach(item => {
        if (item.day !== currentDay) return;

        const [startH, startM] = item.startTime.split('.').map(Number);
        const startTimeInMinutes = startH * 60 + startM;
        const diff = startTimeInMinutes - timeInMinutes;

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

    if (m === 59 && h === 23) notifiedAlerts.clear();
}, 45000);
