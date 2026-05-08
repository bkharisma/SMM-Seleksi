import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import DataTable from '@/components/ui/data-table';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

interface Role {
    id: number;
    name: string;
}

interface UserData {
    id: number;
    name: string;
    username: string;
    email: string | null;
    status: boolean;
    roles: Role[];
    created_at: string;
}

interface PaginatedData {
    data: UserData[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface UsersIndexProps {
    users: PaginatedData;
    roles: Role[];
    filters: { search?: string; role?: string; status?: string };
}

export default function UsersIndex({ users, roles, filters }: UsersIndexProps) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }, [flash]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (roleFilter) params.set('role', roleFilter);
        if (statusFilter) params.set('status', statusFilter);
        router.get(`/admin/users?${params.toString()}`, {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Nama',
            render: (item: UserData) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-gray-500">@{item.username}</div>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            render: (item: UserData) => item.email || '-',
        },
        {
            key: 'roles',
            label: 'Role',
            render: (item: UserData) => (
                <div className="flex gap-1">
                    {item.roles.map((role) => (
                        <Badge key={role.name} variant={role.name === 'superadmin' ? 'danger' : role.name === 'admin' ? 'warning' : 'info'}>
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: UserData) => (
                <Badge variant={item.status ? 'success' : 'danger'}>
                    {item.status ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
    ];

    return (
        <AdminLayout title="Manajemen User">
            <Head title="Manajemen User" />

            {showAlert && (flash?.success || flash?.error) && (
                <div className="mb-4">
                    <Alert
                        type={flash?.success ? 'success' : 'error'}
                        message={flash?.success || flash?.error}
                        onClose={() => setShowAlert(false)}
                    />
                </div>
            )}

            <Card
                title="Manajemen User"
                action={
                    <Link href="/admin/users/create">
                        <Button>Tambah User</Button>
                    </Link>
                }
            >
                <div className="mb-4 flex flex-wrap gap-2">
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, username, email..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        options={[{ value: '', label: 'Semua Role' }, ...roles.map((r) => ({ value: r.name, label: r.name }))]}
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Nonaktif' }
                        ]}
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Nonaktif' }
                        ]}
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Semua Status' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Nonaktif' }
                        ]}
                    />
                    <Button onClick={handleSearch} size="sm">Cari</Button>
                </div>

                <DataTable
                    data={users.data}
                    columns={columns}
                    pagination={users}
                    actions={(item: UserData) => (
                        <>
                            <Link href={`/admin/users/${item.id}/edit`} className="text-sm text-yellow-600 hover:text-yellow-800">
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Hapus
                            </button>
                        </>
                    )}
                />
            </Card>
        </AdminLayout>
    );
}
