<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensi';

    protected $fillable = ['data_absensi_id', 'peserta_id', 'ruang_id', 'hadir'];

    protected $casts = ['hadir' => 'boolean'];

    public function dataAbsensi()
    {
        return $this->belongsTo(DataAbsensi::class);
    }

    public function peserta()
    {
        return $this->belongsTo(Peserta::class);
    }

    public function ruang()
    {
        return $this->belongsTo(Ruang::class);
    }
}
