import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';

interface HomeProps {
    news: Array<{
        id: number;
        title: string;
        description: string;
        post_name: string;
        news_type: string | null;
        img: string | null;
        pdf: string | null;
        published_at: string;
    }>;
    jadwal: Array<{
        id: number;
        nama_jadwal: string;
        keterangan: string | null;
        tgl_awal: string | null;
        tgl_akhir: string | null;
        jam_awal: string | null;
        jam_akhir: string | null;
        jenis: string | null;
    }>;
    hero_image_url: string | null;
    accreditation_image_url: string | null;
}

export default function Home({ news, jadwal, hero_image_url, accreditation_image_url }: HomeProps) {
    const { app } = usePage().props as any;

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getJenisIcon = (jenis: string | null) => {
        const icons: Record<string, string> = {
            ujian: 'assignment',
            wawancara: 'record_voice_over',
            kesehatan: 'favorite',
            daftar: 'edit_note',
            lainnya: 'event',
        };
        return icons[jenis || ''] || 'event';
    };

    const getJenisColor = (jenis: string | null) => {
        const colors: Record<string, string> = {
            ujian: 'bg-error-container text-on-error-container',
            wawancara: 'bg-tertiary-container text-on-tertiary-container',
            kesehatan: 'bg-primary-container text-on-primary-container',
            daftar: 'bg-secondary-container text-on-secondary-container',
            lainnya: 'bg-surface-variant text-on-surface',
        };
        return colors[jenis || ''] || 'bg-surface-variant text-on-surface';
    };
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

    return (
        <div className="min-h-screen bg-background">
            <Head title="SMMPTP Poltekpar Palembang" />

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
                        <div className="text-h3 font-h3 text-primary">Poltekpar Palembang</div>
                    </div>
                    <div className="hidden md:flex gap-cs items-center">
                        <Link href="#" className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors">Beranda</Link>
                        <Link href="#informasi-seleksi" className="text-secondary font-body-md hover:text-primary-container transition-colors">Informasi</Link>
                        <Link href="/news" className="text-secondary font-body-md hover:text-primary-container transition-colors">Berita</Link>
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

            <main>
                <section className="relative overflow-hidden bg-surface-container-low pt-cxl pb-cxl md:pt-[120px] md:pb-[120px]">
                    <div className="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-cxl">
                        <div className="z-10">
                            <span className="inline-block px-sm py-base bg-secondary-container text-on-secondary-fixed font-label-md rounded-full mb-sm">Penerimaan Mahasiswa Baru 2024/2025</span>
                            <h1 className="font-h1 text-on-surface mb-cs">Wujudkan Karir Gemilang di Industri Hospitality Dunia</h1>
                            <p className="text-body-lg text-secondary mb-cl max-w-[500px]">Bergabunglah dengan Politeknik Pariwisata Palembang, institusi pendidikan pariwisata unggulan yang mencetak profesional berstandar internasional.</p>
                            <div className="flex flex-wrap gap-sm">
                                <Link href="/registrasi" className="bg-primary-container text-on-primary-container font-button text-button px-cxl py-cs rounded-lg shadow-md hover:opacity-90 transition-all">Daftar Sekarang</Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                {hero_image_url ? (
                                    <img src={hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-6xl text-secondary">article</span>
                                    </div>
                                )}
                            </div>
                            {accreditation_image_url && (
                                <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-cs rounded-xl shadow-lg border border-outline-variant hidden lg:block">
                                    <div className="flex items-center gap-sm">
                                        <img src={accreditation_image_url} alt="Akreditasi" className="w-16 h-16 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-h3 text-primary">A+ Akreditasi</p>
                                            <p className="font-label-md text-secondary">Institusi Terakreditasi Nasional</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!accreditation_image_url && (
                                <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-cs rounded-xl shadow-lg border border-outline-variant hidden lg:block">
                                    <div className="flex items-center gap-sm">
                                        <div className="bg-primary-container text-on-primary-container p-sm rounded-lg">
                                            <span className="material-symbols-outlined">verified</span>
                                        </div>
                                        <div>
                                            <p className="font-h3 text-primary">A+ Akreditasi</p>
                                            <p className="font-label-md text-secondary">Institusi Terakreditasi Nasional</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="informasi-seleksi" className="py-cxl bg-surface-bright">
                    <div className="max-w-[1200px] mx-auto px-gutter">
                        <div className="text-center mb-cxl">
                            <h2 className="font-h2 text-on-surface mb-xs">Informasi Seleksi</h2>
                            <p className="text-secondary font-body-md">Panduan lengkap mengenai jalur masuk dan persyaratan akademik.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-cs">
                            <div className="md:col-span-8 bg-surface-container-lowest p-cl rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <span className="material-symbols-outlined text-primary text-[40px] mb-sm">school</span>
                                        <h3 className="font-h3 text-on-surface mb-sm">SMM Poltekpar Palembang</h3>
                                        <p className="text-secondary font-body-md mb-cs">Seleksi Mandiri Masuk (SMM) merupakan jalur seleksi yang dikelola secara internal oleh Politeknik Pariwisata Palembang untuk menjaring talenta terbaik di bidang perhotelan dan pariwisata.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-4 bg-primary-container text-on-primary-container p-cl rounded-xl shadow-sm text-on-primary-container flex flex-col justify-center">
                                <span className="material-symbols-outlined text-[32px] mb-sm">event_available</span>
                                <h3 className="font-h3 mb-xs">Jadwal Seleksi</h3>
                                <div className="space-y-xs mb-cl">
                                    {jadwal.length > 0 ? jadwal.slice(0, 3).map((item) => (
                                        <div key={item.id} className="text-sm">
                                            <p className="font-medium">{item.nama_jadwal}</p>
                                            <p className="opacity-80">{formatDate(item.tgl_awal)}{item.tgl_akhir ? ` - ${formatDate(item.tgl_akhir)}` : ''}</p>
                                        </div>
                                    )) : (
                                        <p className="text-sm opacity-80">Belum ada jadwal.</p>
                                    )}
                                </div>
                                <Link href="/jadwal" className="font-button text-button flex items-center gap-xs hover:underline">
                                    Lihat Jadwal Lengkap <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            </div>
                        </div>

                        {jadwal.length > 0 && (
                            <div className="mt-cl">
                                <h3 className="font-h3 text-on-surface mb-cs">Jadwal Lengkap</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-cs">
                                    {jadwal.map((item) => (
                                        <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-start gap-sm mb-sm">
                                                <div className={`p-sm rounded-lg ${getJenisColor(item.jenis)}`}>
                                                    <span className="material-symbols-outlined">{getJenisIcon(item.jenis)}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-h3 text-on-surface leading-tight">{item.nama_jadwal}</h4>
                                                    {item.keterangan && <p className="text-secondary font-body-md mt-xs">{item.keterangan}</p>}
                                                </div>
                                            </div>
                                            <div className="space-y-xs text-label-md text-secondary">
                                                <div className="flex items-center gap-xs">
                                                    <span className="material-symbols-outlined text-base">calendar_today</span>
                                                    <span>{formatDate(item.tgl_awal)}{item.tgl_akhir ? ` - ${formatDate(item.tgl_akhir)}` : ''}</span>
                                                </div>
                                                {item.jam_awal && (
                                                    <div className="flex items-center gap-xs">
                                                        <span className="material-symbols-outlined text-base">schedule</span>
                                                        <span>{item.jam_awal} - {item.jam_akhir}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-cxl">
                    <div className="max-w-[1200px] mx-auto px-gutter">
                        <div className="flex justify-between items-end mb-cxl">
                            <div>
                                <h2 className="font-h2 text-on-surface mb-xs">Berita & Pengumuman</h2>
                                <p className="text-secondary font-body-md">Tetap terinformasi dengan update terbaru dari kampus.</p>
                            </div>
                            <button className="text-primary font-button text-button hover:underline hidden md:block">Lihat Semua Berita</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-cs">
                            {news.length > 0 ? news.map((item) => (
                                <Link key={item.id} href={`/news/${item.id}`} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer block">
                                    <div className="h-48 overflow-hidden">
                                        {item.img ? (
                                            <img src={`/storage/${item.img}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                                <span className="material-symbols-outlined text-6xl text-secondary">article</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-cs">
                                        <span className="text-label-md text-primary font-bold uppercase tracking-wider mb-xs inline-block">{item.post_name}</span>
                                        <h4 className="font-h3 text-on-surface mb-sm leading-tight">{item.title}</h4>
                                        <p className="text-secondary font-body-md line-clamp-2 mb-cs">{item.description.substring(0, 150)}...</p>
                                        <div className="flex justify-between items-center text-label-md text-outline">
                                            <span>{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-secondary col-span-full text-center py-cl">Belum ada berita.</p>
                            )}
                        </div>
                        <button className="w-full mt-cl border border-outline text-primary font-button text-button py-cs rounded-lg md:hidden">Lihat Semua Berita</button>
                    </div>
                </section>

                <section className="py-cxl px-gutter">
                    <div className="max-w-[1200px] mx-auto bg-inverse-surface text-inverse-on-surface rounded-2xl p-cl md:p-cxl text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="font-h2 mb-cs">Siap Memulai Perjalanan Anda?</h2>
                            <p className="font-body-lg mb-cl opacity-80 max-w-[700px] mx-auto">Jangan lewatkan kesempatan untuk menjadi bagian dari generasi pemimpin pariwisata masa depan. Daftar sekarang dan raih impianmu.</p>
                            <Link href="/registrasi" className="bg-primary-container text-on-primary-container font-button text-button px-cxl py-cs rounded-lg shadow-lg hover:bg-primary-fixed-dim transition-all">Mulai Pendaftaran Online</Link>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary opacity-10 rounded-full -ml-24 -mb-24"></div>
                    </div>
                </section>
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
