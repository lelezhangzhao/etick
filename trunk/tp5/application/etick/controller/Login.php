<?php
namespace app\etick\controller;

use think\Controller;
use think\Request;
use think\Session;

use app\etick\api\Status as StatusApi;
use app\etick\api\Util as UtilApi;

use app\etick\model\User as UserModel;

class Login extends Controller{
	public function Index(){
		return $this->fetch();
	}

	public function Login(Request $request){

	    $loginTime = date('Y-m-d H:i:s');

        $username = $request->param('username');
        $passwordmd5 = $request->param('passwordmd5');
        $captcha = $request->param('captcha');

        //验证验证码
        if(UtilApi::HasCaptcha() === true) {
            if (empty($captcha)) {
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAEMPTY');
            }
            if (!captcha_check($captcha)) {
                return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAERROR');
            }
        }


        //验证username，username不存在，返回ERROR_STATUS_USERNAMEORPASSWORDERROR
        if(empty($username)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEISEMPTY');
        }
        $user = UserModel::where('username', $username)->find();
        if(empty($username)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEORPASSWORDERROR');
        }


        //验证username和password匹配
        if(empty($passwordmd5)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_PASSWORDISEMPTY');
        }
        if($user->passwordmd5 !== $passwordmd5){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERNAMEORPASSWORDERROR');
        }


        //更新登录时间
        $user->latestlogintime = $loginTime;
        $user->allowField(true)->save();

        //记录session
        Session::set('userid', $user->id);
        
        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '登录成功', $user->id);

    }
}