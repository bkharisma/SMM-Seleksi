import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';

interface Tahap {
    id: number;
    nama: string;
    urutan: number;
}

interface Ujian {
    id: number;
    nama: string;
    kode: string;
    tahap_seleksi_id: number | null;
    deskripsi: string | null;
    fields_config: any;
    active: boolean;
}

interface UjianFormProps {
    ujian: Ujian | null;
    tahap: Tahap[];
}

export default function UjianForm({ ujian, tahap }: UjianFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const isEdit = !!ujian;

    const { data, setData, post, put, processing, errors } = useForm({
        nama: ujian?.nama || '',
        kode: ujian?.kode || '',
        tahap_seleksi_id: ujian?.tahap_seleksi_id ?? '',
        deskripsi: ujian?.deskripsi || '',
        fields_config: (ujian?.fields_config as Record<string, any>) ?? { fields: [] },
        active: ujian?.active ?? true,
    });

    const handleFieldToggle = (fieldName: string) => {
        const currentFields = [...(data.fields_config.fields || [])];

        if (currentFields.includes(fieldName)) {
            setData('fields_config', { fields: currentFields.filter((f) => f !== fieldName) });
        } else {
            setData('fields_config', { fields: [...currentFields, fieldName] });
        }
    };

    const availableFields = [
        { name: 'psi_iq', label: 'Bakat Skolastik' },
        { name: 'psi_bobot', label: 'Psikotes' },
        { name: 'bing_nil', label: 'Literasi Bahasa Inggris' },
        { name: 'waw_nil', label: 'Wawancara' },
        { name: 'waw_bersedia_pindah', label: 'Bersedia Pindah Prodi' },
        { name: 'waw_rekomendasi_prodi_id', label: 'Rekomendasi Prodi' },
        { name: 'waw_catatan', label: 'Catatan Wawancara' },
        { name: 'kes_hasil', label: 'Tes Kesehatan' },
        { name: 'kes_tb', label: 'Tinggi Badan' },
        { name: 'kes_bw', label: 'Buta Warna' },
        { name: 'kes_scol', label: 'Skoliosis' },
        { name: 'kes_hamil', label: 'Kehamilan' },
        { name: 'minat_dominan', label: 'Minat Dominan' },
        { name: 'skor_akhir', label: 'Skor Akhir' },
    ];

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/ujian/${ujian!.id}`);
        } else {
            post('/admin/ujian');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Jenis Ujian' : 'Tambah Jenis Ujian'}>
            <Head title={isEdit ? 'Edit Ujian' : 'Tambah Ujian'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Jenis Ujian' : 'Tambah Jenis Ujian'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="kode"
                            label="Kode Ujian"
                            value={data.kode}
                            onChange={(e) => setData('kode', e.target.value)}
                            error={errors.kode}
                            required
                        />
                        <Input
                            id="nama"
                            label="Nama Ujian"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            error={errors.nama}
                            required
                        />
                    </div>
                    <Select
                        id="tahap_seleksi_id"
                        label="Tahap Seleksi"
                        value={data.tahap_seleksi_id}
                        onChange={(e) => setData('tahap_seleksi_id', e.target.value)}
                        error={errors.tahap_seleksi_id}
                        placeholder="-- Pilih Tahap Seleksi --"
                        options={tahap.map((t) => ({ value: String(t.id), label: `${t.nama} (Urutan ${t.urutan})` }))}
                    />
                    <Textarea
                        id="deskripsi"
                        label="Deskripsi"
                        value={data.deskripsi}
                        onChange={(e) => setData('deskripsi', e.target.value)}
                        error={errors.deskripsi}
                        rows={3}
                    />
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Field Nilai (untuk template Excel)
                        </label>
                        <div className="grid gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-600 sm:grid-cols-2 lg:grid-cols-3">
                            {availableFields.map((field) => (
                                <div key={field.name} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`field_${field.name}`}
                                        checked={(data.fields_config.fields || []).includes(field.name)}
                                        onChange={() => handleFieldToggle(field.name)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`field_${field.name}`} className="text-sm text-gray-700 dark:text-gray-300">
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.fields_config && (
                            <p className="mt-1 text-sm text-red-600">{errors.fields_config}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={data.active}
                            onChange={(e) => setData('active', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">
                            Aktif
                        </label>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link href="/admin/ujian">
                            <Button variant="secondary" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" isLoading={processing}>
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
