import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';
import RegistrationLink from '@/components/ui/registration-link';

interface KontakProps {
    settings: {
        nama_ptp: string;
        alamat_ptp: string;
        telepon_ptp: string;
        email_ptp: string;
        website_ptp: string;
    };
}

export default function Kontak({ settings }: KontakProps) {
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
            <Head title="Kontak Kami - SMM Poltekpar Palembang" />

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
                        <Link href="/" className="text-lg md:text-h3 font-h3 text-primary truncate">{settings.nama_ptp || 'Poltekpar Palembang'}</Link>
                    </div>
                    <div className="hidden md:flex gap-cs items-center">
                        <Link href="/" className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors">Beranda</Link>
                        <Link href="/#informasi-seleksi" className="text-secondary font-body-md hover:text-primary-container transition-colors">Informasi</Link>
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
                            <Link href="/" className="flex items-center gap-sm px-sm py-2 text-primary font-medium rounded-lg bg-primary-container/10" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">home</span> Beranda
                            </Link>
                            <Link href="/#informasi-seleksi" className="flex items-center gap-sm px-sm py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="material-symbols-outlined text-lg">info</span> Informasi
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

            <main className="max-w-[1000px] mx-auto px-gutter py-cs md:py-cxl">
                <Link href="/" className="inline-flex items-center gap-xs text-primary font-button text-button mb-cl hover:underline text-sm md:text-base">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Beranda
                </Link>

                <div className="mb-cl md:mb-cxl">
                    <h1 className="text-2xl md:text-[40px] font-h1 text-on-surface mb-xs leading-tight">Kontak Kami</h1>
                    <p className="text-sm md:text-body-lg text-secondary">Hubungi kami untuk informasi lebih lanjut mengenai seleksi masuk {settings.nama_ptp || 'Poltekpar Palembang'}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-cs mb-cxl">
                    {settings.alamat_ptp && (
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                            <div className="flex items-start gap-sm mb-sm">
                                <div className="p-sm bg-primary-container rounded-lg">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                </div>
                                <div>
                                    <h3 className="font-h3 text-on-surface mb-xs">Alamat</h3>
                                    <p className="text-body-md text-on-surface-variant">{settings.alamat_ptp}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {settings.telepon_ptp && (
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                            <div className="flex items-start gap-sm mb-sm">
                                <div className="p-sm bg-primary-container rounded-lg">
                                    <span className="material-symbols-outlined text-primary">phone</span>
                                </div>
                                <div>
                                    <h3 className="font-h3 text-on-surface mb-xs">Telepon</h3>
                                    <p className="text-body-md text-on-surface-variant">{settings.telepon_ptp}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {settings.email_ptp && (
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                            <div className="flex items-start gap-sm mb-sm">
                                <div className="p-sm bg-primary-container rounded-lg">
                                    <span className="material-symbols-outlined text-primary">email</span>
                                </div>
                                <div>
                                    <h3 className="font-h3 text-on-surface mb-xs">Email</h3>
                                    <p className="text-body-md text-on-surface-variant">{settings.email_ptp}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                        <div className="flex items-start gap-sm mb-sm">
                            <div className="p-sm bg-primary-container rounded-lg">
                                <span className="material-symbols-outlined text-primary">schedule</span>
                            </div>
                            <div>
                                <h3 className="font-h3 text-on-surface mb-xs">Jam Operasional</h3>
                                <p className="text-body-md text-on-surface-variant">Senin - Jumat: 08.00 - 16.00 WIB</p>
                                <p className="text-body-md text-on-surface-variant">Sabtu - Minggu: Tutup</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                    <h3 className="font-h3 text-on-surface mb-sm">Lokasi Kami</h3>
                    <div className="aspect-video rounded-lg overflow-hidden bg-surface-container flex items-center justify-center">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15937.200338891447!2d104.784986!3d-3.013778!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b9da2ffffffff%3A0xb2a0e2068605b02d!2sPoltekpar%20Palembang!5e0!3m2!1sen!2sus!4v1778883228755!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="min-h-[300px]"
                        />
                    </div>
                </div>
            </main>

            <footer className="bg-surface-container-highest border-t border-outline-variant">
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-cl max-w-[1200px] mx-auto">
                    <div className="mb-cl md:mb-0">
                        <div className="text-lg md:text-h3 font-h3 text-on-surface mb-xs">Politeknik Pariwisata Palembang</div>
                        <p className="text-on-surface-variant font-label-md max-w-[350px] text-sm">Kampus Perguruan tinggi vokasi di bidang keparwisataan yang berkomitmen untuk menjadi perguruan tinggi yang berstandar international, unggul, dan berkepribadian indonesia.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-sm">
                        <div className="flex flex-wrap justify-center gap-cs mb-xs">
                            <Link href="/kontak" className="text-primary underline font-label-md text-sm">Kontak Kami</Link>
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
