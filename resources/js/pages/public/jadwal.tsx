import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';

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

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getJenisIcon = (jenis: string | null) => {
        switch (jenis) {
            case 'ujian': return 'assignment';
            case 'wawancara': return 'record_voice_over';
            case 'kesehatan': return 'favorite';
            case 'daftar': return 'app_registration';
            default: return 'event';
        }
    };

    const getJenisColor = (jenis: string | null) => {
        switch (jenis) {
            case 'ujian': return 'bg-primary-container text-on-primary-container';
            case 'wawancara': return 'bg-secondary-container text-on-secondary-container';
            case 'kesehatan': return 'bg-tertiary-container text-on-tertiary-container';
            case 'daftar': return 'bg-error-container text-on-error-container';
            default: return 'bg-surface-container text-on-surface';
        }
    };

    const getJenisLabel = (jenis: string | null) => {
        switch (jenis) {
            case 'ujian': return 'Ujian';
            case 'wawancara': return 'Wawancara';
            case 'kesehatan': return 'Kesehatan';
            case 'daftar': return 'Pendaftaran';
            default: return jenis || '-';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Jadwal Seleksi - SMMPTP Poltekpar Palembang" />

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
                        <Link href="/jadwal" className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors">Jadwal</Link>
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
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${
                                            currentTheme === 'light'
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">light_mode</span>
                                        Light
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('dark')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${
                                            currentTheme === 'dark'
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">dark_mode</span>
                                        Dark
                                    </button>
                                    <button
                                        onClick={() => handleThemeChange('system')}
                                        className={`flex items-center gap-xs px-3 py-2 w-full text-left transition-all text-label-md ${
                                            currentTheme === 'system'
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">desktop_windows</span>
                                        System
                                    </button>
                                </div>
                            )}
                        </div>
                        <Link href="/login-member" className="font-button text-button px-sm py-xs text-primary hover:bg-surface-container transition-colors">Masuk</Link>
                        <Link href="/registrasi" className="font-button text-button px-cs py-xs bg-primary-container text-on-primary-container rounded-lg shadow-sm hover:opacity-90 transition-all">Daftar</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1200px] mx-auto px-gutter py-cxl">
                <Link href="/" className="inline-flex items-center gap-xs text-primary font-button text-button mb-cl hover:underline">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Beranda
                </Link>

                <div className="mb-cxl">
                    <h1 className="font-h1 text-on-surface mb-xs">Jadwal Seleksi</h1>
                    <p className="text-body-lg text-secondary">Informasi lengkap jadwal seleksi masuk Poltekpar Palembang.</p>
                </div>

                {jadwal.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-cs">
                        {jadwal.map((item) => (
                            <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="p-cl">
                                    <div className="flex items-start justify-between mb-sm">
                                        <div className={`p-sm rounded-lg ${getJenisColor(item.jenis)}`}>
                                            <span className="material-symbols-outlined text-xl">{getJenisIcon(item.jenis)}</span>
                                        </div>
                                        <span className={`text-label-sm font-bold uppercase tracking-wider px-sm py-xs rounded-full ${getJenisColor(item.jenis)}`}>
                                            {getJenisLabel(item.jenis)}
                                        </span>
                                    </div>

                                    <h3 className="font-h3 text-on-surface mb-sm">{item.nama_jadwal}</h3>

                                    {item.keterangan && (
                                        <p className="text-body-sm text-secondary mb-base">{item.keterangan}</p>
                                    )}

                                    <div className="space-y-xs">
                                        <div className="flex items-center gap-xs text-label-md text-on-surface-variant">
                                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                                            <span>{formatDate(item.tgl_awal)} - {formatDate(item.tgl_akhir)}</span>
                                        </div>
                                        {item.jam_awal && (
                                            <div className="flex items-center gap-xs text-label-md text-on-surface-variant">
                                                <span className="material-symbols-outlined text-lg">schedule</span>
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
                        <span className="material-symbols-outlined text-6xl text-secondary mb-sm">event_busy</span>
                        <p className="text-body-lg text-secondary">Belum ada jadwal yang tersedia.</p>
                    </div>
                )}
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
                            <Link href="/syarat-ketentuan" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Syarat & Ketentuan</Link>
                        </div>
                        <p className="text-on-surface-variant font-label-md opacity-70">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
