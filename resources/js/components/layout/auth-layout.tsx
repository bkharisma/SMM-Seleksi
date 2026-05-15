import { Link, usePage } from '@inertiajs/react';

export default function AuthLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { app } = usePage().props as any;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-lg">
                <div className="mb-6 md:mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {app?.logo_url ? (
                                <img src={app.logo_url} alt="Logo" className="h-14 w-auto object-contain" />
                            ) : (
                                <div className="bg-primary-container text-on-primary-container p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                                </div>
                            )}
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-primary">Seleksi Mandiri Masuk</h1>
                        <p className="text-sm sm:text-base text-on-surface-variant mt-1">Politeknik Pariwisata Palembang</p>
                    </Link>
                </div>
                <div className="rounded-xl bg-surface-container-lowest p-5 sm:p-6 lg:p-8 custom-shadow border border-outline-variant">
                    {title && (
                        <h2 className="mb-5 sm:mb-6 text-xl sm:text-2xl font-semibold text-on-surface">{title}</h2>
                    )}
                    {children}
                </div>
                <div className="mt-6 text-center text-label-md text-secondary">
                    &copy; {new Date().getFullYear()} SMM Poltekpar Palembang
                </div>
            </div>
        </div>
    );
}
