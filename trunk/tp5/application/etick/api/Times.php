<?php

namespace app\etick\api;

class Times{


    static public function GetSystemTime(){
        $systemTime = date('Y-m-d H:i:s');
        return $systemTime;
    }



}