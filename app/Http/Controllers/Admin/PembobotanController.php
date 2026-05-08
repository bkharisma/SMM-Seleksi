<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembobotan;
use App\Models\Pendaftar;
use App\Models\PendaftarNilai;
use App\Models\TahapSeleksi;
use App\Models\Ujian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PembobotanController extends Controller
{
    public function index(): Response
    {
        $tahap = TahapSeleksi::with('ujian')->orderBy('urutan')->get();

        $pembobotan = Pembobotan::pluck('bobot_config', 'tahap_seleksi_id');

        return Inertia::render('admin/pembobotan/index', [
            'tahap' => $tahap,
            'pembobotan' => $pembobotan,
        ]);
    }

    public function edit(TahapSeleksi $tahap): Response
    {
        $ujian = Ujian::where('tahap_seleksi_id', $tahap->id)->get();
        $pembobotan = Pembobotan::where('tahap_seleksi_id', $tahap->id)->first();

        return Inertia::render('admin/pembobotan/edit', [
            'tahap' => $tahap,
            'ujian' => $ujian,
            'pembobotan' => $pembobotan,
        ]);
    }

    public function update(Request $request, TahapSeleksi $tahap): RedirectResponse
    {
        $validated = $request->validate([
            'bobot_config' => 'required|array',
            'bobot_config.*' => 'required|numeric|min:0|max:100',
        ]);

        $total = array_sum($validated['bobot_config']);
        if (abs($total - 100) > 0.01) {
            return redirect()->back()->with('error', 'Total bobot harus 100%. Saat ini: ' . $total . '%');
        }

        Pembobotan::updateOrCreate(
            ['tahap_seleksi_id' => $tahap->id],
            ['bobot_config' => $validated['bobot_config']]
        );

        return redirect()->route('admin.pembobotan.index')->with('success', 'Konfigurasi bobot berhasil disimpan.');
    }

    public function hitung(TahapSeleksi $tahap): RedirectResponse
    {
        $pembobotan = Pembobotan::where('tahap_seleksi_id', $tahap->id)->first();

        if (! $pembobotan) {
            return redirect()->back()->with('error', 'Konfigurasi bobot belum diatur untuk tahap ini.');
        }

        $bobotConfig = $pembobotan->bobot_config;
        $count = 0;

        $pendaftarList = Pendaftar::whereNotNull('noujian')->get();

        foreach ($pendaftarList as $pendaftar) {
            $nilaiAkhir = 0;
            $hasNilai = false;

            foreach ($bobotConfig as $ujianId => $bobot) {
                $nilai = PendaftarNilai::where('nup', $pendaftar->kode_pendaftar)
                    ->where('ujian_id', $ujianId)
                    ->first();

                if ($nilai && $nilai->skor_akhir !== null) {
                    $nilaiAkhir += ($bobot / 100) * $nilai->skor_akhir;
                    $hasNilai = true;
                }
            }

            if ($hasNilai) {
                $pendaftar->update(['nilai_akhir' => round($nilaiAkhir, 2)]);
                $count++;
            }
        }

        return redirect()->route('admin.pembobotan.index')
            ->with('success', "Nilai akhir berhasil dihitung untuk {$count} pendaftar.");
    }

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
}
