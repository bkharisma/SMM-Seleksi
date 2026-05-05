@component('mail::message')
# Pembayaran Terkonfirmasi

Halo **{{ $peserta->nama }}**,

Pembayaran pendaftaran Anda telah terkonfirmasi. Anda sekarang resmi menjadi **Peserta SMMPTP Poltekpar Palembang**.

## Data Peserta

| Item | Keterangan |
|------|-----------|
| **NUP** | {{ $peserta->nup }} |
| **Nama** | {{ $peserta->nama }} |
| **Email** | {{ $peserta->email }} |

## Langkah Selanjutnya

1. Login ke dashboard member Anda
2. Lengkapi data profil (data pribadi, orang tua, pendidikan)
3. Upload foto dan dokumen yang diperlukan
4. Pantau jadwal ujian dan pengumuman

@component('mail::button', ['url' => config('app.url') . '/login-member', 'color' => 'blue'])
Login Dashboard
@endcomponent

Selamat dan semoga sukses!

Salam,<br>
**Panitia SMMPTP Poltekpar Palembang**
@endcomponent
