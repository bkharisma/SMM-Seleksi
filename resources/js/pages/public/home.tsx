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
    tahun_akademik: string;
}

export default function Home({ news, jadwal, hero_image_url, accreditation_image_url, tahun_akademik }: HomeProps) {
    const { app } = usePage().props as any;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const formatDate = (date: string | null) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getJenisIcon = (jenis: string | null) => {
        const icons: Record<string, string> = {
            ujian: 'assignment',
            wawancara: 'record_voice_over',
            kesehatan: 'favorite',
            daftar: 'edit_note',
            pengumuman: 'campaign',
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
            pengumuman: 'bg-inverse-surface text-inverse-on-surface',
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

    return (
        <div className="min-h-screen bg-background">
            <Head title="SMM Poltekpar Palembang" />

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
                        <Link href="#" className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors">Beranda</Link>
                        <Link href="#informasi-seleksi" className="text-secondary font-body-md hover:text-primary-container transition-colors">Informasi</Link>
                        <Link href="#berita" className="text-secondary font-body-md hover:text-primary-container transition-colors">Berita</Link>
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

                        <div className="hidden md:flex items-center gap-sm">
                            <Link href="/login-member" className="font-button text-button px-sm py-xs text-primary hover:bg-surface-container transition-colors">Masuk</Link>
                            <Link href="/registrasi" className="font-button text-button px-cs py-xs bg-primary-container text-on-primary-container rounded-lg shadow-sm hover:opacity-90 transition-all">Daftar</Link>
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
                            <Link href="#" className="flex items-center gap-sm px-sm py-2 text-primary font-medium rounded-lg bg-primary-container/10" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">home</span>
                                Beranda
                            </Link>
                            <Link href="#informasi-seleksi" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">info</span>
                                Informasi
                            </Link>
                            <Link href="#berita" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">newspaper</span>
                                Berita
                            </Link>
                            <div className="border-t border-outline-variant pt-sm mt-sm">
                                <Link href="/login-member" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="material-symbols-outlined text-lg">login</span>
                                    Masuk
                                </Link>
                                <Link href="/registrasi" className="flex items-center justify-center gap-sm px-sm py-2 mt-xs bg-primary-container text-on-primary-container font-medium rounded-lg shadow-sm hover:opacity-90 transition-all" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="material-symbols-outlined text-lg">person_add</span>
                                    Daftar Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main>
                <section className="relative overflow-hidden bg-surface-container-low pt-cs pb-cs md:pt-cxl md:pb-cxl">
                    <div className="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-cl md:gap-cxl">
                        <div className="z-10">
                            <span className="inline-block px-sm py-xs text-xs md:text-sm bg-secondary-container text-on-secondary-fixed font-label-md rounded-full mb-sm">Penerimaan Mahasiswa Baru {tahun_akademik}</span>
                            <h1 className="text-2xl md:text-[40px] font-h1 text-on-surface mb-cs leading-tight">Wujudkan Karir Gemilang di Industri Hospitality Dunia</h1>
                            <p className="text-sm md:text-body-lg text-secondary mb-cl max-w-[500px]">Bergabunglah dengan Politeknik Pariwisata Palembang, institusi pendidikan pariwisata unggulan yang mencetak profesional berstandar internasional.</p>
                            <div className="flex flex-wrap gap-sm">
                                <Link href="/registrasi" className="inline-block bg-primary-container text-on-primary-container font-button text-button px-sm md:px-cxl py-xs md:py-cs rounded-lg shadow-md hover:opacity-90 transition-all">Daftar Sekarang</Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                {hero_image_url ? (
                                    <img src={hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl md:text-6xl text-secondary">article</span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-surface-container-lowest/95 backdrop-blur-sm p-xs md:p-sm rounded-xl shadow-lg border border-outline-variant">
                                <div className="flex items-center gap-xs mb-xs pb-xs border-b border-outline-variant">
                                    {accreditation_image_url ? (
                                        <img src={accreditation_image_url} alt="Akreditasi" className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover" />
                                    ) : (
                                        <div className="bg-primary-container text-on-primary-container p-xs rounded-lg shrink-0">
                                            <span className="material-symbols-outlined text-base">verified</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-primary leading-tight">Terakreditasi Baik Sekali</p>
                                        <p className="text-[10px] md:text-xs text-secondary hidden sm:block">Poltekpar Palembang oleh BAN-PT</p>
                                    </div>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-primary mb-xs">4 Prodi Terakreditasi Unggul</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-xs">
                                    <div className="flex items-center gap-xs">
                                        <div className="bg-primary-container text-on-primary-container p-xs rounded-lg shrink-0">
                                            <span className="material-symbols-outlined text-sm">event</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-medium text-on-surface leading-tight">D4 PKA</p>
                                            <p className="text-[9px] text-primary font-label-sm">Unggul</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-xs">
                                        <div className="bg-secondary-container text-on-secondary-container p-xs rounded-lg shrink-0">
                                            <span className="material-symbols-outlined text-sm">hotel</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-medium text-on-surface leading-tight">D3 DIK</p>
                                            <p className="text-[9px] text-secondary font-label-sm">Unggul</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-xs">
                                        <div className="bg-tertiary-container text-on-tertiary-container p-xs rounded-lg shrink-0">
                                            <span className="material-symbols-outlined text-sm">restaurant</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-medium text-on-surface leading-tight">D3 TAH</p>
                                            <p className="text-[9px] text-tertiary font-label-sm">Unggul</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-xs">
                                        <div className="bg-error-container text-on-error-container p-xs rounded-lg shrink-0">
                                            <span className="material-symbols-outlined text-sm">ramen_dining</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-medium text-on-surface leading-tight">D3 SKU</p>
                                            <p className="text-[9px] text-error font-label-sm">Unggul</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="informasi-seleksi" className="py-cs md:py-cxl bg-surface-bright">
                    <div className="max-w-[1200px] mx-auto px-gutter">
                        <div className="text-center mb-cl md:mb-cxl">
                            <h2 className="text-xl md:text-[32px] font-h2 text-on-surface mb-xs leading-tight">Informasi Seleksi</h2>
                            <p className="text-sm md:text-body-md text-secondary">Informasi jadwal pelaksanaan seleksi masuk Politeknik Pariwisata Palembang.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-cs">
                            <div className="md:col-span-8 bg-surface-container-lowest p-cl rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <span className="material-symbols-outlined text-primary text-[32px] md:text-[40px] mb-sm">school</span>
                                        <h3 className="font-h3 text-on-surface mb-sm">SMM Poltekpar Palembang</h3>
                                        <p className="text-sm md:text-body-md text-secondary mb-cs">Seleksi Mandiri Masuk (SMM) merupakan jalur seleksi yang dikelola secara internal oleh Politeknik Pariwisata Palembang untuk menjaring talenta terbaik di bidang perhotelan dan pariwisata.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-4 bg-primary-container text-on-primary-container p-cl rounded-xl shadow-sm flex flex-col justify-center">
                                <span className="material-symbols-outlined text-[28px] md:text-[32px] mb-sm">event_available</span>
                                <h3 className="font-h3 mb-xs">Jadwal Seleksi</h3>
                                <div className="space-y-xs mb-cl">
                                    {jadwal.length > 0 ? jadwal.slice(0, 3).map((item) => (
                                        <div key={item.id} className="text-xs md:text-sm">
                                            <p className="font-medium">{item.nama_jadwal}</p>
                                            <p className="opacity-80">{formatDate(item.tgl_awal)}{item.tgl_akhir ? ` - ${formatDate(item.tgl_akhir)}` : ''}</p>
                                        </div>
                                    )) : (
                                        <p className="text-xs md:text-sm opacity-80">Belum ada jadwal.</p>
                                    )}
                                </div>
                                <Link href="/jadwal" className="font-button text-button flex items-center gap-xs hover:underline text-sm md:text-base">
                                    Lihat Jadwal Lengkap <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </Link>
                            </div>
                        </div>

                        {jadwal.length > 0 && (
                            <div className="mt-cl">
                                <h3 className="text-lg md:text-[24px] font-h3 text-on-surface mb-cs">Jadwal Lengkap</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-cs">
                                    {jadwal.map((item) => (
                                        <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-sm md:p-cl shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-start gap-sm mb-sm">
                                                <div className={`p-sm rounded-lg shrink-0 ${getJenisColor(item.jenis)}`}>
                                                    <span className="material-symbols-outlined text-lg">{getJenisIcon(item.jenis)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-h3 text-on-surface leading-tight truncate">{item.nama_jadwal}</h4>
                                                    {item.keterangan && <p className="text-secondary font-body-md mt-xs text-sm line-clamp-2">{item.keterangan}</p>}
                                                </div>
                                            </div>
                                            <div className="space-y-xs text-label-md text-secondary text-sm">
                                                <div className="flex items-center gap-xs">
                                                    <span className="material-symbols-outlined text-base shrink-0">calendar_today</span>
                                                    <span className="truncate">{formatDate(item.tgl_awal)}{item.tgl_akhir ? ` - ${formatDate(item.tgl_akhir)}` : ''}</span>
                                                </div>
                                                {item.jam_awal && (
                                                    <div className="flex items-center gap-xs">
                                                        <span className="material-symbols-outlined text-base shrink-0">schedule</span>
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

                <section id="berita" className="py-cs md:py-cxl">
                    <div className="max-w-[1200px] mx-auto px-gutter">
                        <div className="mb-cl md:mb-cxl">
                            <h2 className="text-xl md:text-[32px] font-h2 text-on-surface mb-xs leading-tight">Berita & Pengumuman</h2>
                            <p className="text-sm md:text-body-md text-secondary">Tetap terinformasi dengan update terbaru dari kampus.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-cs">
                            {news.length > 0 ? news.map((item) => (
                                <Link key={item.id} href={`/news/${item.id}`} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer block">
                                    <div className="h-36 md:h-48 overflow-hidden">
                                        {item.img ? (
                                            <img src={`/storage/${item.img}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl md:text-6xl text-secondary">article</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-sm md:p-cs">
                                        <span className="text-label-md text-primary font-bold uppercase tracking-wider mb-xs inline-block text-xs md:text-sm">{item.post_name}</span>
                                        <h4 className="font-h3 text-on-surface mb-sm leading-tight text-sm md:text-base">{item.title}</h4>
                                        <p className="text-secondary font-body-md line-clamp-2 mb-cs text-xs md:text-sm">{item.description.substring(0, 150)}...</p>
                                        <div className="flex justify-between items-center text-label-md text-outline text-xs md:text-sm">
                                            <span>{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-secondary col-span-full text-center py-cl">Belum ada berita.</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-cs md:py-cxl px-gutter">
                    <div className="max-w-[1200px] mx-auto bg-inverse-surface text-inverse-on-surface rounded-2xl p-cl md:p-cxl text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-xl md:text-[32px] font-h2 mb-cs leading-tight">Siap Memulai Perjalanan Anda?</h2>
                            <p className="text-sm md:text-body-lg mb-cl opacity-80 max-w-[700px] mx-auto">Jangan lewatkan kesempatan untuk menjadi bagian dari generasi pemimpin pariwisata masa depan. Daftar sekarang dan raih impianmu.</p>
                            <Link href="/registrasi" className="inline-block bg-primary-container text-on-primary-container font-button text-button px-sm md:px-cxl py-xs md:py-cs rounded-lg shadow-lg hover:bg-primary-fixed-dim transition-all">Mulai Pendaftaran Online</Link>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary opacity-10 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-tertiary opacity-10 rounded-full -ml-16 md:-ml-24 -mb-16 md:-mb-24"></div>
                    </div>
                </section>
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
                        <p className="text-on-surface-variant font-label-md opacity-70 text-sm">© {new Date().getFullYear()} Seleksi Mandiri Masuk Poltekpar Palembang.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
