<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ImportErrorsExport implements FromArray, WithHeadings, WithStyles, WithTitle
{
    protected array $errors;

    protected array $headings;

    public function __construct(array $errors, array $headings = [])
    {
        $this->errors = $errors;
        $this->headings = $headings;
    }

    public function array(): array
    {
        return array_map(function ($e) {
            $row = [
                $e['row'] ?? '',
            ];

            $data = $e['data'] ?? $e;
            foreach ($this->headings as $heading) {
                $row[] = $data[$heading] ?? '';
            }

            $row[] = $e['error'] ?? '';

            return $row;
        }, $this->errors);
    }

    public function headings(): array
    {
        return array_merge(['Baris'], $this->headings, ['Error']);
    }

    public function title(): string
    {
        return 'Error Import';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
