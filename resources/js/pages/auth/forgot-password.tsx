import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/components/layout/auth-layout';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <AuthLayout title="Lupa Password">
            <Head title="Lupa Password" />
            <form onSubmit={submit} className="space-y-4">
                <p className="text-label-md text-on-surface-container">
                    Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                </p>
                <div>
                    <label htmlFor="email" className="mb-1 block text-label-md text-on-surface-container">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        autoFocus
                    />
                    {errors.email && <p className="mt-1 text-label-md text-error">{errors.email}</p>}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-primary px-4 py-2 font-button text-button text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {processing ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
                <div className="text-center text-label-md">
                    <a href="/login" className="text-primary hover:underline">
                        Kembali ke Login
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
}
