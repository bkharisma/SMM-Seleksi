import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Card from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardProps {
    stats: {
        total_peminat: number;
        total_peserta: number;
        total_pembayaran: number;
        total_pengunjung: number;
        total_lulus: number;
        total_belum_lulus: number;
    };
    prodi_distribution: Array<{ name: string; value: number }>;
    survey_data: Array<{ name: string; value: number }>;
    monthly_registration: Array<{ month: string; count: number }>;
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function Dashboard({ stats, prodi_distribution, survey_data, monthly_registration }: DashboardProps) {
    const cards = [
        { label: 'Total Peminat', value: stats.total_peminat, color: 'bg-blue-500', icon: '👥' },
        { label: 'Total Peserta', value: stats.total_peserta, color: 'bg-green-500', icon: '✅' },
        { label: 'Total Pembayaran', value: stats.total_pembayaran, color: 'bg-yellow-500', icon: '💰' },
        { label: 'Total Pengunjung', value: stats.total_pengunjung, color: 'bg-purple-500', icon: '👁️' },
        { label: 'Total Lulus', value: stats.total_lulus, color: 'bg-emerald-500', icon: '🎓' },
        { label: 'Belum Lulus', value: stats.total_belum_lulus, color: 'bg-red-500', icon: '⏳' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <Card key={card.label}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
                                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color} text-2xl`}>
                                {card.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card title="Distribusi Peserta per Prodi (Pilihan 1)">
                    {prodi_distribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={prodi_distribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {prodi_distribution.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="py-8 text-center text-gray-500">Belum ada data.</p>
                    )}
                </Card>

                <Card title="Pendaftaran per Bulan">
                    {monthly_registration.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthly_registration}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="py-8 text-center text-gray-500">Belum ada data.</p>
                    )}
                </Card>
            </div>

            {survey_data.length > 0 && (
                <div className="mt-6">
                    <Card title="Sumber Informasi Peminat">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={survey_data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            )}

            <div className="mt-6">
                <Card title="Selamat Datang">
                    <p className="text-gray-600 dark:text-gray-400">
                        Sistem Seleksi Mandiri Masuk Politeknik Pariwisata Palembang. Gunakan menu di sebelah kiri untuk mengelola data peminat, peserta, ujian, dan kelulusan.
                    </p>
                </Card>
            </div>
        </AdminLayout>
    );
}
