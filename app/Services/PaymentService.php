<?php

namespace App\Services;

use App\Mail\PaymentConfirmed;
use App\Models\BsiPembayaran;
use App\Models\Peminat;
use App\Models\Peserta;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentService
{
    public function promoteToPeserta(Peminat $peminat): array
    {
        if ($peminat->bsiPembayaran && ! $peminat->bsiPembayaran->isPaid()) {
            return [
                'success' => false,
                'message' => 'Pembayaran belum dikonfirmasi.',
            ];
        }

        if (Peserta::where('nup', $peminat->nup)->exists()) {
            return [
                'success' => false,
                'message' => 'Peminat sudah menjadi peserta.',
            ];
        }

        return DB::transaction(function () use ($peminat) {
            $user = User::firstOrCreate(
                ['email' => $peminat->email],
                [
                    'name' => $peminat->nama,
                    'username' => $peminat->nup,
                    'password' => Hash::make($peminat->pwd),
                    'status' => 1,
                    'ref_id' => $peminat->id,
                ]
            );

            if (! $user->hasRole('mahasiswa')) {
                $user->assignRole('mahasiswa');
            }

            $peserta = Peserta::create([
                'user_id' => $user->id,
                'nup' => $peminat->nup,
                'tgldaftar' => $peminat->tgldaftar ?? now(),
                'nama' => $peminat->nama,
                'email' => $peminat->email,
                'hp' => $peminat->hp,
                'tgllahir' => $peminat->tgllahir,
                'kwng' => $peminat->kwng ?? 'WNI',
                'pil1' => $peminat->pil1,
                'pil2' => $peminat->pil2,
                'pil3' => $peminat->pil3,
                'pil4' => $peminat->pil4,
                'taustp' => $peminat->taustp,
                'nama_sekolah' => $peminat->nama_sekolah,
                'status' => 1,
            ]);

            try {
                Mail::to($peserta->email)->queue(new PaymentConfirmed($peserta));
            } catch (\Exception $e) {
                Log::error('Failed to send payment confirmation email', [
                    'peserta_id' => $peserta->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return [
                'success' => true,
                'peserta' => $peserta,
                'user' => $user,
            ];
        });
    }

    public function processCallback(string $trxId, array $callbackData): array
    {
        $payment = BsiPembayaran::where('trx_id', $trxId)->first();

        if (! $payment) {
            return [
                'success' => false,
                'message' => 'Transaksi tidak ditemukan.',
            ];
        }

        if ($payment->isPaid()) {
            return [
                'success' => true,
                'message' => 'Pembayaran sudah diproses sebelumnya.',
                'payment' => $payment,
            ];
        }

        $paymentAmount = $callbackData['payment_amount'] ?? $payment->trx_amount;
        $paymentDatetime = $callbackData['datetime_payment'] ?? now();

        $payment->update([
            'payment_amount' => $paymentAmount,
            'cumulative_payment_amount' => $paymentAmount,
            'datetime_payment' => $paymentDatetime,
            'datetime_payment_iso8601' => $paymentDatetime,
        ]);

        $this->promoteToPeserta($payment->peminat);

        return [
            'success' => true,
            'message' => 'Pembayaran berhasil diproses.',
            'payment' => $payment,
        ];
    }
}
