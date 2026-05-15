import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';

export default function Kontak() {
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

    return (
        <div className="min-h-screen bg-background">
            <Head title="Kontak Kami - SMMPTP Poltekpar Palembang" />

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

            <main className="max-w-[1000px] mx-auto px-gutter py-cxl">
                <Link href="/" className="inline-flex items-center gap-xs text-primary font-button text-button mb-cl hover:underline">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Beranda
                </Link>

                <div className="mb-cxl">
                    <h1 className="font-h1 text-on-surface mb-xs">Kontak Kami</h1>
                    <p className="text-body-lg text-secondary">Hubungi kami untuk informasi lebih lanjut mengenai seleksi masuk Poltekpar Palembang.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-cs mb-cxl">
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                        <div className="flex items-start gap-sm mb-sm">
                            <div className="p-sm bg-primary-container rounded-lg">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                            </div>
                            <div>
                                <h3 className="font-h3 text-on-surface mb-xs">Alamat</h3>
                                <p className="text-body-md text-on-surface-variant">Jl. Bandara Sultan Mahmud Badaruddin II, Kemuning, Kota Palembang, Sumatera Selatan 30151</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                        <div className="flex items-start gap-sm mb-sm">
                            <div className="p-sm bg-primary-container rounded-lg">
                                <span className="material-symbols-outlined text-primary">phone</span>
                            </div>
                            <div>
                                <h3 className="font-h3 text-on-surface mb-xs">Telepon</h3>
                                <p className="text-body-md text-on-surface-variant">(0711) 123-4567</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                        <div className="flex items-start gap-sm mb-sm">
                            <div className="p-sm bg-primary-container rounded-lg">
                                <span className="material-symbols-outlined text-primary">email</span>
                            </div>
                            <div>
                                <h3 className="font-h3 text-on-surface mb-xs">Email</h3>
                                <p className="text-body-md text-on-surface-variant">pendaftaran@poltekpar-palembang.ac.id</p>
                            </div>
                        </div>
                    </div>

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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.016!2d104.664!3d-2.916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNTQnNTcuNiJTIDEwNMKwMzknNTAuNCJF!5e0!3m2!1sid!2sid!4v1"
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
                        <div className="text-h3 font-h3 text-on-surface mb-xs">Poltekpar Palembang</div>
                        <p className="text-on-surface-variant font-label-md max-w-[300px]">Kampus Unggulan Pariwisata Indonesia Timur. Mencetak profesional hospitality dunia.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-sm">
                        <div className="flex gap-cs mb-xs">
                            <Link href="/kontak" className="text-primary underline font-label-md">Kontak Kami</Link>
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
