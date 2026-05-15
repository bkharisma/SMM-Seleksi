import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

interface LandingSettingsProps {
    settings: {
        hero_image_path: string;
        accreditation_image_path: string;
    };
}

export default function LandingSettings({ settings }: LandingSettingsProps) {
    const { flash, errors } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [heroPreview, setHeroPreview] = useState<string | null>(settings.hero_image_path ? `/storage/${settings.hero_image_path}` : null);
    const [accreditationPreview, setAccreditationPreview] = useState<string | null>(settings.accreditation_image_path ? `/storage/${settings.accreditation_image_path}` : null);
    const [heroProcessing, setHeroProcessing] = useState(false);
    const [accreditationProcessing, setAccreditationProcessing] = useState(false);
    const heroFileInputRef = useRef<HTMLInputElement>(null);
    const accreditationFileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData } = useForm({
        hero_image: null as File | null,
        accreditation_image: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            setAlertType('success');
            setAlertMessage(flash.success);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('hero_image', file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setHeroPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadHero = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.hero_image) return;

        setHeroProcessing(true);
        const formData = new FormData();
        formData.append('image', data.hero_image);

        router.post('/admin/settings/landing/hero-image', formData, {
            onSuccess: () => {
                setHeroProcessing(false);
                setData('hero_image', null);
                if (heroFileInputRef.current) {
                    heroFileInputRef.current.value = '';
                }
            },
            onError: () => {
                setHeroProcessing(false);
                if (errors?.image) {
                    setAlertType('error');
                    setAlertMessage(errors.image);
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 5000);
                }
            },
        });
    };

    const handleDeleteHero = () => {
        if (confirm('Apakah Anda yakin ingin menghapus hero image?')) {
            router.delete('/admin/settings/landing/hero-image');
        }
    };

    const handleAccreditationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('accreditation_image', file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setAccreditationPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAccreditation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.accreditation_image) return;

        setAccreditationProcessing(true);
        const formData = new FormData();
        formData.append('image', data.accreditation_image);

        router.post('/admin/settings/landing/accreditation-image', formData, {
            onSuccess: () => {
                setAccreditationProcessing(false);
                setData('accreditation_image', null);
                if (accreditationFileInputRef.current) {
                    accreditationFileInputRef.current.value = '';
                }
            },
            onError: () => {
                setAccreditationProcessing(false);
                if (errors?.image) {
                    setAlertType('error');
                    setAlertMessage(errors.image);
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 5000);
                }
            },
        });
    };

    const handleDeleteAccreditation = () => {
        if (confirm('Apakah Anda yakin ingin menghapus foto akreditasi?')) {
            router.delete('/admin/settings/landing/accreditation-image');
        }
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Landing Page" />

            {showAlert && (
                <div className="mb-4">
                    <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title="Pengaturan Landing Page">
                <div className="space-y-8">
                    <div className="border-t border-outline-variant pt-6">
                        <h3 className="mb-2 text-lg font-semibold text-on-surface">Hero Image</h3>
                        <p className="mb-4 text-sm text-on-surface-variant">
                            Gambar utama yang ditampilkan pada bagian hero landing page. Format: PNG, JPG, JPEG, WebP. Maks: 5MB.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-64 h-40 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden">
                                    {heroPreview ? (
                                        <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-4xl mx-auto mb-1">image</span>
                                            <p className="text-xs">Belum ada hero image</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <input
                                    ref={heroFileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleHeroChange}
                                    className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:opacity-90"
                                />
                                <div className="flex gap-sm">
                                    <Button
                                        type="button"
                                        onClick={handleUploadHero}
                                        isLoading={heroProcessing}
                                        disabled={!data.hero_image}
                                    >
                                        Upload Hero Image
                                    </Button>
                                    {heroPreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleDeleteHero}
                                        >
                                            Hapus
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-outline-variant pt-6">
                        <h3 className="mb-2 text-lg font-semibold text-on-surface">Foto Akreditasi</h3>
                        <p className="mb-4 text-sm text-on-surface-variant">
                            Foto yang ditampilkan pada badge akreditasi di bagian hero landing page. Format: PNG, JPG, JPEG, WebP. Maks: 5MB.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-40 h-40 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden">
                                    {accreditationPreview ? (
                                        <img src={accreditationPreview} alt="Accreditation Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-4xl mx-auto mb-1">image</span>
                                            <p className="text-xs">Belum ada foto</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <input
                                    ref={accreditationFileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleAccreditationChange}
                                    className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:opacity-90"
                                />
                                <div className="flex gap-sm">
                                    <Button
                                        type="button"
                                        onClick={handleUploadAccreditation}
                                        isLoading={accreditationProcessing}
                                        disabled={!data.accreditation_image}
                                    >
                                        Upload Foto Akreditasi
                                    </Button>
                                    {accreditationPreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleDeleteAccreditation}
                                        >
                                            Hapus
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </AdminLayout>
    );
}
