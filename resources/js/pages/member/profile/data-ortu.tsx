import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alert';

interface Peserta {
    nm_ayah: string | null;
    nm_ibu: string | null;
    pek_ayah: string | null;
    pek_ibu: string | null;
    telp_ortu: string | null;
    hp_ortu: string | null;
    email_ortu: string | null;
}

interface OrtuProps {
    peserta: Peserta;
}

export default function DataOrtu({ peserta }: OrtuProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        nm_ayah: peserta.nm_ayah || '',
        nm_ibu: peserta.nm_ibu || '',
        pek_ayah: peserta.pek_ayah || '',
        pek_ibu: peserta.pek_ibu || '',
        telp_ortu: peserta.telp_ortu || '',
        hp_ortu: peserta.hp_ortu || '',
        email_ortu: peserta.email_ortu || '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/member/profile/ortu');
    };

    const navItems = [
        { href: '/member/profile', label: 'Data Pribadi', active: false },
        { href: '/member/profile/ortu', label: 'Data Orang Tua', active: true },
        { href: '/member/profile/pendidikan', label: 'Data Pendidikan', active: false },
        { href: '/member/profile/pilihan', label: 'Pilihan Prodi', active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title="Data Orang Tua" />

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

                <Card title="Data Orang Tua">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Input
                                id="nm_ayah"
                                label="Nama Ayah"
                                value={data.nm_ayah}
                                onChange={(e) => setData('nm_ayah', e.target.value)}
                                error={errors.nm_ayah}
                            />
                            <Input
                                id="nm_ibu"
                                label="Nama Ibu"
                                value={data.nm_ibu}
                                onChange={(e) => setData('nm_ibu', e.target.value)}
                                error={errors.nm_ibu}
                            />
                            <Input
                                id="pek_ayah"
                                label="Pekerjaan Ayah"
                                value={data.pek_ayah}
                                onChange={(e) => setData('pek_ayah', e.target.value)}
                                error={errors.pek_ayah}
                            />
                            <Input
                                id="pek_ibu"
                                label="Pekerjaan Ibu"
                                value={data.pek_ibu}
                                onChange={(e) => setData('pek_ibu', e.target.value)}
                                error={errors.pek_ibu}
                            />
                            <Input
                                id="telp_ortu"
                                label="Telp. Ortu"
                                value={data.telp_ortu}
                                onChange={(e) => setData('telp_ortu', e.target.value)}
                                error={errors.telp_ortu}
                            />
                            <Input
                                id="hp_ortu"
                                label="HP Ortu"
                                value={data.hp_ortu}
                                onChange={(e) => setData('hp_ortu', e.target.value)}
                                error={errors.hp_ortu}
                            />
                            <Input
                                id="email_ortu"
                                label="Email Ortu"
                                type="email"
                                value={data.email_ortu}
                                onChange={(e) => setData('email_ortu', e.target.value)}
                                error={errors.email_ortu}
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
