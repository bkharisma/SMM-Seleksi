import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Toggle from '@/components/ui/toggle';

interface DashboardMemberSettingsProps {
    settings: {
        dashboard_lengkap: number;
        dashboard_upload_syarat: number;
    };
}

export default function DashboardMemberSettings({ settings }: DashboardMemberSettingsProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        dashboard_lengkap: settings.dashboard_lengkap.toString(),
        dashboard_upload_syarat: settings.dashboard_upload_syarat.toString(),
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings/dashboard-member');
    };

    const handleDashboardLengkapToggle = (checked: boolean) => {
        setData('dashboard_lengkap', checked ? '1' : '0');
        if (checked) {
            setData('dashboard_upload_syarat', '0');
        }
    };

    const handleDashboardUploadSyaratToggle = (checked: boolean) => {
        setData('dashboard_upload_syarat', checked ? '1' : '0');
        if (checked) {
            setData('dashboard_lengkap', '0');
        }
    };

    return (
        <AdminLayout title="Pengaturan Dashboard Member">
            <Head title="Dashboard Member" />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Pengaturan Dashboard Member">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Pilih tipe dashboard yang akan ditampilkan untuk member. Hanya satu dashboard yang dapat aktif dalam satu waktu.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-outline-variant p-4">
                            <div className="flex-1">
                                <p className="font-medium text-on-surface">Dashboard Lengkap</p>
                                <p className="mt-1 text-sm text-on-surface-variant">
                                    Menampilkan semua informasi: profil, nilai, jadwal, hasil seleksi, dan kelulusan
                                </p>
                                <ul className="mt-2 space-y-1 text-xs text-on-surface-variant">
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Kelengkapan profil dengan progress bar</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Hasil seleksi per tahap</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Jadwal kegiatan</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Nilai ujian (psikotes, bahasa inggris, wawancara, kesehatan)</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Pengumuman kelulusan</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="ml-4">
                                <Toggle
                                    id="dashboard_lengkap"
                                    checked={data.dashboard_lengkap === '1'}
                                    onChange={handleDashboardLengkapToggle}
                                    label={data.dashboard_lengkap === '1' ? 'Aktif' : 'Nonaktif'}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-outline-variant p-4">
                            <div className="flex-1">
                                <p className="font-medium text-on-surface">Dashboard Upload Syarat</p>
                                <p className="mt-1 text-sm text-on-surface-variant">
                                    Menampilkan form upload dokumen persyaratan secara fokus
                                </p>
                                <ul className="mt-2 space-y-1 text-xs text-on-surface-variant">
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Status kelengkapan profil</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Upload foto peserta</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Upload surat keterangan sehat</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Status raport</span>
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span>Catatan admin untuk perbaikan dokumen</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="ml-4">
                                <Toggle
                                    id="dashboard_upload_syarat"
                                    checked={data.dashboard_upload_syarat === '1'}
                                    onChange={handleDashboardUploadSyaratToggle}
                                    label={data.dashboard_upload_syarat === '1' ? 'Aktif' : 'Nonaktif'}
                                />
                            </div>
                        </div>
                    </div>

                    {errors.dashboard_lengkap && (
                        <p className="text-sm text-error">{errors.dashboard_lengkap}</p>
                    )}
                    {errors.dashboard_upload_syarat && (
                        <p className="text-sm text-error">{errors.dashboard_upload_syarat}</p>
                    )}

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
