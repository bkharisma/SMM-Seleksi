import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

interface RegistrationLinkProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function RegistrationLink({ children, className, onClick }: RegistrationLinkProps) {
    const { app } = usePage().props as any;
    const customUrl = app?.custom_registration_enabled && app?.custom_registration_url
        ? app.custom_registration_url
        : null;

    if (customUrl) {
        return (
            <a href={customUrl} className={className} onClick={onClick}>
                {children}
            </a>
        );
    }

    return (
        <Link href="/registrasi" className={className} onClick={onClick}>
            {children}
        </Link>
    );
}
