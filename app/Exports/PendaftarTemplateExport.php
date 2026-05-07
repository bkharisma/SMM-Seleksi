<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class PendaftarTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new PendaftarTemplateSheet,
            new ProdiReferenceSheet,
            new JalurReferenceSheet,
        ];
    }
}
