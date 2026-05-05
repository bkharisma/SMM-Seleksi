import { Link } from '@inertiajs/react';

export default function AuthLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SMMPTP</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Politeknik Pariwisata Palembang</p>
                    </Link>
                </div>
                <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                    {title && (
                        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                    )}
                    {children}
                </div>
                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} SMMPTP Poltekpar Palembang
                </div>
            </div>
        </div>
    );
}
