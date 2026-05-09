import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/components/layout/admin-layout';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

interface Prodi {
    nama_prodi: string;
}

interface FileKesehatan {
    id: number;
    file_lockes: string;
    is_revisi: boolean;
}

interface Kesehatan {
    id: number;
    namalbg: string | null;
    tb: number | null;
    bb: number | null;
    bw: string | null;
    status: string;
    catatan: string | null;
}

interface Pendaftar {
    nup: string;
    noujian: string | null;
    nama: string;
    pil1_prodi: Prodi | null;
    lulus_prodi: Prodi | null;
    kesehatan: Kesehatan | null;
    fileKesehatan?: FileKesehatan[];
}

interface PesertaDetailProps {
    pendaftar: Pendaftar;
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Lengkap': 'success',
    'Tidak Lengkap': 'danger',
    'Perbaikan': 'warning',
    'Belum Diperiksa': 'info',
};

export default function PesertaDetail({ pendaftar }: PesertaDetailProps) {
    return (
        <AdminLayout title="Detail Syarat Peserta">
            <Head title="Detail Syarat Peserta" />

            <div className="mb-4 flex items-center gap-2">
                <Link href="/admin/syarat">
                    <Button variant="secondary" size="sm">← Kembali</Button>
                </Link>
            </div>

            <Card title="Data Peserta" className="mb-6">
                <div className="grid gap-2 md:grid-cols-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">NUP</span>
                        <span className="font-medium">{pendaftar.nup}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">No. Ujian</span>
                        <span className="font-medium">{pendaftar.noujian || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Nama</span>
                        <span className="font-medium">{pendaftar.nama}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Lulus Di</span>
                        <span className="font-medium">{pendaftar.lulus_prodi?.nama_prodi || '-'}</span>
                    </div>
                </div>
            </Card>

            <Card title="Surat Keterangan Sehat">
                {pendaftar.kesehatan ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status</span>
                            <Badge variant={statusColors[pendaftar.kesehatan.status] || 'info'}>
                                {pendaftar.kesehatan.status}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Lembaga</span>
                                <span className="font-medium">{pendaftar.kesehatan.namalbg || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">TB/BB</span>
                                <span className="font-medium">{pendaftar.kesehatan.tb ?? '-'}/{pendaftar.kesehatan.bb ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Buta Warna</span>
                                <span className="font-medium">{pendaftar.kesehatan.bw || '-'}</span>
                            </div>
                        </div>
                        {pendaftar.kesehatan.catatan && (
                            <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    <strong>Catatan:</strong> {pendaftar.kesehatan.catatan}
                                </p>
                            </div>
                        )}
                        {pendaftar.fileKesehatan && pendaftar.fileKesehatan.length > 0 && (
                            <div>
                                <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">File:</p>
                                <div className="space-y-1">
                                    {pendaftar.fileKesehatan.map((file) => (
                                        <a
                                            key={file.id}
                                            href={`/storage/${file.file_lockes}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                        >
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            {file.file_lockes.split('/').pop()}
                                            {file.is_revisi && <Badge variant="warning" className="ml-1 text-xs">Revisi</Badge>}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Link href={`/admin/syarat/kesehatan/${pendaftar.kesehatan.id}`}>
                            <Button variant="secondary" size="sm" className="w-full">Verifikasi Kesehatan</Button>
                        </Link>
                    </div>
                ) : (
                    <p className="py-4 text-center text-sm text-gray-500">Belum upload kesehatan</p>
                )}
            </Card>
        </AdminLayout>
    );
}
