<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Raport extends Model
{
    use HasFactory;

    protected $table = 'raport';

    protected $fillable = [
        'noujian', 'npsn', 'akreditasi', 'ahuruf', 'anilai',
        'x_1peng', 'x_1ket', 'x_2peng', 'x_2ket',
        'xi_1peng', 'xi_1ket', 'xi_2peng', 'xi_2ket',
        'xii_1peng', 'xii_1ket', 'xii_2peng', 'xii_2ket',
        'status', 'catatan',
    ];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }

    public function fileRaport()
    {
        return $this->hasMany(FileRaport::class, 'pendaftar_id');
    }
}
