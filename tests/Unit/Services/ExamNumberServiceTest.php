<?php

use App\Models\Mnoujian;
use App\Models\Pendaftar;
use App\Models\Prodi;
use App\Services\ExamNumberService;

beforeEach(function () {
    Prodi::create([
        'id' => 1,
        'kode_prodi' => 'D4HOT',
        'nama_prodi' => 'D4 Hotel',
        'jenjang_prodi' => 'D4',
        'active' => true,
    ]);
});

test('generates exam number with correct format', function () {
    $peserta = Pendaftar::create([
        'kode_pendaftar' => '250001',
        'nama' => 'Test Peserta',
        'pil1' => 1,
    ]);

    $service = new ExamNumberService;
    $noujian = $service->generateForPeserta($peserta);

    $year = now()->format('y');
    expect($noujian)->toStartWith($year);
    expect(strlen($noujian))->toBe(8);

    $peserta->refresh();
    expect($peserta->noujian)->toBe($noujian);
});

test('generates unique exam numbers for different participants', function () {
    $peserta1 = Pendaftar::create([
        'kode_pendaftar' => '250001',
        'nama' => 'Test A',
        'pil1' => 1,
    ]);

    $peserta2 = Pendaftar::create([
        'kode_pendaftar' => '250002',
        'nama' => 'Test B',
        'pil1' => 1,
    ]);

    $service = new ExamNumberService;
    $no1 = $service->generateForPeserta($peserta1);
    $no2 = $service->generateForPeserta($peserta2);

    expect($no1)->not->toBe($no2);
});

test('returns existing exam number if already generated', function () {
    $peserta = Pendaftar::create([
        'kode_pendaftar' => '250001',
        'nama' => 'Test Peserta',
        'noujian' => '25HO0001',
        'pil1' => 1,
    ]);

    Mnoujian::create([
        'noujian' => '25HO0001',
        'nup' => '250001',
    ]);

    $service = new ExamNumberService;
    $noujian = $service->generateForPeserta($peserta);

    expect($noujian)->toBe('25HO0001');
});

test('generate bulk creates exam numbers for multiple peserta', function () {
    $peserta1 = Pendaftar::create([
        'kode_pendaftar' => '250001',
        'nama' => 'Test A',
        'pil1' => 1,
    ]);

    $peserta2 = Pendaftar::create([
        'kode_pendaftar' => '250002',
        'nama' => 'Test B',
        'pil1' => 1,
    ]);

    $service = new ExamNumberService;
    $count = $service->generateBulk([$peserta1->id, $peserta2->id]);

    expect($count)->toBe(2);

    $peserta1->refresh();
    $peserta2->refresh();
    expect($peserta1->noujian)->not->toBeNull();
    expect($peserta2->noujian)->not->toBeNull();
});

test('skips peserta that already has exam number', function () {
    $peserta = Pendaftar::create([
        'kode_pendaftar' => '250001',
        'nama' => 'Test A',
        'noujian' => '25HO0001',
        'pil1' => 1,
    ]);

    $service = new ExamNumberService;
    $count = $service->generateBulk([$peserta->id]);

    expect($count)->toBe(0);
});
