<?php

namespace App\Services;

use App\Models\Mnoujian;
use App\Models\Pendaftar;
use Illuminate\Support\Facades\DB;

class ExamNumberService
{
    public function generateForPeserta(Pendaftar $peserta): string
    {
        return DB::transaction(function () use ($peserta) {
            $existing = Mnoujian::where('nup', $peserta->kode_pendaftar)->first();
            if ($existing) {
                $peserta->update(['noujian' => $existing->noujian]);

                return $existing->noujian;
            }

            $year = now()->format('y');
            $prodiCode = $peserta->pil1Prodi ? substr($peserta->pil1Prodi->kode_prodi, 0, 2) : '00';
            $sequence = $this->getNextSequence();
            $noujian = $year.$prodiCode.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);

            Mnoujian::create([
                'noujian' => $noujian,
                'nup' => $peserta->kode_pendaftar,
            ]);

            $peserta->update(['noujian' => $noujian]);

            return $noujian;
        });
    }

    public function generateBulk(array $pesertaIds): int
    {
        $count = 0;
        foreach ($pesertaIds as $id) {
            $peserta = Pendaftar::find($id);
            if ($peserta && ! $peserta->noujian) {
                $this->generateForPeserta($peserta);
                $count++;
            }
        }

        return $count;
    }

    private function getNextSequence(): int
    {
        $last = Mnoujian::orderBy('noujian', 'desc')->first();
        if (! $last) {
            return 1;
        }
        $seq = (int) substr($last->noujian, -4);

        return $seq + 1;
    }
}
