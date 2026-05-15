<?php

use App\Models\BsiPembayaran;
use App\Models\Peminat;
use App\Models\Periode;
use App\Models\Prodi;
use App\Models\Setup;
use App\Services\BsiVaService;

beforeEach(function () {
    Setup::set('bsi_va_prefix', '9901');

    Periode::create([
        'spmb' => '20251',
        'tgl_awal' => now()->subDay(),
        'tgl_akhir' => now()->addDay(),
        'active' => true,
    ]);

    Prodi::create([
        'kode_prodi' => 'D4HOT',
        'nama_prodi' => 'D4 Hotel',
        'jenjang_prodi' => 'D4',
        'active' => true,
    ]);
});

test('generates va number with correct prefix and padding', function () {
    $service = new BsiVaService;

    $peminat = Peminat::create([
        'nup' => '250001',
        'nama' => 'Test User',
        'email' => 'test@example.com',
        'hp' => '081234567890',
        'tgldaftar' => now(),
        'tgllahir' => '2000-01-01',
        'pil1' => Prodi::first()->id,
    ]);

    $result = $service->createVirtualAccount($peminat, 200000);

    expect($result['success'])->toBeTrue();
    expect($result['virtual_account'])->toStartWith('9901');
    expect($result['amount'])->toBe(200000);
    expect($result['is_sandbox'])->toBeTrue();
});

test('va number length is correct', function () {
    $service = new BsiVaService;

    $peminat = Peminat::create([
        'nup' => '250002',
        'nama' => 'Test User 2',
        'email' => 'test2@example.com',
        'hp' => '081234567891',
        'tgldaftar' => now(),
        'tgllahir' => '2000-01-01',
        'pil1' => Prodi::first()->id,
    ]);

    $result = $service->createVirtualAccount($peminat, 200000);

    $vaLength = strlen((string) $result['virtual_account']);
    // prefix (4) + padded peminat id (10) = 14
    expect($vaLength)->toBe(14);
});

test('creates bsi pembayaran record in database', function () {
    $service = new BsiVaService;

    $peminat = Peminat::create([
        'nup' => '250003',
        'nama' => 'Test User 3',
        'email' => 'test3@example.com',
        'hp' => '081234567892',
        'tgldaftar' => now(),
        'tgllahir' => '2000-01-01',
        'pil1' => Prodi::first()->id,
    ]);

    $result = $service->createVirtualAccount($peminat, 200000);

    $payment = BsiPembayaran::where('peminat_id', $peminat->id)->first();
    expect($payment)->not->toBeNull();
    expect($payment->trx_amount)->toBe(200000);
    expect($payment->virtual_account)->toBe((string) $result['virtual_account']);
});

test('check payment returns correct status', function () {
    $service = new BsiVaService;

    $peminat = Peminat::create([
        'nup' => '250004',
        'nama' => 'Test User 4',
        'email' => 'test4@example.com',
        'hp' => '081234567893',
        'tgldaftar' => now(),
        'tgllahir' => '2000-01-01',
        'pil1' => Prodi::first()->id,
    ]);

    $result = $service->createVirtualAccount($peminat, 200000);

    $check = $service->checkPayment($result['trx_id']);
    expect($check['success'])->toBeTrue();
    expect($check['is_paid'])->toBeFalse();

    // Mark as paid
    $payment = BsiPembayaran::where('trx_id', $result['trx_id'])->first();
    $payment->update([
        'payment_amount' => 200000,
        'datetime_payment' => now(),
        'datetime_payment_iso8601' => now(),
    ]);

    $check = $service->checkPayment($result['trx_id']);
    expect($check['is_paid'])->toBeTrue();
});

test('bwi pembayaran is_expired works correctly', function () {
    $payment = new BsiPembayaran([
        'trx_id' => 1234567890,
        'trx_amount' => 200000,
        'virtual_account' => 990100000000001,
        'description' => 'Test',
        'datetime_expired' => now()->subHour(),
    ]);

    expect($payment->isExpired())->toBeTrue();

    $payment->datetime_expired = now()->addHour();
    expect($payment->isExpired())->toBeFalse();
});
