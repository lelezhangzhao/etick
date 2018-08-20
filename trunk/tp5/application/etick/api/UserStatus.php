<?php

namespace app\etick\api;

use think\Session;

use app\etick\api\Status as StatusApi;

use app\etick\model\User as UserModel;

class UserStatus{
    static public function IsUserLogin(){
        return Session::has('userid');
    }

    static public function TestUserLoginAndStatus(){
        if(false === self::IsUserLogin()){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOTLOGIN');
        }
        $user = UserModel::get(Session::get('userid'));
        if(0 !== $user->status){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEISFROZEN');
        }
        return true;
    }

    static public function IsUserAdmin(){
        if(false === self::IsUserLogin()){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOTLOGIN');
        }
        $user = UserModel::get(Session::get('userid'));
        if(1 !== $user->role){
            return self::FrozenUser('非法访问IsUserAdmin');
        }
        return true;
    }

    static public function FrozenUser($msg){
        if(false === self::IsUserLogin()){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_NOTLOGIN');
        }
        $user = UserModel::get(Session::get('userid'));
        $user->status = 1;
        $user->statusinfo = $msg;
        $user->allowField(true)->save();
        return StatusApi::ReturnErrorStatus('ERROR_STATUS_HACKER');
    }
}