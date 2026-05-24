import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';
import RegistrationLink from '@/components/ui/registration-link';

interface NewsPageProps {
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
}

export default function News({ news }: NewsPageProps) {
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

    return (
        <div className="min-h-screen bg-background">
            <Head title="Berita & Pengumuman - SMM Poltekpar Palembang" />

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
                        <Link href="/#informasi-seleksi" className="text-secondary font-body-md hover:text-primary-container transition-colors">Informasi</Link>
                        <Link href="/news" className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors">Berita</Link>
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
                            <Link href="/#informasi-seleksi" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">info</span> Informasi
                            </Link>
                            <Link href="/news" className="flex items-center gap-sm px-sm py-2 text-primary font-medium rounded-lg bg-primary-container/10" onClick={() => setMobileMenuOpen(false)}>
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

            <main>
                <section className="py-cs md:py-cxl bg-surface-bright">
                    <div className="max-w-[1200px] mx-auto px-gutter">
                        <div className="text-center mb-cl md:mb-cxl">
                            <h1 className="text-2xl md:text-[40px] font-h1 text-on-surface mb-xs leading-tight">Berita & Pengumuman</h1>
                            <p className="text-sm md:text-body-md text-secondary">Tetap terinformasi dengan update terbaru dari kampus.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-cs">
                            {news.length > 0 ? news.map((item) => (
                                <Link key={item.id} href={`/news/${item.id}`} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer block">
                                    <div className="aspect-video overflow-hidden bg-surface-container">
                                        {item.img ? (
                                            <img src={`/storage/${item.img}`} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
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
                            <RegistrationLink className="inline-block bg-primary-container text-on-primary-container font-button text-button px-sm md:px-cxl py-xs md:py-cs rounded-lg shadow-lg hover:bg-primary-fixed-dim transition-all">Mulai Pendaftaran Online</RegistrationLink>
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
