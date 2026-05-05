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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                </p>
                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                        autoFocus
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
                <div className="text-center text-sm">
                    <a href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Kembali ke Login
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
}
