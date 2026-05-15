import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Toggle from '@/components/ui/toggle';

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
        dashboard_lengkap: number;
        dashboard_upload_syarat: number;
        logo_path: string;
    };
}

export default function Settings({ settings }: SettingsProps) {
    const { flash, app } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(app?.logo_url || null);
    const [logoProcessing, setLogoProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, put, delete: destroy, processing, errors } = useForm({
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
        dashboard_lengkap: settings.dashboard_lengkap.toString(),
        dashboard_upload_syarat: settings.dashboard_upload_syarat.toString(),
        logo: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    useEffect(() => {
        setTimeout(() => setLogoPreview(app?.logo_url || null), 0);
    }, [app?.logo_url]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings');
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

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadLogo = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.logo) {
return;
}

        setLogoProcessing(true);
        const formData = new FormData();
        formData.append('logo', data.logo);

        router.post('/admin/settings/logo', formData, {
            onSuccess: () => {
                setLogoProcessing(false);
                setData('logo', null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: () => {
                setLogoProcessing(false);
            },
        });
    };

    const handleDeleteLogo = () => {
        if (confirm('Apakah Anda yakin ingin menghapus logo?')) {
            destroy('/admin/settings/logo');
        }
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
                        <label htmlFor="alamat_ptp" className="mb-1 block text-sm font-medium text-on-surface-container">
                            Alamat PTP
                        </label>
                        <textarea
                            id="alamat_ptp"
                            value={data.alamat_ptp}
                            onChange={(e) => setData('alamat_ptp', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.alamat_ptp && <p className="mt-1 text-sm text-error">{errors.alamat_ptp}</p>}
                    </div>
                    <div>
                        <label htmlFor="pengumuman_url" className="mb-1 block text-sm font-medium text-on-surface-container">
                            URL Pengumuman
                        </label>
                        <input
                            id="pengumuman_url"
                            type="url"
                            value={data.pengumuman_url}
                            onChange={(e) => setData('pengumuman_url', e.target.value)}
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {errors.pengumuman_url && <p className="mt-1 text-sm text-red-600">{errors.pengumuman_url}</p>}
                    </div>

                    <div className="border-t border-outline-variant pt-6">
                        <h3 className="mb-4 text-lg font-semibold text-on-surface">Logo Aplikasi</h3>
                        <p className="mb-4 text-sm text-on-surface-variant">
                            Upload logo yang akan ditampilkan pada navbar dashboard dan landing page. Format: PNG, JPG, JPEG, SVG. Maks: 2MB.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-4xl mx-auto mb-1">image</span>
                                            <p className="text-xs">Belum ada logo</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                    onChange={handleLogoChange}
                                    className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:opacity-90"
                                />
                                {errors.logo && <p className="text-sm text-error">{errors.logo}</p>}
                                <div className="flex gap-sm">
                                    <Button
                                        type="button"
                                        onClick={handleUploadLogo}
                                        isLoading={logoProcessing}
                                        disabled={!data.logo}
                                    >
                                        Upload Logo
                                    </Button>
                                    {logoPreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleDeleteLogo}
                                        >
                                            Hapus Logo
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-outline-variant pt-6">
                        <h3 className="mb-4 text-lg font-semibold text-on-surface">Dashboard Member</h3>
                        <p className="mb-4 text-sm text-on-surface-variant">
                            Pilih tipe dashboard yang akan ditampilkan untuk member. Hanya satu dashboard yang dapat aktif dalam satu waktu.
                        </p>
                        <div className="space-y-4 rounded-lg bg-surface-container-low p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-on-surface">Dashboard Lengkap</p>
                                    <p className="text-sm text-on-surface-variant">
                                        Menampilkan profil, nilai, jadwal, hasil seleksi, dan kelulusan
                                    </p>
                                </div>
                                <Toggle
                                    id="dashboard_lengkap"
                                    checked={data.dashboard_lengkap === '1'}
                                    onChange={handleDashboardLengkapToggle}
                                    label={data.dashboard_lengkap === '1' ? 'Aktif' : 'Nonaktif'}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-on-surface">Dashboard Upload Syarat</p>
                                    <p className="text-sm text-on-surface-variant">
                                        Menampilkan form upload dokumen persyaratan (kesehatan, rapor, foto)
                                    </p>
                                </div>
                                <Toggle
                                    id="dashboard_upload_syarat"
                                    checked={data.dashboard_upload_syarat === '1'}
                                    onChange={handleDashboardUploadSyaratToggle}
                                    label={data.dashboard_upload_syarat === '1' ? 'Aktif' : 'Nonaktif'}
                                />
                            </div>
                        </div>
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
