import { router } from '@inertiajs/react';
import { useState } from 'react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

export default function Pagination({ links, from, to, total, current_page, last_page, per_page }: PaginationProps) {
    const [goToPage, setGoToPage] = useState('');

    const handlePageClick = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const handleGoToPage = () => {
        const page = parseInt(goToPage);
        if (page >= 1 && page <= last_page) {
            const url = new URL(window.location.href);
            url.searchParams.set('page', page.toString());
            router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
        }
    };

    if (last_page <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:flex-row">
            <div className="text-sm text-gray-700 dark:text-gray-300">
                Menampilkan <span className="font-medium">{from}</span> sampai{' '}
                <span className="font-medium">{to}</span> dari{' '}
                <span className="font-medium">{total}</span> data
            </div>
            <div className="flex items-center gap-2">
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    {links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(link.url)}
                            disabled={!link.url}
                            className={`relative inline-flex items-center px-3 py-2 text-sm font-semibold transition-colors first:rounded-l-md last:rounded-r-md focus:z-20 focus:outline-offset-0 ${
                                !link.url
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800'
                                    : link.active
                                        ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600'
                                        : 'bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={goToPage}
                        onChange={(e) => setGoToPage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
                        placeholder="Halaman"
                        className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        min={1}
                        max={last_page}
                    />
                    <button
                        onClick={handleGoToPage}
                        className="rounded-md bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        Go
                    </button>
                </div>
            </div>
        </div>
    );
}
