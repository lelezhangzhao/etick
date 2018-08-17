<?php
namespace app\etick\controller;

use think\Controller;
use think\Request;
use think\Validate;

use app\etick\api\Status as StatusApi;

use app\etick\model\User as UserModel;


class Register extends Controller{
    public function Index(){
        return $this->fetch();
    }

    public function GetTelIdentify(Request $request){
        $tel = $request->param('tel');

        //检测该tel是否合法

        //必需有值
        $result = Validate::is($tel, 'require');
        if(false === $result){
            $json_arr = ['code' => 115, 'msg' => StatusApi::$ERROR_STATUS[115]];
            return json_encode($json_arr);
        }

        //必需11位
        $result = Validate::length($tel, 11);
        if(false === $result){
            $json_arr = ['code' => 107, 'msg' => StatusApi::$ERROR_STATUS[107]];
            return json_encode($json_arr);
        }

        //符合手机号规则
        $result = Validate::is($tel, '/^1[3-8]{1}[0-9]{9}$/');
        if(false === $result){
            $json_arr = ['code' => 116, 'msg' => StatusApi::$ERROR_STATUS[116]];
            return json_encode($json_arr);
        }

        //检测该tel是否已注册
        $user = UserModel::where('tel', $tel)->find();
        if(!empty($user)){
            $json_arr = ['code' => 108, 'msg' => StatusApi::$ERROR_STATUS[108]];
            return json_encode($json_arr);
        }

        //记录该手机号，用于注册时验证


        //发送验证码



        $json_arr = ['code' => 0, 'msg' => ''];
        return json_encode($json_arr);

    }

    public function Register(Request $request){
        //验证图片验证码

        //验证用户名、密码合法性

        //验证用户名唯一性

        //验证手机号是否接收验证码手机号

        //注册成功

    }


}