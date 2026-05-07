<?php

use App\Models\BsiPembayaran;
use App\Models\Peminat;
use App\Models\Pendaftar;
use App\Models\Periode;
use App\Models\Prodi;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();

    Role::create(['name' => 'mahasiswa', 'guard_name' => 'web']);

    Periode::create([
        'spmb' => '20251',
        'tgl_awal' => now()->subDay(),
        'tgl_akhir' => now()->addDay(),
        'active' => true,
    ]);

    Prodi::create([
        'id' => 1,
        'kode_prodi' => 'D4HOT',
        'nama_prodi' => 'D4 Hotel',
        'jenjang_prodi' => 'D4',
        'active' => true,
    ]);

    $peminat = Peminat::create([
        'nup' => '250001',
        'nama' => 'Test User',
        'pwd' => 'password123',
        'email' => 'test@example.com',
        'hp' => '081234567890',
        'tgldaftar' => now(),
        'tgllahir' => '2000-01-01',
        'pil1' => 1,
    ]);
});

test('bsi callback missing trx_id returns error', function () {
    $response = $this->postJson('/api/callback/bsi', [
        'status' => 'SUCCESS',
        'payment_amount' => 200000,
    ]);

    $response->assertStatus(400);
    $response->assertJson(['statusCode' => '4000000']);
});

test('bsi callback with valid data processes payment', function () {
    $peminat = Peminat::first();

    BsiPembayaran::create([
        'trx_id' => 1234567890,
        'peminat_id' => $peminat->id,
        'trx_amount' => 200000,
        'virtual_account' => '9901000000000001',
        'description' => 'Test payment',
        'datetime_expired' => now()->addDay(),
    ]);

    $response = $this->postJson('/api/callback/bsi', [
        'trx_id' => 1234567890,
        'status' => 'SUCCESS',
        'payment_amount' => 200000,
        'virtual_account' => '9901000000000001',
    ]);

    $response->assertStatus(200);
    $response->assertJson(['statusCode' => '2000000']);

    $payment = BsiPembayaran::where('trx_id', 1234567890)->first();
    expect($payment->payment_amount)->toBe(200000);
});

test('bsi callback promotes peminat to peserta', function () {
    $peminat = Peminat::first();

    BsiPembayaran::create([
        'trx_id' => 1234567891,
        'peminat_id' => $peminat->id,
        'trx_amount' => 200000,
        'virtual_account' => '9901000000000002',
        'description' => 'Test payment',
        'datetime_expired' => now()->addDay(),
    ]);

    $this->postJson('/api/callback/bsi', [
        'trx_id' => 1234567891,
        'status' => 'SUCCESS',
        'payment_amount' => 200000,
        'virtual_account' => '9901000000000002',
    ]);

    $peserta = Pendaftar::where('kode_pendaftar', '250001')->first();
    expect($peserta)->not->toBeNull();
    expect($peserta->nama)->toBe('Test User');
    expect($peserta->email)->toBe('test@example.com');
});

test('bsi callback duplicate payment returns success', function () {
    $peminat = Peminat::first();

    $payment = BsiPembayaran::create([
        'trx_id' => 1234567892,
        'peminat_id' => $peminat->id,
        'trx_amount' => 200000,
        'virtual_account' => '9901000000000003',
        'description' => 'Test payment',
        'datetime_expired' => now()->addDay(),
    ]);

    $payment->update([
        'payment_amount' => 200000,
        'datetime_payment' => now(),
        'datetime_payment_iso8601' => now(),
    ]);

    $response = $this->postJson('/api/callback/bsi', [
        'trx_id' => 1234567892,
        'status' => 'SUCCESS',
        'payment_amount' => 200000,
    ]);

    $response->assertStatus(200);
});
