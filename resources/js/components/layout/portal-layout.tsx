import { Link } from '@inertiajs/react';

interface PortalLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function PortalLayout({ children, title }: PortalLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        SMMPTP Poltekpar
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                            Beranda
                        </Link>
                        <Link href="/kelulusan" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                            Cek Kelulusan
                        </Link>
                        <Link href="/registrasi" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Daftar Sekarang
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {title && (
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    </div>
                )}
                {children}
            </main>
            <footer className="mt-16 border-t bg-white py-8 dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:px-6 lg:px-8">
                    <p>&copy; {new Date().getFullYear()} SMMPTP Politeknik Pariwisata Palembang. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
