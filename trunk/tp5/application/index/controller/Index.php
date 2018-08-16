<?php
namespace app\index\controller;

use think\Controller;
use think\Request;

use app\index\model\User as UserModel;

class Index extends Controller
{
    public function index()
    {
        echo phpinfo();
    }

    public function add(Request $request){
        $user = new UserModel();
        $user->username = $request->param('username');
        $user->password = $request->param('password');

//        $result = $this->validate($user, 'User');
//        if(true !== $result){
//            return $result;
//        }else{
//            return 'insert successful';
//        }

        if($user->allowField(true)->validate(true)->save($user)){
            return 'insert successful';
        }else{
            return $user->getError();
        }




}
}
