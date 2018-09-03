<?php

namespace app\etick\controller;

use think\Controller;
use think\Session;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;

use app\etick\model\User as UserModel;

class User extends Controller{
    public function GetUserInfo(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $user = UserModel::get(Session::get('userid'));
        $json_arr = ['username' => $user->username, 'eti' => $user->eti];

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', json_encode($json_arr));
    }
}