<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 15px; }
        .header h2 { margin: 0; color: #1e40af; }
        .header p { margin: 2px 0; color: #666; font-size: 10px; }
        .section { margin-bottom: 15px; }
        .section h3 { background: #f3f4f6; padding: 5px 10px; margin: 0 0 8px 0; font-size: 12px; color: #1e40af; border-left: 3px solid #1e40af; }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 3px 5px; vertical-align: top; }
        .info-table td:first-child { width: 140px; color: #666; }
        .info-table td:nth-child(2) { width: 10px; }
        .photo { float: right; width: 90px; height: 120px; border: 1px solid #ccc; text-align: center; line-height: 120px; color: #999; background: #f5f5f5; margin-left: 10px; }
        .photo img { width: 90px; height: 120px; object-fit: cover; }
        .footer { margin-top: 20px; text-align: right; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $appName }}</h2>
        <p>PROFIL PESERTA SELEKSI</p>
    </div>

    <div class="photo">
        @if($peserta->foto)
            <img src="{{ storage_path('app/public/' . $peserta->foto) }}" alt="Foto">
        @else
            Foto
        @endif
    </div>

    <div class="section">
        <h3>Data Pribadi</h3>
        <table class="info-table">
            <tr><td>NUP</td><td>:</td><td>{{ $peserta->nup }}</td></tr>
            <tr><td>No. Ujian</td><td>:</td><td>{{ $peserta->noujian ?? '-' }}</td></tr>
            <tr><td>Nama Lengkap</td><td>:</td><td>{{ $peserta->nama }}</td></tr>
            <tr><td>NIK</td><td>:</td><td>{{ $peserta->nik ?? '-' }}</td></tr>
            <tr><td>Tempat, Tgl Lahir</td><td>:</td><td>{{ $peserta->tempatlahir ?? '-' }}, {{ $peserta->tgllahir?->format('d-m-Y') ?? '-' }}</td></tr>
            <tr><td>Jenis Kelamin</td><td>:</td><td>{{ $peserta->sex === 'L' ? 'Laki-laki' : ($peserta->sex === 'P' ? 'Perempuan' : '-') }}</td></tr>
            <tr><td>Golongan Darah</td><td>:</td><td>{{ $peserta->goldarah ?? '-' }}</td></tr>
            <tr><td>Agama</td><td>:</td><td>{{ $peserta->agama ?? '-' }}</td></tr>
            <tr><td>Email</td><td>:</td><td>{{ $peserta->email ?? '-' }}</td></tr>
            <tr><td>HP</td><td>:</td><td>{{ $peserta->hp ?? '-' }}</td></tr>
            <tr><td>Alamat</td><td>:</td><td>{{ $peserta->alamat ?? '-' }}</td></tr>
            <tr><td>Kabupaten</td><td>:</td><td>{{ $peserta->kabupaten ?? '-' }}</td></tr>
            <tr><td>Provinsi</td><td>:</td><td>{{ $peserta->provinsi?->nama_prop ?? '-' }}</td></tr>
            <tr><td>Kode Pos</td><td>:</td><td>{{ $peserta->kodepos ?? '-' }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Data Orang Tua</h3>
        <table class="info-table">
            <tr><td>Nama Ayah</td><td>:</td><td>{{ $peserta->nm_ayah ?? '-' }}</td></tr>
            <tr><td>Nama Ibu</td><td>:</td><td>{{ $peserta->nm_ibu ?? '-' }}</td></tr>
            <tr><td>Pekerjaan Ayah</td><td>:</td><td>{{ $peserta->pek_ayah ?? '-' }}</td></tr>
            <tr><td>Pekerjaan Ibu</td><td>:</td><td>{{ $peserta->pek_ibu ?? '-' }}</td></tr>
            <tr><td>Telp. Ortu</td><td>:</td><td>{{ $peserta->telp_ortu ?? '-' }}</td></tr>
            <tr><td>HP Ortu</td><td>:</td><td>{{ $peserta->hp_ortu ?? '-' }}</td></tr>
            <tr><td>Email Ortu</td><td>:</td><td>{{ $peserta->email_ortu ?? '-' }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Data Pendidikan</h3>
        <table class="info-table">
            <tr><td>Jenis SMA</td><td>:</td><td>{{ $peserta->jenis_sma ?? '-' }}</td></tr>
            <tr><td>Nama Sekolah</td><td>:</td><td>{{ $peserta->nama_sekolah ?? '-' }}</td></tr>
            <tr><td>Kota Sekolah</td><td>:</td><td>{{ $peserta->kota_sekolah ?? '-' }}</td></tr>
            <tr><td>Tahun STTB</td><td>:</td><td>{{ $peserta->thn_sttb ?? '-' }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Pilihan Program Studi</h3>
        <table class="info-table">
            <tr><td>Pilihan 1</td><td>:</td><td>{{ $peserta->pil1Prodi?->nama_prodi ?? '-' }}</td></tr>
            <tr><td>Pilihan 2</td><td>:</td><td>{{ $peserta->pil2Prodi?->nama_prodi ?? '-' }}</td></tr>
            <tr><td>Pilihan 3</td><td>:</td><td>{{ $peserta->pil3Prodi?->nama_prodi ?? '-' }}</td></tr>
            <tr><td>Pilihan 4</td><td>:</td><td>{{ $peserta->pil4Prodi?->nama_prodi ?? '-' }}</td></tr>
            <tr><td>Sumber Info</td><td>:</td><td>{{ $peserta->survey?->keterangan ?? '-' }}</td></tr>
        </table>
    </div>

    @if($peserta->ruang)
    <div class="section">
        <h3>Jadwal & Ruang Ujian</h3>
        <table class="info-table">
            <tr><td>Ruang</td><td>:</td><td>{{ $peserta->ruang->nomor_ruang }} - {{ $peserta->ruang->nama_gedung }}</td></tr>
            <tr><td>Kelompok</td><td>:</td><td>{{ $peserta->ruang_kelompok ?? '-' }}</td></tr>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
