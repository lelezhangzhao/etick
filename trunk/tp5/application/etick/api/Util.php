<?php

namespace app\etick\api;

class Util{
    static public function GetUUID(){
        $str = md5(uniqid(mt_rand(), true));
        return $str;
    }

    static public function HasTel(){
        return false;
    }

    static public function HasCaptcha(){
        return false;
    }

    static public function RegisterSendEti(){
        return true;
    }
}