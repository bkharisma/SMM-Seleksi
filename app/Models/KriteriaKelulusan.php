<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KriteriaKelulusan extends Model
{
    use HasFactory;

    protected $table = 'kriteria_kelulusan';

    protected $fillable = [
        'prodi_id', 'tahap_seleksi_id', 'min_iq', 'bobot_iq', 'min_english', 'min_wawancara',
        'min_tb', 'max_tb', 'max_bw', 'max_obe', 'allow_nark', 'allow_hml', 'allow_tato',
        'allow_tindik', 'allow_paru', 'allow_strab', 'allow_scol',
        'ordering', 'filter_pilihan', 'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function tahapSeleksi()
    {
        return $this->belongsTo(TahapSeleksi::class);
    }

    public function kriteriaUjian()
    {
        return $this->hasMany(KriteriaUjian::class);
    }
}
