<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { color: #1e40af; margin: 0; font-size: 18px; }
        .header h2 { color: #666; margin: 5px 0 0; font-size: 14px; font-weight: normal; }
        .title { text-align: center; background: #f0f9ff; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
        .title h3 { color: #1e40af; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table td { padding: 6px 8px; vertical-align: top; }
        table td:first-child { width: 35%; font-weight: bold; color: #555; }
        .va-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .va-box .va-number { font-size: 24px; font-weight: bold; color: #92400e; font-family: monospace; }
        .va-box .va-amount { font-size: 18px; font-weight: bold; color: #92400e; margin-top: 5px; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px; }
        .note { background: #fff7ed; border: 1px solid #fed7aa; padding: 10px; border-radius: 5px; font-size: 11px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $appName }}</h1>
        <h2>Politeknik Pariwisata Palembang</h2>
    </div>

    <div class="title">
        <h3>BUKTI REGISTRASI PENDAFTARAN</h3>
    </div>

    <table>
        <tr>
            <td>No Pendaftar</td>
            <td>: {{ $peminat->nup }}</td>
        </tr>
        <tr>
            <td>Nama Lengkap</td>
            <td>: {{ $peminat->nama }}</td>
        </tr>
        <tr>
            <td>Email</td>
            <td>: {{ $peminat->email }}</td>
        </tr>
        <tr>
            <td>No. HP</td>
            <td>: {{ $peminat->hp }}</td>
        </tr>
        <tr>
            <td>Tanggal Lahir</td>
            <td>: {{ $peminat->tgllahir ? $peminat->tgllahir->format('d F Y') : '-' }}</td>
        </tr>
        <tr>
            <td>Asal Sekolah</td>
            <td>: {{ $peminat->nama_sekolah ?? '-' }}</td>
        </tr>
        <tr>
            <td>Tanggal Daftar</td>
            <td>: {{ $peminat->tgldaftar ? $peminat->tgldaftar->format('d F Y H:i') : '-' }}</td>
        </tr>
    </table>

    @if($va)
    <div class="va-box">
        <div style="font-size: 12px; color: #92400e; margin-bottom: 5px;">Virtual Account BSI</div>
        <div class="va-number">{{ $va->virtual_account }}</div>
        <div class="va-amount">Rp {{ number_format($va->trx_amount, 0, ',', '.') }}</div>
        <div style="font-size: 11px; color: #92400e; margin-top: 5px;">
            Batas Bayar: {{ $va->datetime_expired?->format('d F Y H:i') }}
        </div>
    </div>
    @endif

    <div class="note">
        <strong>Catatan:</strong>
        <ul style="margin: 5px 0 0; padding-left: 20px;">
            <li>Simpan bukti registrasi ini sebagai tanda bukti pendaftaran.</li>
            <li>Password login telah dikirimkan ke email terdaftar.</li>
            <li>Lakukan pembayaran sebelum batas waktu yang ditentukan.</li>
            <li>Setelah pembayaran dikonfirmasi, Anda dapat login ke dashboard member.</li>
        </ul>
    </div>

    <div class="footer">
        <p>Dokumen ini dicetak secara otomatis pada {{ now()->format('d F Y H:i') }}</p>
        <p>{{ $appName }} - Politeknik Pariwisata Palembang</p>
    </div>
</body>
</html>
