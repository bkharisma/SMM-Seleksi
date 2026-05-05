import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PortalLayout from '@/components/layout/portal-layout';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface Prodi {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
    singkatan_prodi: string | null;
    jenjang_prodi: string;
}

interface Survey {
    id: number;
    keterangan: string;
}

interface RegistrasiProps {
    periode: { spmb: string; tgl_awal: string; tgl_akhir: string } | null;
    aktif: number;
    biaya: number;
    maxPilihan: number;
    prodi: Prodi[];
    survey: Survey[];
}

export default function Registrasi({ periode, aktif, biaya, maxPilihan, prodi, survey }: RegistrasiProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        email: '',
        hp: '',
        tgllahir: '',
        kwng: 'WNI',
        pil1: '',
        pil2: '',
        pil3: '',
        pil4: '',
        taustp: '',
        nama_sekolah: '',
    });

    useEffect(() => {
        if (flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/registrasi', {
            onError: () => {
                setShowAlert(true);
            },
        });
    };

    const nextStep = () => {
        if (step === 1) {
            if (!data.nama || !data.email || !data.hp || !data.tgllahir) {
                setShowAlert(true);
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const prodiOptions = Array.isArray(prodi) ? prodi.map((p) => ({
        value: p.id.toString(),
        label: `[${p.jenjang_prodi}] ${p.nama_prodi}`,
    })) : [];

    const surveyOptions = Array.isArray(survey) ? survey.map((s) => ({
        value: s.id.toString(),
        label: s.keterangan,
    })) : [];

    if (!periode || !aktif) {
        return (
            <PortalLayout title="Pendaftaran">
                <Head title="Pendaftaran" />
                <Card>
                    <div className="py-8 text-center">
                        <svg className="mx-auto h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Pendaftaran Ditutup</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Pendaftaran saat ini sedang tidak dibuka. Silakan cek kembali nanti.
                        </p>
                    </div>
                </Card>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout title="Formulir Pendaftaran">
            <Head title="Pendaftaran" />

            {showAlert && flash?.error && (
                <div className="mb-4">
                    <Alert type="error" message={flash.error} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-1 items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                                    s <= step
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`h-1 flex-1 ${
                                        s < step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="mb-4 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <span>Data Pribadi</span>
                    <span>Pilihan Prodi</span>
                    <span>Konfirmasi</span>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Pribadi</h3>
                                <Input
                                    id="nama"
                                    label="Nama Lengkap"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    error={errors.nama}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                />
                                <Input
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                    placeholder="email@contoh.com"
                                />
                                <Input
                                    id="hp"
                                    label="Nomor HP/WhatsApp"
                                    value={data.hp}
                                    onChange={(e) => setData('hp', e.target.value)}
                                    error={errors.hp}
                                    required
                                    placeholder="08xxxxxxxxxx"
                                />
                                <Input
                                    id="tgllahir"
                                    label="Tanggal Lahir"
                                    type="date"
                                    value={data.tgllahir}
                                    onChange={(e) => setData('tgllahir', e.target.value)}
                                    error={errors.tgllahir}
                                    required
                                />
                                <Select
                                    id="kwng"
                                    label="Kewarganegaraan"
                                    value={data.kwng}
                                    onChange={(e) => setData('kwng', e.target.value)}
                                    options={[
                                        { value: 'WNI', label: 'WNI' },
                                        { value: 'WNA', label: 'WNA' },
                                    ]}
                                />
                                <Input
                                    id="nama_sekolah"
                                    label="Asal Sekolah"
                                    value={data.nama_sekolah}
                                    onChange={(e) => setData('nama_sekolah', e.target.value)}
                                    error={errors.nama_sekolah}
                                    placeholder="Nama SMA/SMK/MA"
                                />
                                <div className="flex justify-end">
                                    <Button type="button" onClick={nextStep}>
                                        Lanjutkan
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pilihan Program Studi</h3>
                                <Select
                                    id="pil1"
                                    label="Pilihan Prodi 1 (Wajib)"
                                    value={data.pil1}
                                    onChange={(e) => setData('pil1', e.target.value)}
                                    options={prodiOptions}
                                    placeholder="Pilih Prodi 1"
                                    error={errors.pil1}
                                    required
                                />
                                <Select
                                    id="pil2"
                                    label="Pilihan Prodi 2"
                                    value={data.pil2}
                                    onChange={(e) => setData('pil2', e.target.value)}
                                    options={prodiOptions}
                                    placeholder="Pilih Prodi 2 (opsional)"
                                    error={errors.pil2}
                                />
                                {maxPilihan >= 3 && (
                                    <Select
                                        id="pil3"
                                        label="Pilihan Prodi 3"
                                        value={data.pil3}
                                        onChange={(e) => setData('pil3', e.target.value)}
                                        options={prodiOptions}
                                        placeholder="Pilih Prodi 3 (opsional)"
                                        error={errors.pil3}
                                    />
                                )}
                                {maxPilihan >= 4 && (
                                    <Select
                                        id="pil4"
                                        label="Pilihan Prodi 4"
                                        value={data.pil4}
                                        onChange={(e) => setData('pil4', e.target.value)}
                                        options={prodiOptions}
                                        placeholder="Pilih Prodi 4 (opsional)"
                                        error={errors.pil4}
                                    />
                                )}
                                <Select
                                    id="taustp"
                                    label="Sumber Informasi"
                                    value={data.taustp}
                                    onChange={(e) => setData('taustp', e.target.value)}
                                    options={surveyOptions}
                                    placeholder="Dari mana Anda mengetahui info ini?"
                                />
                                <div className="flex justify-between">
                                    <Button type="button" variant="secondary" onClick={prevStep}>
                                        Kembali
                                    </Button>
                                    <Button type="button" onClick={nextStep}>
                                        Lanjutkan
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Konfirmasi & Pembayaran</h3>
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Ringkasan Pendaftaran</h4>
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">Nama:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white">{data.nama}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">Email:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white">{data.email}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">HP:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white">{data.hp}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">Asal Sekolah:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white">{data.nama_sekolah || '-'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">Pilihan 1:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white">
                                                {Array.isArray(prodi) ? prodi.find((p) => p.id.toString() === data.pil1)?.nama_prodi || '-' : '-'}
                                            </dd>
                                        </div>
                                        {data.pil2 && (
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Pilihan 2:</dt>
                                                <dd className="font-medium text-gray-900 dark:text-white">
                                                    {Array.isArray(prodi) ? prodi.find((p) => p.id.toString() === data.pil2)?.nama_prodi || '-' : '-'}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                    <h4 className="font-medium text-blue-900 dark:text-blue-300">Biaya Pendaftaran</h4>
                                    <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        Rp {biaya.toLocaleString('id-ID')}
                                    </p>
                                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                                        Pembayaran melalui Virtual Account BSI setelah pendaftaran berhasil.
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="secondary" onClick={prevStep}>
                                        Kembali
                                    </Button>
                                    <Button type="submit" isLoading={processing}>
                                        Daftar & Bayar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </Card>
            </div>
        </PortalLayout>
    );
}
