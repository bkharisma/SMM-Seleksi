<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kartu Pendaftar</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @media print {
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Arial, sans-serif;
                font-size: 10px;
            }
            .card {
                width: 85mm;
                height: 55mm;
                border: 2px solid #000;
                border-radius: 5px;
                margin: 5mm auto;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }
            .header p {
                margin: 5px 0 0 0;
                font-size: 10px;
            }
            .photo {
                width: 50mm;
                height: 50mm;
                object-fit: cover;
                margin: 0 auto 15px;
                border: 2px solid #ddd;
                background: white;
            }
            .content {
                padding: 10px;
                line-height: 1.5;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
            }
            .info-label {
                width: 40%;
                font-weight: bold;
                color: #333;
            }
            .info-value {
                width: 60%;
            }
            .prodi {
                background: #f0f0ff;
                padding: 5px 10px;
                margin: 5px 0;
                border-radius: 3px;
                font-size: 11px;
            }
            .footer {
                text-align: center;
                font-size: 9px;
                color: #666;
                margin-top: 15px;
                border-top: 1px solid #000;
                padding-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>KARTU PENDAFTAR</h1>
            <p>POLITEKNIK PARIWISATA PALEMBANG</p>
        <p>SELEKSI MANDIRI MASUK</p>
        @if($pendaftar)
            <p>TAHUN AKADEMIK {{ $pendaftar->tanggal_lahir->year }}</p>
        @endif
        </div>
        <div class="content">
            <div style="text-align: center; margin: 15px 0;">
                <div class="photo">
                    @if($pendaftar->foto)
                        <img src="{{ asset($pendaftar->foto) }}" alt="{{ $pendaftar->nama }}">
                    @else
                        <div style="width: 100%; height: 100%; background: #eee; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 30px;">👤</span>
                        </div>
                    @endif
                </div>
            </div>

            <div class="info-row">
                <div class="info-label">Nama</div>
                <div class="info-value">{{ $pendaftar->nama }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">No. Ujian</div>
                <div class="info-value">{{ $pendaftar->noujian }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Kode Pendaftar</div>
                <div class="info-value">{{ $pendaftar->kode_pendaftar }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Tanggal Lahir</div>
                <div class="info-value">{{ $pendaftar->tanggal_lahir ? $pendaftar->tanggal_lahir->format('d F Y') : '-' }}</div>
            </div>

            <div class="prodi">
                <p><strong>Pilihan 1: </strong>{{ $pendaftar->pil1Prodi->nama_prodi ?? '-' }}</p>
                @if($pendaftar->pil2Prodi)
                    <p><strong>Pilihan 2: </strong>{{ $pendaftar->pil2Prodi->nama_prodi }}</p>
                @endif
                @if($pendaftar->pil3Prodi)
                    <p><strong>Pilihan 3: </strong>{{ $pendaftar->pil3Prodi->nama_prodi }}</p>
                @endif
            </div>
        </div>
        </div>

        <div class="footer">
            <p>Silahkan bawa kartu ini saat ujian seleksi.</p>
            <p>Waktu ujian: Lihat jadwal di dashboard.</p>
        </div>
    </div>
</body>
</html>
