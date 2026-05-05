import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface SettingsProps {
    settings: {
        nama_ptp: string;
        alamat_ptp: string;
        telepon_ptp: string;
        email_ptp: string;
        website_ptp: string;
        biaya_pendaftaran: number;
        aktif: number;
        tahun_akademik: string;
        pengumuman_url: string;
        max_pilihan: number;
    };
}

export default function Settings({ settings }: SettingsProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        nama_ptp: settings.nama_ptp,
        alamat_ptp: settings.alamat_ptp,
        telepon_ptp: settings.telepon_ptp,
        email_ptp: settings.email_ptp,
        website_ptp: settings.website_ptp,
        biaya_pendaftaran: settings.biaya_pendaftaran.toString(),
        aktif: settings.aktif.toString(),
        tahun_akademik: settings.tahun_akademik,
        pengumuman_url: settings.pengumuman_url,
        max_pilihan: settings.max_pilihan.toString(),
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings');
    };

    return (
        <AdminLayout title="Pengaturan Sistem">
            <Head title="Pengaturan" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Pengaturan Sistem">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="nama_ptp"
                            label="Nama PTP"
                            value={data.nama_ptp}
                            onChange={(e) => setData('nama_ptp', e.target.value)}
                            error={errors.nama_ptp}
                            required
                        />
                        <Input
                            id="tahun_akademik"
                            label="Tahun Akademik"
                            value={data.tahun_akademik}
                            onChange={(e) => setData('tahun_akademik', e.target.value)}
                            error={errors.tahun_akademik}
                            required
                        />
                        <Input
                            id="email_ptp"
                            label="Email PTP"
                            type="email"
                            value={data.email_ptp}
                            onChange={(e) => setData('email_ptp', e.target.value)}
                            error={errors.email_ptp}
                        />
                        <Input
                            id="telepon_ptp"
                            label="Telepon PTP"
                            value={data.telepon_ptp}
                            onChange={(e) => setData('telepon_ptp', e.target.value)}
                            error={errors.telepon_ptp}
                        />
                        <Input
                            id="website_ptp"
                            label="Website PTP"
                            value={data.website_ptp}
                            onChange={(e) => setData('website_ptp', e.target.value)}
                            error={errors.website_ptp}
                        />
                        <Input
                            id="biaya_pendaftaran"
                            label="Biaya Pendaftaran (Rp)"
                            type="number"
                            value={data.biaya_pendaftaran}
                            onChange={(e) => setData('biaya_pendaftaran', e.target.value)}
                            error={errors.biaya_pendaftaran}
                            required
                        />
                        <Input
                            id="max_pilihan"
                            label="Maksimum Pilihan Prodi"
                            type="number"
                            min="1"
                            max="4"
                            value={data.max_pilihan}
                            onChange={(e) => setData('max_pilihan', e.target.value)}
                            error={errors.max_pilihan}
                            required
                        />
                        <Select
                            id="aktif"
                            label="Status Pendaftaran"
                            value={data.aktif}
                            onChange={(e) => setData('aktif', e.target.value)}
                            options={[
                                { value: '1', label: 'Aktif' },
                                { value: '0', label: 'Tidak Aktif' },
                            ]}
                            error={errors.aktif}
                        />
                    </div>
                    <div>
                        <label htmlFor="alamat_ptp" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alamat PTP
                        </label>
                        <textarea
                            id="alamat_ptp"
                            value={data.alamat_ptp}
                            onChange={(e) => setData('alamat_ptp', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.alamat_ptp && <p className="mt-1 text-sm text-red-600">{errors.alamat_ptp}</p>}
                    </div>
                    <div>
                        <label htmlFor="pengumuman_url" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            URL Pengumuman
                        </label>
                        <input
                            id="pengumuman_url"
                            type="url"
                            value={data.pengumuman_url}
                            onChange={(e) => setData('pengumuman_url', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.pengumuman_url && <p className="mt-1 text-sm text-red-600">{errors.pengumuman_url}</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={processing}>
                            Simpan Pengaturan
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
