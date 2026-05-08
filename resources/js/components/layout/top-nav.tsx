import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { getStoredTheme, setStoredTheme, toggleTheme, getEffectiveTheme } from '@/lib/theme';

interface NavItem {
    href?: string;
    label: string;
    icon?: string;
    children?: NavItem[];
}

const menuGroups: { title?: string; items: NavItem[]; icon?: string }[] = [
    {
        items: [
            { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
        ],
    },
    {
        title: 'Data Master',
        icon: 'database',
        items: [
            { href: '/admin/prodi', label: 'Program Studi', icon: 'book' },
            { href: '/admin/periode', label: 'Periode', icon: 'calendar_today' },
            { href: '/admin/ruang', label: 'Ruang Ujian', icon: 'home' },
            { href: '/admin/jadwal', label: 'Jadwal', icon: 'schedule' },
            { href: '/admin/ujian', label: 'Jenis Ujian', icon: 'description' },
            { href: '/admin/tahap-seleksi', label: 'Tahap Seleksi', icon: 'layers' },
            { href: '/admin/survey', label: 'Sumber Informasi', icon: 'poll' },
            { href: '/admin/education', label: 'Jenjang Pendidikan', icon: 'school' },
            { href: '/admin/jalur-pendaftaran', label: 'Jalur Pendaftaran', icon: 'format_list_bulleted' },
        ],
    },
    {
        title: 'Konten',
        icon: 'article',
        items: [
            { href: '/admin/news', label: 'Berita', icon: 'newspaper' },
            { href: '/admin/documents', label: 'Dokumen', icon: 'folder' },
        ],
    },
    {
        title: 'Pendaftar',
        icon: 'groups',
        items: [
            { href: '/admin/pendaftar', label: 'Data Pendaftar', icon: 'groups' },
        ],
    },
    {
        title: 'Dokumen',
        icon: 'description',
        items: [
            { href: '/admin/upload/raport', label: 'Verifikasi Raport', icon: 'description' },
            { href: '/admin/upload/kesehatan', label: 'Verifikasi Kesehatan', icon: 'favorite' },
        ],
    },
    {
        title: 'Seleksi',
        icon: 'playlist_add_check',
        items: [
            { href: '/admin/kriteria', label: 'Kriteria Kelulusan', icon: 'my_location' },
            { href: '/admin/pembobotan', label: 'Pembobotan', icon: 'percent' },
            { href: '/admin/nilai', label: 'Nilai Ujian', icon: 'emoji_events' },
            { href: '/admin/seleksi', label: 'Seleksi', icon: 'check_circle' },
            { href: '/admin/seleksi-pindah-prodi', label: 'Seleksi Pindah Prodi', icon: 'swap_horiz' },
            { href: '/admin/seleksi/rekap', label: 'Rekap Kelulusan', icon: 'bar_chart' },
            { href: '/admin/referensi', label: 'Referensi', icon: 'info' },
            { href: '/admin/absensi', label: 'Absensi', icon: 'content_paste' },
        ],
    },
    {
        title: 'Pengaturan',
        icon: 'settings',
        items: [
            { href: '/admin/users', label: 'Manajemen User', icon: 'group' },
            { href: '/admin/settings', label: 'Pengaturan Sistem', icon: 'settings' },
        ],
    },
];

export default function TopNav() {
    const { url, auth } = usePage() as any;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [mobileDropdowns, setMobileDropdowns] = useState<Record<number, boolean>>({});
    const [themeOpen, setThemeOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(getStoredTheme());
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentTheme(getStoredTheme());
    }, [getStoredTheme()]);

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        setStoredTheme(theme);
        setCurrentTheme(theme);
        setThemeOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
                setOpenDropdown(null);
                setThemeOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function isActive(href: string) {
        return url.startsWith(href);
    }

    function isGroupActive(items: NavItem[]): boolean {
        return items.some(item => item.href && isActive(item.href));
    }

    return (
        <nav ref={navRef} className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-50 w-full">
            <div className="max-w-[1400px] mx-auto px-gutter h-14 flex items-center justify-between gap-md">
                <div className="flex items-center gap-sm shrink-0">
                    <div>
                        <h1 className="text-label-md font-h3 font-medium text-primary leading-none">SMMPTP Poltekpar</h1>
                        <p className="text-[9px] uppercase tracking-wider font-medium text-secondary">Admin Portal</p>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-xs">
                    {menuGroups.map((group, groupIndex) => (
                        <div
                            key={groupIndex}
                            className="relative"
                            onMouseEnter={() => setOpenDropdown(groupIndex)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            {group.items.length === 1 && group.items[0].href ? (
                                <Link
                                    href={group.items[0].href}
                                    className={`flex items-center gap-xs px-2 py-1.5 rounded-lg transition-all text-label-md ${
                                        isActive(group.items[0].href)
                                            ? 'bg-primary-container text-on-primary-container'
                                            : 'text-on-surface-variant hover:bg-surface-variant'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{group.items[0].icon}</span>
                                    {group.items[0].label}
                                </Link>
                            ) : (
                                <button
                                    className={`flex items-center gap-xs px-2 py-1.5 rounded-lg transition-all text-label-md ${
                                        openDropdown === groupIndex || isGroupActive(group.items)
                                            ? 'bg-primary-container text-on-primary-container'
                                            : 'text-on-surface-variant hover:bg-surface-variant'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {group.icon}
                                    </span>
                                    {group.title}
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </button>
                            )}

                            {group.items.length > 1 && (
                                <div
                                    className={`absolute top-full left-0 mt-2 min-w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant py-2 transition-all z-50 ${
                                        openDropdown === groupIndex
                                            ? 'opacity-100 visible'
                                            : 'opacity-0 invisible'
                                    }`}
                                >
                                    <div className="px-3 py-2 border-b border-outline-variant mb-2">
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-secondary">
                                            {group.title}
                                        </p>
                                    </div>
                                    {group.items.map((item, itemIndex) => (
                                        item.href && (
                                            <Link
                                                key={itemIndex}
                                                href={item.href}
                                                className={`flex items-center gap-xs px-cs py-1.5 transition-all text-label-md ${
                                                    isActive(item.href)
                                                        ? 'bg-primary-container text-on-primary-container mx-2 rounded-lg'
                                                        : 'text-on-surface-variant hover:bg-surface-variant'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-sm shrink-0">
                    <div className="relative">
                        <button
                            onClick={() => setThemeOpen(!themeOpen)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-all"
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
                                    className={`flex items-center gap-xs px-cs py-1.5 w-full text-left transition-all text-label-md ${
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
                                    className={`flex items-center gap-xs px-cs py-1.5 w-full text-left transition-all text-label-md ${
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
                                    className={`flex items-center gap-xs px-cs py-1.5 w-full text-left transition-all text-label-md ${
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
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-all relative">
                        <span className="material-symbols-outlined text-lg">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
                    </button>
                    <div className="h-6 w-[1px] bg-outline-variant mx-xs"></div>
                    <div className="flex items-center gap-sm">
                        <div className="text-right hidden sm:block">
                            <p className="font-medium text-label-md text-on-surface leading-none">{auth?.user?.name || 'Admin'}</p>
                            <p className="text-[9px] text-secondary">{auth?.user?.email || 'admin@poltekpar.ac.id'}</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <img
                                alt="Admin Avatar"
                                className="w-8 h-8 rounded-full object-cover border-2 border-surface-container"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX3M2w147ji8PBtzu1GronKRpsuN76_oq8fZYmQVbdFtzIhGUGzL5ne8Zy3XYb_pui9wo_G-WZPfL5J4crHltKQREWyecdmvZAGwaCOsdPp0uyrVbFe6jZRq6_nUnxc3JRI0gS1GaHlKiC4EJMqXXQhdGZkysrwBRP01TOhbOuFD0VJQ8BYVDUVTG3R6kW6eGXhdhMlLtSJnmgSahKw6GO6p-6IIKGtNmxID93elDgWr8BuBPHpfze94c6C3aEneABRnzzqJ26oA"
                            />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-xs z-50">
                                <Link href="#" className="flex items-center gap-sm px-cs py-sm text-on-surface-variant hover:bg-surface-variant transition-all text-label-md">
                                    <span className="material-symbols-outlined text-lg">person</span> Profil
                                </Link>
                                <hr className="border-outline-variant my-xs"/>
                                <Link href="/logout" method="post" as="button" className="flex items-center gap-sm px-cs py-sm text-error hover:bg-error-container transition-all text-label-md">
                                    <span className="material-symbols-outlined text-lg">logout</span> Keluar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-on-surface-variant lg:hidden"
                >
                    <span className="material-symbols-outlined text-lg">
                        {mobileOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-outline-variant lg:hidden px-gutter py-cs">
                    <div className="flex flex-col gap-sm">
                        {menuGroups.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                {group.items.length === 1 && group.items[0].href ? (
                                    <Link
                                        href={group.items[0].href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-xs px-sm py-2 rounded-lg transition-all text-label-md ${
                                            isActive(group.items[0].href)
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">{group.items[0].icon}</span>
                                        {group.items[0].label}
                                    </Link>
                                ) : (
                                    <div>
                                        <button
                                            onClick={() => setMobileDropdowns(prev => ({
                                                ...prev,
                                                [groupIndex]: !prev[groupIndex]
                                            }))}
                                            className={`flex items-center justify-between gap-xs px-sm py-2 w-full rounded-lg transition-all text-label-md ${
                                                isGroupActive(group.items)
                                                    ? 'bg-primary-container text-on-primary-container'
                                                    : 'text-on-surface-variant hover:bg-surface-variant'
                                            }`}
                                        >
                                            <div className="flex items-center gap-xs">
                                                <span className="material-symbols-outlined text-lg">
                                                    {group.icon}
                                                </span>
                                                {group.title}
                                            </div>
                                            <span className="material-symbols-outlined text-sm">
                                                {mobileDropdowns[groupIndex] ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </button>
                                        {mobileDropdowns[groupIndex] && (
                                            <div className="pl-8 pt-sm pb-sm space-y-1">
                                                {group.items.map((item, itemIndex) => (
                                                    item.href && (
                                                        <Link
                                                            key={itemIndex}
                                                            href={item.href}
                                                            onClick={() => setMobileOpen(false)}
                                                            className={`flex items-center gap-xs px-sm py-2 rounded-lg transition-all text-label-md ${
                                                                isActive(item.href)
                                                                    ? 'bg-primary-container text-on-primary-container'
                                                                    : 'text-on-surface-variant hover:bg-surface-variant'
                                                            }`}
                                                        >
                                                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                                            {item.label}
                                                        </Link>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
