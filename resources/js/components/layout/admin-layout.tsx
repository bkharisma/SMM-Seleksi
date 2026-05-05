import TopNav from './top-nav';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            <TopNav />
            <main className="flex-1">
                {title && (
                    <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
                        </div>
                    </div>
                )}
                <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
