# Product Requirements Document (PRD) — Haikatalyst

**Versi:** 1.0
**Tanggal:** 17 Juni 2026
**Penulis:** Haikal Akbar Diennova
**Repository:** [github.com/avruakeren/haikatalyst](https://github.com/avruakeren/haikatalyst)

---

## 1. Ringkasan Eksekutif

Haikatalyst adalah aplikasi web **Media Pembelajaran Berbasis Permainan Papan Interaktif** yang dirancang untuk siswa Sekolah Dasar (SD). Proyek ini merupakan tugas skripsi (Sarjana) di Universitas Sultan Ageng Tirtayasa. Permainan mengadaptasi mekanik klasik ular tangga menjadi board game digital dengan soal-soal pelajaran yang dihasilkan secara otomatis (auto-generated), mendukung 2–7 pemain dalam satu perangkat.

Tiga dari dua belas mata pelajaran yang direncanakan telah diimplementasikan, dengan sisanya akan menyusul setelah seminar proposal.

---

## 2. Visi & Tujuan Produk

**Visi:** Menjadi media pembelajaran alternatif yang menyenangkan dan efektif bagi siswa SD dengan menggabungkan mekanika board game interaktif dan kurikulum sekolah.

**Tujuan:**
- Meningkatkan motivasi belajar siswa melalui pendekatan gamifikasi
- Menyediakan variasi soal yang tidak terbatas melalui generator soal otomatis
- Mendukung pembelajaran kolaboratif (multiplayer dalam satu perangkat)
- Menjadi alat bantu ajar bagi guru di dalam kelas

---

## 3. Target Pengguna

| Persona | Deskripsi |
|---------|-----------|
| **Siswa SD Kelas 1–6** | Pengguna utama yang memainkan game untuk belajar mata pelajaran sesuai jenjang |
| **Guru SD** | Pengguna yang memfasilitasi sesi belajar di kelas menggunakan proyektor/satu perangkat |
| **Orang Tua** | Pendamping belajar anak di rumah |

---

## 4. Fitur Produk

### 4.1 Halaman Beranda (`index.html`)
- Tampilan brand dengan tema gelap "Solo Leveling Abyssal System"
- Animasi gradien latar dengan grid dan partikel floating
- Tombol "Ayo Main" dengan efek suara
- Navigasi ke halaman jenjang dan developer

### 4.2 Pemilihan Jenjang (`jenjang.html` + `jenjang.js`)
- Tombol interaktif untuk kelas 1–6
- Panel material yang menampilkan mata pelajaran tersedia per kelas
- Efek suara dengan nada naik sesuai jenjang
- Status "Coming Soon" untuk kelas/mata pelajaran yang belum tersedia

### 4.3 Game Kelas 1 — Bahasa Indonesia (`game-kelas1.html`)
| Aspek | Detail |
|-------|--------|
| **Tipe** | Menyusun kata menjadi kalimat yang benar |
| **Mekanik** | Klik kata-kata acak untuk menyusun kalimat |
| **Jumlah Soal** | 5 soal bawaan (built-in) |
| **Skor** | 3 nyawa, progres level |
| **Feedback** | Animasi sukses/gagal + confetti saat selesai |

### 4.4 Game Kelas 2 — Bahasa Indonesia (`game-kelas2-bindo.html`)
| Aspek | Detail |
|-------|--------|
| **Tipe** | Menyusun kalimat dengan pola SPO/SPOK |
| **Mekanik** | Klik kata-kata acak untuk menyusun kalimat |
| **Bank Soal** | 15 soal, diacak 5 per permainan |
| **Skor** | Poin per jawaban benar |
| **Hasil Akhir** | Popup ringkasan dengan opsi main lagi |

### 4.5 Game Kelas 5 — Matematika (*Fitur Utama*) (`game-kelas5-mat.html`)

Game board matematika dengan mekanik ular tangga digital dan soal auto-generated.

#### 4.5.1 Setup Permainan
| Opsi | Pilihan |
|------|---------|
| **Jumlah Pemain** | 2–7 pemain |
| **Mode Papan** | Plain (standar) / Hazard (ada blok bahaya mundur) |
| **Panjang Game** | Normal (100 blok) / Fast (50 blok) |
| **Auto Question** | On/Off + frekuensi: Jarang / Normal / Sering / Sulit |
| **Tema** | Dark / Light |

#### 4.5.2 Mekanik Board
- Papan berbentuk grid 10 kolom dengan layout zigzag (seperti ular tangga)
- Dadu digital (nilai 1–6) dengan animasi visual dan suara
- Bidak bergerak step-by-step (170ms per blok) dengan animasi meluncur
- Giliran bergiliran (turn-based), tombol dadu dinonaktifkan selama animasi
- Penanda pemain terdepan (leader tracker)
- Progress bar pemain terjauh
- Riwayat permainan (game log, 8 entri terakhir)
- Partikel berwarna saat bidak mendarat di blok
- Efek glow/pulse pada blok aktif
- Popup pemenang dengan confetti

#### 4.5.3 Sistem Soal (5 tipe, auto-generated)
| Tipe Soal | Deskripsi |
|-----------|-----------|
| **Pilihan Ganda** | Operasi matematika (+, -, ×, :), nilai tempat, pola bilangan |
| **Tebak Angka** | Petunjuk progresif untuk menebak angka tersembunyi |
| **Nilai Tempat** | Susun chip digit ke kolom nilai tempat yang benar |
| **Timbangan** | Pilih nilai yang menyeimbangkan timbangan |
| **Uang** | Pilih kombinasi pecahan uang yang tepat untuk membayar |

Setiap soal memiliki:
- Timer 60 detik
- Jawaban benar: maju +2 blok
- Jawaban salah: mundur -1 blok
- Waktu habis: mundur -1 blok

#### 4.5.4 Blok Instruksi Kustom
- Klik kanan blok untuk membuka editor instruksi
- Setel teks instruksi kustom dengan efek gerakan opsional
- Tetapkan tipe soal spesifik ke blok tertentu
- Indikator visual (border warna) pada blok yang memiliki instruksi

### 4.6 Sistem Suara (`js/sfx.js`)
- Sintesis suara penuh via Web Audio API — tanpa file audio
- 12 efek suara: click, roll, start, soft, toggle, warn, win, hover, boost, info
- Musik latar (generative pentatonic scale loop)
- Menghormati preferensi `prefers-reduced-motion`
- Scaling nada dinamis per jenjang

### 4.7 Sistem Pixel Art Icons (`js/pixel-art-icons.js` + `pixel-art-icons.css`)
- Konversi emoji ke SVG pixel art saat runtime
- 14+ ikon dengan animasi retro (float, spin, tilt, glow, coin sparkle, trophy glare)
- Pixel confetti pada momen sukses
- MutationObserver untuk konten yang ditambahkan secara dinamis

### 4.8 Halaman Developer (`developer.html`)
- Panel glassmorphism dengan foto pengembang
- Informasi: Nama, NIM, Program Studi, Dosen Pembimbing, Universitas
- Avatar yang bisa diklik (toggle 2 foto)
- Tautan ke Instagram

### 4.9 Coming Soon (`gamelain.html`)
- Halaman placeholder untuk konten yang akan datang

---

## 5. Persyaratan Teknis

### 5.1 Tech Stack
| Komponen | Teknologi |
|----------|-----------|
| **Markup** | HTML5 (semantik) |
| **Styling** | CSS3 (Custom Properties, Flexbox, Grid, Keyframe Animations, Glassmorphism) |
| **Logika** | Vanilla JavaScript ES6+ |
| **Suara** | Web Audio API |
| **Font** | Google Fonts (Inter, Baloo 2, Nunito, Comic Neue, Fredoka, Fira Code, Share Tech Mono) |
| **Ikon** | Pixel art SVG inline + emoji-to-SVG converter |
| **Dev Server** | live-server |

### 5.2 Arsitektur
- **Pola:** Static Single-Page Application (tanpa router/framework)
- **Navigasi:** `window.location.href` langsung
- **Modularitas:** 1 file JS per halaman, namespace global (`window.SFX`, `window.getPixelIcon`)
- **Tanpa ketergantungan eksternal** selain Google Fonts

### 5.3 CSS Architecture
- CSS Custom Properties untuk theming (dark/light)
- CSS Grid untuk layout board dan panel
- Glassmorphism (`backdrop-filter: blur()`)
- Responsive design dengan 10+ breakpoint (440px–1180px)

### 5.4 Aksesibilitas
- `prefers-reduced-motion` dihormati di semua animasi
- HTML semantik (`<main>`, `<section>`, `<aside>`, `<nav>`, dll)
- ARIA attributes (`aria-expanded`, `aria-pressed`, `aria-selected`, `aria-label`)
- Navigasi keyboard (Escape tutup modal)
- Focus states pada elemen interaktif

---

## 6. User Flow

```
Beranda → Pilih Kelas → Pilih Mata Pelajaran
                                    ↓
                    ┌──────────────────────────┐
                    │  (jika tersedia)          │
                    ↓                          ↓
             Halaman Game               Coming Soon
                    ↓
          [Setup: jumlah pemain,
           mode papan, dll]
                    ↓
              Board Game Play
          (giliran bergiliran)
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
   Jawab Soal             Blok Instruksi
   (auto-generated)       (kustom)
        ↓                       ↓
   Correct (+2) /         Ikuti instruksi
   Wrong (-1)
        ↓
    Cek Pemenang
   ┌────┴────┐
   ↓         ↓
  Ada     Belum Ada
   ↓         ↓
Popup     Giliran
Winner    Pemain
Confetti  Berikutnya
```

---

## 7. Non-Functional Requirements

| Aspek | Requirement |
|-------|-------------|
| **Performa** | Animasi bidak 170ms/blok harus smooth di 60fps pada perangkat modern |
| **Responsive** | Mendukung layar 320px (mobile) hingga 1920px (desktop) |
| **Offline** | 100% berfungsi tanpa koneksi internet setelah halaman dimuat |
| **Kompatibilitas** | Chrome, Firefox, Edge, Safari (2 versi terakhir) |
| **Daya Tahan** | Tidak ada memory leak pada sesi permainan panjang |
| **Keamanan** | Semua kode client-side; tidak ada data sensitif |

---

## 8. Rencana Pengembangan ke Depan

### Jangka Pendek (Pasca-Sempro)
- Implementasi 9 game yang tersisa (Kelas 1–6, 2 mapel per kelas)
  - Kelas 1: Matematika
  - Kelas 2: Matematika
  - Kelas 3: Bahasa Indonesia, Matematika
  - Kelas 4: Bahasa Indonesia, Matematika
  - Kelas 5: Bahasa Indonesia
  - Kelas 6: Bahasa Indonesia, Matematika

### Jangka Panjang (Ideal)
- Tambahan mata pelajaran (IPA, IPS, PPKn)
- Sistem leaderboard / skor persisten (localStorage)
- Multiplayer jarak jauh (WebRTC / realtime)
- Generator soal berbasis kurikulum terbaru (Kurikulum Merdeka)
- Dukungan touch/swipe untuk perangkat tablet
- Opsi ekspor hasil belajar (PDF)

---

## 9. Metrik Kesuksesan

Sebagai proyek skripsi, kesuksesan diukur melalui:

| Metrik | Target |
|--------|--------|
| **Fungsionalitas** | Semua fitur di PRD ini berjalan sesuai spesifikasi (≥95% test pass) |
| **Uji Pengguna** | Responden siswa/guru memberikan nilai ≥80% pada aspek kemudahan dan kegunaan |
| **Kinerja** | FPS ≥55 pada perangkat kelas menengah selama board game |
| **Validasi Akademik** | Lulus sidang skripsi dengan nilai minimal B |
| **Konten** | Minimal 3 dari 12 jenjang terisi penuh pada versi 1.0 |

---

## Lampiran

- **Tech Stack Detail:** Lihat `README.md`
- **Design System:** Lihat `design.md` (color palette, typography, efek, anti-patterns)
- **Changelog:** Lihat `changelog.txt` (riwayat pengembangan Feb–Jun 2026)
