<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 9px; color: #333; }
        .header { text-align: center; margin-bottom: 10px; }
        .header h2 { margin: 0; font-size: 12px; color: #1e40af; }
        .header p { margin: 2px 0; font-size: 9px; color: #666; }
        .info { margin-bottom: 10px; }
        .info table { width: 100%; }
        .info td { padding: 2px 0; font-size: 9px; }
        .info td:first-child { width: 100px; color: #666; }
        table.list { width: 100%; border-collapse: collapse; margin-top: 5px; }
        table.list th { background: #f3f4f6; border: 1px solid #ddd; padding: 4px; font-size: 8px; text-align: center; }
        table.list td { border: 1px solid #ddd; padding: 3px 4px; font-size: 8px; }
        table.list td:first-child { text-align: center; width: 25px; }
        table.list td:nth-child(2) { width: 70px; }
        table.list td:nth-child(3) { width: 70px; }
        table.list td:last-child { text-align: center; width: 40px; }
        .footer { margin-top: 20px; text-align: right; font-size: 9px; }
        .sign { margin-top: 30px; text-align: right; }
        .sign div { display: inline-block; text-align: center; width: 150px; }
        .sign .line { border-bottom: 1px solid #333; height: 40px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $appName }}</h2>
        <p>DAFTAR HADIR PESERTA SELEKSI</p>
    </div>

    <div class="info">
        <table>
            <tr><td>Ruang</td><td>: {{ $ruang->nomor_ruang }} - {{ $ruang->nama_gedung }}</td></tr>
            <tr><td>Tanggal</td><td>: {{ $dataAbsensi->tanggal?->format('d/m/Y') ?? '-' }}</td></tr>
            <tr><td>Waktu</td><td>: {{ $dataAbsensi->waktu ?? '-' }}</td></tr>
            <tr><td>Jenis</td><td>: {{ ucfirst($dataAbsensi->jenis ?? '-') }}</td></tr>
            <tr><td>Kelompok</td><td>: {{ $dataAbsensi->kelompok ?? '-' }}</td></tr>
        </table>
    </div>

    <table class="list">
        <thead>
            <tr>
                <th>No</th>
                <th>No. Ujian</th>
                <th>No Pendaftar</th>
                <th>Nama</th>
                <th>Pilihan 1</th>
                <th>Tanda Tangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($absensi as $index => $a)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $a->peserta?->noujian }}</td>
                <td>{{ $a->peserta?->nup }}</td>
                <td>{{ $a->peserta?->nama }}</td>
                <td>{{ $a->peserta?->pil1_prodi?->nama_prodi }}</td>
                <td></td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">Tidak ada data</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="sign">
        <div>
            <p>Palembang, {{ now()->format('d/m/Y') }}</p>
            <p>Petugas Absensi</p>
            <div class="line"></div>
            <p>(...........................)</p>
        </div>
    </div>
</body>
</html>
