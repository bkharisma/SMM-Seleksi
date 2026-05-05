<?php

use App\Models\KriteriaKelulusan;
use App\Models\Peserta;
use App\Models\PesertaNilai;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use App\Models\Ujian;
use App\Services\SelectionService;

beforeEach(function () {
    Prodi::create([
        'id' => 1,
        'kode_prodi' => 'D4HOT',
        'nama_prodi' => 'D4 Hotel',
        'jenjang_prodi' => 'D4',
        'active' => true,
    ]);

    TahapSeleksi::create([
        'nama' => 'Tahap 1 - Administrasi',
        'urutan' => 1,
        'active' => true,
    ]);

    TahapSeleksi::create([
        'nama' => 'Tahap 2 - Wawancara',
        'urutan' => 2,
        'active' => true,
    ]);

    Ujian::create([
        'nama' => 'Psikotes',
        'kode' => 'PSIKOTES',
        'active' => true,
    ]);

    Ujian::create([
        'nama' => 'Bahasa Inggris',
        'kode' => 'INGGRIS',
        'active' => true,
    ]);

    Ujian::create([
        'nama' => 'Wawancara',
        'kode' => 'WAWANCARA',
        'active' => true,
    ]);

    Ujian::create([
        'nama' => 'Kesehatan',
        'kode' => 'KESEHATAN',
        'active' => true,
    ]);
});

test('get tahap seleksi active returns ordered list', function () {
    $service = new SelectionService;
    $tahap = $service->getTahapSeleksiActive();

    expect($tahap)->toHaveCount(2);
    expect($tahap->first()->urutan)->toBe(1);
});

test('evaluate peserta lulus if meets all criteria', function () {
    $peserta = Peserta::create([
        'nup' => '250001',
        'noujian' => '25HO0001',
        'nama' => 'Test Peserta',
        'pil1' => 1,
        'status' => true,
    ]);

    $ujianId = Ujian::where('kode', 'PSIKOTES')->first()->id;
    PesertaNilai::create([
        'nup' => '250001',
        'ujian_id' => $ujianId,
        'psi_iq' => 100,
        'psi_bobot' => 80,
        'type' => 'PSIKOTES',
    ]);

    $ujianIngris = Ujian::where('kode', 'INGGRIS')->first()->id;
    PesertaNilai::create([
        'nup' => '250001',
        'ujian_id' => $ujianIngris,
        'bing_nil' => 450,
        'type' => 'INGGRIS',
    ]);

    $kriteria = KriteriaKelulusan::create([
        'prodi_id' => 1,
        'tahap_seleksi_id' => 1,
        'min_iq' => 90,
        'min_english' => 400,
        'active' => true,
    ]);

    $service = new SelectionService;
    $result = $service->evaluatePeserta($peserta, $kriteria);

    expect($result['lulus'])->toBeTrue();
});

test('evaluate peserta fails if iq below minimum', function () {
    $peserta = Peserta::create([
        'nup' => '250002',
        'noujian' => '25HO0002',
        'nama' => 'Test Peserta 2',
        'pil1' => 1,
        'status' => true,
    ]);

    $ujianId = Ujian::where('kode', 'PSIKOTES')->first()->id;
    PesertaNilai::create([
        'nup' => '250002',
        'ujian_id' => $ujianId,
        'psi_iq' => 70,
        'psi_bobot' => 50,
        'type' => 'PSIKOTES',
    ]);

    $kriteria = KriteriaKelulusan::create([
        'prodi_id' => 1,
        'tahap_seleksi_id' => 1,
        'min_iq' => 90,
        'active' => true,
    ]);

    $service = new SelectionService;
    $result = $service->evaluatePeserta($peserta, $kriteria);

    expect($result['lulus'])->toBeFalse();
    expect($result['reasons'])->toContain('IQ (70) di bawah minimum (90)');
});

test('get kriteria for prodi tahap returns correct record', function () {
    KriteriaKelulusan::create([
        'prodi_id' => 1,
        'tahap_seleksi_id' => 1,
        'min_iq' => 90,
        'active' => true,
    ]);

    $service = new SelectionService;
    $kriteria = $service->getKriteriaForProdiTahap(1, 1);

    expect($kriteria)->not->toBeNull();
    expect($kriteria->min_iq)->toBe(90);
});

test('preview selection returns summary counts', function () {
    KriteriaKelulusan::create([
        'prodi_id' => 1,
        'tahap_seleksi_id' => 1,
        'min_iq' => 90,
        'active' => true,
    ]);

    $service = new SelectionService;
    $result = $service->previewSelection(1, 1, 1);

    expect($result)->toHaveKey('total');
    expect($result)->toHaveKey('lulus');
    expect($result)->toHaveKey('tidak_lulus');
    expect($result)->toHaveKey('results');
});

test('get rekap kelulusan returns per prodi data', function () {
    $service = new SelectionService;
    $rekap = $service->getRekapKelulusan();

    expect($rekap)->toHaveKey('rekap_per_prodi');
    expect($rekap)->toHaveKey('total_lulus');
    expect($rekap)->toHaveKey('total_peserta');
});
