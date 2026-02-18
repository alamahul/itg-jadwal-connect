# ITG Jadwal Connect 🗓️

**ITG Jadwal Connect** adalah aplikasi manajemen jadwal kuliah progresif (PWA) yang dirancang khusus untuk mahasiswa Institut Teknologi Garut (ITG). Aplikasi ini mempermudah mahasiswa dalam menyusun jadwal pribadi, memantau jadwal umum, dan mendapatkan notifikasi pengingat kuliah secara otomatis.

---

## 🚀 Fitur Unggulan

- **Responsive Dashboard**: Desain modern dan adaptif. Tampilan desktop yang proporsional dan tampilan mobile yang dioptimalkan dalam bentuk grid efisien.
- **Sistem Notifikasi Pintar**:
  - **Offline support**: Notifikasi tetap berjalan meskipun tanpa internet.
  - **Midnight Summary**: Ringkasan jadwal harian otomatis setiap pukul 00:00.
  - **Customizable Alerts**: Atur pengingat sebelum jadwal dimulai (5, 10, 15, hingga 180 menit sebelumnya).
- **PWA (Progressive Web App)**: Dapat diinstal langsung ke layar utama HP atau desktop tanpa melalui Play Store/App Store.
- **Mode Malam & Terang**: Dukungan tema *Night Mode* dan *Light Mode* yang premium dan nyaman di mata.
- **Deteksi Bentrok**: Peringatan otomatis jika jadwal yang Anda tambahkan bertabrakan dengan jadwal yang sudah ada.
- **Filter Hebat**: Cari jadwal berdasarkan Hari, Semester, atau Kelas dengan antarmuka yang intuitif.

---

## 💻 Teknologi yang Digunakan

- **Core**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Alerts**: [SweetAlert2](https://sweetalert2.github.io/)
- **PWA Service Worker**: Integrasi kustom untuk *Background Push Notification* dan *Offline Caching*.

---

## 🛠️ Instalasi Lokal

Ikuti langkah berikut untuk menjalankan proyek di perangkat lokal Anda:

1. **Clone repositori**:
   ```bash
   git clone https://github.com/alamahul/itg-jadwal-connect.git
   cd itg-jadwal-connect
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan mode pengembangan**:
   ```bash
   npm run dev
   ```

4. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## 📦 Deployment

Aplikasi ini siap di-deploy ke platform seperti **Vercel** atau **Netlify**. Pastikan untuk mengonfigurasi `manifest.json` dan Service Worker agar fitur PWA berjalan sempurna di domain produksi.

---

## 📱 Screenshots

|                    Jadwal Saya (Portrait)                     |                      Jadwal Umum (Landscape)                       |                       Peringatan Bentrok                       |
| :-----------------------------------------------------------: | :----------------------------------------------------------------: | :------------------------------------------------------------: |
| ![iOS 1](/public/images/screenshots/jadwal_saya_portrait.png) | ![Dark Mode](/public/images/screenshots/jadwal_umum_landscape.png) | ![Login](/public/images/screenshots/info_bentrok_portrait.png) |

---

## 📝 Catatan PWA
Untuk mendapatkan fitur terbaik:
1. Klik tombol **"Add to Home Screen"** di browser Anda.
2. Berikan izin **Notification** saat diminta.
3. Gunakan browser modern seperti **Chrome** atau **Edge** untuk dukungan Service Worker yang maksimal.

---
Dikembangkan dengan ❤️ untuk Mahasiswa ITG.
