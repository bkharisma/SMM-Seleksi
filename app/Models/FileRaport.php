<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileRaport extends Model
{
    use HasFactory;

    protected $table = 'file_raport';

    protected $fillable = ['noujian', 'file_loc'];

    public function peserta()
    {
        return $this->belongsTo(Peserta::class, 'noujian', 'noujian');
    }
}
