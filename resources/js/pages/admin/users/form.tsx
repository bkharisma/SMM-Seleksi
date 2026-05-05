import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Alert from '@/components/ui/alert';

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
}

interface UserFormProps {
    user: UserData | null;
    roles: Role[];
}

export default function UserForm({ user, roles }: UserFormProps) {
    const { errors } = usePage().props as any;
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState(user?.roles?.[0]?.name || 'admin');
    const [status, setStatus] = useState(user?.status ?? true);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const data = {
            name,
            username,
            email: email || null,
            password: password || undefined,
            password_confirmation: passwordConfirmation || undefined,
            role,
            status,
        };

        if (user) {
            router.put(`/admin/users/${user.id}`, data, {
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/admin/users', data, {
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AdminLayout title={user ? 'Edit User' : 'Tambah User'}>
            <Head title={user ? 'Edit User' : 'Tambah User'} />

            <div className="max-w-2xl">
                <Card title={user ? 'Edit User' : 'Tambah User Baru'}>
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mb-4">
                            <Alert
                                type="error"
                                message={Object.values(errors)[0] as string}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password {user && <span className="text-gray-500">(kosongkan jika tidak diubah)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    required={!user}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Konfirmasi Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    required={!user}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    required
                                >
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    value={status ? '1' : '0'}
                                    onChange={(e) => setStatus(e.target.value === '1')}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="1">Aktif</option>
                                    <option value="0">Nonaktif</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Batal
                            </Button>
                            <Button type="submit" isLoading={processing}>
                                {user ? 'Simpan Perubahan' : 'Tambah User'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}
