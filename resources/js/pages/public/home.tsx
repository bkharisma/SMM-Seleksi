import { Head, Link } from '@inertiajs/react';

interface HomeProps {
    news: Array<{
        id: number;
        title: string;
        description: string;
        post_name: string;
        published_at: string;
    }>;
    jadwal: Array<{
        id: number;
        nama_jadwal: string;
        tgl_awal: string;
        tgl_akhir: string;
        keterangan: string;
    }>;
}

export default function Home({ news, jadwal }: HomeProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Head title="SMMPTP Poltekpar Palembang" />
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <h1 className="text-4xl font-bold">SMMPTP Poltekpar Palembang</h1>
                    <p className="mt-4 text-lg text-blue-100">
                        Seleksi Mandiri Masuk Politeknik Pariwisata Palembang
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Link
                            href="/registrasi"
                            className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href="/login-member"
                            className="rounded-lg border border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                        >
                            Login Peserta
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Berita Terbaru</h2>
                        {news.length > 0 ? (
                            <div className="space-y-4">
                                {news.map((item) => (
                                    <div key={item.id} className="rounded-lg border p-4 dark:border-gray-700">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            {item.description.substring(0, 150)}...
                                        </p>
                                        <p className="mt-2 text-xs text-gray-500">{item.published_at}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">Belum ada berita.</p>
                        )}
                    </div>
                    <div>
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Jadwal Kegiatan</h2>
                        {jadwal.length > 0 ? (
                            <div className="space-y-4">
                                {jadwal.map((item) => (
                                    <div key={item.id} className="rounded-lg border p-4 dark:border-gray-700">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.nama_jadwal}</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            {item.tgl_awal} - {item.tgl_akhir}
                                        </p>
                                        {item.keterangan && (
                                            <p className="mt-1 text-sm text-gray-500">{item.keterangan}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">Belum ada jadwal.</p>
                        )}
                    </div>
                </div>
            </main>
            <footer className="border-t bg-gray-50 py-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} SMMPTP Politeknik Pariwisata Palembang
                </div>
            </footer>
        </div>
    );
}
