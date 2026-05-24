import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';
import RegistrationLink from '@/components/ui/registration-link';

export default function KebijakanPrivasi() {
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

    const sections = [
        {
            title: '1. Pengumpulan Informasi',
            content: 'Kami mengumpulkan informasi yang Anda berikan saat mendaftar, termasuk nama, email, nomor telepon, alamat, dan dokumen pendukung seperti ijazah dan foto. Informasi ini digunakan semata-mata untuk keperluan proses seleksi penerimaan mahasiswa baru.',
        },
        {
            title: '2. Penggunaan Informasi',
            content: 'Informasi yang dikumpulkan digunakan untuk: memproses pendaftaran Anda, menghubungi Anda terkait proses seleksi, menerbitkan kartu peserta ujian, mengumumkan hasil seleksi, dan keperluan administrasi akademik lainnya.',
        },
        {
            title: '3. Perlindungan Data',
            content: 'Kami menggunakan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses tidak sah, kehilangan, penyalahgunaan, atau pengungkapan. Data disimpan dalam sistem yang aman dan hanya dapat diakses oleh personel yang berwenang.',
        },
        {
            title: '4. Berbagi Informasi',
            content: 'Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga untuk tujuan komersial. Informasi hanya dapat dibagikan jika diwajibkan oleh hukum atau untuk keperluan proses seleksi yang sah.',
        },
        {
            title: '5. Retensi Data',
            content: 'Data pribadi Anda akan disimpan selama diperlukan untuk tujuan seleksi dan sesuai dengan kebijakan retensi data institusi. Setelah proses seleksi selesai, data akan diarsipkan atau dihapus sesuai ketentuan yang berlaku.',
        },
        {
            title: '6. Hak Anda',
            content: 'Anda memiliki hak untuk mengakses, memperbaiki, atau meminta penghapusan data pribadi Anda. Jika Anda ingin menggunakan hak ini, silakan hubungi kami melalui kontak yang tersedia di halaman Kontak Kami.',
        },
        {
            title: '7. Perubahan Kebijakan',
            content: 'Kebijakan privasi ini dapat diperbarui dari waktu ke waktu. Setiap perubahan akan diumumkan melalui halaman ini. Kami menyarankan Anda untuk secara berkala meninjau kebijakan privasi ini.',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Kebijakan Privasi - SMM Poltekpar Palembang" />

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

            <main className="max-w-[800px] mx-auto px-gutter py-cs md:py-cxl">
                <Link href="/" className="inline-flex items-center gap-xs text-primary font-button text-button mb-cl hover:underline text-sm md:text-base">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Beranda
                </Link>

                <div className="mb-cl md:mb-cxl">
                    <h1 className="text-2xl md:text-[40px] font-h1 text-on-surface mb-xs leading-tight">Kebijakan Privasi</h1>
                    <p className="text-sm md:text-body-lg text-secondary">Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
                    <p className="text-label-md text-secondary mt-sm">Terakhir diperbarui: Januari 2024</p>
                </div>

                <div className="space-y-cl">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-cl">
                            <h2 className="font-h3 text-on-surface mb-sm">{section.title}</h2>
                            <p className="text-body-md text-on-surface-variant leading-relaxed">{section.content}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-cxl p-cl bg-primary-container rounded-xl">
                    <p className="text-body-md text-on-primary-container">
                        Jika Anda memiliki pertanyaan atau kekhawatiran mengenai kebijakan privasi ini, silakan hubungi kami melalui halaman{' '}
                        <Link href="/kontak" className="font-bold underline">Kontak Kami</Link>.
                    </p>
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
                            <Link href="/kontak" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md text-sm">Kontak Kami</Link>
                            <Link href="/kebijakan-privasi" className="text-primary underline font-label-md text-sm">Kebijakan Privasi</Link>
                            <Link href="/syarat-ketentuan" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md text-sm">Syarat & Ketentuan</Link>
                        </div>
                        <p className="text-on-surface-variant font-label-md opacity-70 text-sm">© {new Date().getFullYear()} Seleksi Mandiri Masuk Poltekpar Palembang.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
