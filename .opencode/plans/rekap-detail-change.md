# Plan: Ubah Lulus di Prodi ke Kode Prodi + Simbol Referensi

## Changes

### 1. Backend: `app/Services/SelectionService.php` (line 365-381)

Change `lulus_prodi` from `nama_prodi` to `kode_prodi` and add `is_referensi` field:

```php
// Line 379: change from
'lulus_prodi' => $p->lulusProdi?->nama_prodi,
// to
'lulus_prodi' => $p->lulusProdi?->kode_prodi,

// Add new line after it
'is_referensi' => (bool) $p->is_referensi,
```

### 2. Frontend: `resources/js/pages/admin/seleksi/rekap-detail.tsx`

**Import Star icon** (line 1):
```tsx
import { Star } from 'lucide-react';
```

**Update PesertaLulus interface** (line 15-25):
```tsx
interface PesertaLulus {
    id: number;
    nup: string;
    nama: string;
    noujian: string | null;
    pilihan: string;
    tahap_lulus: string | null;
    total_skor: number;
    status: string;
    lulus_prodi: string | null;
    is_referensi: boolean;
}
```

**Update table cell** (line 224):
```tsx
// Change from:
<td className="whitespace-nowrap px-4 py-2 text-sm">{p.lulus_prodi || '-'}</td>

// To:
<td className="whitespace-nowrap px-4 py-2 text-sm">
    {p.lulus_prodi || '-'}
    {p.is_referensi && <Star className="inline h-4 w-4 text-amber-500 ml-1" />}
</td>
```
