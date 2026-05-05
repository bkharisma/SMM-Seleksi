<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kabupaten extends Model
{
    use HasFactory;

    protected $table = 'kabupaten';

    protected $primaryKey = 'kode_kab';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = ['kode_kab', 'kode_prop', 'nama_kab'];

    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'kode_prop', 'kode_prop');
    }

    public function peserta()
    {
        return $this->hasMany(Peserta::class, 'kode_kab', 'kode_kab');
    }
}
