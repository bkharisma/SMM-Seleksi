import { Head, Link } from '@inertiajs/react';
import PortalLayout from '@/components/layout/portal-layout';
import Card from '@/components/ui/card';

interface KelulusanIndexProps {
    tahap1_dibuka: boolean;
    tahap2_dibuka: boolean;
}

export default function KelulusanIndex({ tahap1_dibuka, tahap2_dibuka }: KelulusanIndexProps) {
    return (
        <PortalLayout title="Pengumuman Kelulusan">
            <Head title="Pengumuman Kelulusan" />

            <div className="mx-auto max-w-3xl space-y-6">
                <p className="text-center text-gray-600 dark:text-gray-400">
                    Silakan pilih tahap pengumuman kelulusan yang ingin Anda lihat.
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Link href="/kelulusan/tahap-1" className="block">
                        <Card>
                            <div className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Kelulusan Tahap 1
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Pengumuman hasil seleksi berdasarkan nilai tes (Psikotes, Bahasa Inggris, Wawancara, Kesehatan).
                                </p>
                                <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${tahap1_dibuka ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                                    {tahap1_dibuka ? 'Tersedia' : 'Belum Tersedia'}
                                </span>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/kelulusan/tahap-2" className="block">
                        <Card>
                            <div className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Kelulusan Tahap 2
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Pengumuman hasil seleksi akhir berdasarkan verifikasi dokumen dan kelengkapan berkas.
                                </p>
                                <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${tahap2_dibuka ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                                    {tahap2_dibuka ? 'Tersedia' : 'Belum Tersedia'}
                                </span>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </PortalLayout>
    );
}
