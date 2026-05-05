<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peserta extends Model
{
    use HasFactory;

    protected $table = 'peserta';

    protected $fillable = [
        'user_id', 'nup', 'noujian', 'ruang_id', 'ruang_kelompok',
        'tgldaftar', 'nama', 'foto', 'nik', 'tempatlahir', 'tgllahir',
        'goldarah', 'sex', 'agama', 'email', 'hp', 'kode_prop',
        'kode_kab', 'propinsi', 'kabupaten', 'kecamatan', 'alamat',
        'kodepos', 'kwng', 'pil1', 'pil2', 'pil3', 'pil4', 'taustp',
        'bersedia', 'bersedia_data', 'lulus', 'param_lulus',
        'lulus_tahap', 'status', 'nil_psikotes', 'nil_bhsinggris',
        'nil_wawancara', 'nil_kesehatan', 'nm_ayah', 'nm_ibu',
        'pek_ayah', 'pek_ibu', 'telp_ortu', 'hp_ortu', 'email_ortu',
        'jenis_sma', 'kota_sekolah', 'prop_sekolah', 'thn_sttb',
        'nama_sekolah', 'presor_tkt', 'presor_juara', 'presor',
        'preskes_tkt', 'preskes_juara', 'preskes', 'prespen_tkt',
        'prespen_juara', 'prespen', 'tgl_cek_lulus', 'tgl_cek_kali',
    ];

    protected $casts = [
        'tgldaftar' => 'date',
        'tgllahir' => 'date',
        'bersedia' => 'boolean',
        'bersedia_data' => 'boolean',
        'status' => 'boolean',
        'presor_juara' => 'boolean',
        'preskes_juara' => 'boolean',
        'prespen_juara' => 'boolean',
        'param_lulus' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ruang()
    {
        return $this->belongsTo(Ruang::class);
    }

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

    public function lulusProdi()
    {
        return $this->belongsTo(Prodi::class, 'lulus');
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class, 'taustp');
    }

    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'kode_prop', 'kode_prop');
    }

    public function dataKabupaten()
    {
        return $this->belongsTo(Kabupaten::class, 'kode_kab', 'kode_kab');
    }

    public function nilai()
    {
        return $this->hasMany(PesertaNilai::class, 'nup', 'nup');
    }

    public function raport()
    {
        return $this->hasOne(Raport::class, 'noujian', 'noujian');
    }

    public function kesehatan()
    {
        return $this->hasOne(Kesehatan::class, 'noujian', 'noujian');
    }

    public function fileRaport()
    {
        return $this->hasMany(FileRaport::class, 'noujian', 'noujian');
    }

    public function fileKesehatan()
    {
        return $this->hasMany(FileKesehatan::class, 'noujian', 'noujian');
    }

    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }

    public function getIsLulusAttribute(): bool
    {
        return $this->lulus !== null;
    }
}
