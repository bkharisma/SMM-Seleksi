import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

interface EducationLevel {
    code: string;
    description: string;
}

interface Peserta {
    jenis_sma: string | null;
    nama_sekolah: string | null;
    kota_sekolah: string | null;
    prop_sekolah: string | null;
    thn_sttb: string | null;
    presor_tkt: string | null;
    presor_juara: number | null;
    presor: string | null;
    preskes_tkt: string | null;
    preskes_juara: number | null;
    preskes: string | null;
    prespen_tkt: string | null;
    prespen_juara: number | null;
    prespen: string | null;
}

interface PendidikanProps {
    peserta: Peserta;
    education: EducationLevel[];
}

export default function DataPendidikan({ peserta }: PendidikanProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        jenis_sma: peserta.jenis_sma || '',
        nama_sekolah: peserta.nama_sekolah || '',
        kota_sekolah: peserta.kota_sekolah || '',
        prop_sekolah: peserta.prop_sekolah || '',
        thn_sttb: peserta.thn_sttb || '',
        presor_tkt: peserta.presor_tkt || '',
        presor_juara: peserta.presor_juara?.toString() || '',
        presor: peserta.presor || '',
        preskes_tkt: peserta.preskes_tkt || '',
        preskes_juara: peserta.preskes_juara?.toString() || '',
        preskes: peserta.preskes || '',
        prespen_tkt: peserta.prespen_tkt || '',
        prespen_juara: peserta.prespen_juara?.toString() || '',
        prespen: peserta.prespen || '',
    });

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
        put('/member/profile/pendidikan');
    };

    const navItems = [
        { href: '/member/profile', label: 'Data Pribadi', active: false },
        { href: '/member/profile/ortu', label: 'Data Orang Tua', active: false },
        { href: '/member/profile/pendidikan', label: 'Data Pendidikan', active: true },
        { href: '/member/profile/pilihan', label: 'Pilihan Prodi', active: false },
    ];

    const juaraOptions = [
        { value: '', label: '-' },
        { value: '1', label: 'Juara 1' },
        { value: '2', label: 'Juara 2' },
        { value: '3', label: 'Juara 3' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title="Data Pendidikan" />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Update Profil</h1>
                    <Link href="/member/dashboard">
                        <Button variant="secondary" size="sm">Kembali</Button>
                    </Link>
                </div>

                {showAlert && flash?.success && (
                    <div className="mb-4">
                        <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                    </div>
                )}

                <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg bg-white p-2 shadow dark:bg-gray-800">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`whitespace-nowrap rounded px-4 py-2 text-sm font-medium ${
                                item.active
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <Card title="Data Sekolah">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Select
                                id="jenis_sma"
                                label="Jenis SMA"
                                value={data.jenis_sma}
                                onChange={(e) => setData('jenis_sma', e.target.value)}
                                options={[
                                    { value: 'SMA', label: 'SMA' },
                                    { value: 'SMK', label: 'SMK' },
                                    { value: 'MA', label: 'MA' },
                                    { value: 'Lainnya', label: 'Lainnya' },
                                ]}
                                placeholder="Pilih Jenis SMA"
                            />
                            <Input
                                id="nama_sekolah"
                                label="Nama Sekolah"
                                value={data.nama_sekolah}
                                onChange={(e) => setData('nama_sekolah', e.target.value)}
                                error={errors.nama_sekolah}
                            />
                            <Input
                                id="kota_sekolah"
                                label="Kota Sekolah"
                                value={data.kota_sekolah}
                                onChange={(e) => setData('kota_sekolah', e.target.value)}
                                error={errors.kota_sekolah}
                            />
                            <Input
                                id="prop_sekolah"
                                label="Provinsi Sekolah"
                                value={data.prop_sekolah}
                                onChange={(e) => setData('prop_sekolah', e.target.value)}
                                error={errors.prop_sekolah}
                            />
                            <Input
                                id="thn_sttb"
                                label="Tahun Lulus"
                                value={data.thn_sttb}
                                onChange={(e) => setData('thn_sttb', e.target.value)}
                                error={errors.thn_sttb}
                            />
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Prestasi Olahraga</h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                <Input
                                    id="presor_tkt"
                                    label="Tingkat"
                                    value={data.presor_tkt}
                                    onChange={(e) => setData('presor_tkt', e.target.value)}
                                />
                                <Select
                                    id="presor_juara"
                                    label="Juara"
                                    value={data.presor_juara}
                                    onChange={(e) => setData('presor_juara', e.target.value)}
                                    options={juaraOptions}
                                />
                                <Input
                                    id="presor"
                                    label="Keterangan"
                                    value={data.presor}
                                    onChange={(e) => setData('presor', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Prestasi Kesenian</h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                <Input
                                    id="preskes_tkt"
                                    label="Tingkat"
                                    value={data.preskes_tkt}
                                    onChange={(e) => setData('preskes_tkt', e.target.value)}
                                />
                                <Select
                                    id="preskes_juara"
                                    label="Juara"
                                    value={data.preskes_juara}
                                    onChange={(e) => setData('preskes_juara', e.target.value)}
                                    options={juaraOptions}
                                />
                                <Input
                                    id="preskes"
                                    label="Keterangan"
                                    value={data.preskes}
                                    onChange={(e) => setData('preskes', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Prestasi Penalaran</h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                <Input
                                    id="prespen_tkt"
                                    label="Tingkat"
                                    value={data.prespen_tkt}
                                    onChange={(e) => setData('prespen_tkt', e.target.value)}
                                />
                                <Select
                                    id="prespen_juara"
                                    label="Juara"
                                    value={data.prespen_juara}
                                    onChange={(e) => setData('prespen_juara', e.target.value)}
                                    options={juaraOptions}
                                />
                                <Input
                                    id="prespen"
                                    label="Keterangan"
                                    value={data.prespen}
                                    onChange={(e) => setData('prespen', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="submit" isLoading={processing}>Simpan Perubahan</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
