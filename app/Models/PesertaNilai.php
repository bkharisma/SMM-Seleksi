<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PesertaNilai extends Model
{
    use HasFactory;

    protected $table = 'peserta_nilai';

    protected $fillable = [
        'nup', 'nus', 'ujian_id', 'psi_iq', 'psi_bobot', 'bing_nil',
        'waw_nil', 'kes_tb', 'kes_bw', 'kes_obe', 'kes_nark',
        'kes_hml', 'kes_tato', 'kes_tindik', 'kes_paru', 'kes_stra',
        'kes_scol', 'type', 'skor_akhir',
    ];

    protected $casts = [
        'kes_bw' => 'boolean',
        'kes_nark' => 'boolean',
        'kes_hml' => 'boolean',
        'kes_tato' => 'boolean',
        'kes_tindik' => 'boolean',
        'kes_paru' => 'boolean',
        'kes_stra' => 'boolean',
        'kes_scol' => 'boolean',
    ];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function peserta()
    {
        return $this->belongsTo(Peserta::class, 'nup', 'nup');
    }
}
