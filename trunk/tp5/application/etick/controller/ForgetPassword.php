<?php
namespace app\etick\controller;

use think\Controller;
use think\Request;
use think\Session;

use app\etick\model\User as UserModel;

use app\etick\api\Status as StatusApi;


class ForgetPassword extends Controller{
    public function Index(){
        return $this->fetch();
    }

    public function GetTelIdentify(Request $request){
        $username = $request->param('username');
        $tel = $request->param('tel');

        $data = [
            'username' => $username,
            'tel' => $tel,
        ];

        //验证username和tel合法性
        $result = $this->validate($data, 'User.forgetpasswordgettelidentify');
        if(true !== $result){
            return StatusApi::ReturnErrorStatus($result);
        }

        //验证username和tel匹配性
        $user = UserModel::where('username', $username)->find();
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEORTELERROR');
        }else if($user->tel !== $tel){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEORTELERROR');
        }

        //记录该手机号，用于注册时验证
        Session::set('forgetpassword_tel', $tel);

        //记录用户名，改密码时匹配
        Session::set('forgetpassword_username', $username);


        //同一ip240秒内只能获取两次验证码


        //发送手机验证码
        Telidentify::GetTelIdentify($tel);


        return StatusApi::ReturnJson(0, '手机验证码已发送');


    }

    public function FixPassword(Request $request){
        $telidentify = $request->param('telidentify');
        $captcha = $request->param('captcha');
        $newpassword = $request->param('newpassword');

        //验证session是否保存forgetpassword_tel
        //如果没有直接退出
        if(false === Session::has('forgetpassword_tel')){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PROGRESSERRORJUMPTOMATCH');
        }
        //验证session是否保存forgetpassword_username
        //如果没有直接退出
        if(false === Session::has('forgetpassword_username')){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PROGRESSERRORJUMPTOMATCH');
        }


        //验证captcha
        if(empty($captcha)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAEMPTY');
        }
        if(!captcha_check($captcha)) {
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAERROR');
        }

        //验证手机验证码
        if(!Telidentify::TelIdentifyOk($telidentify)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_TELIDENTIFYERROR');
        }


        $user = UserModel::where('username', Session::get('forgetpassword_username'))->find();

        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEISNOTEXIST');
        }

        $user->password = $newpassword;
        $user->passwordmd5 = md5($newpassword);
        $user->allowField(true)->save();



        //删除forgetpassword_tel
        Session::delete('forgetpassword_tel');

        //删除forgetpassword_username
        Session::delete('forgetpassword_username');

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '密码修改成功');
    }


}