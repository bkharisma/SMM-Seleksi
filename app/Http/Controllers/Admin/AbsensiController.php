<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\DataAbsensi;
use App\Models\Pendaftar;
use App\Models\Ruang;
use App\Pdf\DaftarHadirPdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DataAbsensi::with(['ruang']);

        if ($request->filled('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        }

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->jenis);
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $absensi = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/absensi/index', [
            'absensi' => $absensi,
            'filters' => $request->only(['tanggal', 'jenis']),
            'ruang' => Ruang::where('active', true)->get(['id', 'nomor_ruang', 'nama_gedung']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/absensi/form', [
            'dataAbsensi' => null,
            'ruang' => Ruang::where('active', true)->get(['id', 'nomor_ruang', 'nama_gedung', 'kapasitas']),
            'peserta' => Pendaftar::whereNotNull('noujian')->get(['id', 'kode_pendaftar', 'noujian', 'nama', 'ruang_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis' => 'required|string|max:16',
            'kelompok' => 'nullable|integer',
            'tanggal' => 'required|date',
            'waktu' => 'nullable|string|max:16',
            'ruang_id' => 'required|exists:ruang,id',
            'nomor_awal' => 'nullable|string|max:16',
            'nomor_akhir' => 'nullable|string|max:16',
            'peserta_ids' => 'nullable|array',
            'peserta_ids.*' => 'exists:pendaftar,id',
        ]);

        $dataAbsensi = DB::transaction(function () use ($validated) {
            $dataAbsensi = DataAbsensi::create($validated);

            if (! empty($validated['peserta_ids'])) {
                $absensiRecords = collect($validated['peserta_ids'])->map(function ($pesertaId) use ($dataAbsensi) {
                    return [
                        'data_absensi_id' => $dataAbsensi->id,
                        'peserta_id' => $pesertaId,
                        'ruang_id' => $dataAbsensi->ruang_id,
                        'hadir' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                });

                Absensi::insert($absensiRecords->toArray());
            }

            return $dataAbsensi;
        });

        return redirect()->route('admin.absensi.show', $dataAbsensi)->with('success', 'Sesi absensi berhasil dibuat.');
    }

    public function show(DataAbsensi $absensi): Response
    {
        $absensi->load(['ruang', 'absensi' => function ($q) {
            $q->with(['peserta' => function ($pq) {
                $pq->with('pil1Prodi');
            }]);
        }]);

        return Inertia::render('admin/absensi/data', [
            'dataAbsensi' => $absensi,
        ]);
    }

    public function saveAttendance(Request $request, DataAbsensi $absensi): RedirectResponse
    {
        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*.id' => 'required|exists:absensi,id',
            'attendance.*.hadir' => 'required|boolean',
        ]);

        foreach ($validated['attendance'] as $item) {
            Absensi::where('id', $item['id'])->update(['hadir' => $item['hadir']]);
        }

        return redirect()->back()->with('success', 'Data kehadiran berhasil disimpan.');
    }

    public function cetak(DataAbsensi $absensi, $ruangId, DaftarHadirPdf $pdf)
    {
        $ruang = Ruang::find($ruangId);
        if (! $ruang) {
            return redirect()->back()->with('error', 'Ruang tidak ditemukan.');
        }

        return $pdf->download($absensi, $ruang);
    }

    public function distribusi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ruang_id' => 'required|exists:ruang,id',
            'jenis' => 'required|string|max:16',
            'tanggal' => 'required|date',
            'waktu' => 'nullable|string|max:16',
            'kelompok' => 'nullable|integer',
        ]);

        $ruang = Ruang::find($validated['ruang_id']);
        $kapasitas = $ruang->kapasitas ?? 30;

        $peserta = Pendaftar::whereNotNull('noujian')
            ->whereNull('ruang_id')
            ->orderBy('kode_pendaftar')
            ->get();

        DB::transaction(function () use ($validated, $peserta, $kapasitas, $ruang) {
            $kelompok = 1;
            $count = 0;

            $dataAbsensi = DataAbsensi::create([
                'jenis' => $validated['jenis'],
                'kelompok' => $validated['kelompok'] ?? 1,
                'tanggal' => $validated['tanggal'],
                'waktu' => $validated['waktu'],
                'ruang_id' => $ruang->id,
            ]);

            foreach ($peserta as $p) {
                if ($count >= $kapasitas) {
                    break;
                }

                $p->update(['ruang_id' => $ruang->id, 'ruang_kelompok' => $kelompok]);

                Absensi::create([
                    'data_absensi_id' => $dataAbsensi->id,
                    'peserta_id' => $p->id,
                    'ruang_id' => $ruang->id,
                    'hadir' => false,
                ]);

                $count++;
            }
        });

        return redirect()->route('admin.absensi.index')->with('success', "Berhasil mendistribusikan peserta ke ruang {$ruang->nomor_ruang}.");
    }

    public function destroy(DataAbsensi $absensi): RedirectResponse
    {
        $absensi->absensi()->delete();
        $absensi->delete();

        return redirect()->back()->with('success', 'Sesi absensi berhasil dihapus.');
    }
}
