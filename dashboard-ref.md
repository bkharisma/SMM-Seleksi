<!DOCTYPE html>

<html class="light" lang="id"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Admin Dashboard - Poltekpar Palembang</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-fixed": "#b9eaff",
                    "secondary-container": "#d0e1fb",
                    "on-error-container": "#93000a",
                    "tertiary-fixed-dim": "#ffb86f",
                    "surface-tint": "#006781",
                    "on-secondary-fixed": "#0b1c30",
                    "surface-bright": "#f7fafc",
                    "outline": "#6f787d",
                    "on-primary": "#ffffff",
                    "surface-container": "#ebeef0",
                    "background": "#f7fafc",
                    "surface-container-low": "#f1f4f6",
                    "surface-variant": "#e0e3e5",
                    "tertiary-fixed": "#ffdcbd",
                    "on-tertiary": "#ffffff",
                    "surface-dim": "#d7dadd",
                    "secondary-fixed-dim": "#b7c8e1",
                    "tertiary": "#794602",
                    "surface-container-high": "#e6e8eb",
                    "on-secondary-container": "#54647a",
                    "surface-container-lowest": "#ffffff",
                    "secondary": "#505f76",
                    "secondary-fixed": "#d3e4fe",
                    "on-background": "#181c1e",
                    "on-primary-fixed-variant": "#004d62",
                    "primary": "#005a71",
                    "on-tertiary-container": "#ffe8d6",
                    "error": "#ba1a1a",
                    "on-primary-fixed": "#001f29",
                    "on-secondary-fixed-variant": "#38485d",
                    "surface": "#f7fafc",
                    "on-surface-variant": "#3f484c",
                    "surface-container-highest": "#e0e3e5",
                    "on-surface": "#181c1e",
                    "on-primary-container": "#d3f1ff",
                    "tertiary-container": "#965e1c",
                    "inverse-primary": "#81d1f0",
                    "primary-container": "#0e7490",
                    "on-error": "#ffffff",
                    "inverse-on-surface": "#eef1f3",
                    "outline-variant": "#bec8cd",
                    "inverse-surface": "#2d3133",
                    "primary-fixed-dim": "#81d1f0",
                    "on-tertiary-fixed-variant": "#693c00",
                    "on-secondary": "#ffffff",
                    "error-container": "#ffdad6",
                    "on-tertiary-fixed": "#2c1600"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "md": "24px",
                    "sm": "16px",
                    "gutter": "24px",
                    "xs": "8px",
                    "base": "4px",
                    "lg": "48px",
                    "xl": "64px",
                    "margin": "auto"
            },
            "fontFamily": {
                    "h3": ["Manrope"],
                    "body-md": ["Inter"],
                    "label-md": ["Inter"],
                    "body-lg": ["Inter"],
                    "button": ["Inter"],
                    "h1": ["Manrope"],
                    "h2": ["Manrope"]
            },
            "fontSize": {
                    "h3": ["24px", {"lineHeight": "1.4", "letterSpacing": "0", "fontWeight": "600"}],
                    "body-md": ["16px", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
                    "label-md": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.02em", "fontWeight": "500"}],
                    "body-lg": ["18px", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
                    "button": ["16px", {"lineHeight": "1", "letterSpacing": "0.01em", "fontWeight": "600"}],
                    "h1": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "h2": ["32px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #f7fafc;
            color: #181c1e;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .custom-shadow {
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
        }
    </style>
</head>
<body class="font-body-md text-body-md flex flex-col min-h-screen">
<!-- Top Navigation Bar -->
<nav class="bg-surface-container-low border-b border-outline-variant sticky top-0 z-50 w-full">
<div class="max-w-[1400px] mx-auto px-gutter h-20 flex items-center justify-between gap-md">
<!-- Branding -->
<div class="flex items-center gap-sm shrink-0">
<div>
<h1 class="text-h3 font-h3 text-primary leading-none">Admin Portal</h1>
<p class="text-[10px] uppercase tracking-wider font-bold text-secondary">Admission System</p>
</div>
</div>
<!-- Navigation Links -->
<div class="hidden lg:flex items-center gap-xs">
<a class="flex items-center gap-xs px-sm py-2 bg-primary-container text-on-primary-container rounded-lg font-bold transition-all text-label-md" href="#">
<span class="material-symbols-outlined text-lg" data-icon="dashboard">dashboard</span>
                Dashboard
            </a>
<a class="flex items-center gap-xs px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all text-label-md" href="#">
<span class="material-symbols-outlined text-lg" data-icon="groups">groups</span>
                Data Pendaftar
            </a>
<a class="flex items-center gap-xs px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all text-label-md" href="#">
<span class="material-symbols-outlined text-lg" data-icon="fact_check">fact_check</span>
                Verifikasi
            </a>
<a class="flex items-center gap-xs px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all text-label-md" href="#">
<span class="material-symbols-outlined text-lg" data-icon="settings">settings</span>
                Pengaturan
            </a>
</div>
<!-- Search Bar -->
<div class="flex-grow max-w-md hidden md:block">
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg transition-colors group-focus-within:text-primary">search</span>
<input class="w-full pl-10 pr-4 py-2 bg-surface-container border-outline-variant rounded-full text-label-md focus:ring-primary focus:border-primary border transition-all" placeholder="Cari pendaftar, dokumen..." type="text"/>
</div>
</div>
<!-- User Profile & Notifications -->
<div class="flex items-center gap-sm shrink-0">
<button class="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-all relative">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
<div class="h-8 w-[1px] bg-outline-variant mx-xs"></div>
<div class="flex items-center gap-sm">
<div class="text-right hidden sm:block">
<p class="font-bold text-label-md text-on-surface leading-none">Admin Poltekpar</p>
<p class="text-[10px] text-secondary">admin@poltekpar.ac.id</p>
</div>
<div class="relative group cursor-pointer">
<img alt="Admin Avatar" class="w-10 h-10 rounded-full object-cover border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX3M2w147ji8PBtzu1GronKRpsuN76_oq8fZYmQVbdFtzIhGUGzL5ne8Zy3XYb_pui9wo_G-WZPfL5J4crHltKQREWyecdmvZAGwaCOsdPp0uyrVbFe6jZRq6_nUnxc3JRI0gS1GaHlKiC4EJMqXXQhdGZkysrwBRP01TOhbOuFD0VJQ8BYVDUVTG3R6kW6eGXhdhMlLtSJnmgSahKw6GO6p-6IIKGtNmxID93elDgWr8BuBPHpfze94c6C3aEneABRnzzqJ26oA"/>
<div class="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-xs z-50">
<a class="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-all text-label-md" href="#">
<span class="material-symbols-outlined text-lg">person</span> Profil
                        </a>
<hr class="border-outline-variant my-xs"/>
<a class="flex items-center gap-sm px-md py-sm text-error hover:bg-error-container transition-all text-label-md" href="#">
<span class="material-symbols-outlined text-lg">logout</span> Keluar
                        </a>
</div>
</div>
</div>
</div>
</div>
</nav>
<!-- Main Content Canvas -->
<main class="flex-grow px-gutter py-lg max-w-[1400px] mx-auto w-full">
<!-- Header -->
<header class="mb-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-sm">
<div>
<h2 class="text-h1 font-h1 text-on-surface mb-xs">Ringkasan Seleksi Mandiri</h2>
<p class="text-body-lg font-body-lg text-secondary">Pantau data pendaftaran mahasiswa baru tahun akademik 2024/2025.</p>
</div>
<div class="flex gap-sm">
<button class="bg-primary-container text-white py-2 px-md rounded-lg font-bold flex items-center justify-center gap-xs shadow-sm hover:opacity-90 transition-all text-label-md">
<span class="material-symbols-outlined text-lg">add</span>
                Laporan Baru
            </button>
<div class="bg-surface-container rounded-lg px-sm py-2 flex items-center gap-xs border border-outline-variant">
<span class="material-symbols-outlined text-secondary text-lg">calendar_today</span>
<span class="text-label-md font-label-md text-on-surface">Mei 2024</span>
</div>
</div>
</header>
<!-- Stats Grid (Bento Style) -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm mb-lg">
<div class="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-outline-variant flex flex-col gap-xs">
<div class="flex justify-between items-start">
<div class="bg-primary-container/10 p-xs rounded-lg text-primary-container">
<span class="material-symbols-outlined">group</span>
</div>
<span class="text-xs font-bold text-green-600 bg-green-50 px-xs py-0.5 rounded">+12%</span>
</div>
<p class="text-label-md font-label-md text-secondary mt-base">Total Pendaftar</p>
<h3 class="text-h2 font-h2 text-on-surface">1,284</h3>
</div>
<div class="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-outline-variant flex flex-col gap-xs">
<div class="flex justify-between items-start">
<div class="bg-secondary-container/20 p-xs rounded-lg text-secondary">
<span class="material-symbols-outlined">verified</span>
</div>
<span class="text-xs font-bold text-green-600 bg-green-50 px-xs py-0.5 rounded">+8%</span>
</div>
<p class="text-label-md font-label-md text-secondary mt-base">Terverifikasi</p>
<h3 class="text-h2 font-h2 text-on-surface">856</h3>
</div>
<div class="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-outline-variant flex flex-col gap-xs">
<div class="flex justify-between items-start">
<div class="bg-tertiary-fixed p-xs rounded-lg text-tertiary">
<span class="material-symbols-outlined">pending_actions</span>
</div>
<span class="text-xs font-bold text-amber-600 bg-amber-50 px-xs py-0.5 rounded">Aktif</span>
</div>
<p class="text-label-md font-label-md text-secondary mt-base">Menunggu</p>
<h3 class="text-h2 font-h2 text-on-surface">342</h3>
</div>
<div class="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-outline-variant flex flex-col gap-xs">
<div class="flex justify-between items-start">
<div class="bg-error-container p-xs rounded-lg text-error">
<span class="material-symbols-outlined">cancel</span>
</div>
<span class="text-xs font-bold text-error bg-error-container/50 px-xs py-0.5 rounded">-2%</span>
</div>
<p class="text-label-md font-label-md text-secondary mt-base">Ditolak</p>
<h3 class="text-h2 font-h2 text-on-surface">86</h3>
</div>
</section>
<!-- Main Dashboard Content -->
<section class="grid grid-cols-1 lg:grid-cols-3 gap-md">
<!-- Trends Chart Placeholder (Asymmetric Visual) -->
<div class="lg:col-span-2 bg-surface-container-lowest p-md rounded-xl custom-shadow border border-outline-variant">
<div class="flex justify-between items-center mb-lg">
<div>
<h4 class="text-h3 font-h3 text-on-surface">Tren Registrasi Harian</h4>
<p class="text-label-md font-label-md text-secondary">Data registrasi 7 hari terakhir</p>
</div>
<select class="bg-surface-container border-none text-label-md font-label-md rounded-lg py-xs">
<option>Minggu Ini</option>
<option>Bulan Ini</option>
</select>
</div>
<div class="h-64 flex items-end justify-between gap-base px-base mb-base">
<div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[40%] rounded-t-lg relative group">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">120</div>
</div>
<div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[65%] rounded-t-lg relative group">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">185</div>
</div>
<div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[55%] rounded-t-lg relative group">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">150</div>
</div>
<div class="w-full bg-primary-container h-[90%] rounded-t-lg relative group">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded opacity-100">240</div>
</div>
<div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[75%] rounded-t-lg relative group">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">210</div>
</div>
<div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[45%] rounded-t-lg relative group">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">130</div>
</div>
<div class="w-full bg-primary-container/20 hover:bg-primary-container transition-all h-[60%] rounded-t-lg relative group">
<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">170</div>
</div>
</div>
<div class="flex justify-between text-xs text-secondary px-base">
<span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
</div>
</div>
<!-- Recent Activity Feed -->
<div class="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-outline-variant flex flex-col">
<h4 class="text-h3 font-h3 text-on-surface mb-sm">Aktivitas Terbaru</h4>
<div class="space-y-sm overflow-y-auto max-h-[350px] pr-xs">
<div class="flex gap-sm border-b border-outline-variant pb-sm">
<div class="bg-primary-fixed w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-primary text-sm">person_add</span>
</div>
<div>
<p class="font-bold text-label-md text-on-surface">Pendaftar Baru</p>
<p class="text-xs text-on-surface-variant">Andi Pratama telah mengisi formulir.</p>
<span class="text-[10px] text-secondary">2 menit yang lalu</span>
</div>
</div>
<div class="flex gap-sm border-b border-outline-variant pb-sm">
<div class="bg-secondary-container w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-secondary text-sm">upload_file</span>
</div>
<div>
<p class="font-bold text-label-md text-on-surface">Dokumen Diunggah</p>
<p class="text-xs text-on-surface-variant">Siti Aminah mengunggah Ijazah SMA.</p>
<span class="text-[10px] text-secondary">15 menit yang lalu</span>
</div>
</div>
<div class="flex gap-sm border-b border-outline-variant pb-sm">
<div class="bg-tertiary-fixed w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-tertiary text-sm">check_circle</span>
</div>
<div>
<p class="font-bold text-label-md text-on-surface">Verifikasi Berhasil</p>
<p class="text-xs text-on-surface-variant">Dokumen Budi Santoso telah diverifikasi.</p>
<span class="text-[10px] text-secondary">1 jam yang lalu</span>
</div>
</div>
<div class="flex gap-sm pb-sm">
<div class="bg-error-container w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-error text-sm">warning</span>
</div>
<div>
<p class="font-bold text-label-md text-on-surface">Perlu Tindakan</p>
<p class="text-xs text-on-surface-variant">Foto Rina tidak memenuhi standar kualifikasi.</p>
<span class="text-[10px] text-secondary">3 jam yang lalu</span>
</div>
</div>
</div>
<button class="mt-auto pt-md text-primary font-bold text-label-md text-center hover:underline">Lihat Semua Aktivitas</button>
</div>
<!-- Information Card (Bento Large) -->
<div class="lg:col-span-3 bg-primary text-white p-lg rounded-xl flex flex-col md:flex-row items-center gap-lg relative overflow-hidden">
<div class="z-10 relative">
<h4 class="text-h2 font-h2 mb-sm">Persiapan Gelombang 2</h4>
<p class="text-body-md opacity-90 max-w-xl mb-md">Seleksi Mandiri Masuk Gelombang 1 akan ditutup dalam 3 hari. Pastikan semua verifikasi berkas diselesaikan sebelum tanggal 30 Mei 2024 pukul 23:59 WIB.</p>
<div class="flex gap-sm">
<button class="bg-white text-primary px-md py-sm rounded-lg font-bold text-label-md hover:bg-opacity-90 transition-all">Kelola Jadwal</button>
<button class="border border-white border-opacity-30 px-md py-sm rounded-lg font-bold text-label-md hover:bg-white/10 transition-all">Unduh Laporan G1</button>
</div>
</div>
<div class="md:ml-auto z-10">
<img alt="Collaboration" class="w-full max-w-sm rounded-lg shadow-xl object-cover h-48 md:h-64" data-alt="A group of diverse, professional students and administrators collaborating in a bright, modern academic setting in Palembang. The background features clean corporate lines and soft teal atmospheric lighting consistent with a premium institution. The overall mood is focused, academic, and highly professional with a minimal color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBus8FD58q4zzyqMfJcLDDmKZZ3oXWrBRuxSG6a2HmxLVvK6rpa2ORm1DBrsZlWMzyTnL_WMHVoauOs6GaDFEziagbfoSomGqoG5aWPuE6zdhPqTFegC11l1Vh6nhIpfYiuKsHNFe75NIUK9zeOfx2DgBK3-XcGFb9aio2canqbJHZlQTHZjfk3NnNA2h00oZlO3vKNwp9a6L0Y_56R98xvGcHLbT-A8xv4woxghiqlWc96LIm8TC94SxaghvPmSfLLtKI40Kfx8A"/>
</div>
<!-- Abstract Decorative Pattern -->
<div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
<div class="absolute bottom-0 right-1/4 w-32 h-32 bg-primary-fixed opacity-10 translate-y-1/2 rounded-full"></div>
</div>
</section>
<!-- Footer -->
<footer class="mt-xl pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-sm">
<p class="text-label-md font-label-md text-secondary">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
<div class="flex gap-md">
<a class="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Kontak Kami</a>
<a class="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
<a class="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Syarat &amp; Ketentuan</a>
</div>
</footer>
</main>
</body></html>