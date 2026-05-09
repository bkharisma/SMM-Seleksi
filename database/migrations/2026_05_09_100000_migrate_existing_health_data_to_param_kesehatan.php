<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $kesehatanRecords = DB::table('kesehatan')->get();

        foreach ($kesehatanRecords as $record) {
            $existingParams = $record->param_kesehatan ? json_decode($record->param_kesehatan, true) : [];

            $fixedFields = [
                'tb' => $record->tb,
                'bb' => $record->bb,
                'ow' => $record->ow,
                'obesitas' => $record->obesitas,
                'tensi' => $record->tensi,
                'nadi' => $record->nadi,
                'tato' => $record->tato,
                'tindik' => $record->tindik,
                'bw' => $record->bw,
                'strab' => $record->strab,
                'pupil' => $record->pupil,
                'paru' => $record->paru,
                'sco' => $record->sco,
                'mop' => $record->mop,
                'amp' => $record->amp,
                'thc' => $record->thc,
                'kehamilan' => $record->kehamilan,
            ];

            $mergedParams = array_filter($fixedFields, fn ($v) => $v !== null);
            $finalParams = array_merge($existingParams, $mergedParams);

            if (!empty($finalParams)) {
                DB::table('kesehatan')
                    ->where('id', $record->id)
                    ->update(['param_kesehatan' => json_encode($finalParams)]);
            }
        }
    }

    public function down(): void
    {
    }
};
