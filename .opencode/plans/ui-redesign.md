# UI Redesign Implementation Plan

## Overview
Redesign admin dashboard + app layout based on `dashboard-ref.md` and landing page based on `landing-ref.md`.

## Phase 1: Theme & Foundation

### 1.1 `vite.config.ts`
Replace Instrument Sans font with Manrope + Inter:
```ts
fonts: [
    bunny('Manrope', {
        weights: [600, 700, 800],
    }),
    bunny('Inter', {
        weights: [400, 500, 600],
    }),
],
```

### 1.2 `resources/views/app.blade.php`
Add Google Fonts links for Material Symbols + Manrope/Inter (CDN fallback). Change body class to `font-body-md text-body-md`:
```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

### 1.3 `resources/css/app.css`
Full rewrite with @theme directive containing all custom colors, spacing, fonts, border-radius from the reference tailwind config. Also add `custom-shadow` utility and Material Symbols font-variation-settings.

---

## Phase 2: Admin Dashboard Redesign

### 2.1 `resources/js/components/layout/top-nav.tsx`
Complete rewrite to match dashboard-ref.md top nav:
- Branding: "Admin Portal" heading + "Admission System" subtitle
- Desktop nav links: Dashboard, Data Pendaftar, Verifikasi, Pengaturan (with Material Symbols icons)
- Search bar (rounded-full, hidden on mobile)
- Notifications bell with red dot indicator
- User avatar + name + email + hover dropdown (Profil, Keluar)
- Mobile: hamburger menu
- Uses `usePage()` for auth data and active route detection
- Keep existing menu structure (menuGroups) for dropdown functionality

### 2.2 `resources/js/components/layout/admin-layout.tsx`
Update to new layout:
- `bg-background` background
- Nav at top (sticky)
- Main content with `max-w-[1400px]`, `px-gutter py-lg`
- Remove the title header bar (dashboard page handles its own header)

### 2.3 `resources/js/pages/admin/dashboard.tsx`
Complete rewrite matching dashboard-ref.md:
- Page header: "Ringkasan Seleksi Mandiri" h1 + subtitle + "Laporan Baru" button + date display
- 4 stat cards in bento grid (sm:grid-cols-2 lg:grid-cols-4):
  - Total Pendaftar (mapped from stats.total_pendaftar)
  - Terverifikasi (mapped from stats.total_dengan_noujian)
  - Menunggu (mapped from stats.total_belum_lulus)
  - Ditolak (mapped from stats.total_tanpa_noujian, or computed)
- Main content grid (lg:grid-cols-3):
  - Registration trends bar chart (CSS-based, 2 cols) - uses monthly_registration data
  - Activity feed panel (1 col) - shows recent notifications
  - Full-width CTA banner (3 cols) - "Persiapan Gelombang 2"
- Footer with copyright + links
- Uses Material Symbols for all icons
- Uses custom theme colors throughout

---

## Phase 3: Landing Page Redesign

### 3.1 `resources/js/pages/public/home.tsx`
Complete rewrite matching landing-ref.md:
- **Top nav** (sticky): "Poltekpar Palembang" branding, Beranda/Informasi/Dokumen/Panduan links, Masuk/Daftar buttons
- **Hero section**: Badge ("Penerimaan Mahasiswa Baru 2024/2025"), h1 title, subtitle, "Daftar Sekarang" + "Lihat Profil" CTAs, hero image with rotation effect, A+ accreditation floating card
- **Bento info grid** (md:grid-cols-12):
  - Large card (col-span-8): SMM info with student avatars + "+500 pendaftar" 
  - Small card (col-span-4): "Pendaftaran Dibuka" with primary-container bg
  - Small card (col-span-4): "Syarat Dokumen" checklist
  - Medium card (col-span-8): "Program Studi Unggulan" with tags
- **News section**: Grid of 3 news cards using `news` prop, with image placeholders, category badges, dates, share icons. "Lihat Semua Berita" button
- **CTA section**: Dark bg, "Siap Memulai Perjalanan Anda?", "Mulai Pendaftaran Online" button
- **Footer**: "Poltekpar Palembang" branding, description, links (Kontak Kami, Kebijakan Privasi, Syarat & Ketentuan), copyright
- Uses Material Symbols throughout
- Uses `news` and `jadwal` props from backend

---

## Notes
- No backend/controller changes required
- Lucide icons remain available for other pages not being redesigned
- recharts remains available for other pages
- Existing component library (Card, Button, Badge, etc.) remains unchanged
- Material Symbols loaded via Google Fonts CDN
- Manrope + Inter loaded via both bunny fonts (vite) and Google Fonts CDN (fallback)
