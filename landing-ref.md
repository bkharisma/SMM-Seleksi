<!DOCTYPE html>

<html lang="id"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
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
        body { background-color: #f7fafc; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="font-body-md text-on-surface">
<!-- TopAppBar -->
<nav class="bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant docked full-width top-0 shadow-sm sticky z-50">
<div class="flex justify-between items-center w-full px-gutter max-w-[1200px] mx-auto h-20">
<div class="text-h3 font-h3 text-primary dark:text-primary-fixed-dim">Poltekpar Palembang</div>
<div class="hidden md:flex gap-md items-center">
<a class="text-primary font-bold border-b-2 border-primary pb-1 transition-colors" href="#">Beranda</a>
<a class="text-secondary dark:text-secondary-fixed-dim font-body-md hover:text-primary-container dark:hover:text-primary-fixed-dim transition-colors" href="#">Informasi</a>
<a class="text-secondary dark:text-secondary-fixed-dim font-body-md hover:text-primary-container dark:hover:text-primary-fixed-dim transition-colors" href="#">Dokumen</a>
<a class="text-secondary dark:text-secondary-fixed-dim font-body-md hover:text-primary-container dark:hover:text-primary-fixed-dim transition-colors" href="#">Panduan</a>
</div>
<div class="flex items-center gap-sm">
<button class="font-button text-button px-sm py-xs text-primary hover:bg-surface-container transition-colors">Masuk</button>
<button class="font-button text-button px-md py-xs bg-primary-container text-on-primary-container rounded-lg shadow-sm hover:opacity-90 transition-all">Daftar</button>
</div>
</div>
</nav>
<main>
<!-- Hero Section -->
<section class="relative overflow-hidden bg-surface-container-low pt-xl pb-xl md:pt-[120px] md:pb-[120px]">
<div class="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-xl">
<div class="z-10">
<span class="inline-block px-sm py-base bg-secondary-container text-on-secondary-fixed font-label-md rounded-full mb-sm">Penerimaan Mahasiswa Baru 2024/2025</span>
<h1 class="font-h1 text-h1 text-on-surface mb-md">Wujudkan Karir Gemilang di Industri Hospitality Dunia</h1>
<p class="font-body-lg text-body-lg text-secondary mb-lg max-w-[500px]">Bergabunglah dengan Politeknik Pariwisata Palembang, institusi pendidikan pariwisata unggulan yang mencetak profesional berstandar internasional.</p>
<div class="flex flex-wrap gap-sm">
<button class="bg-primary-container text-on-primary-container font-button text-button px-xl py-md rounded-lg shadow-md hover:opacity-90 transition-all">Daftar Sekarang</button>
<button class="border border-outline text-primary font-button text-button px-xl py-md rounded-lg hover:bg-surface-container transition-all flex items-center gap-xs">
<span class="material-symbols-outlined">play_circle</span>
                            Lihat Profil
                        </button>
</div>
</div>
<div class="relative">
<div class="aspect-[4/3] rounded-xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
<img alt="Student Life" class="w-full h-full object-cover" data-alt="A professional photograph of a group of diverse students in smart academic uniforms, smiling confidently in front of a modern university building entrance. The lighting is soft and warm, capturing a high-end academic atmosphere with pristine architecture and lush green landscaping. The scene is bright and sophisticated, using a clean color palette of whites and soft blues to match a premium corporate education branding." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy860SmV9vdhOdE1HIlYqyW87iVR5Zwhg7OIz-USvxmITMr9D9K6xxYW3WAxtjpFvUI18WBpWhgUaSNf8IG4QC150pwNMdeYm7VEDj2j7oFbT4ZVVRBbBNm2LekAxE8gYJfCEgJCiLkTO5BIAtLEs_U6-PEAoj6rpjRWlZkThwCRRCO7VacF08i2ap5nX3kBQAspHUvyKxUhsz2MgNi4Y8Ik5HbMjUxAb1RS4sEI3bkGRfeJ5XT_2n9xxIHVwJ88Aaau9UfKRLHg"/>
</div>
<div class="absolute -bottom-8 -left-8 bg-surface-container-lowest p-md rounded-xl shadow-lg border border-outline-variant hidden lg:block">
<div class="flex items-center gap-sm">
<div class="bg-primary-container text-on-primary-container p-sm rounded-lg">
<span class="material-symbols-outlined">verified</span>
</div>
<div>
<p class="font-h3 text-h3 text-primary">A+ Akreditasi</p>
<p class="font-label-md text-label-md text-secondary">Institusi Terakreditasi Nasional</p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Informasi Seleksi (Bento Grid) -->
<section class="py-xl bg-surface-bright">
<div class="max-w-[1200px] mx-auto px-gutter">
<div class="text-center mb-xl">
<h2 class="font-h2 text-h2 text-on-surface mb-xs">Informasi Seleksi</h2>
<p class="text-secondary font-body-md">Panduan lengkap mengenai jalur masuk dan persyaratan akademik.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-md">
<!-- Large Card -->
<div class="md:col-span-8 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
<div class="flex flex-col h-full justify-between">
<div>
<span class="material-symbols-outlined text-primary text-[40px] mb-sm">school</span>
<h3 class="font-h3 text-h3 text-on-surface mb-sm">SMM Poltekpar Palembang</h3>
<p class="text-secondary font-body-md mb-md">Seleksi Mandiri Masuk (SMM) merupakan jalur seleksi yang dikelola secara internal oleh Politeknik Pariwisata Palembang untuk menjaring talenta terbaik di bidang perhotelan dan pariwisata.</p>
</div>
<div class="flex items-center gap-md">
<div class="flex -space-x-4">
<img alt="Student" class="w-12 h-12 rounded-full border-2 border-white object-cover" data-alt="A portrait of a cheerful female student wearing a clean academic uniform in a brightly lit campus environment, embodying a professional and studious aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUX0IKMsO2_GoSCB-GTdzdiI2vqGmb7VGRKN09hWfn533nvEyURz5Afsatcqt2scHjNPrCtetAa28P_u_KokDN0J4Udk03L9AOubvziWcKQGtiv8_5VYEUIZgCqkEjyXwL-ep35u3IN5W1EvJaoR5cMhCkquKJBa0fGEbUsq9ZjCAK4Au2lyBJC0c_ypL2heqFtf0AH5huSl1HdEW6NbmK8hSZBVjAU99xw-L3RcoLp9y6mGF-rMvLQQ2s89hd2IaSyEJpM2Ew2Q"/>
<img alt="Student" class="w-12 h-12 rounded-full border-2 border-white object-cover" data-alt="A portrait of a male student in professional hospitality attire, smiling warmly in a sophisticated hotel lobby background with soft lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKRV2325u3UDYdF018vo2iOif_9-jl0efH3wYJHqKHKQlwFXhiH1zWIPNyMa2A2U_7v0LaR_m19El6GMtVOmgkCGSA1NZnqoUpLXqDOKF2ND0hL-nEXl_Dx1nh8PO6J6fBJkUYy4FeRLPeJo5bwmELYuYNd7bDOqSVHAKJWrw59AUcWDGsPyxVnQw6aL7U1DPN-a739Ajl8cyZtLsJvr9FezYdZV5aRRRTn7xIkGQ94td_vAQZRAjt65AFPNrwF77ebgnvtEUOMA"/>
<div class="w-12 h-12 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md">+500</div>
</div>
<span class="text-label-md text-secondary">Pendaftar baru minggu ini</span>
</div>
</div>
</div>
<!-- Small Card 1 -->
<div class="md:col-span-4 bg-primary-container p-lg rounded-xl shadow-sm text-on-primary-container flex flex-col justify-center">
<span class="material-symbols-outlined text-[32px] mb-sm">event_available</span>
<h3 class="font-h3 text-h3 mb-xs">Pendaftaran Dibuka</h3>
<p class="font-body-md mb-lg opacity-90">Mulai dari 1 Maret - 30 Juni 2024. Pastikan data Anda lengkap sebelum mengunggah.</p>
<a class="font-button text-button flex items-center gap-xs hover:underline" href="#">
                            Lihat Jadwal Lengkap <span class="material-symbols-outlined">arrow_forward</span>
</a>
</div>
<!-- Small Card 2 -->
<div class="md:col-span-4 bg-surface-container-high p-lg rounded-xl border border-outline-variant hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined text-primary text-[32px] mb-sm">description</span>
<h3 class="font-h3 text-h3 text-on-surface mb-xs">Syarat Dokumen</h3>
<ul class="text-secondary font-body-md space-y-xs">
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[18px]">check_circle</span> Scan Ijazah/SKL</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[18px]">check_circle</span> Pas Foto 4x6</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[18px]">check_circle</span> Kartu Keluarga</li>
</ul>
</div>
<!-- Medium Card -->
<div class="md:col-span-8 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-lg items-center">
<div class="flex-1">
<h3 class="font-h3 text-h3 text-on-surface mb-xs">Program Studi Unggulan</h3>
<p class="text-secondary font-body-md mb-md">Pilih dari berbagai program studi yang telah teruji dan memiliki jaringan industri luas.</p>
<div class="grid grid-cols-2 gap-sm">
<div class="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Seni Kuliner</div>
<div class="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Tata Hidang</div>
<div class="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Divisi Kamar</div>
<div class="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Usaha Perjalanan</div>
</div>
</div>
<div class="w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
<img alt="Culinary Arts" class="w-full h-full object-cover" data-alt="A professional culinary student in a white chef uniform meticulously plating a sophisticated dish in a high-tech, stainless steel commercial kitchen. The lighting is clean and bright, emphasizing professional excellence and precision in a modern academic culinary setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqAJhIULlScJarcgkrZNwsIetZu0wNP6PENpy_D5kvhTEOkA-teecvhP5xKMOhXeu4OrAbJCI2Czt9bqC2r6dtkCPedYOsmHwKBlJ6cAGBxbUXzNuDVxYj59nybl3RCVCEdZ7x1MZVc2F97dZjfxoqkCvVIU-0ODoqUXx-_55_LrEr8K9kLugPnGfyEOT-YXdDaDxM5HsGNplxs2l1QFziZfWMku5eHMMdA2AJS59y36Pe5MEbObctJ4zWuUXcAAEygHWbz2ICBw"/>
</div>
</div>
</div>
</div>
</section>
<!-- Berita & Pengumuman -->
<section class="py-xl">
<div class="max-w-[1200px] mx-auto px-gutter">
<div class="flex justify-between items-end mb-xl">
<div>
<h2 class="font-h2 text-h2 text-on-surface mb-xs">Berita &amp; Pengumuman</h2>
<p class="text-secondary font-body-md">Tetap terinformasi dengan update terbaru dari kampus.</p>
</div>
<button class="text-primary font-button text-button hover:underline hidden md:block">Lihat Semua Berita</button>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
<!-- News Card 1 -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all group">
<div class="h-48 overflow-hidden">
<img alt="News 1" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A wide shot of a modern conference hall with students listening to a keynote speaker. The scene is professional and academic, featuring high-quality audio-visual equipment and soft ambient lighting that highlights the corporate university aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwQJeo1zfH0AafAzBzto38FOyKePBox1jNgLqhQJFG_ozy22-0K9HJa8hyadoNuyrS1h8q-umiSZ7nigGDKSlgu2oAoXYFHxjPlEqTpSnXRgIOYfB-SyY6cxdWoAfZ2qnst36-PkV3nZfi28PPDWixiil_MIj_H-2JgCUZetTIahH9svPfCCzemYPRGL3hHjAHaCX23QHIEr4fPFpGcOkCtd0CJkxxEjI7QAAMBM2n0TLhpO8n9FLpcHGTQKROmeFo0JsEkkVjhA"/>
</div>
<div class="p-md">
<span class="text-label-md text-primary font-bold uppercase tracking-wider mb-xs inline-block">Pengumuman</span>
<h4 class="font-h3 text-h3 text-on-surface mb-sm leading-tight">Sosialisasi Jalur Mandiri 2024 Secara Virtual</h4>
<p class="text-secondary font-body-md line-clamp-2 mb-md">Ikuti sesi tanya jawab langsung mengenai teknis pendaftaran Jalur Mandiri melalui platform Zoom.</p>
<div class="flex justify-between items-center text-label-md text-outline">
<span>24 Jan 2024</span>
<span class="material-symbols-outlined">share</span>
</div>
</div>
</div>
<!-- News Card 2 -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all group">
<div class="h-48 overflow-hidden">
<img alt="News 2" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A brightly lit, modern library with students studying together on contemporary wooden tables. Large windows reveal a lush green campus. The atmosphere is quiet, productive, and academically inspiring, using a neutral color palette with teal accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2tC0yo1Z0MA9DnXncUgxE8KttE6s-03mS84uiyfF9m_lQ4llvDu164cBdnUSHDslACmo8ef9xD3GDXjS81RYrYGeYawuT9nPRbarmhbK46xqcSpsgB5wdv9tKegVjtTQYiIPIzr0Zvq3widnVar6AKhQHKYuSgrd-QmIwRzLmZj4BMHLQl4zX-NwBHsaZLW-SSF35JN9QPc_ZxeXW6S8icZyZTJMOZAK4PNL3YmPs7Q46lH814jUFpDu1Rg1FzWIKhhjp4ANkeg"/>
</div>
<div class="p-md">
<span class="text-label-md text-primary font-bold uppercase tracking-wider mb-xs inline-block">Berita</span>
<h4 class="font-h3 text-h3 text-on-surface mb-sm leading-tight">Poltekpar Palembang Jalin Kerja Sama dengan Marriot Group</h4>
<p class="text-secondary font-body-md line-clamp-2 mb-md">Kerja sama strategis ini membuka peluang magang internasional bagi mahasiswa berprestasi di seluruh dunia.</p>
<div class="flex justify-between items-center text-label-md text-outline">
<span>18 Jan 2024</span>
<span class="material-symbols-outlined">share</span>
</div>
</div>
</div>
<!-- News Card 3 -->
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all group">
<div class="h-48 overflow-hidden">
<img alt="News 3" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="An elegant restaurant setting within a hospitality school, where students are being trained in high-end table service. The interior is sophisticated with fine dining decor, soft warm lighting, and a professional academic tone." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBekNPYtvci-2IGyGQnLjkjHS_CyHHKiW2Pl8OPCMfza4zNVf0X8rnxDGTFNqG6k1lVCq0b0zuVvSHSxF9BGpYjIDDmbQqdJRmp4HpZ8H5KnUXz8xGVKOl1acUuAlzBXtNWDmLjH3BFBY6bHCWyrsxcRfee_XbA_oMjSmptFfiW80FNWetWjPEBVm_MWh4E0SUzibamA4pMbpGUHL-a-n_XcjM1XNh8EuK0MxSJHVzP7NeiuSxexX6WRb07olRj1MPrLntTLpBfg"/>
</div>
<div class="p-md">
<span class="text-label-md text-primary font-bold uppercase tracking-wider mb-xs inline-block">Tips</span>
<h4 class="font-h3 text-h3 text-on-surface mb-sm leading-tight">Persiapan Menghadapi Ujian Wawancara</h4>
<p class="text-secondary font-body-md line-clamp-2 mb-md">Beberapa hal penting yang harus diperhatikan calon mahasiswa saat mengikuti sesi wawancara seleksi.</p>
<div class="flex justify-between items-center text-label-md text-outline">
<span>15 Jan 2024</span>
<span class="material-symbols-outlined">share</span>
</div>
</div>
</div>
</div>
<button class="w-full mt-lg border border-outline text-primary font-button text-button py-md rounded-lg md:hidden">Lihat Semua Berita</button>
</div>
</section>
<!-- CTA Section -->
<section class="py-xl px-gutter">
<div class="max-w-[1200px] mx-auto bg-inverse-surface text-inverse-on-surface rounded-2xl p-lg md:p-xl text-center relative overflow-hidden">
<div class="relative z-10">
<h2 class="font-h2 text-h2 mb-md">Siap Memulai Perjalanan Anda?</h2>
<p class="font-body-lg text-body-lg mb-lg opacity-80 max-w-[700px] mx-auto">Jangan lewatkan kesempatan untuk menjadi bagian dari generasi pemimpin pariwisata masa depan. Daftar sekarang dan raih impianmu.</p>
<button class="bg-primary-container text-on-primary-container font-button text-button px-xl py-md rounded-lg shadow-lg hover:bg-primary-fixed-dim transition-all">Mulai Pendaftaran Online</button>
</div>
<!-- Abstract decorative element -->
<div class="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full -mr-32 -mt-32"></div>
<div class="absolute bottom-0 left-0 w-48 h-48 bg-tertiary opacity-10 rounded-full -ml-24 -mb-24"></div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
<div class="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-lg max-w-[1200px] mx-auto">
<div class="mb-lg md:mb-0">
<div class="text-h3 font-h3 text-on-surface dark:text-inverse-on-surface mb-xs">Poltekpar Palembang</div>
<p class="text-on-surface-variant dark:text-surface-variant font-label-md max-w-[300px]">Kampus Unggulan Pariwisata Indonesia Timur. Mencetak profesional hospitality dunia.</p>
</div>
<div class="flex flex-col items-center md:items-end gap-sm">
<div class="flex gap-md mb-xs">
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim underline font-label-md transition-colors" href="#">Kontak Kami</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim underline font-label-md transition-colors" href="#">Kebijakan Privasi</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim underline font-label-md transition-colors" href="#">Syarat &amp; Ketentuan</a>
</div>
<p class="text-on-surface-variant dark:text-surface-variant font-label-md opacity-70">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
</div>
</div>
</footer>
</body></html>