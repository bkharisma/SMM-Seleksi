# Plan: Fitur Reset Nilai Akhir pada Pembobotan

## Masalah
Ketika user menghapus semua nilai di tiap ujian, kolom `nilai_akhir` di tabel `pendaftar` tidak ikut tereset. 
Nilai hasil hitungan sebelumnya tetap tersimpan.

## Solusi
Tambahkan tombol "Reset Nilai Akhir" pada halaman pembobotan yang menghapus `nilai_akhir` pendaftar terkait tahap seleksi.

---

## Perubahan yang Diperlukan

### 1. Backend: `app/Http/Controllers/Admin/PembobotanController.php`

Tambahkan method baru `resetNilaiAkhir` setelah method `hitung` (setelah baris 98):

```php
public function resetNilaiAkhir(TahapSeleksi $tahap): RedirectResponse
{
    $ujianIds = Ujian::where('tahap_seleksi_id', $tahap->id)->pluck('id');

    $nupList = PendaftarNilai::whereIn('ujian_id', $ujianIds)
        ->distinct()
        ->pluck('nup');

    $count = Pendaftar::whereIn('kode_pendaftar', $nupList)
        ->whereNotNull('nilai_akhir')
        ->update(['nilai_akhir' => null]);

    return redirect()->route('admin.pembobotan.index')
        ->with('success', "Nilai akhir berhasil direset untuk {$count} pendaftar pada tahap {$tahap->nama}.");
}
```

### 2. Route: `routes/web.php`

Tambahkan route baru setelah baris 198 (setelah route `pembobotan.hitung`):

```php
Route::delete('/pembobotan/{tahap}/reset-nilai-akhir', [PembobotanController::class, 'resetNilaiAkhir'])->name('pembobotan.reset-nilai-akhir');
```

### 3. Frontend: `resources/js/pages/admin/pembobotan/edit.tsx`

Tambahkan handler dan tombol reset.

#### a. Tambahkan import `useState` yang sudah ada, tambahkan handler function setelah `handleHitung` (setelah baris 80):

```tsx
const handleReset = () => {
    if (!confirm('Apakah Anda yakin ingin mereset semua nilai akhir yang sudah dihitung untuk tahap ini?')) {
        return;
    }
    setProcessing(true);
    router.delete(`/admin/pembobotan/${tahap.id}/reset-nilai-akhir`, {
        onFinish: () => setProcessing(false),
    });
};
```

#### b. Tambahkan tombol reset di samping tombol "Hitung Nilai Akhir" (di dalam div dengan class `flex gap-2` di sekitar baris 156-172):

Di dalam `<div className="flex gap-2">`, tambahkan tombol berikut SETELAH tombol "Simpan Bobot" dan SEBELUM tombol "Hitung Nilai Akhir":

```tsx
<Button
    variant="danger"
    onClick={handleReset}
    disabled={processing}
    isLoading={processing}
>
    Reset Nilai Akhir
</Button>
```

Jadi urutan tombol menjadi: Simpan Bobot → Reset Nilai Akhir → Hitung Nilai Akhir

---

## Catatan
- Method `resetNilaiAkhir` hanya mereset pendaftar yang punya `nilai_akhir` tidak null (`whereNotNull('nilai_akhir')`)
- Reset dilakukan per tahap seleksi, sesuai scope perhitungan
- Tombol dilengkapi konfirmasi dialog untuk mencegah klik tidak sengaja
