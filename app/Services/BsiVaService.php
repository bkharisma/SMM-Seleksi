<?php

namespace App\Services;

use App\Models\BsiPembayaran;
use App\Models\Peminat;
use App\Models\Setup;
use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BsiVaService
{
    protected string $clientId;

    protected string $secretKey;

    protected string $apiUrl;

    public function __construct()
    {
        $this->clientId = config('services.bsi.client_id', env('BSI_CLIENT_ID', ''));
        $this->secretKey = config('services.bsi.secret_key', env('BSI_SECRET_KEY', ''));
        $this->apiUrl = rtrim(config('services.bsi.api_url', env('BSI_API_URL', 'https://sandbox.api.bpi.co.id/ext/bnis/')), '/');
    }

    public function createVirtualAccount(Peminat $peminat, int $amount): array
    {
        $vaNumber = $this->generateVaNumber($peminat);
        $expiredTime = now()->addHours(24);

        if ($this->isMockMode()) {
            $trxId = (int) (time().$peminat->id);

            return $this->mockVaResponse($trxId, $vaNumber, $amount, $expiredTime, $peminat);
        }

        $trxId = time().$peminat->id;

        $data = [
            'type' => 'createbilling',
            'client_id' => $this->clientId,
            'trx_id' => $trxId,
            'trx_amount' => $amount,
            'billing_type' => 'c',
            'customer_name' => $peminat->nama,
            'customer_email' => $peminat->email ?? '',
            'customer_phone' => $peminat->hp ?? '',
            'virtual_account' => $vaNumber,
            'datetime_expired' => $expiredTime->format('Y-m-d\TH:i:sP'),
            'description' => 'Pendaftaran SMMPTP - '.$peminat->nama,
        ];

        try {
            $encryptedData = BsiEnc::encrypt($data, $this->clientId, $this->secretKey);

            $payload = [
                'client_id' => $this->clientId,
                'data' => $encryptedData,
            ];

            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(30)
                ->post($this->apiUrl.'?fungsi=vabilling', $payload);

            if (! $response->successful()) {
                Log::error('BSI VA Creation HTTP Failed', [
                    'peminat_id' => $peminat->id,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Gagal menghubungi BSI: '.$response->status(),
                ];
            }

            $result = $response->json();

            if (($result['status'] ?? '') !== '000') {
                Log::error('BSI VA Creation Failed', [
                    'peminat_id' => $peminat->id,
                    'response' => $result,
                ]);

                return [
                    'success' => false,
                    'message' => $result['message'] ?? 'Gagal membuat virtual account dari BSI.',
                ];
            }

            $decrypted = BsiEnc::decrypt($result['data'], $this->clientId, $this->secretKey);

            $trxIdInt = (int) $trxId;
            BsiPembayaran::create([
                'trx_id' => $trxIdInt,
                'peminat_id' => $peminat->id,
                'trx_amount' => $amount,
                'virtual_account' => $vaNumber,
                'description' => 'Pendaftaran SMMPTP - '.$peminat->nama,
                'datetime_expired' => $expiredTime,
            ]);

            return [
                'success' => true,
                'trx_id' => $trxIdInt,
                'virtual_account' => $vaNumber,
                'amount' => $amount,
                'expired_at' => $expiredTime,
                'response' => $decrypted,
            ];
        } catch (\Exception $e) {
            Log::error('BSI VA Creation Exception', [
                'peminat_id' => $peminat->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghubungi BSI.',
            ];
        }
    }

    public function checkPayment(string $trxId): array
    {
        if ($this->isMockMode()) {
            $payment = BsiPembayaran::where('trx_id', $trxId)->first();
            if (! $payment) {
                return ['success' => false, 'message' => 'Transaksi tidak ditemukan'];
            }

            return [
                'success' => true,
                'is_paid' => $payment->isPaid(),
                'payment' => $payment,
            ];
        }

        $payment = BsiPembayaran::where('trx_id', $trxId)->first();
        if (! $payment) {
            return ['success' => false, 'message' => 'Transaksi tidak ditemukan'];
        }

        return [
            'success' => true,
            'is_paid' => $payment->isPaid(),
            'payment' => $payment,
        ];
    }

    protected function generateVaNumber(Peminat $peminat): string
    {
        $prefix = Setup::get('bsi_va_prefix', '9901');
        $suffix = str_pad($peminat->id, 10, '0', STR_PAD_LEFT);

        return $prefix.$suffix;
    }

    protected function isMockMode(): bool
    {
        return env('BSI_MOCK_MODE', false)
            || config('app.env') === 'local'
            || config('app.env') === 'testing';
    }

    protected function mockVaResponse(int $trxId, string $vaNumber, int $amount, Carbon|CarbonImmutable $expiredAt, Peminat $peminat): array
    {
        BsiPembayaran::create([
            'trx_id' => $trxId,
            'peminat_id' => $peminat->id,
            'trx_amount' => $amount,
            'virtual_account' => $vaNumber,
            'description' => 'Pendaftaran SMMPTP - '.$peminat->nama,
            'datetime_expired' => $expiredAt,
        ]);

        return [
            'success' => true,
            'trx_id' => $trxId,
            'virtual_account' => $vaNumber,
            'amount' => $amount,
            'expired_at' => $expiredAt,
            'response' => [
                'statusCode' => '2000000',
                'statusMessage' => 'Success',
            ],
            'is_sandbox' => true,
        ];
    }
}
