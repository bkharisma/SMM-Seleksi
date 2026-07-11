<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 10px; }
        .card { border: 1px solid #333; padding: 8px; border-radius: 4px; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 5px; margin-bottom: 8px; }
        .header h2 { margin: 0; color: #1e40af; font-size: 12px; }
        .header p { margin: 2px 0; color: #666; font-size: 8px; }
        .content { display: flex; gap: 10px; }
        .photo { width: 70px; height: 90px; border: 1px solid #ccc; text-align: center; line-height: 90px; color: #999; background: #f5f5f5; }
        .photo img { width: 70px; height: 90px; object-fit: cover; }
        .info { flex: 1; }
        .info table { width: 100%; }
        .info td { padding: 1px 0; vertical-align: top; }
        .info td:first-child { width: 70px; color: #666; }
        .footer { margin-top: 8px; text-align: center; font-size: 7px; color: #999; border-top: 1px solid #eee; padding-top: 3px; }
        .qr { text-align: center; margin-top: 5px; }
        .qr img { width: 60px; height: 60px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2>{{ $appName }}</h2>
            <p>KARTU PESERTA SELEKSI</p>
        </div>
        <div class="content">
            <div class="photo">
                @if($peserta->foto)
                    <img src="{{ storage_path('app/public/' . $peserta->foto) }}" alt="Foto">
                @else
                    Foto
                @endif
            </div>
            <div class="info">
                <table>
                    <tr><td>No. Ujian</td><td><strong>{{ $peserta->noujian }}</strong></td></tr>
                    <tr><td>No Pendaftar</td><td>{{ $peserta->nup }}</td></tr>
                    <tr><td>Nama</td><td>{{ $peserta->nama }}</td></tr>
                    <tr><td>TTL</td><td>{{ $peserta->tempatlahir }}, {{ $peserta->tgllahir?->format('d-m-Y') }}</td></tr>
                    <tr><td>Pilihan 1</td><td>{{ $peserta->pil1Prodi?->nama_prodi }}</td></tr>
                    @if($peserta->ruang)
                    <tr><td>Ruang</td><td>{{ $peserta->ruang->nomor_ruang }}</td></tr>
                    @endif
                </table>
            </div>
        </div>
        <div class="qr">
            <img src="{{ $qrCode }}" alt="QR Code">
        </div>
        <div class="footer">
            Kartu ini wajib dibawa saat mengikuti seleksi
        </div>
    </div>
</body>
</html>
