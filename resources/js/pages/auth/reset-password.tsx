import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/components/layout/auth-layout';

interface ResetPasswordProps {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <AuthLayout title="Reset Password">
            <Head title="Reset Password" />
            <form onSubmit={submit} className="space-y-4">
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
                        readOnly
                    />
                    {errors.email && <p className="mt-1 text-label-md text-error">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="mb-1 block text-label-md text-on-surface-container">
                        Password Baru
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        autoFocus
                    />
                    {errors.password && <p className="mt-1 text-label-md text-error">{errors.password}</p>}
                </div>
                <div>
                    <label htmlFor="password_confirmation" className="mb-1 block text-label-md text-on-surface-container">
                        Konfirmasi Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                    />
                    {errors.password_confirmation && <p className="mt-1 text-label-md text-error">{errors.password_confirmation}</p>}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-primary px-4 py-2 font-button text-button text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {processing ? 'Memproses...' : 'Reset Password'}
                </button>
            </form>
        </AuthLayout>
    );
}
