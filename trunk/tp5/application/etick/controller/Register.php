<?php
namespace app\etick\controller;

use think\Controller;
use think\Request;
use think\Validate;
use think\Session;

use app\etick\api\Status as StatusApi;
use app\etick\api\Times as TimesApi;
use app\etick\api\Database as DatabaseApi;
use app\etick\api\Util as UtilApi;

use app\etick\model\User as UserModel;



class Register extends Controller{


    public function Index(){
        return $this->fetch();
    }

    public function GetTelIdentify(Request $request){
        $tel = $request->param('tel');

        $data = ['tel' => $tel];

        //检测该tel是否合法
        $result = $this->validate($data, 'User.tel');
        if(true !== $result){
            return StatusApi::ReturnErrorStatus($result);
        }


        //检测该tel是否已注册
        $user = UserModel::where('tel', $tel)->find();
        if(!empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_TELISALREADYEXIST');
        }

        //记录该手机号，用于注册时验证
        Session::set('register_tel', $tel);


        //同一ip240秒内只能获取两次验证码


        //发送验证码
        Telidentify::GetTelIdentify($tel);


        return StatusApi::ReturnJson(0, '手机验证码已发送');

    }

    public function Register(Request $request){

        $registerTime = date('Y-m-d H:i:s');

        $username = $request->param('username');
        $password = $request->param('password');
        $tel = $request->param('tel');
        $telidentify = $request->param('telidentify');
        $captcha = $request->param('captcha');
        $rankpre = $request->param('rankpre');


        //验证session中有register_tel
        //如果没有直接退出
        //如果有比较两次是否相同,然后删除
        if(false === Session::has('register_tel')){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_GETTELIDENTIFYFIRST');
        }else if(Session::get('register_tel') !== $tel){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_TELDIFFERENT');
        }
        Session::delete('register_tel');


        //验证图片验证码
        if(UtilApi::HasCaptcha() === true){
            if(empty($captcha)){
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAEMPTY');
            }
            if(!captcha_check($captcha)) {
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAERROR');
            }
        }

        //验证手机验证码
        if(!Telidentify::TelIdentifyOk($telidentify)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_TELIDENTIFYERROR');
        }

        $user = [
            'username' => $username,
            'password' => $password,
            'tel' => $tel,
        ];
        $result = $this->validate($user, 'User');
        if(true !== $result){
            return StatusApi::ReturnErrorStatus($result);
        }

        //验证用户名唯一性
        $user = UserModel::where('username', $username)->find();
        if(!empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEISALREADYEXIST');
        }

        //推荐人验证
        if(!empty($rankpre)){
            $user = UserModel::where('uuid', $rankpre)->find();
            if(empty($user)){
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_RANKPREERROR');
            }
        }

        //注册成功
        DatabaseApi::AddUser($username, $password, $tel, $registerTime, $rankpre);

        //如果有推荐人，推荐人团队数+1
        if(!empty($rankpre)){
            $user = UserModel::where('uuid', $rankpre)->find();
            $user->teamonecount += 1;
            $user->teamcount += 1;
            $user->allowField(true)->save();

            $rankpre = $user->rankpre;
            while(!empty($rankpre)){
                $user = UserModel::where('uuid', $rankpre)->find();
                $user->teamcount += 1;
                $user->allowField(true)->save();
                $rankpre = $user->rankpre;
            }
        }

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '注册成功');
    }
}