<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kabupaten;
use App\Models\Prodi;
use Illuminate\Support\Facades\Cache;

class ReferensiController extends Controller
{
    public function kabupaten(string $provinsiId)
    {
        $kabupaten = Cache::remember("kabupaten_{$provinsiId}", 3600, function () use ($provinsiId) {
            return Kabupaten::where('kode_prop', $provinsiId)
                ->orderBy('nama_kab')
                ->get(['kode_kab', 'nama_kab']);
        });

        return response()->json($kabupaten);
    }

    public function prodiByJenjang(string $jenjang)
    {
        $prodi = Cache::remember("prodi_jenjang_{$jenjang}", 3600, function () use ($jenjang) {
            return Prodi::where('jenjang_prodi', $jenjang)
                ->where('active', true)
                ->orderBy('nama_prodi')
                ->get(['id', 'kode_prodi', 'nama_prodi', 'singkatan_prodi']);
        });

        return response()->json($prodi);
    }

    public function allProdi()
    {
        $prodi = Cache::remember('all_prodi_active', 3600, function () {
            return Prodi::active()
                ->orderBy('jenjang_prodi')
                ->orderBy('nama_prodi')
                ->get(['id', 'kode_prodi', 'nama_prodi', 'singkatan_prodi', 'jenjang_prodi']);
        });

        return response()->json($prodi);
    }
}
