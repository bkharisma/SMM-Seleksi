<?php

use App\Models\BsiPembayaran;
use App\Models\Peminat;
use App\Models\Periode;
use App\Models\Prodi;
use App\Models\Setup;
use App\Models\Survey;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();

    Setup::set('aktif', 1);
    Setup::set('biaya_pendaftaran', 200000);
    Setup::set('max_pilihan', 4);

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

    Prodi::create([
        'id' => 2,
        'kode_prodi' => 'D3PAR',
        'nama_prodi' => 'D3 Pariwisata',
        'jenjang_prodi' => 'D3',
        'active' => true,
    ]);

    Survey::create([
        'keterangan' => 'Media Sosial',
    ]);
});

test('registrasi page loads successfully', function () {
    $response = $this->get(route('registrasi'));

    $response->assertOk();
    $response->assertInertia(function ($page) {
        $page->component('public/registrasi');
    });
});

test('can register a new peminat', function () {
    $response = $this->post('/registrasi', [
        'nama' => 'John Doe',
        'email' => 'john@example.com',
        'hp' => '081234567890',
        'tgllahir' => '2000-01-01',
        'kwng' => 'WNI',
        'pil1' => 1,
        'taustp' => 1,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    expect(Peminat::where('email', 'john@example.com')->exists())->toBeTrue();
});

test('registration fails if periode is not active', function () {
    Periode::query()->update(['active' => false]);

    $response = $this->post('/registrasi', [
        'nama' => 'John Doe',
        'email' => 'john@example.com',
        'hp' => '081234567890',
        'tgllahir' => '2000-01-01',
        'pil1' => 1,
    ]);

    $response->assertSessionHas('error');
});

test('registration fails if name is empty', function () {
    $response = $this->post('/registrasi', [
        'nama' => '',
        'email' => 'john@example.com',
        'hp' => '081234567890',
        'tgllahir' => '2000-01-01',
        'pil1' => 1,
    ]);

    $response->assertSessionHasErrors(['nama']);
});

test('registration creates bsi virtual account', function () {
    $response = $this->post('/registrasi', [
        'nama' => 'Jane Doe',
        'email' => 'jane@example.com',
        'hp' => '081234567891',
        'tgllahir' => '2000-01-01',
        'kwng' => 'WNI',
        'pil1' => 1,
        'taustp' => 1,
    ]);

    $peminat = Peminat::where('email', 'jane@example.com')->first();
    expect($peminat)->not->toBeNull();
    expect($peminat->nup)->not->toBeNull();

    $va = BsiPembayaran::where('peminat_id', $peminat->id)->first();
    expect($va)->not->toBeNull();
    expect($va->trx_amount)->toBe(200000);
});

test('duplicate email is rejected', function () {
    Peminat::create([
        'nup' => '250001',
        'nama' => 'Existing User',
        'email' => 'existing@example.com',
        'hp' => '081234567899',
        'tgldaftar' => now(),
        'tgllahir' => '2000-01-01',
        'pil1' => Prodi::first()->id,
    ]);

    $response = $this->post('/registrasi', [
        'nama' => 'New User',
        'email' => 'existing@example.com',
        'hp' => '081234567890',
        'tgllahir' => '2000-01-01',
        'pil1' => 1,
    ]);

    $response->assertSessionHasErrors(['email']);
});
