import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';

export default function SyaratKetentuan() {
    const { app } = usePage().props as any;
    const [themeOpen, setThemeOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(getStoredTheme());
    const themeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
                setThemeOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        setStoredTheme(theme);
        setCurrentTheme(theme);
        setThemeOpen(false);
    };

    const sections = [
        {
            title: '1. Persyaratan Umum',
            items: [
                'Warga Negara Indonesia (WNI)',
                'Lulusan SMA/SMK/MA atau sederajat dari tahun sebelumnya dan tahun berjalan',
                'Memiliki kesehatan yang baik sehingga tidak mengganggu kelancaran studi',
                'Bersedia mematuhi seluruh peraturan dan tata tertib Poltekpar Palembang',
            ],
        },
        {
            title: '2. Persyaratan Dokumen',
            items: [
                'Fotokopi Ijazah SMA/SMK/MA atau SKL (Surat Keterangan Lulus) yang dilegalisir',
                'Fotokopi Kartu Keluarga (KK)',
                'Fotokopi Akta Kelahiran',
                'Pas foto terbaru berwarna ukuran 4x6 cm (latar belakang merah)',
                'Fotokopi KTP (Kartu Tanda Penduduk)',
                'Surat Keterangan Sehat dari dokter',
            ],
        },
        {
            title: '3. Proses Pendaftaran',
            items: [
                'Calon peserta wajib mengisi formulir pendaftaran online secara lengkap dan benar',
                'Biaya pendaftaran tidak dapat dikembalikan dengan alasan apapun',
                'Data yang diisi harus sesuai dengan dokumen asli',
                'Peserta wajib mengunggah dokumen persyaratan sesuai format yang ditentukan',
            ],
        },
        {
            title: '4. Proses Seleksi',
            items: [
                'Seleksi terdiri dari tahap verifikasi berkas, ujian tertulis, dan/atau wawancara',
                'Jadwal dan lokasi seleksi akan diumumkan melalui website resmi',
                'Peserta wajib hadir tepat waktu sesuai jadwal yang ditentukan',
                'Peserta yang tidak hadir tanpa alasan yang sah dinyatakan gugur',
            ],
        },
        {
            title: '5. Ketentuan Kelulusan',
            items: [
                'Kelulusan ditentukan berdasarkan hasil seleksi secara keseluruhan',
                'Keputusan panitia seleksi bersifat final dan tidak dapat diganggu gugat',
                'Hasil seleksi diumumkan melalui website resmi dan tidak melalui surat pribadi',
                'Peserta yang dinyatakan lulus wajib melakukan daftar ulang sesuai jadwal yang ditetapkan',
            ],
        },
        {
            title: '6. Daftar Ulang',
            items: [
                'Peserta yang lulus wajib melakukan daftar ulang dalam waktu yang telah ditentukan',
                'Peserta yang tidak melakukan daftar ulang dianggap mengundurkan diri',
                'Biaya daftar ulang dan ketentuan pembayaran akan diumumkan terpisah',
            ],
        },
        {
            title: '7. Sanksi',
            items: [
                'Peserta yang terbukti melakukan kecurangan dalam proses seleksi akan didiskualifikasi',
                'Pemalsuan dokumen akan berakibat pada pembatalan kelulusan',
                'Poltekpar berhak mengambil tindakan hukum jika diperlukan',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Syarat & Ketentuan - SMMPTP Poltekpar Palembang" />

            <nav className="bg-surface-container-lowest border-b border-outline-variant docked full-width top-0 shadow-sm sticky z-50">
                <div className="flex justify-between items-center w-full px-gutter max-w-[1200px] mx-auto h-20">
                    <div className="flex items-center gap-sm">
                        {app?.logo_url ? (
                            <img src={app.logo_url} alt="Logo" className="h-12 w-auto object-contain" />
                        ) : (
                            <div className="h-12 w-12 rounded-lg bg-primary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">school</span>
                            </div>
                        )}
                        <Link href="/" className="text-h3 font-h3 text-primary">Poltekpar Palembang</Link>
                    </div>
                    <div className="hidden md:flex gap-cs items-center">
                        <Link href="/" className="text-secondary font-body-md hover:text-primary-container transition-colors">Beranda</Link>
                        <Link href="/jadwal" className="text-secondary font-body-md hover:text-primary-container transition-colors">Jadwal</Link>
                        <Link href="#" className="text-secondary font-body-md hover:text-primary-container transition-colors">Dokumen</Link>
                        <Link href="#" className="text-secondary font-body-md hover:text-primary-container transition-colors">Panduan</Link>
                    </div>
                    <div className="flex items-center gap-sm">
                        <div ref={themeRef} className="relative">
                            <button
                                onClick={() => setThemeOpen(!themeOpen)}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-all"
                                title="Tema"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {currentTheme === 'light' && 'light_mode'}
                                    {currentTheme === 'dark' && 'dark_mode'}
                                    {currentTheme === 'system' && 'desktop_windows'}
                                </span>
                            </button>
                            {themeOpen && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant py-1 z-50">
                                    <button
                                        onClick={() => handleThemeChange('light')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${currentTheme === 'light' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">light_mode</span> Light
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('dark')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${currentTheme === 'dark' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">dark_mode</span> Dark
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('system')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${currentTheme === 'system' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">desktop_windows</span> System
                                    </button>
                                </div>
                            )}
                        </div>
                        <Link href="/login-member" className="font-button text-button px-sm py-xs text-primary hover:bg-surface-container transition-colors">Masuk</Link>
                        <Link href="/registrasi" className="font-button text-button px-cs py-xs bg-primary-container text-on-primary-container rounded-lg shadow-sm hover:opacity-90 transition-all">Daftar</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-[800px] mx-auto px-gutter py-cxl">
                <Link href="/" className="inline-flex items-center gap-xs text-primary font-button text-button mb-cl hover:underline">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Beranda
                </Link>

                <div className="mb-cxl">
                    <h1 className="font-h1 text-on-surface mb-xs">Syarat & Ketentuan</h1>
                    <p className="text-body-lg text-secondary">Syarat dan ketentuan yang berlaku untuk proses seleksi penerimaan mahasiswa baru Poltekpar Palembang.</p>
                    <p className="text-label-md text-secondary mt-sm">Terakhir diperbarui: Januari 2024</p>
                </div>

                <div className="space-y-cl">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                            <h2 className="font-h3 text-on-surface mb-sm">{section.title}</h2>
                            <ul className="space-y-xs">
                                {section.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-xs text-body-md text-on-surface-variant">
                                        <span className="material-symbols-outlined text-lg text-primary mt-0.5 shrink-0">check_circle</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-cxl p-cl bg-primary-container rounded-xl">
                    <p className="text-body-md text-on-primary-container">
                        Dengan mendaftar, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
                        Jika ada pertanyaan, silakan hubungi kami melalui halaman{' '}
                        <Link href="/kontak" className="font-bold underline">Kontak Kami</Link>.
                    </p>
                </div>
            </main>

            <footer className="bg-surface-container-highest border-t border-outline-variant">
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-cl max-w-[1200px] mx-auto">
                    <div className="mb-cl md:mb-0">
                        <div className="text-h3 font-h3 text-on-surface mb-xs">Poltekpar Palembang</div>
                        <p className="text-on-surface-variant font-label-md max-w-[300px]">Kampus Unggulan Pariwisata Indonesia Timur. Mencetak profesional hospitality dunia.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-sm">
                        <div className="flex gap-cs mb-xs">
                            <Link href="/kontak" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Kontak Kami</Link>
                            <Link href="/kebijakan-privasi" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Kebijakan Privasi</Link>
                            <Link href="/syarat-ketentuan" className="text-primary underline font-label-md">Syarat & Ketentuan</Link>
                        </div>
                        <p className="text-on-surface-variant font-label-md opacity-70">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
