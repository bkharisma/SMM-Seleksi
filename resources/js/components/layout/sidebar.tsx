import { Link, usePage } from '@inertiajs/react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/settings', label: 'Pengaturan', icon: 'settings' },
    { href: '/admin/users', label: 'Manajemen User', icon: 'users' },
    { label: 'Data Master', divider: true },
    { href: '/admin/prodi', label: 'Program Studi', icon: 'book' },
    { href: '/admin/periode', label: 'Periode', icon: 'calendar' },
    { href: '/admin/ruang', label: 'Ruang Ujian', icon: 'home' },
    { href: '/admin/jadwal', label: 'Jadwal', icon: 'clock' },
    { href: '/admin/ujian', label: 'Jenis Ujian', icon: 'file-text' },
    { href: '/admin/tahap-seleksi', label: 'Tahap Seleksi', icon: 'layers' },
    { href: '/admin/survey', label: 'Sumber Informasi', icon: 'survey' },
    { href: '/admin/education', label: 'Jenjang Pendidikan', icon: 'school' },
    { label: 'Konten', divider: true },
    { href: '/admin/news', label: 'Berita', icon: 'newspaper' },
    { href: '/admin/documents', label: 'Dokumen', icon: 'folder' },
    { label: 'Peserta', divider: true },
    { href: '/admin/peminat', label: 'Peminat', icon: 'users' },
    { href: '/admin/peserta', label: 'Peserta', icon: 'user-check' },
    { label: 'Dokumen', divider: true },
    { href: '/admin/upload/raport', label: 'Verifikasi Raport', icon: 'file-text' },
    { href: '/admin/upload/kesehatan', label: 'Verifikasi Kesehatan', icon: 'heart' },
    { label: 'Seleksi', divider: true },
    { href: '/admin/kriteria', label: 'Kriteria Kelulusan', icon: 'target' },
    { href: '/admin/nilai', label: 'Nilai Ujian', icon: 'award' },
    { href: '/admin/seleksi', label: 'Seleksi', icon: 'check-circle' },
    { href: '/admin/seleksi/rekap', label: 'Rekap Kelulusan', icon: 'bar-chart' },
    { href: '/admin/absensi', label: 'Absensi', icon: 'clipboard' },
    { href: '/admin/pembayaran/bsi', label: 'Pembayaran BSI', icon: 'credit-card' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { url } = usePage();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out dark:bg-gray-800 lg:static lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b px-6 dark:border-gray-700">
                    <Link href="/admin/dashboard" className="text-lg font-bold text-gray-900 dark:text-white">
                        SMMPTP Admin
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="mt-4 space-y-1 overflow-y-auto px-3 pb-4">
                    {menuItems.map((item, index) => {
                        if ('divider' in item && item.divider) {
                            return (
                                <div key={index} className="my-3 border-t border-gray-200 pt-2 dark:border-gray-700">
                                    <span className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        }

                        const isActive = url.startsWith((item as any).href);
                        return (
                            <Link
                                key={(item as any).href}
                                href={(item as any).href}
                                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                {(item as any).label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
