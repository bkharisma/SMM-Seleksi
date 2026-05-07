import { Head, Link } from '@inertiajs/react';

interface HomeProps {
    news: Array<{
        id: number;
        title: string;
        description: string;
        post_name: string;
        published_at: string;
    }>;
}

export default function Home({ news }: HomeProps) {
    return (
        <div className="min-h-screen bg-background">
            <Head title="SMMPTP Poltekpar Palembang" />

            <nav className="bg-surface-container-lowest border-b border-outline-variant docked full-width top-0 shadow-sm sticky z-50">
                <div className="flex justify-between items-center w-full px-gutter max-w-[1200px] mx-auto h-20">
                    <div className="text-h3 font-h3 text-primary">Poltekpar Palembang</div>
                    <div className="hidden md:flex gap-cs items-center">
                        <Link href="#" className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors">Beranda</Link>
                        <Link href="#" className="text-secondary font-body-md hover:text-primary-container transition-colors">Informasi</Link>
                        <Link href="#" className="text-secondary font-body-md hover:text-primary-container transition-colors">Dokumen</Link>
                        <Link href="#" className="text-secondary font-body-md hover:text-primary-container transition-colors">Panduan</Link>
                    </div>
                    <div className="flex items-center gap-sm">
                        <Link href="/login-member" className="font-button text-button px-sm py-xs text-primary hover:bg-surface-container transition-colors">Masuk</Link>
                        <Link href="/registrasi" className="font-button text-button px-cs py-xs bg-primary-container text-on-primary-container rounded-lg shadow-sm hover:opacity-90 transition-all">Daftar</Link>
                    </div>
                </div>
            </nav>

            <main>
                <section className="relative overflow-hidden bg-surface-container-low pt-cxl pb-cxl md:pt-[120px] md:pb-[120px]">
                    <div className="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-cxl">
                        <div className="z-10">
                            <span className="inline-block px-sm py-base bg-secondary-container text-on-secondary-fixed font-label-md rounded-full mb-sm">Penerimaan Mahasiswa Baru 2024/2025</span>
                            <h1 className="font-h1 text-on-surface mb-cs">Wujudkan Karir Gemilang di Industri Hospitality Dunia</h1>
                            <p className="text-body-lg text-secondary mb-cl max-w-[500px]">Bergabunglah dengan Politeknik Pariwisata Palembang, institusi pendidikan pariwisata unggulan yang mencetak profesional berstandar internasional.</p>
                            <div className="flex flex-wrap gap-sm">
                                <Link href="/registrasi" className="bg-primary-container text-on-primary-container font-button text-button px-cxl py-cs rounded-lg shadow-md hover:opacity-90 transition-all">Daftar Sekarang</Link>
                                <Link href="#" className="border border-outline text-primary font-button text-button px-cxl py-cs rounded-lg hover:bg-surface-container transition-all flex items-center gap-xs">
                                    <span className="material-symbols-outlined">play_circle</span>
                                    Lihat Profil
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-secondary">article</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-cs rounded-xl shadow-lg border border-outline-variant hidden lg:block">
                                <div className="flex items-center gap-sm">
                                    <div className="bg-primary-container text-on-primary-container p-sm rounded-lg">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <div>
                                        <p className="font-h3 text-primary">A+ Akreditasi</p>
                                        <p className="font-label-md text-secondary">Institusi Terakreditasi Nasional</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-cxl bg-surface-bright">
                    <div className="max-w-[1200px] mx-auto px-gutter">
                        <div className="text-center mb-cxl">
                            <h2 className="font-h2 text-on-surface mb-xs">Informasi Seleksi</h2>
                            <p className="text-secondary font-body-md">Panduan lengkap mengenai jalur masuk dan persyaratan akademik.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-cs">
                            <div className="md:col-span-8 bg-surface-container-lowest p-cl rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <span className="material-symbols-outlined text-primary text-[40px] mb-sm">school</span>
                                        <h3 className="font-h3 text-on-surface mb-sm">SMM Poltekpar Palembang</h3>
                                        <p className="text-secondary font-body-md mb-cs">Seleksi Mandiri Masuk (SMM) merupakan jalur seleksi yang dikelola secara internal oleh Politeknik Pariwisata Palembang untuk menjaring talenta terbaik di bidang perhotelan dan pariwisata.</p>
                                    </div>
                                    <div className="flex items-center gap-cs">
                                        <div className="flex -space-x-4">
                                            <img
                                                alt="Student"
                                                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUX0IKMsO2_GoSCB-GTdzdiI2vqGmb7VGRKN09hWfn533nvEyURz5Afsatcqt2scHjNPrCtetAa28P_u_KokDN0J4Udk03L9AOubvziWcKQGtiv8_5VYEUIZgCqkEjyXwL-ep35u3IN5W1EvJaoR5cMhCkquKJBa0fGEbUsq9ZjCAK4Au2lyBJC0c_ypL2heqFtf0AH5huSl1HdEW6NbmK8hSZBVjAU99xw-L3RcoLp9y6mGF-rMvLQQ2s89hd2IaSyEJpM2Ew2Q"
                                            />
                                            <img
                                                alt="Student"
                                                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKRV2325u3UDYdF018vo2iOif_9-jl0efH3wYJHqKHKQlwFXhiH1zWIPNyMa2A2U_7v0LaR_m19El6GMtVOmgkCGSA1NZnqoUpLXqDOKF2ND0hL-nEXl_Dx1nh8PO6J6fBJkUYy4FeRLPeJo5bwmELYuYNd7bDOqSVHAKJWrw59AUcWDGsPyxVnQw6aL7U1DPN-a739Ajl8cyZtLsJvr9FezYdZV5aRRRTn7xIkGQ94td_vAQZRAjt65AFPNrw77ebgnvtEUOMA"
                                            />
                                            <div className="w-12 h-12 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md">+500</div>
                                        </div>
                                        <span className="text-label-md text-secondary">Pendaftar baru minggu ini</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-4 bg-primary-container text-on-primary-container p-cl rounded-xl shadow-sm text-on-primary-container flex flex-col justify-center">
                                <span className="material-symbols-outlined text-[32px] mb-sm">event_available</span>
                                <h3 className="font-h3 mb-xs">Pendaftaran Dibuka</h3>
                                <p className="font-body-md mb-cl opacity-90">Mulai dari 1 Maret - 30 Juni 2024. Pastikan data Anda lengkap sebelum mengunggah.</p>
                                <Link href="#" className="font-button text-button flex items-center gap-xs hover:underline">
                                    Lihat Jadwal Lengkap <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            </div>

                            <div className="md:col-span-4 bg-surface-container-high p-cl rounded-xl border border-outline-variant hover:bg-surface-variant transition-colors">
                                <span className="material-symbols-outlined text-primary text-[32px] mb-sm">description</span>
                                <h3 className="font-h3 text-on-surface mb-xs">Syarat Dokumen</h3>
                                <ul className="text-secondary font-body-md space-y-xs">
                                    <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">check_circle</span> Scan Ijazah/SKL</li>
                                    <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">check_circle</span> Pas Foto 4x6</li>
                                    <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">check_circle</span> Kartu Keluarga</li>
                                </ul>
                            </div>

                            <div className="md:col-span-8 bg-surface-container-lowest p-cl rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-cl items-center">
                                <div className="flex-1">
                                    <h3 className="font-h3 text-on-surface mb-xs">Program Studi Unggulan</h3>
                                    <p className="text-secondary font-body-md mb-cs">Pilih dari berbagai program studi yang telah teruji dan memiliki jaringan industri luas.</p>
                                    <div className="grid grid-cols-2 gap-sm">
                                        <div className="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Seni Kuliner</div>
                                        <div className="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Tata Hidang</div>
                                        <div className="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Divisi Kamar</div>
                                        <div className="p-sm bg-surface-container rounded-lg text-label-md font-label-md text-primary">Usaha Perjalanan</div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
                                    <img
                                        alt="Culinary Arts"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqAJhIULlScJarcgkrZNwsIetZu0wNP6PENpy_D5kvhTEOkA-teecvhP5xKMOhXeu4OrAbJCI2Czt9bqC2r6dtkCPedYOsmHwKBlJ6cAGBxbUXzNuDVxYj59nybl3RCVCEdZ7xMZVc2F97dZjfxoqkCvVIU-0ODoqUXx-_55_LrEr8K9kLugPnGfyEOT-YXdDaDxM5HsGNplxs2l1QFziZfWMku5eHMMdA2AJS59y36Pe5MEbObctJ4zWuUXcAAEygHWbz2ICBw"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-cxl">
                    <div className="max-w-[1200px] mx-auto px-gutter">
                        <div className="flex justify-between items-end mb-cxl">
                            <div>
                                <h2 className="font-h2 text-on-surface mb-xs">Berita & Pengumuman</h2>
                                <p className="text-secondary font-body-md">Tetap terinformasi dengan update terbaru dari kampus.</p>
                            </div>
                            <button className="text-primary font-button text-button hover:underline hidden md:block">Lihat Semua Berita</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-cs">
                            {news.length > 0 ? news.map((item) => (
                                <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                    <div className="h-48 overflow-hidden">
                                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                            <span className="material-symbols-outlined text-6xl text-secondary">article</span>
                                        </div>
                                    </div>
                                    <div className="p-cs">
                                        <span className="text-label-md text-primary font-bold uppercase tracking-wider mb-xs inline-block">{item.post_name}</span>
                                        <h4 className="font-h3 text-on-surface mb-sm leading-tight">{item.title}</h4>
                                        <p className="text-secondary font-body-md line-clamp-2 mb-cs">{item.description.substring(0, 150)}...</p>
                                        <div className="flex justify-between items-center text-label-md text-outline">
                                            <span>{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="material-symbols-outlined">share</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-secondary col-span-full text-center py-cl">Belum ada berita.</p>
                            )}
                        </div>
                        <button className="w-full mt-cl border border-outline text-primary font-button text-button py-cs rounded-lg md:hidden">Lihat Semua Berita</button>
                    </div>
                </section>

                <section className="py-cxl px-gutter">
                    <div className="max-w-[1200px] mx-auto bg-inverse-surface text-inverse-on-surface rounded-2xl p-cl md:p-cxl text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="font-h2 mb-cs">Siap Memulai Perjalanan Anda?</h2>
                            <p className="font-body-lg mb-cl opacity-80 max-w-[700px] mx-auto">Jangan lewatkan kesempatan untuk menjadi bagian dari generasi pemimpin pariwisata masa depan. Daftar sekarang dan raih impianmu.</p>
                            <Link href="/registrasi" className="bg-primary-container text-on-primary-container font-button text-button px-cxl py-cs rounded-lg shadow-lg hover:bg-primary-fixed-dim transition-all">Mulai Pendaftaran Online</Link>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary opacity-10 rounded-full -ml-24 -mb-24"></div>
                    </div>
                </section>
            </main>

            <footer className="bg-surface-container-highest border-t border-outline-variant">
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-cl max-w-[1200px] mx-auto">
                    <div className="mb-cl md:mb-0">
                        <div className="text-h3 font-h3 text-on-surface mb-xs">Poltekpar Palembang</div>
                        <p className="text-on-surface-variant font-label-md max-w-[300px]">Kampus Unggulan Pariwisata Indonesia Timur. Mencetak profesional hospitality dunia.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-sm">
                        <div className="flex gap-cs mb-xs">
                            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Kontak Kami</Link>
                            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Kebijakan Privasi</Link>
                            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors underline font-label-md">Syarat & Ketentuan</Link>
                        </div>
                        <p className="text-on-surface-variant font-label-md opacity-70">© 2024 Poltekpar Palembang. Seleksi Mandiri Masuk.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
