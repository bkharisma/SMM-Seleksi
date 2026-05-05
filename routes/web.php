<?php

use App\Http\Controllers\Admin\AbsensiController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\EducationController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\KriteriaKelulusanController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\NilaiUjianController;
use App\Http\Controllers\Admin\PeminatController;
use App\Http\Controllers\Admin\PeriodeController;
use App\Http\Controllers\Admin\PesertaController;
use App\Http\Controllers\Admin\PesertaUploadController;
use App\Http\Controllers\Admin\ProdiController;
use App\Http\Controllers\Admin\RuangController;
use App\Http\Controllers\Admin\SeleksiController;
use App\Http\Controllers\Admin\SetupController;
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

    // Ujian
    Route::resource('ujian', UjianController::class)->except(['show']);

    // Tahap Seleksi
    Route::resource('tahap-seleksi', TahapSeleksiController::class)->except(['show']);

    // Survey
    Route::resource('survey', SurveyController::class)->except(['show']);

    // Education
    Route::resource('education', EducationController::class)->except(['show']);

    // News
    Route::resource('news', NewsController::class)->except(['show']);

    // Documents
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents/upload', [DocumentController::class, 'upload'])->name('documents.upload');
    Route::delete('/documents/{filename}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Peminat
    Route::get('/peminat', [PeminatController::class, 'index'])->name('peminat.index');
    Route::get('/peminat/export', [PeminatController::class, 'export'])->name('peminat.export');
    Route::post('/peminat/import', [PeminatController::class, 'import'])->name('peminat.import');
    Route::get('/peminat/template', [PeminatController::class, 'template'])->name('peminat.template');
    Route::delete('/peminat/{peminat}', [PeminatController::class, 'destroy'])->name('peminat.destroy');

    // Peserta
    Route::get('/peserta', [PesertaController::class, 'index'])->name('peserta.index');
    Route::get('/peserta/export', [PesertaController::class, 'export'])->name('peserta.export');
    Route::post('/peserta/import', [PesertaController::class, 'import'])->name('peserta.import');
    Route::get('/peserta/template', [PesertaController::class, 'downloadTemplate'])->name('peserta.template');
    Route::post('/peserta/generate-noujian', [PesertaController::class, 'generateNoUjian'])->name('peserta.generate-noujian');
    Route::get('/peserta/{peserta}', [PesertaController::class, 'show'])->name('peserta.show');
    Route::get('/peserta/{peserta}/edit', [PesertaController::class, 'edit'])->name('peserta.edit');
    Route::put('/peserta/{peserta}', [PesertaController::class, 'update'])->name('peserta.update');
    Route::delete('/peserta/{peserta}', [PesertaController::class, 'destroy'])->name('peserta.destroy');
    Route::get('/peserta/{peserta}/kartu', [PesertaController::class, 'kartuPeserta'])->name('peserta.kartu');
    Route::get('/peserta/{peserta}/profile-pdf', [PesertaController::class, 'profilePdf'])->name('peserta.profile-pdf');
    Route::post('/peserta/{peserta}/upload-foto', [PesertaController::class, 'uploadFoto'])->name('peserta.upload-foto');

    // Upload Dokumen Admin
    Route::get('/upload/raport', [PesertaUploadController::class, 'raportIndex'])->name('upload.raport-index');
    Route::get('/upload/raport/{raport}', [PesertaUploadController::class, 'raportShow'])->name('upload.raport-show');
    Route::post('/upload/raport/{raport}/status', [PesertaUploadController::class, 'updateRaportStatus'])->name('upload.raport-status');
    Route::get('/upload/raport/export', [PesertaUploadController::class, 'exportRaport'])->name('upload.raport-export');
    Route::get('/upload/kesehatan', [PesertaUploadController::class, 'kesehatanIndex'])->name('upload.kesehatan-index');
    Route::get('/upload/kesehatan/{kesehatan}', [PesertaUploadController::class, 'kesehatanShow'])->name('upload.kesehatan-show');
    Route::post('/upload/kesehatan/{kesehatan}/status', [PesertaUploadController::class, 'updateKesehatanStatus'])->name('upload.kesehatan-status');
    Route::get('/upload/kesehatan/export', [PesertaUploadController::class, 'exportKesehatan'])->name('upload.kesehatan-export');

    // Kriteria Kelulusan
    Route::get('/kriteria', [KriteriaKelulusanController::class, 'index'])->name('kriteria.index');
    Route::get('/kriteria/create', [KriteriaKelulusanController::class, 'create'])->name('kriteria.create');
    Route::post('/kriteria', [KriteriaKelulusanController::class, 'store'])->name('kriteria.store');
    Route::get('/kriteria/{kriteria}/edit', [KriteriaKelulusanController::class, 'edit'])->name('kriteria.edit');
    Route::put('/kriteria/{kriteria}', [KriteriaKelulusanController::class, 'update'])->name('kriteria.update');
    Route::delete('/kriteria/{kriteria}', [KriteriaKelulusanController::class, 'destroy'])->name('kriteria.destroy');

    // Nilai Ujian
    Route::get('/nilai', [NilaiUjianController::class, 'selectUjian'])->name('nilai.select');
    Route::get('/nilai/{ujian}', [NilaiUjianController::class, 'index'])->name('nilai.index');
    Route::post('/nilai/{ujian}/upload', [NilaiUjianController::class, 'upload'])->name('nilai.upload');
    Route::get('/nilai/{ujian}/template', [NilaiUjianController::class, 'downloadTemplate'])->name('nilai.template');
    Route::get('/nilai/{ujian}/export', [NilaiUjianController::class, 'export'])->name('nilai.export');
    Route::put('/nilai/{nilai}', [NilaiUjianController::class, 'update'])->name('nilai.update');
    Route::delete('/nilai/{nilai}', [NilaiUjianController::class, 'destroy'])->name('nilai.destroy');

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
    Route::get('/seleksi/export', [SeleksiController::class, 'export'])->name('seleksi.export');
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
    Route::get('/upload/raport', [MemberDokumenController::class, 'raport'])->name('upload.raport');
    Route::post('/upload/raport', [MemberDokumenController::class, 'storeRaport'])->name('upload.raport.store');
    Route::post('/upload/raport/file', [MemberDokumenController::class, 'uploadRaportFile'])->name('upload.raport.file');
    Route::delete('/upload/raport/file/{file}', [MemberDokumenController::class, 'deleteRaportFile'])->name('upload.raport.file.delete');
    Route::get('/upload/kesehatan', [MemberDokumenController::class, 'kesehatan'])->name('upload.kesehatan');
    Route::post('/upload/kesehatan', [MemberDokumenController::class, 'storeKesehatan'])->name('upload.kesehatan.store');
    Route::post('/upload/kesehatan/file', [MemberDokumenController::class, 'uploadKesehatanFile'])->name('upload.kesehatan.file');
    Route::delete('/upload/kesehatan/file/{file}', [MemberDokumenController::class, 'deleteKesehatanFile'])->name('upload.kesehatan.file.delete');
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
