<?php

use think\Controller;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;

class Admin extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserAdminAndStatus();
        if(true !== $userstatus){
            return $userstatus;
        }

        return $this->fetch();
    }
}