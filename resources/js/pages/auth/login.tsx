import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/components/layout/auth-layout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout title="Login Admin">
            <Head title="Login Admin" />
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="mb-2 block text-body-md font-medium text-on-surface-container">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        autoFocus
                    />
                    {errors.email && <p className="mt-1 text-label-md text-error">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="mb-2 block text-body-md font-medium text-on-surface-container">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                    />
                    {errors.password && <p className="mt-1 text-label-md text-error">{errors.password}</p>}
                </div>
                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember" className="ml-3 text-body-md text-on-surface-container">
                        Ingat saya
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-primary px-4 py-3 font-button text-button text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {processing ? 'Memproses...' : 'Login'}
                </button>
                <div className="text-center text-label-md">
                    <a href="/forgot-password" className="text-primary hover:underline">
                        Lupa password?
                    </a>
                </div>
                <div className="border-t border-outline-variant pt-4 text-center text-label-md">
                    <span className="text-on-surface-variant">Peserta? </span>
                    <a href="/login-member" className="text-primary hover:underline">
                        Login Peserta
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
}
