import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface Provinsi {
    kode_prop: string;
    nama_prop: string;
}

interface Kabupaten {
    kode_kab: string;
    nama_kab: string;
    kode_prop: string;
}

interface Peserta {
    nup: string;
    noujian: string | null;
    nama: string;
    foto: string | null;
    nik: string | null;
    tempatlahir: string | null;
    tgllahir: string | null;
    goldarah: string | null;
    sex: string | null;
    agama: string | null;
    email: string | null;
    hp: string | null;
    kode_prop: string | null;
    kode_kab: string | null;
    alamat: string | null;
    kodepos: string | null;
}

interface ProfileProps {
    peserta: Peserta;
    provinsi: Provinsi[];
    kabupaten: Kabupaten[];
}

export default function DataPribadi({ peserta, provinsi, kabupaten }: ProfileProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [kabupatenList, setKabupatenList] = useState<Kabupaten[]>(kabupaten);

    const { data, setData, put, processing, errors } = useForm({
        nama: peserta.nama || '',
        nik: peserta.nik || '',
        tempatlahir: peserta.tempatlahir || '',
        tgllahir: peserta.tgllahir || '',
        goldarah: peserta.goldarah || '',
        sex: peserta.sex || '',
        agama: peserta.agama || '',
        email: peserta.email || '',
        hp: peserta.hp || '',
        kode_prop: peserta.kode_prop || '',
        kode_kab: peserta.kode_kab || '',
        alamat: peserta.alamat || '',
        kodepos: peserta.kodepos || '',
    });

    const { data: fotoData, setData: setFotoData, post: postFoto, processing: fotoProcessing } = useForm({
        foto: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    useEffect(() => {
        if (data.kode_prop) {
            setKabupatenList(kabupaten.filter(k => k.kode_prop === data.kode_prop));
        }
    }, [data.kode_prop]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/member/profile');
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFotoData('foto', e.target.files[0]);
        }
    };

    const handleUploadFoto = () => {
        if (!fotoData.foto) return;
        const formData = new FormData();
        formData.append('foto', fotoData.foto);
        router.post('/member/upload-foto', formData as any, {
            forceFormData: true,
        });
    };

    const navItems = [
        { href: '/member/profile', label: 'Data Pribadi', active: true },
        { href: '/member/profile/ortu', label: 'Data Orang Tua', active: false },
        { href: '/member/profile/pendidikan', label: 'Data Pendidikan', active: false },
        { href: '/member/profile/pilihan', label: 'Pilihan Prodi', active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title="Data Pribadi" />

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

                <Card title="Foto Profil">
                    <div className="flex items-center gap-4">
                        <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                            {peserta.foto ? (
                                <img src={`/storage/${peserta.foto}`} alt="Foto" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleFotoChange}
                                className="hidden"
                            />
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="mr-2"
                            >
                                Pilih Foto
                            </Button>
                            {fotoData.foto && (
                                <Button onClick={handleUploadFoto} isLoading={fotoProcessing} size="sm">
                                    Upload
                                </Button>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG. Maks: 2MB</p>
                        </div>
                    </div>
                </Card>

                <Card title="Data Pribadi" className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Input
                                id="nama"
                                label="Nama Lengkap"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                error={errors.nama}
                                required
                            />
                            <Input
                                id="nik"
                                label="NIK"
                                value={data.nik}
                                onChange={(e) => setData('nik', e.target.value)}
                                error={errors.nik}
                            />
                            <Input
                                id="tempatlahir"
                                label="Tempat Lahir"
                                value={data.tempatlahir}
                                onChange={(e) => setData('tempatlahir', e.target.value)}
                                error={errors.tempatlahir}
                            />
                            <Input
                                id="tgllahir"
                                label="Tanggal Lahir"
                                type="date"
                                value={data.tgllahir}
                                onChange={(e) => setData('tgllahir', e.target.value)}
                                error={errors.tgllahir}
                            />
                            <Select
                                id="goldarah"
                                label="Golongan Darah"
                                value={data.goldarah}
                                onChange={(e) => setData('goldarah', e.target.value)}
                                options={[
                                    { value: 'A', label: 'A' },
                                    { value: 'B', label: 'B' },
                                    { value: 'AB', label: 'AB' },
                                    { value: 'O', label: 'O' },
                                ]}
                                placeholder="Pilih Golongan Darah"
                            />
                            <Select
                                id="sex"
                                label="Jenis Kelamin"
                                value={data.sex}
                                onChange={(e) => setData('sex', e.target.value)}
                                options={[
                                    { value: 'L', label: 'Laki-laki' },
                                    { value: 'P', label: 'Perempuan' },
                                ]}
                                placeholder="Pilih Jenis Kelamin"
                            />
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                            />
                            <Input
                                id="hp"
                                label="HP"
                                value={data.hp}
                                onChange={(e) => setData('hp', e.target.value)}
                                error={errors.hp}
                            />
                            <Select
                                id="kode_prop"
                                label="Provinsi"
                                value={data.kode_prop}
                                onChange={(e) => {
                                    setData('kode_prop', e.target.value);
                                    setData('kode_kab', '');
                                }}
                                options={provinsi.map(p => ({ value: p.kode_prop, label: p.nama_prop }))}
                                placeholder="Pilih Provinsi"
                            />
                            <Select
                                id="kode_kab"
                                label="Kabupaten/Kota"
                                value={data.kode_kab}
                                onChange={(e) => setData('kode_kab', e.target.value)}
                                options={kabupatenList.map(k => ({ value: k.kode_kab, label: k.nama_kab }))}
                                placeholder="Pilih Kabupaten"
                            />
                            <Input
                                id="alamat"
                                label="Alamat"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                error={errors.alamat}
                            />
                            <Input
                                id="kodepos"
                                label="Kode Pos"
                                value={data.kodepos}
                                onChange={(e) => setData('kodepos', e.target.value)}
                                error={errors.kodepos}
                            />
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
