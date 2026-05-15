import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/settings', label: 'Pengaturan', icon: 'settings' },
    { href: '/admin/users', label: 'Manajemen User', icon: 'groups' },
    { label: 'Data Master', divider: true },
    { href: '/admin/prodi', label: 'Program Studi', icon: 'book' },
    { href: '/admin/periode', label: 'Periode', icon: 'calendar_today' },
    { href: '/admin/ruang', label: 'Ruang Ujian', icon: 'meeting_room' },
    { href: '/admin/jadwal', label: 'Jadwal', icon: 'schedule' },
    { href: '/admin/ujian', label: 'Jenis Ujian', icon: 'assignment' },
    { href: '/admin/tahap-seleksi', label: 'Tahap Seleksi', icon: 'layers' },
    { href: '/admin/survey', label: 'Sumber Informasi', icon: 'poll' },
    { href: '/admin/education', label: 'Jenjang Pendidikan', icon: 'school' },
    { label: 'Konten', divider: true },
    { href: '/admin/news', label: 'Berita', icon: 'newspaper' },
    { href: '/admin/documents', label: 'Dokumen Admin', icon: 'folder' },
    { label: 'Peserta', divider: true },
    { href: '/admin/peminat', label: 'Peminat', icon: 'group' },
    { href: '/admin/peserta', label: 'Peserta', icon: 'badge' },
    { label: 'Syarat', divider: true },
    { href: '/admin/syarat', label: 'Verifikasi Syarat Kelulusan', icon: 'fact_check', children: [
        { href: '/admin/syarat', label: 'Verifikasi Syarat', icon: 'fact_check' },
        { href: '/admin/syarat/rekap', label: 'Rekap Kelulusan', icon: 'bar_chart' },
    ]},
    { href: '/admin/syarat/kesehatan', label: 'Kesehatan', icon: 'favorite' },
    { label: 'Seleksi', divider: true },
    { href: '/admin/kriteria', label: 'Kriteria Kelulusan', icon: 'tune' },
    { href: '/admin/pembobotan', label: 'Pembobotan', icon: 'percent' },
    { href: '/admin/nilai', label: 'Nilai Ujian', icon: 'grade' },
    { href: '/admin/seleksi', label: 'Seleksi', icon: 'fact_check' },
    { href: '/admin/seleksi-pindah-prodi', label: 'Seleksi Pindah Prodi', icon: 'swap_horiz' },
    { href: '/admin/seleksi/rekap', label: 'Rekap Kelulusan', icon: 'bar_chart' },
    { href: '/admin/absensi', label: 'Absensi', icon: 'assignment_turned_in' },
    { href: '/admin/pembayaran/bsi', label: 'Pembayaran BSI', icon: 'payments' },
    { label: 'Pengaturan', divider: true },
    { href: '/admin/settings', label: 'Pengaturan Sistem', icon: 'settings' },
    { href: '/admin/settings/landing', label: 'Pengaturan Landing', icon: 'web' },
    { href: '/admin/settings/dashboard-member', label: 'Dashboard Member', icon: 'dashboard' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { url } = usePage() as any;
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

    const toggleMenu = (href: string) => {
        const newExpanded = new Set(expandedMenus);

        if (newExpanded.has(href)) {
            newExpanded.delete(href);
        } else {
            newExpanded.add(href);
        }

        setExpandedMenus(newExpanded);
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-inverse-surface/50 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-surface-container-lowest shadow-lg transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-outline-variant px-cs">
                    <Link href="/admin/dashboard" className="text-h3 font-h3 text-primary leading-none">
                        Admin Portal
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-on-surface-variant hover:text-on-surface"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="mt-sm space-y-xs overflow-y-auto px-sm pb-cs">
                    {menuItems.map((item, index) => {
                        if ('divider' in item && item.divider) {
                            return (
                                <div key={index} className="pt-sm mt-sm border-t border-outline-variant">
                                    <span className="px-sm text-xs font-semibold uppercase tracking-wider text-secondary">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        }

                        const hasChildren = 'children' in item && item.children;
                        const isActive = hasChildren
                            ? (item.children as any[]).some((child: any) => url.startsWith(child.href))
                            : url.startsWith((item as any).href);
                        const isExpanded = hasChildren && expandedMenus.has((item as any).href);

                        if (hasChildren) {
                            return (
                                <div key={(item as any).href}>
                                    <button
                                        onClick={() => toggleMenu((item as any).href)}
                                        className={`flex w-full items-center justify-between gap-xs rounded-lg px-sm py-2 text-label-md transition-colors ${
                                            isActive
                                                ? 'bg-primary-container text-on-primary-container font-bold'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <div className="flex items-center gap-xs">
                                            <span className="material-symbols-outlined text-lg">{(item as any).icon}</span>
                                            {(item as any).label}
                                        </div>
                                        <span className="material-symbols-outlined text-lg">
                                            {isExpanded ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                    {isExpanded && (
                                        <div className="ml-lg mt-1 space-y-1">
                                            {(item.children as any[]).map((child: any) => {
                                                const isChildActive = url.startsWith(child.href);

                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={`flex items-center gap-xs rounded-lg px-sm py-2 text-label-sm transition-colors ${
                                                            isChildActive
                                                                ? 'bg-primary-container/50 text-on-primary-container font-semibold'
                                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                                        }`}
                                                    >
                                                        <span className="material-symbols-outlined text-base">{child.icon}</span>
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={(item as any).href}
                                href={(item as any).href}
                                className={`flex items-center gap-xs rounded-lg px-sm py-2 text-label-md transition-colors ${
                                    isActive
                                        ? 'bg-primary-container text-on-primary-container font-bold'
                                        : 'text-on-surface-variant hover:bg-surface-variant'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">{(item as any).icon}</span>
                                {(item as any).label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
