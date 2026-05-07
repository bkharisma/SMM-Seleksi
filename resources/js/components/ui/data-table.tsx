import { router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from './pagination';
import Badge from './badge';

interface Column<T = any> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T = any> {
    data: T[];
    columns: Column<T>[];
    pagination?: {
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
    search?: string;
    onSearch?: (value: string) => void;
    actions?: (item: T) => React.ReactNode;
    emptyMessage?: string;
    loading?: boolean;
    selectable?: boolean;
    selectedIds?: Set<number>;
    onToggle?: (id: number) => void;
    onToggleAll?: () => void;
    idKey?: string;
}

export default function DataTable<T = any>({
    data,
    columns,
    pagination,
    search,
    onSearch,
    actions,
    emptyMessage = 'Tidak ada data',
    loading = false,
    selectable = false,
    selectedIds = new Set(),
    onToggle,
    onToggleAll,
    idKey = 'id',
}: DataTableProps<T>) {
    const [searchValue, setSearchValue] = useState(search || '');

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    const handleSort = (key: string) => {
        const url = new URL(window.location.href);
        const currentSort = url.searchParams.get('sort');
        const currentOrder = url.searchParams.get('order');

        if (currentSort === key) {
            url.searchParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
        } else {
            url.searchParams.set('sort', key);
            url.searchParams.set('order', 'asc');
        }

        router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
    };

    const getSortIcon = (key: string) => {
        const url = new URL(window.location.href);
        const currentSort = url.searchParams.get('sort');
        const currentOrder = url.searchParams.get('order');

        if (currentSort !== key) return '↕';
        return currentOrder === 'asc' ? '↑' : '↓';
    };

    const colSpan = columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0);

    return (
        <div>
            {onSearch && (
                <div className="mb-4 flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Cari data..."
                            className="w-full rounded-lg border border-outline-variant py-2 pl-10 pr-4 text-sm text-on-background bg-surface-container-lowest focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <svg className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-container/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-on-primary hover:bg-primary/90"
                    >
                        Cari
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-outline-variant">
                <table className="w-full">
                    <thead className="bg-surface-container">
                        <tr>
                            {selectable && (
                                <th className="px-3 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        checked={data.length > 0 && data.every((item: any) => selectedIds.has(item[idKey]))}
                                        onChange={() => onToggleAll?.()}
                                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-container ${
                                        col.sortable ? 'cursor-pointer select-none hover:text-primary' : ''
                                    } ${col.className || ''}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && <span className="text-xs">{getSortIcon(col.key)}</span>}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-on-surface-container">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                        {loading ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 py-8 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="h-5 w-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span className="text-sm text-on-surface-container">Memuat data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-on-surface-container">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item: any, index) => (
                                <tr key={item.id || index} className="hover:bg-surface-container">
                                    {selectable && (
                                        <td className="px-3 py-3 w-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(item[idKey])}
                                                onChange={() => onToggle?.(item[idKey])}
                                                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td key={col.key} className={`whitespace-nowrap px-4 py-3 text-sm text-on-background ${col.className || ''}`}>
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                            <div className="flex items-center justify-end gap-2">{actions(item)}</div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && <Pagination {...pagination} />}
        </div>
    );
}
