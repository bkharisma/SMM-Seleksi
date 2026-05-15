import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';

export default function KebijakanPrivasi() {
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
            <Head title="Kebijakan Privasi - SMMPTP Poltekpar Palembang" />

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
                    <h1 className="font-h1 text-on-surface mb-xs">Kebijakan Privasi</h1>
                    <p className="text-body-lg text-secondary">Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
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
                        <div className="text-h3 font-h3 text-on-surface mb-xs">Poltekpar Palembang</div>
                        <p className="text-on-surface-variant font-label-md max-w-[300px]">Kampus Unggulan Pariwisata Indonesia Timur. Mencetak profesional hospitality dunia.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-sm">
                        <div className="flex gap-cs mb-xs">
                            <Link href="/kontak" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Kontak Kami</Link>
                            <Link href="/kebijakan-privasi" className="text-primary underline font-label-md">Kebijakan Privasi</Link>
                            <Link href="/syarat-ketentuan" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Syarat & Ketentuan</Link>
                        </div>
                        <p className="text-on-surface-variant font-label-md opacity-70">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
