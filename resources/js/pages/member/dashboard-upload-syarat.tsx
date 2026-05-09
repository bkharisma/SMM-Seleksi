import { Head, Link } from '@inertiajs/react';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';

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

interface PesertaData {
    id: number;
    nama: string;
    nup: string;
    noujian: string | null;
    status: boolean;
    foto: string | null;
    email: string | null;
    tanggal_lahir: string | null;
    jenis_kelamin: string | null;
    no_hp: string | null;
    lulus_tahap_1: boolean;
    lulus_tahap_1_prodi: string | null;
    is_finalized: boolean;
}

interface DashboardUploadSyaratProps {
    peserta: PesertaData | null;
    kesehatan: KesehatanData | null;
}

export default function DashboardUploadSyarat({ peserta, kesehatan }: DashboardUploadSyaratProps) {
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

    const isNotLulusFinal = peserta?.is_finalized === true && peserta?.lulus_tahap_1 === false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 dark:from-gray-900 dark:to-gray-800">
            <Head title="Dashboard Upload Syarat" />
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SMMPTP</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard Upload Syarat</p>
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

                        <Card title="Data Diri">
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Nama</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.nama}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tanggal Lahir</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {peserta.tanggal_lahir ? new Date(peserta.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Jenis Kelamin</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.jenis_kelamin || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">No HP</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.no_hp || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{peserta.email || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status Kelulusan Tahap 1</span>
                                    {peserta.lulus_tahap_1 ? (
                                        <Badge variant="success">
                                            LULUS{peserta.lulus_tahap_1_prodi ? ` - ${peserta.lulus_tahap_1_prodi}` : ''}
                                        </Badge>
                                    ) : peserta.is_finalized ? (
                                        <Badge variant="danger">TIDAK LULUS</Badge>
                                    ) : (
                                        <Badge variant="warning">BELUM LULUS</Badge>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {isNotLulusFinal ? (
                            <Card>
                                <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
                                    <svg className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <h3 className="mt-3 text-lg font-bold text-red-800 dark:text-red-300">Maaf, Anda Tidak Lulus Tahap 1</h3>
                                    <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                                        Anda tidak dapat melanjutkan ke tahap verifikasi dokumen persyaratan.
                                    </p>
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                                        Silakan hubungi panitia jika ada pertanyaan.
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <Card title="Dokumen Persyaratan">
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">Surat Keterangan Sehat</h4>
                                                <p className="text-sm text-gray-500">Dokumen kesehatan dari rumah sakit/klinik</p>
                                            </div>
                                            <Badge variant={getDocStatusVariant(kesehatan?.status)}>
                                                {getDocStatusLabel(kesehatan?.status)}
                                            </Badge>
                                        </div>
                                        {kesehatan?.catatan && (kesehatan.status === 'Tidak Lengkap' || kesehatan.status === 'Perbaikan') && (
                                            <div className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                                                <p className="text-sm font-medium text-red-700 dark:text-red-300">Catatan Admin:</p>
                                                <p className="text-sm text-red-600 dark:text-red-400">{kesehatan.catatan}</p>
                                            </div>
                                        )}
                                        {kesehatan?.files && kesehatan.files.length > 0 && (
                                            <div className="mt-3">
                                                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">File Terupload:</p>
                                                <div className="space-y-1">
                                                    {kesehatan.files.slice(0, 3).map((file) => (
                                                        <a
                                                            key={file.id}
                                                            href={`/storage/${file.file_lockes}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            {file.file_lockes.split('/').pop()}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-3">
                                            <Link
                                                href="/member/upload/kesehatan"
                                                className="block rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                            >
                                                {kesehatan ? 'Update Dokumen Kesehatan' : 'Upload Dokumen Kesehatan'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

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
