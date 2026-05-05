<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KriteriaUjian extends Model
{
    use HasFactory;

    protected $table = 'kriteria_ujian';

    protected $fillable = ['kriteria_kelulusan_id', 'ujian_id', 'jenis', 'nilai_standar', 'parameters'];

    protected $casts = [
        'parameters' => 'array',
    ];

    public function kriteriaKelulusan()
    {
        return $this->belongsTo(KriteriaKelulusan::class);
    }

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }
}
