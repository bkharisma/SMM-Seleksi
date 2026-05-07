<?php

namespace App\Services;

class BsiEnc
{
    const TIME_DIFF_LIMIT = 480;

    public static function encrypt(array $json_data, string $cid, string $secret): string
    {
        return self::doubleEncrypt(strrev((string) time()).'.'.json_encode($json_data), $cid, $secret);
    }

    public static function decrypt(string $hashed_string, string $cid, string $secret): ?array
    {
        $parsed_string = self::doubleDecrypt($hashed_string, $cid, $secret);
        if ($parsed_string === null) {
            return null;
        }

        $parts = explode('.', $parsed_string, 2);
        if (count($parts) < 2) {
            return null;
        }

        [$timestamp, $data] = $parts;

        if (self::tsDiff(strrev($timestamp)) === true) {
            return json_decode($data, true);
        }

        return null;
    }

    private static function tsDiff(string $ts): bool
    {
        return abs((int) $ts - time()) <= self::TIME_DIFF_LIMIT;
    }

    private static function doubleEncrypt(string $string, string $cid, string $secret): string
    {
        $result = self::enc($string, $cid);
        $result = self::enc($result, $secret);

        return strtr(rtrim(base64_encode($result), '='), '+/', '-_');
    }

    private static function enc(string $string, string $key): string
    {
        $result = '';
        $strls = strlen($string);
        $strlk = strlen($key);

        for ($i = 0; $i < $strls; $i++) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % $strlk) - 1, 1);
            $char = chr((ord($char) + ord($keychar)) % 128);
            $result .= $char;
        }

        return $result;
    }

    private static function doubleDecrypt(string $string, string $cid, string $secret): ?string
    {
        $padded = str_pad($string, (int) ceil(strlen($string) / 4) * 4, '=', STR_PAD_RIGHT);
        $result = base64_decode(strtr($padded, '-_', '+/'));

        if ($result === false) {
            return null;
        }

        $result = self::dec($result, $cid);
        $result = self::dec($result, $secret);

        return $result;
    }

    private static function dec(string $string, string $key): string
    {
        $result = '';
        $strls = strlen($string);
        $strlk = strlen($key);

        for ($i = 0; $i < $strls; $i++) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % $strlk) - 1, 1);
            $char = chr(((ord($char) - ord($keychar)) + 256) % 128);
            $result .= $char;
        }

        return $result;
    }
}
