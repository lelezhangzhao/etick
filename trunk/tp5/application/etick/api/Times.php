<?php

namespace app\etick\api;

class Times{


    static public function GetSystemTime(){
        $systemTime = date('Y-m-d H:i:s');
        return $systemTime;
    }

    static public function GetSystemMicroTime(){
        date_default_timezone_set('PRC');
        $mtimestamp = sprintf("%.3f", microtime(true)); // 带毫秒的时间戳

        $timestamp = floor($mtimestamp); // 时间戳
        $milliseconds = round(($mtimestamp - $timestamp) * 1000); // 毫秒

        $datetime = date("Y-m-d H:i:s", $timestamp) . '.' . $milliseconds;

        return $datetime;
    }



}