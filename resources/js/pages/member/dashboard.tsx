import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import DashboardUploadSyarat from './dashboard-upload-syarat';

interface ScoreDetail {
    [key: string]: number | null;
}

interface TahapDetail {
    tahap_nama: string;
    urutan: number;
    lulus: boolean;
    scores: ScoreDetail;
}

interface JadwalItem {
    nama_jadwal: string;
    tgl_awal: string | null;
    tgl_akhir: string | null;
    jam_awal: string | null;
    jam_akhir: string | null;
    keterangan: string | null;
    jenis: string | null;
}

interface FileKesehatan {
    id: number;
    file_lockes: string;
    is_revisi: boolean;
}

interface KesehatanData {
    status: string | null;
    catatan: string | null;
    files: FileKesehatan[];
}

interface ProfileField {
    key: string;
    label: string;
    check: boolean;
}

interface MemberDashboardProps {
    peserta: {
        id: number;
        nama: string;
        nup: string;
        noujian: string | null;
        status: boolean;
        lulus: number | null;
        lulus_prodi: string | null;
        lulus_tahap: string | null;
        pil1_prodi: string | null;
        foto: string | null;
        tempat_lahir: string | null;
        tanggal_lahir: string | null;
        jenis_kelamin: string | null;
        agama: string | null;
        no_hp: string | null;
        alamat: string | null;
        nama_ibu: string | null;
        nama_sekolah: string | null;
        foto_lengkap: boolean;
        email: string | null;
        nilai: {
            psikotes: number | null;
            inggris: number | null;
            wawancara: number | null;
            kesehatan: number | null;
        };
        kesehatan_status: string | null;
        kesehatan_catatan: string | null;
        lulus_tahap_1: boolean;
        lulus_tahap_1_prodi: string | null;
    } | null;
    kesehatan: KesehatanData | null;
    profile_completeness: number;
    profile_fields: ProfileField[];
    details_per_tahap: TahapDetail[];
    jadwal: JadwalItem[];
    active_dashboard_type: 'lengkap' | 'upload_syarat';
}

export default function Dashboard({ peserta, kesehatan, profile_completeness, profile_fields, details_per_tahap, jadwal, active_dashboard_type }: MemberDashboardProps) {
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

    if (active_dashboard_type === 'upload_syarat') {
        return (
            <DashboardUploadSyarat
                peserta={peserta}
                kesehatan={kesehatan}
            />
        );
    }

    const getDocStatusVariant = (status: string | null) => {
        switch (status) {
            case 'Lengkap': return 'success';
            case 'Tidak Lengkap': return 'danger';
            case 'Perbaikan': return 'warning';
            default: return 'info';
        }
    };

    const getDocStatusLabel = (status: string | null) => {
        return status || 'Belum Upload';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 dark:from-gray-900 dark:to-gray-800">
            <Head title="Dashboard Peserta" />
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 text-center relative">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seleksi Mandiri Masuk</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Politeknik Pariwisata Palembang</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Dashboard Peserta</p>

                    <div className="absolute right-0 top-0" ref={themeRef}>
                        <button
                            onClick={() => setThemeOpen(!themeOpen)}
                            className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
                            title="Tema"
                        >
                            <span className="material-symbols-outlined text-lg">
                                {currentTheme === 'light' && 'light_mode'}
                                {currentTheme === 'dark' && 'dark_mode'}
                                {currentTheme === 'system' && 'desktop_windows'}
                            </span>
                        </button>
                        {themeOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-all text-sm ${
                                        currentTheme === 'light'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">light_mode</span> Light
                                </button>
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-all text-sm ${
                                        currentTheme === 'dark'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">dark_mode</span> Dark
                                </button>
                                <button
                                    onClick={() => handleThemeChange('system')}
                                    className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-all text-sm ${
                                        currentTheme === 'system'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">desktop_windows</span> System
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {peserta ? (
                    <div className="space-y-6">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {peserta.foto ? (
                                        <img src={`/storage/${peserta.foto}`} alt={peserta.nama} className="h-16 w-16 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            {peserta.nama?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Selamat datang, {peserta.nama}
                                        </h2>
                                        <p className="text-sm text-gray-500">NUP: {peserta.nup}</p>
                                    </div>
                                </div>
                                <Badge variant={peserta.status ? 'success' : 'danger'}>
                                    {peserta.status ? 'Aktif' : 'Tidak Aktif'}
                                </Badge>
                            </div>
                        </Card>

                        {peserta.lulus && (
                            <Card>
                                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                                    <svg className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-xl font-bold text-green-800 dark:text-green-300">SELAMAT, ANDA LULUS!</h3>
                                    {peserta.lulus_prodi && (
                                        <p className="mt-1 text-green-700 dark:text-green-400">
                                            Program Studi: <strong>{peserta.lulus_prodi}</strong>
                                        </p>
                                    )}
                                    {peserta.lulus_tahap && (
                                        <p className="mt-1 text-sm text-green-600 dark:text-green-500">
                                            Tahap: {peserta.lulus_tahap}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card title="Kelengkapan Profil">
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{profile_completeness}%</span>
                                    </div>
                                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className={`h-2 rounded-full ${profile_completeness === 100 ? 'bg-green-500' : profile_completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${profile_completeness}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 text-xs">
                                    {profile_fields.map((field) => (
                                        <div key={field.key} className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">{field.label}</span>
                                            {field.check ? (
                                                <span className="text-green-600">✓</span>
                                            ) : (
                                                <span className="text-red-500">✗</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Status Dokumen">
                                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Surat Keterangan Sehat</span>
                                        <Badge variant={getDocStatusVariant(peserta.kesehatan_status)}>
                                            {getDocStatusLabel(peserta.kesehatan_status)}
                                        </Badge>
                                    </div>
                                    {peserta.kesehatan_catatan && (peserta.kesehatan_status === 'Tidak Lengkap' || peserta.kesehatan_status === 'Perbaikan') && (
                                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">⚠ {peserta.kesehatan_catatan}</p>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {details_per_tahap.length > 0 && (
                            <Card title="Hasil Seleksi per Tahap">
                                <div className="space-y-3">
                                    {details_per_tahap.map((tahap) => (
                                        <div key={tahap.urutan} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    Tahap {tahap.urutan}: {tahap.tahap_nama}
                                                </span>
                                                {Object.keys(tahap.scores).length > 0 && (
                                                    <div className="mt-1 flex gap-3 text-xs text-gray-500">
                                                        {Object.entries(tahap.scores).map(([key, val]) => (
                                                            <span key={key}>{key.toUpperCase()}: {val !== null ? val : '-'}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <Badge variant={tahap.lulus ? 'success' : 'warning'}>
                                                {tahap.lulus ? 'LULUS' : 'PROSES'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {jadwal.length > 0 && (
                            <Card title="Jadwal Kegiatan">
                                <div className="space-y-3">
                                    {jadwal.map((item, idx) => (
                                        <div key={idx} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900 dark:text-white">{item.nama_jadwal}</h4>
                                                {item.jenis && <Badge variant="info">{item.jenis}</Badge>}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                {item.tgl_awal} {item.tgl_akhir ? `- ${item.tgl_akhir}` : ''}
                                                {item.jam_awal && ` (${item.jam_awal}${item.jam_akhir ? ` - ${item.jam_akhir}` : ''})`}
                                            </p>
                                            {item.keterangan && (
                                                <p className="mt-1 text-xs text-gray-500">{item.keterangan}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {peserta.nilai && (
                            <Card title="Nilai Anda">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        { label: 'Psikotes', value: peserta.nilai.psikotes },
                                        { label: 'Bahasa Inggris', value: peserta.nilai.inggris },
                                        { label: 'Wawancara', value: peserta.nilai.wawancara },
                                        { label: 'Kesehatan', value: peserta.nilai.kesehatan },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {item.value !== null ? item.value : '-'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link
                                href="/member/profile"
                                className="block rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Update Profil
                            </Link>
                            <Link
                                href="/member/upload/kesehatan"
                                className="block rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Upload Dokumen
                            </Link>
                            {peserta.noujian && (
                                <Link
                                    href="/member/kartu-peserta"
                                    className="block rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Kartu Peserta
                                </Link>
                            )}
                            <Link
                                href="/kelulusan"
                                className="block rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cek Kelulusan
                            </Link>
                        </div>

                        <Card>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block w-full rounded-lg bg-red-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Logout
                            </Link>
                        </Card>
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-600 dark:text-gray-400">
                            Data peserta tidak ditemukan. Silakan hubungi admin.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
