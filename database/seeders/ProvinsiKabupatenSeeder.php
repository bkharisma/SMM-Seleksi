<?php

namespace Database\Seeders;

use App\Models\Kabupaten;
use App\Models\Provinsi;
use Illuminate\Database\Seeder;

class ProvinsiKabupatenSeeder extends Seeder
{
    public function run(): void
    {
        $provinsi = [
            ['kode_prop' => '11', 'nama_prop' => 'ACEH'],
            ['kode_prop' => '12', 'nama_prop' => 'SUMATERA UTARA'],
            ['kode_prop' => '13', 'nama_prop' => 'SUMATERA BARAT'],
            ['kode_prop' => '14', 'nama_prop' => 'RIAU'],
            ['kode_prop' => '15', 'nama_prop' => 'JAMBI'],
            ['kode_prop' => '16', 'nama_prop' => 'SUMATERA SELATAN'],
            ['kode_prop' => '17', 'nama_prop' => 'BENGKULU'],
            ['kode_prop' => '18', 'nama_prop' => 'LAMPUNG'],
            ['kode_prop' => '19', 'nama_prop' => 'KEPULAUAN BANGKA BELITUNG'],
            ['kode_prop' => '21', 'nama_prop' => 'KEPULAUAN RIAU'],
            ['kode_prop' => '31', 'nama_prop' => 'DKI JAKARTA'],
            ['kode_prop' => '32', 'nama_prop' => 'JAWA BARAT'],
            ['kode_prop' => '33', 'nama_prop' => 'JAWA TENGAH'],
            ['kode_prop' => '34', 'nama_prop' => 'DI YOGYAKARTA'],
            ['kode_prop' => '35', 'nama_prop' => 'JAWA TIMUR'],
            ['kode_prop' => '36', 'nama_prop' => 'BANTEN'],
            ['kode_prop' => '51', 'nama_prop' => 'BALI'],
            ['kode_prop' => '52', 'nama_prop' => 'NUSA TENGGARA BARAT'],
            ['kode_prop' => '53', 'nama_prop' => 'NUSA TENGGARA TIMUR'],
            ['kode_prop' => '61', 'nama_prop' => 'KALIMANTAN BARAT'],
            ['kode_prop' => '62', 'nama_prop' => 'KALIMANTAN TENGAH'],
            ['kode_prop' => '63', 'nama_prop' => 'KALIMANTAN SELATAN'],
            ['kode_prop' => '64', 'nama_prop' => 'KALIMANTAN TIMUR'],
            ['kode_prop' => '71', 'nama_prop' => 'SULAWESI UTARA'],
            ['kode_prop' => '72', 'nama_prop' => 'SULAWESI TENGAH'],
            ['kode_prop' => '73', 'nama_prop' => 'SULAWESI SELATAN'],
            ['kode_prop' => '74', 'nama_prop' => 'SULAWESI TENGGARA'],
            ['kode_prop' => '75', 'nama_prop' => 'GORONTALO'],
            ['kode_prop' => '76', 'nama_prop' => 'SULAWESI BARAT'],
            ['kode_prop' => '81', 'nama_prop' => 'MALUKU'],
            ['kode_prop' => '82', 'nama_prop' => 'MALUKU UTARA'],
            ['kode_prop' => '91', 'nama_prop' => 'PAPUA BARAT'],
            ['kode_prop' => '94', 'nama_prop' => 'PAPUA'],
        ];

        foreach ($provinsi as $p) {
            Provinsi::firstOrCreate(['kode_prop' => $p['kode_prop']], ['nama_prop' => $p['nama_prop']]);
        }

        $kabupaten = [
            ['kode_kab' => '1601', 'kode_prop' => '16', 'nama_kab' => 'OGAN KOMERING ULU'],
            ['kode_kab' => '1602', 'kode_prop' => '16', 'nama_kab' => 'OGAN KOMERING ILIR'],
            ['kode_kab' => '1603', 'kode_prop' => '16', 'nama_kab' => 'MUARA ENIM'],
            ['kode_kab' => '1604', 'kode_prop' => '16', 'nama_kab' => 'LAHAT'],
            ['kode_kab' => '1605', 'kode_prop' => '16', 'nama_kab' => 'MUSI RAWAS'],
            ['kode_kab' => '1606', 'kode_prop' => '16', 'nama_kab' => 'MUSI BANYUASIN'],
            ['kode_kab' => '1607', 'kode_prop' => '16', 'nama_kab' => 'BANYUASIN'],
            ['kode_kab' => '1608', 'kode_prop' => '16', 'nama_kab' => 'OGAN KOMERING ULU SELATAN'],
            ['kode_kab' => '1609', 'kode_prop' => '16', 'nama_kab' => 'OGAN KOMERING ULU TIMUR'],
            ['kode_kab' => '1610', 'kode_prop' => '16', 'nama_kab' => 'OGAN ILIR'],
            ['kode_kab' => '1611', 'kode_prop' => '16', 'nama_kab' => 'EMPAT LAWANG'],
            ['kode_kab' => '1612', 'kode_prop' => '16', 'nama_kab' => 'PENUKAL ABAB LEMATANG ILIR'],
            ['kode_kab' => '1613', 'kode_prop' => '16', 'nama_kab' => 'MUSI RAWAS UTARA'],
            ['kode_kab' => '1671', 'kode_prop' => '16', 'nama_kab' => 'PALEMBANG'],
            ['kode_kab' => '1672', 'kode_prop' => '16', 'nama_kab' => 'PRABUMULIH'],
            ['kode_kab' => '1673', 'kode_prop' => '16', 'nama_kab' => 'PAGAR ALAM'],
            ['kode_kab' => '1674', 'kode_prop' => '16', 'nama_kab' => 'LUBUKLINGGAU'],
            ['kode_kab' => '3101', 'kode_prop' => '31', 'nama_kab' => 'KEPULAUAN SERIBU'],
            ['kode_kab' => '3171', 'kode_prop' => '31', 'nama_kab' => 'JAKARTA SELATAN'],
            ['kode_kab' => '3172', 'kode_prop' => '31', 'nama_kab' => 'JAKARTA TIMUR'],
            ['kode_kab' => '3173', 'kode_prop' => '31', 'nama_kab' => 'JAKARTA PUSAT'],
            ['kode_kab' => '3174', 'kode_prop' => '31', 'nama_kab' => 'JAKARTA BARAT'],
            ['kode_kab' => '3175', 'kode_prop' => '31', 'nama_kab' => 'JAKARTA UTARA'],
            ['kode_kab' => '3201', 'kode_prop' => '32', 'nama_kab' => 'BOGOR'],
            ['kode_kab' => '3202', 'kode_prop' => '32', 'nama_kab' => 'SUKABUMI'],
            ['kode_kab' => '3203', 'kode_prop' => '32', 'nama_kab' => 'CIANJUR'],
            ['kode_kab' => '3204', 'kode_prop' => '32', 'nama_kab' => 'BANDUNG'],
            ['kode_kab' => '3205', 'kode_prop' => '32', 'nama_kab' => 'GARUT'],
            ['kode_kab' => '3271', 'kode_prop' => '32', 'nama_kab' => 'BOGOR'],
            ['kode_kab' => '3272', 'kode_prop' => '32', 'nama_kab' => 'SUKABUMI'],
            ['kode_kab' => '3273', 'kode_prop' => '32', 'nama_kab' => 'BANDUNG'],
            ['kode_kab' => '3274', 'kode_prop' => '32', 'nama_kab' => 'CIMAHI'],
            ['kode_kab' => '3275', 'kode_prop' => '32', 'nama_kab' => 'BEKASI'],
            ['kode_kab' => '3276', 'kode_prop' => '32', 'nama_kab' => 'DEPOK'],
            ['kode_kab' => '3277', 'kode_prop' => '32', 'nama_kab' => 'CIREBON'],
            ['kode_kab' => '3278', 'kode_prop' => '32', 'nama_kab' => 'BANJAR'],
            ['kode_kab' => '3279', 'kode_prop' => '32', 'nama_kab' => 'TASIKMALAYA'],
            ['kode_kab' => '3301', 'kode_prop' => '33', 'nama_kab' => 'CILACAP'],
            ['kode_kab' => '3374', 'kode_prop' => '33', 'nama_kab' => 'SEMARANG'],
            ['kode_kab' => '3375', 'kode_prop' => '33', 'nama_kab' => 'PEKALONGAN'],
            ['kode_kab' => '3376', 'kode_prop' => '33', 'nama_kab' => 'TEGAL'],
            ['kode_kab' => '3501', 'kode_prop' => '35', 'nama_kab' => 'PACITAN'],
            ['kode_kab' => '3578', 'kode_prop' => '35', 'nama_kab' => 'SURABAYA'],
            ['kode_kab' => '5101', 'kode_prop' => '51', 'nama_kab' => 'JEMBRANA'],
            ['kode_kab' => '5102', 'kode_prop' => '51', 'nama_kab' => 'TABANAN'],
            ['kode_kab' => '5103', 'kode_prop' => '51', 'nama_kab' => 'BADUNG'],
            ['kode_kab' => '5104', 'kode_prop' => '51', 'nama_kab' => 'GIANYAR'],
            ['kode_kab' => '5105', 'kode_prop' => '51', 'nama_kab' => 'KLUNGKUNG'],
            ['kode_kab' => '5106', 'kode_prop' => '51', 'nama_kab' => 'BANGLI'],
            ['kode_kab' => '5107', 'kode_prop' => '51', 'nama_kab' => 'KARANGASEM'],
            ['kode_kab' => '5108', 'kode_prop' => '51', 'nama_kab' => 'BULELENG'],
            ['kode_kab' => '5171', 'kode_prop' => '51', 'nama_kab' => 'DENPASAR'],
            ['kode_kab' => '1201', 'kode_prop' => '12', 'nama_kab' => 'NIAS'],
            ['kode_kab' => '1271', 'kode_prop' => '12', 'nama_kab' => 'SIBOLGA'],
            ['kode_kab' => '1272', 'kode_prop' => '12', 'nama_kab' => 'TANJUNG BALAI'],
            ['kode_kab' => '1273', 'kode_prop' => '12', 'nama_kab' => 'PEMATANG SIANTAR'],
            ['kode_kab' => '1274', 'kode_prop' => '12', 'nama_kab' => 'TEBING TINGGI'],
            ['kode_kab' => '1275', 'kode_prop' => '12', 'nama_kab' => 'MEDAN'],
            ['kode_kab' => '1276', 'kode_prop' => '12', 'nama_kab' => 'BINJAI'],
            ['kode_kab' => '1277', 'kode_prop' => '12', 'nama_kab' => 'PADANGSIDIMPUAN'],
            ['kode_kab' => '1278', 'kode_prop' => '12', 'nama_kab' => 'GUNUNGSITOLI'],
            ['kode_kab' => '7301', 'kode_prop' => '73', 'nama_kab' => 'KEPULAUAN SELAYAR'],
            ['kode_kab' => '7371', 'kode_prop' => '73', 'nama_kab' => 'MAKASSAR'],
            ['kode_kab' => '7372', 'kode_prop' => '73', 'nama_kab' => 'PAREPARE'],
            ['kode_kab' => '5201', 'kode_prop' => '52', 'nama_kab' => 'LOMBOK BARAT'],
            ['kode_kab' => '5202', 'kode_prop' => '52', 'nama_kab' => 'LOMBOK TENGAH'],
            ['kode_kab' => '5203', 'kode_prop' => '52', 'nama_kab' => 'LOMBOK TIMUR'],
            ['kode_kab' => '5204', 'kode_prop' => '52', 'nama_kab' => 'SUMBAWA'],
            ['kode_kab' => '5205', 'kode_prop' => '52', 'nama_kab' => 'DOMPU'],
            ['kode_kab' => '5206', 'kode_prop' => '52', 'nama_kab' => 'BIMA'],
            ['kode_kab' => '5207', 'kode_prop' => '52', 'nama_kab' => 'SUMBAWA BARAT'],
            ['kode_kab' => '5208', 'kode_prop' => '52', 'nama_kab' => 'LOMBOK UTARA'],
            ['kode_kab' => '5271', 'kode_prop' => '52', 'nama_kab' => 'MATARAM'],
            ['kode_kab' => '5272', 'kode_prop' => '52', 'nama_kab' => 'BIMA'],
        ];

        foreach ($kabupaten as $k) {
            Kabupaten::firstOrCreate(['kode_kab' => $k['kode_kab']], [
                'kode_prop' => $k['kode_prop'],
                'nama_kab' => $k['nama_kab'],
            ]);
        }
    }
}
