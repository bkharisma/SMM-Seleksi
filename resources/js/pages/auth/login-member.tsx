import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/components/layout/auth-layout';

export default function LoginMember() {
    const { data, setData, post, processing, errors } = useForm({
        nup: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login-member');
    };

    return (
        <AuthLayout title="Login Peserta">
            <Head title="Login Peserta" />
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="nup" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        NUP (Nomor Urut Peminat)
                    </label>
                    <input
                        id="nup"
                        type="text"
                        value={data.nup}
                        onChange={(e) => setData('nup', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                        autoFocus
                        placeholder="Contoh: 25000001"
                    />
                    {errors.nup && <p className="mt-1 text-sm text-red-600">{errors.nup}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Ingat saya
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Memproses...' : 'Login'}
                </button>
                <div className="border-t pt-4 text-center text-sm dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Admin? </span>
                    <a href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Login Admin
                    </a>
                </div>
                <div className="text-center text-sm">
                    <a href="/registrasi" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Belum punya akun? Daftar di sini
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
}
