import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/components/layout/auth-layout';
import RegistrationLink from '@/components/ui/registration-link';

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
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="nup" className="mb-2 block text-body-md font-medium text-on-surface-container">
                        NUP (Nomor Urut Peminat)
                    </label>
                    <input
                        id="nup"
                        type="text"
                        value={data.nup}
                        onChange={(e) => setData('nup', e.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        autoFocus
                        placeholder="Contoh: 25000001"
                    />
                    {errors.nup && <p className="mt-1 text-label-md text-error">{errors.nup}</p>}
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
                <div className="border-t border-outline-variant pt-4 text-center text-label-md">
                    <span className="text-on-surface-variant">Admin? </span>
                    <a href="/login" className="text-primary hover:underline">
                        Login Admin
                    </a>
                </div>
                <div className="text-center text-label-md">
                    <RegistrationLink className="text-primary hover:underline">
                        Belum punya akun? Daftar di sini
                    </RegistrationLink>
                </div>
            </form>
        </AuthLayout>
    );
}
