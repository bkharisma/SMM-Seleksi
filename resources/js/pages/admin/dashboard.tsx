import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';

interface DashboardProps {
    stats: {
        total_pendaftar: number;
        total_pengunjung: number;
        total_lulus: number;
        total_belum_lulus: number;
        total_dengan_noujian: number;
        total_tanpa_noujian: number;
    };
    prodi_distribution: Array<{ name: string; value: number }>;
    monthly_registration: Array<{ month: string; count: number }>;
}

export default function Dashboard({ stats, prodi_distribution, monthly_registration }: DashboardProps) {
    const statCards = [
        {
            label: 'Total Pendaftar',
            value: stats.total_pendaftar,
            color: 'bg-primary-container/10 text-primary-container',
            icon: 'group',
            trend: '+12%',
            trendColor: 'text-green-600 bg-green-50'
        },
        {
            label: 'Terverifikasi',
            value: stats.total_dengan_noujian,
            color: 'bg-secondary-container/20 text-secondary',
            icon: 'verified',
            trend: '+8%',
            trendColor: 'text-green-600 bg-green-50'
        },
        {
            label: 'Menunggu',
            value: stats.total_belum_lulus,
            color: 'bg-tertiary-fixed text-tertiary',
            icon: 'pending_actions',
            trend: 'Aktif',
            trendColor: 'text-amber-600 bg-amber-50'
        },
        {
            label: 'Ditolak',
            value: stats.total_tanpa_noujian || 0,
            color: 'bg-error-container text-error',
            icon: 'cancel',
            trend: '-2%',
            trendColor: 'text-error bg-error-container/50'
        }
    ];

    const dailyRegistrations = [120, 185, 150, 240, 210, 130, 170];
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    const activities = [
        { type: 'Pendaftar Baru', icon: 'person_add', iconColor: 'bg-primary-fixed text-primary', desc: 'Andi Pratama telah mengisi formulir.', time: '2 menit yang lalu' },
        { type: 'Dokumen Diunggah', icon: 'upload_file', iconColor: 'bg-secondary-container text-secondary', desc: 'Siti Aminah mengunggah Ijazah SMA.', time: '15 menit yang lalu' },
        { type: 'Verifikasi Berhasil', icon: 'check_circle', iconColor: 'bg-tertiary-fixed text-tertiary', desc: 'Dokumen Budi Santoso telah diverifikasi.', time: '1 jam yang lalu' },
        { type: 'Perlu Tindakan', icon: 'warning', iconColor: 'bg-error-container text-error', desc: 'Foto Rina tidak memenuhi standar kualifikasi.', time: '3 jam yang lalu' },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <header className="mb-cxl flex flex-col md:flex-row justify-between items-start md:items-end gap-sm">
                <div>
                    <h2 className="text-h1 font-h1 text-on-surface mb-xs">Ringkasan Seleksi Mandiri</h2>
                    <p className="text-body-lg text-secondary">Pantau data pendaftaran mahasiswa baru tahun akademik 2024/2025.</p>
                </div>
                <div className="flex gap-sm">
                    <button className="bg-primary-container text-on-primary-container py-2 px-cs rounded-lg font-bold flex items-center justify-center gap-xs shadow-sm">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Laporan Baru
                    </button>
                    <div className="bg-surface-container rounded-lg px-sm py-2 flex items-center gap-xs border border-outline-variant">
                        <span className="material-symbols-outlined text-secondary text-lg">calendar_today</span>
                        <span className="text-label-md text-on-surface">Mei 2024</span>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm mb-cl">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-surface-container-lowest p-cs rounded-xl custom-shadow border border-outline-variant flex flex-col gap-xs">
                        <div className="flex justify-between items-start">
                            <div className={`${card.color} p-xs rounded-lg`}>
                                <span className="material-symbols-outlined">{card.icon}</span>
                            </div>
                            <span className={`text-xs font-bold ${card.trendColor} px-xs py-0.5 rounded`}>{card.trend}</span>
                        </div>
                        <p className="text-label-md text-secondary mt-base">{card.label}</p>
                        <h3 className="text-h2 text-on-surface">{card.value.toLocaleString()}</h3>
                    </div>
                ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-cs">
                <div className="lg:col-span-2 bg-surface-container-lowest p-cs rounded-xl custom-shadow border border-outline-variant">
                    <div className="flex justify-between items-center mb-cl">
                        <div>
                            <h4 className="text-h3 text-on-surface">Tren Registrasi Harian</h4>
                            <p className="text-label-md text-secondary">Data registrasi 7 hari terakhir</p>
                        </div>
                        <select className="bg-surface-container border-none text-label-md font-label-md rounded-lg py-xs">
                            <option>Minggu Ini</option>
                            <option>Bulan Ini</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-base px-base mb-base">
                        {dailyRegistrations.map((value, index) => (
                            <div key={index} className="w-full bg-primary-container/20 hover:bg-primary-container transition-all rounded-t-lg relative group" style={{ height: `${value / 240 * 100}%` }}>
                                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded ${index === 3 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>{value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-secondary px-base">
                        {days.map((day) => (
                            <span key={day}>{day}</span>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-cs rounded-xl custom-shadow border border-outline-variant flex flex-col">
                    <h4 className="text-h3 text-on-surface mb-sm">Aktivitas Terbaru</h4>
                    <div className="space-y-sm overflow-y-auto max-h-[350px] pr-xs">
                        {activities.map((activity, index) => (
                            <div key={index} className={`flex gap-sm ${index < activities.length - 1 ? 'border-b border-outline-variant pb-sm' : 'pb-sm'}`}>
                                <div className={`${activity.iconColor} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                                    <span className="material-symbols-outlined text-sm">{activity.icon}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-label-md text-on-surface">{activity.type}</p>
                                    <p className="text-xs text-on-surface-variant">{activity.desc}</p>
                                    <span className="text-[10px] text-secondary">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-auto pt-cs text-primary font-bold text-label-md text-center hover:underline">Lihat Semua Aktivitas</button>
                </div>

                <div className="lg:col-span-3 bg-primary text-on-primary p-cl rounded-xl flex flex-col md:flex-row items-center gap-cl relative overflow-hidden">
                    <div className="z-10 relative">
                        <h4 className="text-h2 mb-sm">Persiapan Gelombang 2</h4>
                        <p className="text-body-md opacity-90 max-w-xl mb-cs">Seleksi Mandiri Masuk Gelombang 1 akan ditutup dalam 3 hari. Pastikan semua verifikasi berkas diselesaikan sebelum tanggal 30 Mei 2024 pukul 23:59 WIB.</p>
                        <div className="flex gap-sm">
                            <button className="bg-surface-container-lowest text-primary px-cs py-sm rounded-lg font-bold hover:bg-opacity-90 transition-all">Kelola Jadwal</button>
                            <button className="border border-white border-opacity-30 px-cs py-sm rounded-lg font-bold hover:bg-white/10 transition-all">Unduh Laporan G1</button>
                        </div>
                    </div>
                    <div className="md:ml-auto z-10">
                        <img
                            alt="Collaboration"
                            className="w-full max-w-sm rounded-lg shadow-xl object-cover h-48 md:h-64"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBus8FD58q4zzyqMfJcLDDmKZZ3oXWrBRuxSG6a2HmxLVvK6rpa2ORm1DBrsZlWMzyTnL_WMHVoauOs6GaDFEziagbfoSomGqoG5aWPuE6zdhPqTFegC11l1Vh6nhIpfYiuKsHNFe75NIUK9zeOfx2DgBK3-XcGFb9aio2canqbJHZlQTHZjfk3NnNA2h00oZlO3vKNwp9a6L0Y_56R98xvGcHLbT-A8xv4woxghiqlWc96LIm8TC94SxaghvPmSfLLtKI40Kfx8A"
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container-lowest opacity-5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-primary-fixed opacity-10 translate-y-1/2 rounded-full"></div>
                </div>
            </section>

            <footer className="mt-cxl pt-cl border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-sm">
                <p className="text-label-md text-secondary">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
                <div className="flex gap-cs">
                    <a className="text-label-md text-secondary hover:text-primary transition-colors" href="#">Kontak Kami</a>
                    <a className="text-label-md text-secondary hover:text-primary transition-colors" href="#">Kebijakan Privasi</a>
                    <a className="text-label-md text-secondary hover:text-primary transition-colors" href="#">Syarat & Ketentuan</a>
                </div>
            </footer>
        </AdminLayout>
    );
}
