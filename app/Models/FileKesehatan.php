<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileKesehatan extends Model
{
    use HasFactory;

    protected $table = 'file_kesehatan';

    protected $fillable = ['noujian', 'file_lockes'];

    public function peserta()
    {
        return $this->belongsTo(Peserta::class, 'noujian', 'noujian');
    }
}
