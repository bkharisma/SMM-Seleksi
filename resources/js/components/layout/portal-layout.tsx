import { Link } from '@inertiajs/react';
import RegistrationLink from '@/components/ui/registration-link';

interface PortalLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function PortalLayout({ children, title }: PortalLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-surface-container-lowest shadow-sm border-outline-variant">
                <div className="mx-auto flex max-w-[1200px] items-center justify-between px-gutter h-20">
                    <Link href="/" className="text-h3 font-h3 text-primary">
                        SMM Poltekpar
                    </Link>
                    <nav className="flex items-center gap-sm">
                        <Link href="/" className="text-label-md text-secondary hover:text-primary transition-colors">
                            Beranda
                        </Link>
                        <Link href="/kelulusan/tahap-1" className="text-label-md text-secondary hover:text-primary transition-colors">
                            Hasil Tahap 1
                        </Link>
                        <Link href="/kelulusan/tahap-2" className="text-label-md text-secondary hover:text-primary transition-colors">
                            Hasil Tahap 2
                        </Link>
                        <RegistrationLink className="font-button text-button px-cs py-xs bg-primary-container text-on-primary-container rounded-lg shadow-sm hover:opacity-90 transition-all">
                            Daftar Sekarang
                        </RegistrationLink>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-[1200px] px-gutter py-cl">
                {title && (
                    <div className="mb-cl text-center">
                        <h1 className="text-h2 font-h2 text-on-surface">{title}</h1>
                    </div>
                )}
                {children}
            </main>
            <footer className="mt-cxl pt-cl border-t border-outline-variant">
                <div className="mx-auto max-w-[1200px] px-gutter py-cl text-center text-label-md text-secondary">
                    <p>&copy; {new Date().getFullYear()} SMM Politeknik Pariwisata Palembang. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
