<?php

namespace app\etick\api;

use app\etick\model\User as UserModel;
use app\etick\api\Util as UtilApi;

class Database{
    static public function AddUser($username, $password, $tel, $registertime, $rankpre){
        $user = new UserModel();
        $user->username = $username;
        $user->password = $password;
        $user->passwordmd5 = md5($password);
        $user->tel = $tel;
        $user->uuid = UtilApi::GetUUID();
        $user->eti = 0.00;
        $user->frozeneti = 0.00;
        $user->credit = 80;
        $user->latestthirtytraderate = 1.00;
        $user->role = 0;
        $user->status = 0;
        $user->rankpre = $rankpre;
        $user->teamonecount = 0;
        $user->teamcount = 0;
        $user->isLead = true;
        $user->isleader = false;
        $user->isbanker = false;
        $user->registertime = $registertime;
        $user->issigntoday = false;

        $user->allowField(true)->save();
        return true;
    }

    static public function AddBettingRecord($userid, $etickmatchtype, $guessingtype, $matchid, $guessingid, $eti, $etistatus){

    }

}