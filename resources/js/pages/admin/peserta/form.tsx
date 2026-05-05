import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
    jenjang_prodi: string;
}

interface Ruang {
    id: number;
    nomor_ruang: string;
    nama_gedung: string | null;
}

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
    id: number;
    nup: string;
    noujian: string | null;
    nama: string;
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
    pil1: number | null;
    pil2: number | null;
    pil3: number | null;
    pil4: number | null;
    ruang_id: number | null;
    ruang_kelompok: number | null;
    status: boolean;
}

interface PesertaFormProps {
    peserta: Peserta;
    prodi: Prodi[];
    ruang: Ruang[];
    provinsi: Provinsi[];
    kabupaten: Kabupaten[];
}

export default function PesertaForm({ peserta, prodi, ruang, provinsi, kabupaten }: PesertaFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
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
        pil1: peserta.pil1?.toString() || '',
        pil2: peserta.pil2?.toString() || '',
        pil3: peserta.pil3?.toString() || '',
        pil4: peserta.pil4?.toString() || '',
        ruang_id: peserta.ruang_id?.toString() || '',
        ruang_kelompok: peserta.ruang_kelompok?.toString() || '',
        status: peserta.status,
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
        } else {
            setKabupatenList(kabupaten);
        }
    }, [data.kode_prop]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/peserta/${peserta.id}`);
    };

    return (
        <AdminLayout title={`Edit Peserta - ${peserta.nama}`}>
            <Head title={`Edit ${peserta.nama}`} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={`Edit Peserta: ${peserta.nama} (${peserta.nup})`}>
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

                    <div className="border-t pt-6">
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Pilihan Prodi</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Select
                                id="pil1"
                                label="Pilihan 1"
                                value={data.pil1}
                                onChange={(e) => setData('pil1', e.target.value)}
                                options={prodi.map(p => ({ value: p.id.toString(), label: `${p.nama_prodi} (${p.jenjang_prodi})` }))}
                                placeholder="Pilih Prodi 1"
                                error={errors.pil1}
                            />
                            <Select
                                id="pil2"
                                label="Pilihan 2"
                                value={data.pil2}
                                onChange={(e) => setData('pil2', e.target.value)}
                                options={prodi.map(p => ({ value: p.id.toString(), label: `${p.nama_prodi} (${p.jenjang_prodi})` }))}
                                placeholder="Pilih Prodi 2"
                            />
                            <Select
                                id="pil3"
                                label="Pilihan 3"
                                value={data.pil3}
                                onChange={(e) => setData('pil3', e.target.value)}
                                options={prodi.map(p => ({ value: p.id.toString(), label: `${p.nama_prodi} (${p.jenjang_prodi})` }))}
                                placeholder="Pilih Prodi 3"
                            />
                            <Select
                                id="pil4"
                                label="Pilihan 4"
                                value={data.pil4}
                                onChange={(e) => setData('pil4', e.target.value)}
                                options={prodi.map(p => ({ value: p.id.toString(), label: `${p.nama_prodi} (${p.jenjang_prodi})` }))}
                                placeholder="Pilih Prodi 4"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Ruang Ujian</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Select
                                id="ruang_id"
                                label="Ruang"
                                value={data.ruang_id}
                                onChange={(e) => setData('ruang_id', e.target.value)}
                                options={ruang.map(r => ({ value: r.id.toString(), label: `${r.nomor_ruang} - ${r.nama_gedung}` }))}
                                placeholder="Pilih Ruang"
                            />
                            <Input
                                id="ruang_kelompok"
                                label="Kelompok"
                                type="number"
                                value={data.ruang_kelompok}
                                onChange={(e) => setData('ruang_kelompok', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="status"
                            checked={data.status}
                            onChange={(e) => setData('status', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="status" className="text-sm text-gray-700 dark:text-gray-300">
                            Status Aktif
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Link href="/admin/peserta">
                            <Button variant="secondary" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" isLoading={processing}>Simpan Perubahan</Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
