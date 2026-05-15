<?php

use App\Http\Controllers\Admin\AbsensiController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\EducationController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\JalurPendaftaranController;
use App\Http\Controllers\Admin\KelulusanRekapController;
use App\Http\Controllers\Admin\KriteriaKelulusanController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\NilaiUjianController;
use App\Http\Controllers\Admin\PendaftarController;
use App\Http\Controllers\Admin\PendaftarUploadController;
use App\Http\Controllers\Admin\PembobotanController;
use App\Http\Controllers\Admin\PeriodeController;
use App\Http\Controllers\Admin\ProdiController;
use App\Http\Controllers\Admin\ReferensiController as AdminReferensiController;
use App\Http\Controllers\Admin\RuangController;
use App\Http\Controllers\Admin\SeleksiController;
use App\Http\Controllers\Admin\SeleksiPindahProdiController;
use App\Http\Controllers\Admin\SetupController;
use App\Http\Controllers\Admin\VerifikasiController;
use App\Http\Controllers\Admin\SurveyController;
use App\Http\Controllers\Admin\TahapSeleksiController;
use App\Http\Controllers\Admin\UjianController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\ReferensiController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LoginMemberController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Callback\BsiCallbackController;
use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\DokumenController as MemberDokumenController;
use App\Http\Controllers\Member\ProfileController as MemberProfileController;
use App\Http\Controllers\Public\KelulusanController;
use App\Http\Controllers\Public\PortalController;
use App\Http\Controllers\Public\RegistrasiController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [PortalController::class, 'index'])->name('home');
Route::get('/news', [PortalController::class, 'indexNews'])->name('news.index');
Route::get('/news/{id}', [PortalController::class, 'showNews'])->name('news.show');
Route::get('/jadwal', [PortalController::class, 'jadwal'])->name('jadwal');
Route::get('/kontak', [PortalController::class, 'kontak'])->name('kontak');
Route::get('/kebijakan-privasi', [PortalController::class, 'kebijakanPrivasi'])->name('kebijakan-privasi');
Route::get('/syarat-ketentuan', [PortalController::class, 'syaratKetentuan'])->name('syarat-ketentuan');

// Registration routes
Route::get('/registrasi', [RegistrasiController::class, 'create'])->name('registrasi');
Route::post('/registrasi', [RegistrasiController::class, 'store'])->middleware('throttle:registrasi');
Route::get('/registrasi/success/{nup}', [RegistrasiController::class, 'success'])->name('registrasi.success');
Route::get('/bukti-daftar/{nup}', [RegistrasiController::class, 'buktiDaftar'])->name('registrasi.bukti');

// Kelulusan routes
Route::get('/kelulusan', [KelulusanController::class, 'index'])->name('kelulusan');
Route::post('/kelulusan', [KelulusanController::class, 'check']);

// Verifikasi routes
Route::get('/verifikasi/{noujian}', [PortalController::class, 'verify'])->name('verifikasi');

// Auth routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:login');

    Route::get('/login-member', [LoginMemberController::class, 'create'])->name('login.member');
    Route::post('/login-member', [LoginMemberController::class, 'store'])->middleware('throttle:login');

    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email');

    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.store');
});

Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');

// Admin routes
Route::middleware(['auth', 'role:superadmin|admin|operator'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Settings
    Route::get('/settings', [SetupController::class, 'index'])->name('settings');
    Route::put('/settings', [SetupController::class, 'update'])->name('settings.update');
    Route::post('/settings/logo', [SetupController::class, 'uploadLogo'])->name('settings.upload-logo');
    Route::delete('/settings/logo', [SetupController::class, 'deleteLogo'])->name('settings.delete-logo');
    Route::get('/settings/dashboard-member', [SetupController::class, 'dashboardMember'])->name('settings.dashboard-member');
    Route::put('/settings/dashboard-member', [SetupController::class, 'updateDashboardMember'])->name('settings.update-dashboard-member');
    Route::get('/settings/landing', [SetupController::class, 'landing'])->name('settings.landing');
    Route::post('/settings/landing/hero-image', [SetupController::class, 'uploadHeroImage'])->name('settings.upload-hero-image');
    Route::delete('/settings/landing/hero-image', [SetupController::class, 'deleteHeroImage'])->name('settings.delete-hero-image');
    Route::post('/settings/landing/accreditation-image', [SetupController::class, 'uploadAccreditationImage'])->name('settings.upload-accreditation-image');
    Route::delete('/settings/landing/accreditation-image', [SetupController::class, 'deleteAccreditationImage'])->name('settings.delete-accreditation-image');

    // Users
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Prodi
    Route::resource('prodi', ProdiController::class)->except(['show']);
    Route::patch('/prodi/{prodi}/toggle-status', [ProdiController::class, 'toggleStatus'])->name('prodi.toggle-status');

    // Periode
    Route::resource('periode', PeriodeController::class)->except(['show']);
    Route::patch('/periode/{periode}/toggle-status', [PeriodeController::class, 'toggleStatus'])->name('periode.toggle-status');

    // Ruang
    Route::resource('ruang', RuangController::class)->except(['show']);
    Route::patch('/ruang/{ruang}/toggle-status', [RuangController::class, 'toggleStatus'])->name('ruang.toggle-status');
    Route::get('/ruang/summary', [RuangController::class, 'summary'])->name('ruang.summary');

    // Jadwal
    Route::resource('jadwal', JadwalController::class)->except(['show']);
    Route::patch('/jadwal/{jadwal}/toggle-status', [JadwalController::class, 'toggleStatus'])->name('jadwal.toggle-status');
    Route::post('/jadwal/reorder', [JadwalController::class, 'reorder'])->name('jadwal.reorder');

    // Ujian
    Route::resource('ujian', UjianController::class)->except(['show']);

    // Tahap Seleksi
    Route::resource('tahap-seleksi', TahapSeleksiController::class)->except(['show']);

    // Survey
    Route::resource('survey', SurveyController::class)->except(['show']);

    // Education
    Route::resource('education', EducationController::class)->except(['show']);

    // News
    Route::resource('news', NewsController::class);

    // Documents
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents/upload', [DocumentController::class, 'upload'])->name('documents.upload');
    Route::delete('/documents/{filename}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Syarat (Verifikasi Dokumen Terpadu)
    Route::get('/syarat', [VerifikasiController::class, 'index'])->name('syarat.index');
    Route::get('/syarat/kesehatan/{kesehatan}', [VerifikasiController::class, 'showKesehatanDetail'])->name('syarat.kesehatan.show');
    Route::post('/syarat/kesehatan/{kesehatan}/status', [VerifikasiController::class, 'updateKesehatanStatus'])->name('syarat.kesehatan.status');
    Route::get('/syarat/peserta/{pendaftar}', [VerifikasiController::class, 'showPesertaDetail'])->name('syarat.peserta');

    // Rekap Kelulusan (Syarat)
    Route::get('/syarat/rekap', [KelulusanRekapController::class, 'index'])->name('syarat.rekap');
    Route::get('/syarat/rekap/{prodi}', [KelulusanRekapController::class, 'detail'])->name('syarat.rekap.detail');
    Route::get('/syarat/rekap/{prodi}/export', [KelulusanRekapController::class, 'exportTahap2Detail'])->name('syarat.rekap.export');
    Route::post('/syarat/rekap/finalisasi', [KelulusanRekapController::class, 'finalisasi'])->name('syarat.rekap.finalisasi');
    Route::post('/syarat/rekap/revert-finalisasi', [KelulusanRekapController::class, 'revertFinalisasi'])->name('syarat.rekap.revert-finalisasi');

    // Jalur Pendaftaran
    Route::resource('jalur-pendaftaran', JalurPendaftaranController::class)->except(['show']);
    Route::patch('/jalur-pendaftaran/{jalur}/toggle-status', [JalurPendaftaranController::class, 'toggleStatus'])->name('jalur-pendaftaran.toggle-status');

    // Pendaftar
    Route::get('/pendaftar', [PendaftarController::class, 'index'])->name('pendaftar.index');
    Route::get('/pendaftar/export', [PendaftarController::class, 'export'])->name('pendaftar.export');
    Route::post('/pendaftar/import', [PendaftarController::class, 'import'])->name('pendaftar.import');
    Route::get('/pendaftar/import-errors/{key}', [PendaftarController::class, 'downloadImportErrors'])->name('pendaftar.import-errors');
    Route::get('/pendaftar/template', [PendaftarController::class, 'template'])->name('pendaftar.template');
    Route::post('/pendaftar/generate-noujian', [PendaftarController::class, 'generateNoUjian'])->name('pendaftar.generate-noujian');
    Route::get('/pendaftar/{pendaftar}', [PendaftarController::class, 'show'])->name('pendaftar.show');
    Route::get('/pendaftar/{pendaftar}/edit', [PendaftarController::class, 'edit'])->name('pendaftar.edit');
    Route::put('/pendaftar/{pendaftar}', [PendaftarController::class, 'update'])->name('pendaftar.update');
    Route::delete('/pendaftar/{pendaftar}', [PendaftarController::class, 'destroy'])->name('pendaftar.destroy');
    Route::get('/pendaftar/{pendaftar}/kartu', [PendaftarController::class, 'kartuPendaftar'])->name('pendaftar.kartu');
    Route::get('/pendaftar/{pendaftar}/profile-pdf', [PendaftarController::class, 'profilePdf'])->name('pendaftar.profile-pdf');
    Route::post('/pendaftar/{pendaftar}/upload-foto', [PendaftarController::class, 'uploadFoto'])->name('pendaftar.upload-foto');

    // Upload Dokumen Admin
    Route::get('/upload/kesehatan', [PendaftarUploadController::class, 'kesehatanIndex'])->name('upload.kesehatan-index');
    Route::get('/upload/kesehatan/{kesehatan}', [PendaftarUploadController::class, 'kesehatanShow'])->name('upload.kesehatan-show');
    Route::post('/upload/kesehatan/{kesehatan}/status', [PendaftarUploadController::class, 'updateKesehatanStatus'])->name('upload.kesehatan-status');
    Route::get('/upload/kesehatan/export', [PendaftarUploadController::class, 'exportKesehatan'])->name('upload.kesehatan-export');

    // Kriteria Kelulusan
    Route::get('/kriteria', [KriteriaKelulusanController::class, 'index'])->name('kriteria.index');
    Route::get('/kriteria/create', [KriteriaKelulusanController::class, 'create'])->name('kriteria.create');
    Route::post('/kriteria', [KriteriaKelulusanController::class, 'store'])->name('kriteria.store');
    Route::get('/kriteria/{kriteria}/edit', [KriteriaKelulusanController::class, 'edit'])->name('kriteria.edit');
    Route::put('/kriteria/{kriteria}', [KriteriaKelulusanController::class, 'update'])->name('kriteria.update');
    Route::delete('/kriteria/{kriteria}', [KriteriaKelulusanController::class, 'destroy'])->name('kriteria.destroy');

    // Nilai Ujian
    Route::get('/nilai', [NilaiUjianController::class, 'selectUjian'])->name('nilai.select');
    Route::get('/nilai/import-errors/{key}', [NilaiUjianController::class, 'downloadImportErrors'])->name('nilai.import-errors');
    Route::get('/nilai/{ujian}', [NilaiUjianController::class, 'index'])->name('nilai.index');
    Route::post('/nilai/{ujian}/upload', [NilaiUjianController::class, 'upload'])->name('nilai.upload');
    Route::get('/nilai/{ujian}/template', [NilaiUjianController::class, 'downloadTemplate'])->name('nilai.template');
    Route::get('/nilai/{ujian}/export', [NilaiUjianController::class, 'export'])->name('nilai.export');
    Route::put('/nilai/{nilai}', [NilaiUjianController::class, 'update'])->name('nilai.update');
    Route::delete('/nilai/{nilai}', [NilaiUjianController::class, 'destroy'])->name('nilai.destroy');
    Route::delete('/nilai-bulk', [NilaiUjianController::class, 'bulkDestroy'])->name('nilai.bulk-destroy');

    // Absensi
    Route::get('/absensi', [AbsensiController::class, 'index'])->name('absensi.index');
    Route::get('/absensi/create', [AbsensiController::class, 'create'])->name('absensi.create');
    Route::post('/absensi', [AbsensiController::class, 'store'])->name('absensi.store');
    Route::get('/absensi/{absensi}', [AbsensiController::class, 'show'])->name('absensi.show');
    Route::post('/absensi/{absensi}/save', [AbsensiController::class, 'saveAttendance'])->name('absensi.save');
    Route::get('/absensi/{absensi}/cetak/{ruangId}', [AbsensiController::class, 'cetak'])->name('absensi.cetak');
    Route::post('/absensi/distribusi', [AbsensiController::class, 'distribusi'])->name('absensi.distribusi');
    Route::delete('/absensi/{absensi}', [AbsensiController::class, 'destroy'])->name('absensi.destroy');

    // Seleksi
    Route::get('/seleksi', [SeleksiController::class, 'index'])->name('seleksi.index');
    Route::post('/seleksi/preview', [SeleksiController::class, 'preview'])->name('seleksi.preview');
    Route::post('/seleksi/save', [SeleksiController::class, 'save'])->name('seleksi.save');
    Route::get('/seleksi/rekap', [SeleksiController::class, 'rekap'])->name('seleksi.rekap');
    Route::get('/seleksi/rekap/{prodi}/export', [SeleksiController::class, 'rekapDetailExport'])->name('seleksi.rekap.detail.export');
    Route::get('/seleksi/rekap/{prodi}', [SeleksiController::class, 'rekapDetail'])->name('seleksi.rekap.detail');
    Route::delete('/seleksi/revoke/{pendaftar}', [SeleksiController::class, 'revokeLulus'])->name('seleksi.revoke');
    Route::delete('/seleksi/bulk-revoke', [SeleksiController::class, 'bulkRevokeLulus'])->name('seleksi.bulk-revoke');
    Route::get('/seleksi/export', [SeleksiController::class, 'export'])->name('seleksi.export');
    Route::post('/seleksi/finalisasi', [SeleksiController::class, 'finalisasi'])->name('seleksi.finalisasi');
    Route::post('/seleksi/revert-finalisasi', [SeleksiController::class, 'revertFinalisasi'])->name('seleksi.revert-finalisasi');

    // Seleksi Pindah Prodi
    Route::get('/seleksi-pindah-prodi', [SeleksiPindahProdiController::class, 'index'])->name('seleksi-pindah-prodi.index');
    Route::post('/seleksi-pindah-prodi/save', [SeleksiPindahProdiController::class, 'saveKeputusan'])->name('seleksi-pindah-prodi.save');

    // Pembobotan
    Route::get('/pembobotan', [PembobotanController::class, 'index'])->name('pembobotan.index');
    Route::get('/pembobotan/{tahap}', [PembobotanController::class, 'edit'])->name('pembobotan.edit');
    Route::put('/pembobotan/{tahap}', [PembobotanController::class, 'update'])->name('pembobotan.update');
    Route::post('/pembobotan/{tahap}/hitung', [PembobotanController::class, 'hitung'])->name('pembobotan.hitung');
    Route::delete('/pembobotan/{tahap}/reset-nilai-akhir', [PembobotanController::class, 'resetNilaiAkhir'])->name('pembobotan.reset-nilai-akhir');

    // Referensi
    Route::get('/referensi', [AdminReferensiController::class, 'index'])->name('referensi.index');
    Route::post('/referensi/{pendaftar}/toggle', [AdminReferensiController::class, 'toggle'])->name('referensi.toggle');
    Route::get('/referensi/{pendaftar}/nilai', [AdminReferensiController::class, 'nilai'])->name('referensi.nilai');
});

// Member routes
Route::middleware(['auth', 'role:mahasiswa'])->prefix('member')->name('member.')->group(function () {
    Route::get('/dashboard', [MemberDashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [MemberProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [MemberProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/ortu', [MemberProfileController::class, 'editOrtu'])->name('profile.ortu');
    Route::put('/profile/ortu', [MemberProfileController::class, 'updateOrtu'])->name('profile.ortu.update');
    Route::get('/profile/pendidikan', [MemberProfileController::class, 'editPendidikan'])->name('profile.pendidikan');
    Route::put('/profile/pendidikan', [MemberProfileController::class, 'updatePendidikan'])->name('profile.pendidikan.update');
    Route::get('/profile/pilihan', [MemberProfileController::class, 'editPilihan'])->name('profile.pilihan');
    Route::put('/profile/pilihan', [MemberProfileController::class, 'updatePilihan'])->name('profile.pilihan.update');
    Route::post('/upload-foto', [MemberProfileController::class, 'uploadFoto'])->name('upload-foto');
    Route::post('/change-password', [MemberProfileController::class, 'changePassword'])->name('change-password');
    Route::get('/kartu-peserta', [MemberProfileController::class, 'kartuPeserta'])->name('kartu-peserta');

    // Upload Dokumen
    Route::get('/upload/kesehatan', function () {
        return redirect()->route('member.dashboard');
    });
    Route::post('/upload/kesehatan', [MemberDokumenController::class, 'storeKesehatan'])->name('upload.kesehatan.store');
    Route::post('/upload/kesehatan/file', [MemberDokumenController::class, 'uploadKesehatanFile'])->name('upload.kesehatan.file');
    Route::delete('/upload/kesehatan/file/{file}', [MemberDokumenController::class, 'deleteKesehatanFile'])->name('upload.kesehatan.file.delete');
    Route::post('/upload/kesehatan/finalize', [MemberDokumenController::class, 'finalizeKesehatan'])->name('upload.kesehatan.finalize');
});

// API routes (public)
Route::prefix('api')->group(function () {
    Route::get('/kabupaten/{provinsiId}', [ReferensiController::class, 'kabupaten']);
    Route::get('/prodi-by-jenjang/{jenjang}', [ReferensiController::class, 'prodiByJenjang']);
    Route::get('/prodi', [ReferensiController::class, 'allProdi']);
});

// API routes (authenticated)
Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::get('/admin/dashboard/chart/{jenis}', [AdminDashboardController::class, 'chartData']);
    Route::get('/admin/notifications', [AdminDashboardController::class, 'getNotifications']);
    Route::post('/admin/notifications/{id}/read', [AdminDashboardController::class, 'markNotificationRead']);
});

// BSI Callback (no CSRF)
Route::post('/api/callback/bsi', [BsiCallbackController::class, 'handle'])->withoutMiddleware([VerifyCsrfToken::class]);
