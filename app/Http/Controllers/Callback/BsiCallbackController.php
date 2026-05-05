<?php

namespace App\Http\Controllers\Callback;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BsiCallbackController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    public function handle(Request $request)
    {
        Log::info('BSI Callback Received', [
            'data' => $request->all(),
        ]);

        $trxId = $request->input('trx_id') ?? $request->input('trxId');
        $status = $request->input('status') ?? $request->input('transaction_status');

        if (! $trxId) {
            return response()->json([
                'statusCode' => '4000000',
                'statusMessage' => 'Missing trx_id',
            ], 400);
        }

        $callbackData = [
            'payment_amount' => $request->input('payment_amount') ?? $request->input('amount'),
            'datetime_payment' => $request->input('datetime_payment') ?? now(),
            'virtual_account' => $request->input('virtual_account'),
            'status' => $status,
        ];

        $result = $this->paymentService->processCallback($trxId, $callbackData);

        if ($result['success']) {
            return response()->json([
                'statusCode' => '2000000',
                'statusMessage' => 'Success',
            ]);
        }

        return response()->json([
            'statusCode' => '4000000',
            'statusMessage' => $result['message'],
        ], 400);
    }
}
