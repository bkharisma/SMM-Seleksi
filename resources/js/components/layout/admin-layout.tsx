import TopNav from './top-nav';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <TopNav />
            <main className="flex-grow px-gutter py-cl max-w-[1400px] mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
