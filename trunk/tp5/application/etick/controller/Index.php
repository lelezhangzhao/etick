<?php
namespace app\etick\controller;

use think\Controller;

use app\etick\api\UserStatus as UserStatusApi;

class Index extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        return $this->fetch();
    }
}
