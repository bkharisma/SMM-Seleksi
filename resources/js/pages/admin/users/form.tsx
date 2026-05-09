import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
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
                            <Input
                                label="Nama Lengkap"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
 
                        <div>
                            <Input
                                label="Username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
 
                        <div>
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
 
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Input
                                    label={`Password ${user ? '(kosongkan jika tidak diubah)' : ''}`}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={!user}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Konfirmasi Password"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required={!user}
                                />
                            </div>
                        </div>
 
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Select
                                    label="Role"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    options={roles.map((r) => ({ value: r.name, label: r.name }))}
                                />
                            </div>
                            <div>
                                <Select
                                    label="Status"
                                    value={status ? '1' : '0'}
                                    onChange={(e) => setStatus(e.target.value === '1')}
                                    options={[
                                        { value: '1', label: 'Aktif' },
                                        { value: '0', label: 'Nonaktif' }
                                    ]}
                                />
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
