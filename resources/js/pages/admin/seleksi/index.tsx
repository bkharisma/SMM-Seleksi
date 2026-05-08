import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Alert from '@/components/ui/alert';
import Select from '@/components/ui/select';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
    kuota_smm: number | null;
}

interface Tahap {
    id: number;
    nama: string;
    urutan: number;
}

interface Jalur {
    id: number;
    kode_jalur: string;
    nama_jalur: string;
}

interface SeleksiIndexProps {
    tahap: Tahap[];
    jalur: Jalur[];
    prodi: Prodi[];
    filters: { tahap_id?: string; jalur_id?: string; prodi_id?: string; pilihan?: string };
}

export default function SeleksiIndex({ tahap, jalur, prodi, filters }: SeleksiIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [tahapId, setTahapId] = useState(filters.tahap_id || '');
    const [jalurId, setJalurId] = useState(filters.jalur_id || '');
    const [prodiId, setProdiId] = useState(filters.prodi_id || '');
    const [pilihan, setPilihan] = useState(filters.pilihan || '');

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleTahapChange = (value: string) => {
        setTahapId(value);
        setJalurId('');
        setProdiId('');
        setPilihan('');
    };

    const handleJalurChange = (value: string) => {
        setJalurId(value);
        setProdiId('');
        setPilihan('');
    };

    const handleProdiChange = (value: string) => {
        setProdiId(value);
        setPilihan('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tahapId || !jalurId || !prodiId) {
            return;
        }
        router.post('/admin/seleksi/preview', {
            tahap_id: tahapId,
            jalur_id: jalurId,
            prodi_id: prodiId,
            pilihan: pilihan || null,
        });
    };

    const isFormValid = tahapId && jalurId && prodiId;

    return (
        <AdminLayout title="Seleksi Kelulusan">
            <Head title="Seleksi Kelulusan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <div className="space-y-6">
                <Card title="Seleksi Kelulusan">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Pilih tahap seleksi, jalur pendaftaran, dan program studi untuk memulai proses seleksi kelulusan.
                        Sistem akan mengevaluasi peserta berdasarkan kriteria yang telah dikonfigurasi.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${tahapId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    1
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Tahap Seleksi"
                                        required
                                        value={tahapId}
                                        onChange={(e) => handleTahapChange(e.target.value)}
                                        options={[{ value: '', label: '-- Pilih Tahap --' }, ...tahap.map((t) => ({ value: t.id, label: t.nama }))]}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${jalurId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    2
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Jalur Pendaftaran"
                                        required
                                        disabled={!tahapId}
                                        value={jalurId}
                                        onChange={(e) => handleJalurChange(e.target.value)}
                                        options={[{ value: '', label: '-- Pilih Jalur --' }, ...jalur.map((j) => ({ value: j.id, label: `${j.kode_jalur} - ${j.nama_jalur}` }))]}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${prodiId ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    3
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Program Studi"
                                        required
                                        disabled={!jalurId}
                                        value={prodiId}
                                        onChange={(e) => handleProdiChange(e.target.value)}
                                        options={[{ value: '', label: '-- Pilih Prodi --' }, ...prodi.map((p) => ({ value: p.id, label: p.nama_prodi }))]}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${pilihan ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    4
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Filter Pilihan (Opsional)"
                                        disabled={!prodiId}
                                        value={pilihan}
                                        onChange={(e) => setPilihan(e.target.value)}
                                        options={[
                                            { value: '', label: 'Semua Pilihan' },
                                            { value: '1', label: 'Pilihan 1' },
                                            { value: '2', label: 'Pilihan 2' },
                                            { value: '3', label: 'Pilihan 3' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={!isFormValid}>Preview Kandidat</Button>
                        </div>
                    </form>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card title="Panduan Seleksi">
                        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>Pilih tahap seleksi yang akan diproses</li>
                            <li>Pilih jalur pendaftaran peserta</li>
                            <li>Pilih program studi tujuan</li>
                            <li>(Opsional) Filter berdasarkan pilihan ke-berapa</li>
                            <li>Klik "Preview Kandidat" untuk melihat hasil evaluasi</li>
                            <li>Centang peserta yang akan diluluskan</li>
                            <li>Klik "Simpan Keputusan" untuk menyimpan hasil seleksi</li>
                        </ol>
                    </Card>

                    <Card
                        title="Rekap Kelulusan"
                        action={
                            <Link href="/admin/seleksi/rekap">
                                <Button variant="outline" size="sm">Lihat Rekap</Button>
                            </Link>
                        }
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Lihat rekapitulasi kelulusan per program studi, jumlah lulus per pilihan, dan export data ke Excel.
                        </p>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
