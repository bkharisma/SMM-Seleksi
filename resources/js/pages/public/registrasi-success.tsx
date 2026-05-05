import { Head, Link } from '@inertiajs/react';
import PortalLayout from '@/components/layout/portal-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

interface VaInfo {
    virtual_account: string;
    amount: number;
    expired_at: string;
    is_sandbox: boolean;
}

interface Peminat {
    nup: string;
    nama: string;
    email: string;
    hp: string;
    bsi_pembayaran: {
        virtual_account: string;
        trx_amount: number;
        datetime_expired: string;
    } | null;
}

interface RegistrasiSuccessProps {
    peminat: Peminat;
    va: VaInfo | null;
}

export default function RegistrasiSuccess({ peminat, va }: RegistrasiSuccessProps) {
    return (
        <PortalLayout title="Pendaftaran Berhasil">
            <Head title="Pendaftaran Berhasil" />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Pendaftaran Berhasil!</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Selamat, <strong>{peminat.nama}</strong>! Anda telah terdaftar sebagai peminat.
                        </p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                            <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Data Pendaftaran</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">NUP:</dt>
                                    <dd className="font-mono font-bold text-gray-900 dark:text-white">{peminat.nup}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Email:</dt>
                                    <dd className="text-gray-900 dark:text-white">{peminat.email}</dd>
                                </div>
                            </dl>
                            <p className="mt-3 text-sm text-yellow-600 dark:text-yellow-400">
                                <strong>Penting:</strong> Password login Anda telah dikirim ke email. Silakan cek inbox/spam.
                            </p>
                        </div>

                        {va && (
                            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                <h3 className="mb-2 font-medium text-blue-900 dark:text-blue-300">
                                    Informasi Pembayaran {va.is_sandbox && '(Sandbox)'}
                                </h3>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-blue-700 dark:text-blue-400">Virtual Account BSI:</dt>
                                        <dd className="font-mono text-lg font-bold text-blue-900 dark:text-blue-200">
                                            {va.virtual_account}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-blue-700 dark:text-blue-400">Jumlah:</dt>
                                        <dd className="font-bold text-blue-900 dark:text-blue-200">
                                            Rp {va.amount.toLocaleString('id-ID')}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-blue-700 dark:text-blue-400">Batas Bayar:</dt>
                                        <dd className="text-blue-900 dark:text-blue-200">{va.expired_at}</dd>
                                    </div>
                                </dl>
                                {va.is_sandbox && (
                                    <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                                        Mode Sandbox: Pembayaran akan otomatis dikonfirmasi.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link href="/login-member">
                                <Button>Login Member</Button>
                            </Link>
                            <Link href="/">
                                <Button variant="secondary">Kembali ke Beranda</Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </PortalLayout>
    );
}
