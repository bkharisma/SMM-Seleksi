<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftar extends Model
{
    use HasFactory;

    protected $table = 'pendaftar';

    protected $fillable = [
        'kode_pendaftar', 'noujian', 'nama', 'tanggal_lahir', 'email', 'no_hp',
        'pil1', 'pil2', 'pil3',
        'lulus', 'lulus_tahap', 'param_lulus', 'nilai_akhir',
        'user_id', 'ruang_id', 'ruang_kelompok', 'jalur_id',
        'tempat_lahir', 'jenis_kelamin', 'alamat', 'agama',
        'nama_ayah', 'nama_ibu', 'hp_ayah', 'hp_ibu',
        'pekerjaan_ayah', 'pekerjaan_ibu',
        'nama_sekolah', 'npsn', 'akreditasi', 'tahun_lulus',
        'prestasi', 'foto', 'is_referensi', 'catatan_referensi',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tempat_lahir' => 'date',
        'param_lulus' => 'array',
        'is_referensi' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ruang()
    {
        return $this->belongsTo(Ruang::class);
    }

    public function jalur()
    {
        return $this->belongsTo(JalurPendaftaran::class, 'jalur_id');
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

    public function lulusProdi()
    {
        return $this->belongsTo(Prodi::class, 'lulus');
    }

    public function lulusTahap()
    {
        return $this->belongsTo(TahapSeleksi::class, 'lulus_tahap');
    }

    public function nilai()
    {
        return $this->hasMany(PendaftarNilai::class, 'nup', 'kode_pendaftar');
    }

    public function raport()
    {
        return $this->hasOne(Raport::class, 'pendaftar_id');
    }

    public function kesehatan()
    {
        return $this->hasOne(Kesehatan::class, 'pendaftar_id');
    }

    public function fileRaport()
    {
        return $this->hasMany(FileRaport::class, 'pendaftar_id');
    }

    public function fileKesehatan()
    {
        return $this->hasMany(FileKesehatan::class, 'pendaftar_id');
    }

    public function getIsLulusAttribute(): bool
    {
        return $this->lulus !== null;
    }

    public function getNamaLengkapAttribute(): string
    {
        return $this->nama;
    }

    public function getPasswordFromTanggalLahirAttribute(): string
    {
        return $this->tanggal_lahir->format('dmY');
    }
}
