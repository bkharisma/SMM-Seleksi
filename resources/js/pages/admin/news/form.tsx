import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import FileUpload from '@/components/ui/file-upload';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';

interface News {
    id: number;
    post_name: string;
    news_type: string | null;
    title: string;
    description: string;
    img: string | null;
    pdf: string | null;
    status: string;
}

interface NewsFormProps {
    news: News | null;
}

export default function NewsForm({ news }: NewsFormProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(news?.img ? `/storage/${news.img}` : null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfName, setPdfName] = useState<string | null>(news?.pdf ? news.pdf.split('/').pop() ?? null : null);
    const isEdit = !!news;

    const { data, setData, post, put, processing, errors } = useForm({
        post_name: news?.post_name || '',
        news_type: news?.news_type || '',
        title: news?.title || '',
        description: news?.description || '',
        status: news?.status || 'draft',
        img: null as File | null,
        pdf: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }, 0);
        }
    }, [flash]);

    const handleImageChange = (file: File | null) => {
        if (file) {
            setData('img', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePdfChange = (file: File | null) => {
        setPdfFile(file);

        if (file) {
            setData('pdf', file);
            setPdfName(file.name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/news/${news!.id}`);
        } else {
            post('/admin/news');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Berita' : 'Tambah Berita'}>
            <Head title={isEdit ? 'Edit Berita' : 'Tambah Berita'} />

            {showAlert && flash?.success && (
                <div className="mb-4">
                    <Alert type="success" message={flash.success} onClose={() => setShowAlert(false)} />
                </div>
            )}

            <Card title={isEdit ? 'Edit Berita' : 'Tambah Berita'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            id="title"
                            label="Judul"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            error={errors.title}
                            required
                        />
                        <Input
                            id="post_name"
                            label="Slug"
                            value={data.post_name}
                            onChange={(e) => setData('post_name', e.target.value)}
                            error={errors.post_name}
                            required
                            helper="Gunakan huruf kecil dan tanda hubung (-)"
                        />
                        <Input
                            id="news_type"
                            label="Tipe Berita"
                            value={data.news_type}
                            onChange={(e) => setData('news_type', e.target.value)}
                            error={errors.news_type}
                            placeholder="Contoh: pengumuman, info"
                        />
                        <Select
                            id="status"
                            label="Status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            options={[
                                { value: 'draft', label: 'Draft' },
                                { value: 'published', label: 'Published' },
                            ]}
                            error={errors.status}
                        />
                    </div>
                    <Textarea
                        id="description"
                        label="Deskripsi"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                        required
                        rows={6}
                    />
                    <FileUpload
                        label="Gambar (opsional)"
                        accept="image/*"
                        onChange={handleImageChange}
                        error={errors.img}
                        preview={imagePreview}
                        maxSize="2MB"
                    />
                    <div>
                        <FileUpload
                            label="File PDF (opsional)"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            error={errors.pdf}
                            maxSize="10MB"
                        />
                        {pdfName && !pdfFile && (
                            <p className="mt-1 text-xs text-on-surface-variant">File saat ini: {pdfName}</p>
                        )}
                        {pdfName && pdfFile && (
                            <p className="mt-1 text-xs text-on-surface-variant">File baru: {pdfName}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link href="/admin/news">
                            <Button variant="secondary" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" isLoading={processing}>
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AdminLayout>
    );
}
