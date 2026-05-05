<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kesehatan extends Model
{
    use HasFactory;

    protected $table = 'kesehatan';

    protected $fillable = [
        'noujian', 'namalbg', 'lokasi', 'tb', 'bb', 'ow', 'obesitas',
        'tensi', 'nadi', 'tato', 'tindik', 'bw', 'strab', 'pupil',
        'paru', 'sco', 'mop', 'amp', 'thc', 'kehamilan', 'status', 'catatan',
    ];

    public function peserta()
    {
        return $this->belongsTo(Peserta::class, 'noujian', 'noujian');
    }

    public function fileKesehatan()
    {
        return $this->hasMany(FileKesehatan::class, 'noujian', 'noujian');
    }
}
