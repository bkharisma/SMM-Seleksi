<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kesehatan extends Model
{
    use HasFactory;

    protected $table = 'kesehatan';

    protected $appends = ['peserta'];

    protected $fillable = [
        'noujian', 'namalbg', 'lokasi', 'tb', 'bb', 'ow', 'obesitas',
        'tensi', 'nadi', 'tato', 'tindik', 'bw', 'strab', 'pupil',
        'paru', 'sco', 'mop', 'amp', 'thc', 'kehamilan', 'status', 'catatan',
        'verifikasi_terakhir', 'diverifikasi_oleh_id', 'param_kesehatan',
    ];

    protected $casts = [
        'verifikasi_terakhir' => 'datetime',
        'param_kesehatan' => 'array',
    ];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }

    public function getPesertaAttribute()
    {
        return $this->pendaftar;
    }

    public function fileKesehatan()
    {
        return $this->hasMany(FileKesehatan::class, 'pendaftar_id', 'pendaftar_id');
    }

    public function diverifikasiOleh()
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh_id');
    }
}
