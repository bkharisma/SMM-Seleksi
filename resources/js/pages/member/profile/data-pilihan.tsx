import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Select from '@/components/ui/select';

interface Prodi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
    jenjang_prodi: string;
}

interface Survey {
    id: number;
    keterangan: string;
}

interface Peserta {
    pil1: number | null;
    pil2: number | null;
    pil3: number | null;
    pil4: number | null;
    taustp: number | null;
}

interface PilihanProps {
    peserta: Peserta;
    prodi: Prodi[];
    survey: Survey[];
}

export default function DataPilihan({ peserta, prodi, survey }: PilihanProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        pil1: peserta.pil1?.toString() || '',
        pil2: peserta.pil2?.toString() || '',
        pil3: peserta.pil3?.toString() || '',
        pil4: peserta.pil4?.toString() || '',
        taustp: peserta.taustp?.toString() || '',
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
        put('/member/profile/pilihan');
    };

    const navItems = [
        { href: '/member/profile', label: 'Data Pribadi', active: false },
        { href: '/member/profile/ortu', label: 'Data Orang Tua', active: false },
        { href: '/member/profile/pendidikan', label: 'Data Pendidikan', active: false },
        { href: '/member/profile/pilihan', label: 'Pilihan Prodi', active: true },
    ];

    const prodiOptions = prodi.map(p => ({
        value: p.id.toString(),
        label: `${p.nama_prodi} (${p.jenjang_prodi})`,
    }));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title="Pilihan Prodi" />

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

                <Card title="Pilihan Program Studi">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Pilih program studi yang diinginkan. Pilihan 1 wajib diisi.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Select
                                id="pil1"
                                label="Pilihan 1 *"
                                value={data.pil1}
                                onChange={(e) => setData('pil1', e.target.value)}
                                options={prodiOptions}
                                placeholder="Pilih Prodi 1"
                                error={errors.pil1}
                            />
                            <Select
                                id="pil2"
                                label="Pilihan 2"
                                value={data.pil2}
                                onChange={(e) => setData('pil2', e.target.value)}
                                options={prodiOptions}
                                placeholder="Pilih Prodi 2"
                            />
                            <Select
                                id="pil3"
                                label="Pilihan 3"
                                value={data.pil3}
                                onChange={(e) => setData('pil3', e.target.value)}
                                options={prodiOptions}
                                placeholder="Pilih Prodi 3"
                            />
                            <Select
                                id="pil4"
                                label="Pilihan 4"
                                value={data.pil4}
                                onChange={(e) => setData('pil4', e.target.value)}
                                options={prodiOptions}
                                placeholder="Pilih Prodi 4"
                            />
                            <Select
                                id="taustp"
                                label="Sumber Informasi"
                                value={data.taustp}
                                onChange={(e) => setData('taustp', e.target.value)}
                                options={survey.map(s => ({ value: s.id.toString(), label: s.keterangan }))}
                                placeholder="Pilih Sumber Informasi"
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
