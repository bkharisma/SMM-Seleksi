import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';
import RegistrationLink from '@/components/ui/registration-link';

interface Jadwal {
    id: number;
    nama_jadwal: string;
    keterangan: string | null;
    tgl_awal: string | null;
    tgl_akhir: string | null;
    jam_awal: string | null;
    jam_akhir: string | null;
    jenis: string | null;
}

interface JadwalPageProps {
    jadwal: Jadwal[];
}

export default function JadwalPage({ jadwal }: JadwalPageProps) {
    const { app } = usePage().props as any;
    const [themeOpen, setThemeOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(getStoredTheme());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const themeRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
                setThemeOpen(false);
            }

            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                const hamburger = document.getElementById('hamburger-btn');

                if (hamburger && !hamburger.contains(e.target as Node)) {
                    setMobileMenuOpen(false);
                }
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

    const formatDate = (date: string | null) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getJenisIcon = (jenis: string | null) => {
        switch (jenis) {
            case 'ujian': return 'assignment';
            case 'wawancara': return 'record_voice_over';
            case 'kesehatan': return 'favorite';
            case 'daftar': return 'app_registration';
            case 'pengumuman': return 'campaign';
            default: return 'event';
        }
    };

    const getJenisColor = (jenis: string | null) => {
        switch (jenis) {
            case 'ujian': return 'bg-primary-container text-on-primary-container';
            case 'wawancara': return 'bg-secondary-container text-on-secondary-container';
            case 'kesehatan': return 'bg-tertiary-container text-on-tertiary-container';
            case 'daftar': return 'bg-error-container text-on-error-container';
            case 'pengumuman': return 'bg-inverse-surface text-inverse-on-surface';
            default: return 'bg-surface-container text-on-surface';
        }
    };

    const getJenisLabel = (jenis: string | null) => {
        switch (jenis) {
            case 'ujian': return 'Ujian';
            case 'wawancara': return 'Wawancara';
            case 'kesehatan': return 'Kesehatan';
            case 'daftar': return 'Pendaftaran';
            case 'pengumuman': return 'Pengumuman';
            default: return jenis || '-';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Jadwal Seleksi - SMM Poltekpar Palembang" />

            <nav className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50 shadow-sm">
                <div className="flex justify-between items-center w-full px-gutter max-w-[1200px] mx-auto h-16 md:h-20">
                    <div className="flex items-center gap-sm">
                        {app?.logo_url ? (
                            <img src={app.logo_url} alt="Logo" className="h-8 w-auto md:h-12 object-contain" />
                        ) : (
                            <div className="h-8 w-8 md:h-12 md:w-12 rounded-lg bg-primary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-lg md:text-2xl">school</span>
                            </div>
                        )}
                        <Link href="/" className="text-lg md:text-h3 font-h3 text-primary truncate">Poltekpar Palembang</Link>
                    </div>
                    <div className="hidden md:flex gap-cs items-center">
                        <Link href="/" className="text-secondary font-body-md hover:text-primary-container transition-colors">Beranda</Link>
                        <Link href="/jadwal" className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors">Jadwal</Link>
                        <Link href="/news" className="text-secondary font-body-md hover:text-primary-container transition-colors">Berita</Link>
                    </div>
                    <div className="flex items-center gap-sm">
                        <div ref={themeRef} className="relative">
                            <button
                                onClick={() => setThemeOpen(!themeOpen)}
                                className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-all"
                                title="Tema"
                            >
                                <span className="material-symbols-outlined text-base md:text-lg">
                                    {currentTheme === 'light' && 'light_mode'}
                                    {currentTheme === 'dark' && 'dark_mode'}
                                    {currentTheme === 'system' && 'desktop_windows'}
                                </span>
                            </button>
                            {themeOpen && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant py-1 z-50">
                                    <button
                                        onClick={() => handleThemeChange('light')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${
                                            currentTheme === 'light'
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">light_mode</span> Light
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('dark')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${
                                            currentTheme === 'dark'
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">dark_mode</span> Dark
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('system')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${
                                            currentTheme === 'system'
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">desktop_windows</span> System
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="hidden md:flex items-center gap-sm">
                            <Link href="/login-member" className="font-button text-button px-sm py-xs text-primary hover:bg-surface-container transition-colors">Masuk</Link>
                            <RegistrationLink className="font-button text-button px-cs py-xs bg-primary-container text-on-primary-container rounded-lg shadow-sm hover:opacity-90 transition-all">Daftar</RegistrationLink>
                        </div>
                        <button
                            id="hamburger-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-all"
                            aria-label="Toggle menu"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {mobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div ref={mobileMenuRef} className="md:hidden border-t border-outline-variant bg-surface-container-lowest">
                        <div className="px-gutter py-sm space-y-xs">
                            <Link href="/" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">home</span> Beranda
                            </Link>
                            <Link href="/jadwal" className="flex items-center gap-sm px-sm py-2 text-primary font-medium rounded-lg bg-primary-container/10" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">event</span> Jadwal
                            </Link>
                            <Link href="/news" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">newspaper</span> Berita
                            </Link>
                            <div className="border-t border-outline-variant pt-sm mt-sm">
                                <Link href="/login-member" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="material-symbols-outlined text-lg">login</span> Masuk
                                </Link>
                                <RegistrationLink className="flex items-center justify-center gap-sm px-sm py-2 mt-xs bg-primary-container text-on-primary-container font-medium rounded-lg shadow-sm hover:opacity-90 transition-all" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="material-symbols-outlined text-lg">person_add</span> Daftar Sekarang
                                </RegistrationLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-[1200px] mx-auto px-gutter py-cs md:py-cxl">
                <Link href="/" className="inline-flex items-center gap-xs text-primary font-button text-button mb-cl hover:underline text-sm md:text-base">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Beranda
                </Link>

                <div className="mb-cl md:mb-cxl">
                    <h1 className="text-2xl md:text-[40px] font-h1 text-on-surface mb-xs leading-tight">Jadwal Seleksi</h1>
                    <p className="text-sm md:text-body-lg text-secondary">Informasi lengkap jadwal seleksi masuk Poltekpar Palembang.</p>
                </div>

                {jadwal.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-cs">
                        {jadwal.map((item) => (
                            <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="p-cl">
                                    <div className="flex items-start justify-between mb-sm">
                                        <div className={`p-sm rounded-lg shrink-0 ${getJenisColor(item.jenis)}`}>
                                            <span className="material-symbols-outlined text-xl">{getJenisIcon(item.jenis)}</span>
                                        </div>
                                        <span className={`text-label-sm font-bold uppercase tracking-wider px-sm py-xs rounded-full shrink-0 ${getJenisColor(item.jenis)}`}>
                                            {getJenisLabel(item.jenis)}
                                        </span>
                                    </div>

                                    <h3 className="font-h3 text-on-surface mb-sm">{item.nama_jadwal}</h3>

                                    {item.keterangan && (
                                        <p className="text-sm text-secondary mb-base line-clamp-2">{item.keterangan}</p>
                                    )}

                                    <div className="space-y-xs">
                                        <div className="flex items-center gap-xs text-label-md text-on-surface-variant text-sm">
                                            <span className="material-symbols-outlined text-lg shrink-0">calendar_today</span>
                                            <span>{formatDate(item.tgl_awal)} - {formatDate(item.tgl_akhir)}</span>
                                        </div>
                                        {item.jam_awal && (
                                            <div className="flex items-center gap-xs text-label-md text-on-surface-variant text-sm">
                                                <span className="material-symbols-outlined text-lg shrink-0">schedule</span>
                                                <span>{item.jam_awal} - {item.jam_akhir}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-cxl">
                        <span className="material-symbols-outlined text-4xl md:text-6xl text-secondary mb-sm">event_busy</span>
                        <p className="text-sm md:text-body-lg text-secondary">Belum ada jadwal yang tersedia.</p>
                    </div>
                )}
            </main>

            <footer className="bg-surface-container-highest border-t border-outline-variant">
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-cl max-w-[1200px] mx-auto">
                    <div className="mb-cl md:mb-0">
                        <div className="text-lg md:text-h3 font-h3 text-on-surface mb-xs">Politeknik Pariwisata Palembang</div>
                        <p className="text-on-surface-variant font-label-md max-w-[350px] text-sm">Kampus Perguruan tinggi vokasi di bidang keparwisataan yang berkomitmen untuk menjadi perguruan tinggi yang berstandar international, unggul, dan berkepribadian indonesia.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-sm">
                        <div className="flex flex-wrap justify-center gap-cs mb-xs">
                            <Link href="/kontak" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md text-sm">Kontak Kami</Link>
                            <Link href="/kebijakan-privasi" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md text-sm">Kebijakan Privasi</Link>
                            <Link href="/syarat-ketentuan" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md text-sm">Syarat & Ketentuan</Link>
                        </div>
                        <p className="text-on-surface-variant font-label-md opacity-70 text-sm">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
