<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminat extends Model
{
    use HasFactory;

    protected $table = 'peminat';

    protected $fillable = [
        'nup', 'spmb', 'nama', 'pwd', 'email', 'hp', 'tgldaftar',
        'tgllahir', 'kwng', 'pil1', 'pil2', 'pil3', 'pil4',
        'taustp', 'nama_sekolah',
    ];

    protected $casts = [
        'tgldaftar' => 'date',
        'tgllahir' => 'date',
    ];

    public function pil1Prodi()
    {
        return $this->belongsTo(Prodi::class, 'pil1');
    }

    public function pil2Prodi()
    {
        return $this->belongsTo(Prodi::class, 'pil2');
    }

    public function pil3Prodi()
    {
        return $this->belongsTo(Prodi::class, 'pil3');
    }

    public function pil4Prodi()
    {
        return $this->belongsTo(Prodi::class, 'pil4');
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class, 'taustp');
    }

    public function bsiPembayaran()
    {
        return $this->hasOne(BsiPembayaran::class);
    }
}
