<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataAbsensi extends Model
{
    use HasFactory;

    protected $table = 'data_absensi';

    protected $fillable = [
        'jenis', 'kelompok', 'tanggal', 'waktu', 'ruang_id',
        'nomor_awal', 'nomor_akhir', 'upd_data',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'upd_data' => 'boolean',
    ];

    public function ruang()
    {
        return $this->belongsTo(Ruang::class);
    }

    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }
}
