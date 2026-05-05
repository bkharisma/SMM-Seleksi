import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard, Users, BookOpen, Calendar, Home, Clock, FileText,
    Layers, ClipboardList, GraduationCap, Newspaper, FolderOpen,
    UserCheck, Heart, Target, Award, CheckCircle, BarChart3,
    CreditCard, Settings, LogOut, Bell, Menu, X, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

interface MenuGroup {
    label: string;
    icon: React.ReactNode;
    items: MenuItem[];
}

const menuGroups: (MenuItem | MenuGroup)[] = [
    {
        href: '/admin/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="h-4 w-4" />,
    } as MenuItem,
    {
        label: 'Data Master',
        icon: <BookOpen className="h-4 w-4" />,
        items: [
            { href: '/admin/prodi', label: 'Program Studi', icon: <BookOpen className="h-4 w-4" /> },
            { href: '/admin/periode', label: 'Periode', icon: <Calendar className="h-4 w-4" /> },
            { href: '/admin/ruang', label: 'Ruang Ujian', icon: <Home className="h-4 w-4" /> },
            { href: '/admin/jadwal', label: 'Jadwal', icon: <Clock className="h-4 w-4" /> },
            { href: '/admin/ujian', label: 'Jenis Ujian', icon: <FileText className="h-4 w-4" /> },
            { href: '/admin/tahap-seleksi', label: 'Tahap Seleksi', icon: <Layers className="h-4 w-4" /> },
            { href: '/admin/survey', label: 'Sumber Informasi', icon: <ClipboardList className="h-4 w-4" /> },
            { href: '/admin/education', label: 'Jenjang Pendidikan', icon: <GraduationCap className="h-4 w-4" /> },
        ],
    } as MenuGroup,
    {
        label: 'Konten',
        icon: <Newspaper className="h-4 w-4" />,
        items: [
            { href: '/admin/news', label: 'Berita', icon: <Newspaper className="h-4 w-4" /> },
            { href: '/admin/documents', label: 'Dokumen', icon: <FolderOpen className="h-4 w-4" /> },
        ],
    } as MenuGroup,
    {
        label: 'Peserta',
        icon: <Users className="h-4 w-4" />,
        items: [
            { href: '/admin/peminat', label: 'Peminat', icon: <Users className="h-4 w-4" /> },
            { href: '/admin/peserta', label: 'Peserta', icon: <UserCheck className="h-4 w-4" /> },
        ],
    } as MenuGroup,
    {
        label: 'Dokumen',
        icon: <FileText className="h-4 w-4" />,
        items: [
            { href: '/admin/upload/raport', label: 'Verifikasi Raport', icon: <FileText className="h-4 w-4" /> },
            { href: '/admin/upload/kesehatan', label: 'Verifikasi Kesehatan', icon: <Heart className="h-4 w-4" /> },
        ],
    } as MenuGroup,
    {
        label: 'Seleksi',
        icon: <Target className="h-4 w-4" />,
        items: [
            { href: '/admin/kriteria', label: 'Kriteria Kelulusan', icon: <Target className="h-4 w-4" /> },
            { href: '/admin/ujian', label: 'Nilai Ujian', icon: <Award className="h-4 w-4" /> },
            { href: '/admin/seleksi', label: 'Seleksi', icon: <CheckCircle className="h-4 w-4" /> },
            { href: '/admin/seleksi/rekap', label: 'Rekap Kelulusan', icon: <BarChart3 className="h-4 w-4" /> },
            { href: '/admin/absensi', label: 'Absensi', icon: <ClipboardList className="h-4 w-4" /> },
            { href: '/admin/pembayaran/bsi', label: 'Pembayaran BSI', icon: <CreditCard className="h-4 w-4" /> },
        ],
    } as MenuGroup,
    {
        label: 'Pengaturan',
        icon: <Settings className="h-4 w-4" />,
        items: [
            { href: '/admin/users', label: 'Manajemen User', icon: <Users className="h-4 w-4" /> },
            { href: '/admin/settings', label: 'Pengaturan Sistem', icon: <Settings className="h-4 w-4" /> },
        ],
    } as MenuGroup,
];

export default function TopNav() {
    const { url } = usePage();
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileGroup, setMobileGroup] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenGroup(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function isActive(href: string) {
        return url.startsWith(href);
    }

    function isGroupActive(group: MenuGroup) {
        return group.items.some((item) => isActive(item.href));
    }

    return (
        <nav ref={navRef} className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span className="hidden sm:inline">SMMPTP Admin</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex lg:items-center lg:gap-1">
                        {menuGroups.map((entry, idx) => {
                            if ('items' in entry) {
                                const group = entry as MenuGroup;
                                const active = isGroupActive(group);
                                return (
                                    <div key={idx} className="relative">
                                        <button
                                            onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                                            className={cn(
                                                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                                active
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                                            )}
                                        >
                                            {group.icon}
                                            <span>{group.label}</span>
                                            <ChevronDown className={cn('h-3 w-3 transition-transform', openGroup === group.label && 'rotate-180')} />
                                        </button>
                                        {openGroup === group.label && (
                                            <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setOpenGroup(null)}
                                                        className={cn(
                                                            'flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                                                            isActive(item.href)
                                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700',
                                                        )}
                                                    >
                                                        <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            const item = entry as MenuItem;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side: notifications + user */}
                    <div className="flex items-center gap-3">
                        <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                0
                            </span>
                        </button>
                        <UserDropdown />
                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="text-gray-500 hover:text-gray-700 lg:hidden dark:text-gray-400"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="max-h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-2">
                        {menuGroups.map((entry, idx) => {
                            if ('items' in entry) {
                                const group = entry as MenuGroup;
                                const active = isGroupActive(group);
                                return (
                                    <div key={idx} className="py-1">
                                        <button
                                            onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
                                            className={cn(
                                                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                                active
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                                            )}
                                        >
                                            {group.icon}
                                            <span className="flex-1 text-left">{group.label}</span>
                                            <ChevronDown className={cn('h-4 w-4 transition-transform', mobileGroup === group.label && 'rotate-180')} />
                                        </button>
                                        {mobileGroup === group.label && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={cn(
                                                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                                                            isActive(item.href)
                                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
                                                        )}
                                                    >
                                                        {item.icon}
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            const item = entry as MenuItem;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                                    )}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}

function UserDropdown() {
    const { auth } = usePage().props as any;
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative hidden sm:block">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {(auth?.user?.name ?? 'A').charAt(0)}
                </div>
                <span className="hidden md:inline">{auth?.user?.name}</span>
            </button>
            {open && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{auth?.user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{auth?.user?.email}</p>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
}
