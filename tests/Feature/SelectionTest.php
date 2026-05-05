<?php

use App\Models\KriteriaKelulusan;
use App\Models\Peserta;
use App\Models\PesertaNilai;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use App\Models\Ujian;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    Role::create(['name' => 'superadmin', 'guard_name' => 'web']);
    Role::create(['name' => 'admin', 'guard_name' => 'web']);
    Role::create(['name' => 'operator', 'guard_name' => 'web']);
    Role::create(['name' => 'mahasiswa', 'guard_name' => 'web']);

    $admin = User::create([
        'name' => 'Admin',
        'email' => 'admin@example.com',
        'username' => 'admin',
        'password' => bcrypt('password'),
        'status' => true,
    ]);
    $admin->assignRole('superadmin');

    Prodi::create([
        'id' => 1,
        'kode_prodi' => 'D4HOT',
        'nama_prodi' => 'D4 Hotel',
        'jenjang_prodi' => 'D4',
        'kuota_smm' => 30,
        'active' => true,
    ]);

    TahapSeleksi::create([
        'nama' => 'Tahap 1',
        'urutan' => 1,
        'active' => true,
    ]);

    Ujian::create([
        'nama' => 'Psikotes',
        'kode' => 'PSIKOTES',
        'active' => true,
    ]);

    $this->actingAs($admin);
});

test('seleksi index page loads for authenticated admin', function () {
    $response = $this->get(route('admin.seleksi.index'));

    $response->assertOk();
    $response->assertInertia(function ($page) {
        $page->component('admin/seleksi/index');
    });
});

test('seleksi preview shows candidates', function () {
    $peserta = Peserta::create([
        'nup' => '250001',
        'noujian' => '25HO0001',
        'nama' => 'Test Peserta',
        'pil1' => 1,
        'status' => true,
    ]);

    KriteriaKelulusan::create([
        'prodi_id' => 1,
        'tahap_seleksi_id' => 1,
        'min_iq' => 90,
        'active' => true,
    ]);

    $ujianId = Ujian::where('kode', 'PSIKOTES')->first()->id;
    PesertaNilai::create([
        'nup' => '250001',
        'ujian_id' => $ujianId,
        'psi_iq' => 100,
        'type' => 'PSIKOTES',
    ]);

    $response = $this->post(route('admin.seleksi.preview'), [
        'tahap_id' => 1,
        'prodi_id' => 1,
        'pilihan' => 1,
    ]);

    $response->assertOk();
});

test('seleksi save marks peserta as lulus', function () {
    $peserta = Peserta::create([
        'nup' => '250001',
        'noujian' => '25HO0001',
        'nama' => 'Test Peserta',
        'pil1' => 1,
        'status' => true,
    ]);

    KriteriaKelulusan::create([
        'prodi_id' => 1,
        'tahap_seleksi_id' => 1,
        'min_iq' => 90,
        'active' => true,
    ]);

    $ujianId = Ujian::where('kode', 'PSIKOTES')->first()->id;
    PesertaNilai::create([
        'nup' => '250001',
        'ujian_id' => $ujianId,
        'psi_iq' => 100,
        'type' => 'PSIKOTES',
    ]);

    $response = $this->post(route('admin.seleksi.save'), [
        'tahap_id' => 1,
        'prodi_id' => 1,
        'pilihan' => 1,
        'selected_nup' => ['250001'],
    ]);

    $response->assertRedirect();

    $peserta->refresh();
    expect($peserta->lulus)->toBe(1);
});

test('seleksi rekap shows summary', function () {
    Peserta::create([
        'nup' => '250001',
        'noujian' => '25HO0001',
        'nama' => 'Test A',
        'pil1' => 1,
        'lulus' => 1,
        'status' => true,
    ]);

    $response = $this->get(route('admin.seleksi.rekap'));

    $response->assertOk();
});

test('seleksi page requires authentication', function () {
    auth()->logout();

    $response = $this->get(route('admin.seleksi.index'));

    $response->assertRedirect(route('login'));
});

test('can check kelulusan as public with valid nup', function () {
    $peserta = Peserta::create([
        'nup' => '250001',
        'noujian' => '25HO0001',
        'nama' => 'Test Peserta',
        'pil1' => 1,
        'lulus' => 1,
        'lulus_tahap' => 'Tahap 1',
        'status' => true,
    ]);

    $user = User::create([
        'name' => 'Test Peserta',
        'email' => 'test@example.com',
        'username' => '250001',
        'password' => bcrypt('password123'),
        'ref_id' => 1,
        'status' => true,
    ]);
    $peserta->update(['user_id' => $user->id]);

    $response = $this->post('/kelulusan', [
        'nup' => '250001',
        'password' => 'password123',
    ]);

    $response->assertOk();
});
