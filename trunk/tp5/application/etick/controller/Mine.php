<?php
namespace app\etick\controller;

use think\Controller;
use think\Request;
use think\Session;
use think\Db;

use app\etick\api\UserStatus as UserStatusApi;
use app\etick\api\Status as StatusApi;
use app\etick\api\Util as UtilApi;
use app\etick\api\Times as TimesApi;


use app\etick\model\User as UserModel;

class Mine extends Controller{
    public function Index(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        return $this->fetch();

    }

    public function GetFixPasswordTelIdentify(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $user = UserModel::get(Session::get('userid'));
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }

        $tel = $user->tel;




        //同一ip240秒内只能获取两次验证码


        //发送验证码
        Telidentify::GetTelIdentify($tel);


        return StatusApi::ReturnJson(0, '手机验证码已发送');

    }

    public function FixPassword(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $oldPasswordmd5 = $request->param('oldpasswordmd5');
        $newPassword = $request->param('newpassword');
        $telidentify = $request->param('telidentify');
        $captcha = $request->param('captcha');

        if(UtilApi::HasCaptcha()){
            //验证图片验证码
            if(UtilApi::HasCaptcha() === true){
                if(empty($captcha)){
                    return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAEMPTY');
                }
                if(!captcha_check($captcha)) {
                    return StatusApi::ReturnErrorStatus('ERROR_STATUS_CAPTCHAERROR');
                }
            }
        }

        //验证手机验证码
        if(!Telidentify::TelIdentifyOk($telidentify)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_TELIDENTIFYERROR');
        }


        //修改密码
        $user = UserModel::get(Session::get('userid'));
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }

        //验证旧密码
        if($user->passwordmd5 !== $oldPasswordmd5) {
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_OLDPASSWORDISNOTRIGHT');
        }

        $user->password = $newPassword;
        $user->passwordmd5 = md5($newPassword);
        $user->allowField(true)->save();

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '密码修改成功');

    }

    public function GetUserAccount(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $userid = Session::get('userid');

        $user = Db::name('user')->field('name, banknum, bankname, alipaynum')->where('id', $userid)->find();
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }

        return StatusApi::ReturnJsonWithContent('ERROR_STATUS_SUCCESS', '', $user);

    }

    public function SetUserAccount(Request $request){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }

        $name = $request->param('name');
        $banknum = $request->param('banknum');
        $bankname = $request->param('bankname');
        $alipaynum = $request->param('alipaynum');

        $user = UserModel::get(Session::get('userid'));
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }

        $user->name = $name;
        $user->banknum = $banknum;
        $user->bankname = $bankname;
        $user->alipaynum = $alipaynum;
        $user->allowField(true)->save();

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '修改成功');
    }

    public function Logout(){
        $userstatus = UserStatusApi::TestUserLoginAndStatus();
        if (true !== $userstatus) {
            return $userstatus;
        }
        $systemTime = TimesApi::GetSystemTime();

        $user = UserModel::get(Session::get('userid'));
        if(empty($user)){
            return StatusApi::ReturnErrorStatus('ERROR_STATUS_USERISNOTEXIST');
        }

        $user->logouttime = $systemTime;
        $user->allowField(true)->save();

        Session::delete('userid');

        return StatusApi::ReturnJson('ERROR_STATUS_SUCCESS', '退出成功');

    }

}