import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';

interface NewsDetailProps {
    news: {
        id: number;
        title: string;
        description: string;
        post_name: string;
        news_type: string | null;
        img: string | null;
        pdf: string | null;
        published_at: string;
    };
}

export default function NewsDetail({ news }: NewsDetailProps) {
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title={`${news.title} - SMM Poltekpar Palembang`} />

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
                        <Link href="#" className="text-secondary font-body-md hover:text-primary-container transition-colors">Informasi</Link>
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

            <main className="max-w-[800px] mx-auto px-gutter py-cxl">
                <Link href="/" className="inline-flex items-center gap-xs text-primary font-button text-button mb-cl hover:underline">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Beranda
                </Link>

                <article>
                    <div className="mb-cl">
                        {news.news_type && (
                            <span className="inline-block px-sm py-xs bg-primary-container text-on-primary-container rounded-full text-label-sm font-bold uppercase tracking-wider mb-sm">
                                {news.news_type}
                            </span>
                        )}
                        <h1 className="font-h1 text-on-surface mb-sm">{news.title}</h1>
                        <time className="text-label-md text-secondary">
                            {formatDate(news.published_at)}
                        </time>
                    </div>

                    {news.img && (
                        <div className="mb-cl">
                            <img
                                src={`/storage/${news.img}`}
                                alt={news.title}
                                className="w-full rounded-xl object-cover max-h-[400px]"
                            />
                        </div>
                    )}

                    <div className="prose max-w-none">
                        <p className="text-body-lg text-on-surface whitespace-pre-wrap leading-relaxed">{news.description}</p>
                    </div>

                    {news.pdf && (
                        <div className="mt-cl pt-cl border-t border-outline-variant">
                            <h3 className="font-h3 text-on-surface mb-sm">Lampiran</h3>
                            <a
                                href={`/storage/${news.pdf}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-sm rounded-lg bg-primary-container px-cs py-sm text-on-primary-container hover:opacity-90 transition-all"
                            >
                                <span className="material-symbols-outlined">picture_as_pdf</span>
                                Lihat / Download PDF
                            </a>
                        </div>
                    )}
                </article>
            </main>

            <footer className="bg-surface-container-highest border-t border-outline-variant">
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-cl max-w-[1200px] mx-auto">
                    <div className="mb-cl md:mb-0">
                        <div className="text-lg md:text-h3 font-h3 text-on-surface mb-xs">Politeknik Pariwisata Palembang</div>
                        <p className="text-on-surface-variant font-label-md max-w-[350px] text-sm">Kampus Perguruan tinggi vokasi di bidang keparwisataan yang berkomitmen untuk menjadi perguruan tinggi yang berstandar international, unggul, dan berkepribadian indonesia.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-sm">
                        <div className="flex gap-cs mb-xs">
                            <Link href="/kontak" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Kontak Kami</Link>
                            <Link href="/kebijakan-privasi" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Kebijakan Privasi</Link>
                            <Link href="/syarat-ketentuan" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Syarat & Ketentuan</Link>
                        </div>
                        <p className="text-on-surface-variant font-label-md opacity-70 text-sm">© {new Date().getFullYear()} Seleksi Mandiri Masuk Poltekpar Palembang.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
