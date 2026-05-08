<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendaftarNilai extends Model
{
    use HasFactory;

    protected $table = 'pendaftar_nilai';

    protected $fillable = [
        'nup', 'nus', 'ujian_id', 'psi_iq', 'psi_bobot', 'bing_nil',
        'waw_nil', 'waw_bersedia_pindah', 'waw_rekomendasi_prodi_id', 'waw_catatan',
        'kes_tb', 'kes_bw', 'kes_paru',
        'kes_scol', 'kes_hamil', 'kes_hasil', 'type', 'skor_akhir', 'minat_dominan', 'pendaftar_id',
    ];

    protected $casts = [
        'kes_bw' => 'boolean',
        'kes_paru' => 'boolean',
        'kes_scol' => 'boolean',
        'kes_hamil' => 'boolean',
        'kes_hasil' => 'boolean',
        'waw_bersedia_pindah' => 'boolean',
    ];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class, 'nup', 'kode_pendaftar');
    }

    public function wawRekomendasiProdi()
    {
        return $this->belongsTo(Prodi::class, 'waw_rekomendasi_prodi_id');
    }
}
