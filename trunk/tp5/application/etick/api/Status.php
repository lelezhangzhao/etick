<?php

namespace app\etick\api;

class Status{



    static public $ERROR_STATUS = array(
        'ERROR_STATUS_SUCCESS' => '正常',
        'ERROR_STATUS_TEST' => '测试',
        'ERROR_STATUS_USERNAMELENGTHERROR' => '用户名长度不对',
        'ERROR_STATUS_USERNAMEISALREADYEXIST' => '用户名已存在',
        'ERROR_STATUS_USERNAMEISNOTEXIST' => '用户名不存在',
        'ERROR_STATUS_USERISNOTEXIST' => '用户不存在',
        'ERROR_STATUS_USERNAMEORPASSWORDERROR' => '用户名或密码错误',
        'ERROR_STATUS_USERNAMEISEMPTY' => '用户名为空',
        'ERROR_STATUS_USERNAMEMIN5' => '用户名至少5个字符',
        'ERROR_STATUS_USERNAMEMAX30' => '用户名最多30个字符',
        'ERROR_STATUS_USERNAMEORTELERROR' => '用户名或手机号错误', //忘记密码页面使用
        'ERROR_STATUS_USERNAMEISFROZEN' => '用户已封号',
        'ERROR_STATUS_PASSWORDISEMPTY' => '密码为空',
        'ERROR_STATUS_PASSWORDMIN5' => '密码至少5个字符',
        'ERROR_STATUS_PASSWORDMAX30' => '密码最多30个字符',
        'ERROR_STATUS_OLDPASSWORDISNOTRIGHT' => '旧密码不正确',
        'ERROR_STATUS_NOTLOGIN' => '未登录',
        'ERROR_STATUS_SIGNED' => '已签到',
        'ERROR_STATUS_TELLENGTHERROR' => '手机号长度不对',
        'ERROR_STATUS_TELISALREADYEXIST' => '手机号已存在',
        'ERROR_STATUS_TELISEMPTY' => '手机号为空',
        'ERROR_STATUS_TELFORMATERROR' => '手机号码格式错误',
        'ERROR_STATUS_TELDIFFERENT' => '两次手机号不同',
        'ERROR_STATUS_TELIDENTIFYERROR' => '手机验证码错误',
        'ERROR_STATUS_CAPTCHAEMPTY' => '图片验证码为空',
        'ERROR_STATUS_CAPTCHAERROR' => '图片验证码错误',
        'ERROR_STATUS_RANKPREERROR' => '推荐码有误',
        'ERROR_STATUS_HACKER' => '非法访问，账号已冻结',
        'ERROR_STATUS_PROGRESSERRORJUMPTOMATCH' => '流程错误，直接跳到主页',
        'ERROR_STATUS_NOMATCHMATCH' => '没有赛事',
        'ERROR_STATUS_MATCHISNOTDISPLAY' => '赛事未开始竞猜', //非法访问
        'ERROR_STATUS_MATCHCANTCOMPETITION' => '当前比赛无竞猜',
        'ERROR_STATUS_GUESSINGREMAINETINOTENOUGH' => '竞猜剩余额度不足',
        'ERROR_STATUS_MATCHTYPEERROR' => '赛事类型错误', //0/1/2/3 正常/带单/福利/开庄
        'ERROR_STATUS_COMPETITIONGUESSINGISNOTEXIST' => '竞猜不存在',
        'ERROR_STATUS_COMPETITIONGUESSINGISSTOP' => '竞猜已停止',
        'ERROR_STATUS_FIVEMINUTESOVERBETTINGTIME' => '下注超过五分钟，不可撤单',
        'ERROR_STATUS_MATCHHASALREADYBEGINING' => '比赛已开始，不可撤单',
        'ERROR_STATUS_MATCHHASALREADYCANCELED' => '比赛已取消，不可撤单',
        'ERROR_STATUS_MATCHHASALREADYREVERTED' => '竞猜已撤销，不可撤单',
        'ERROR_STATUS_CANTREVERT' => '不可撤单',
        'ERROR_STATUS_BETTINGRECORDISNOTEXIST' => '注单不存在',
        'ERROR_STATUS_PURCHASEISNOTEXIST' => '交易不存在',
        'ERROR_STATUS_PURCHASEREMAINETIISNOTENOUGH' => '交易剩余ETI不足',
        'ERROR_STATUS_ETIISNOTENOUGH' => '可用ETI不足',
        'ERROR_STATUS_CANTBUYSELFENTRUSTMENTSALING' => '不可买自己挂卖单',
        'ERROR_STATUS_CANTSALESELFENTRUSTMENTBUYING' => '不可卖自己挂买单',
        'ERROR_STATUS_PARAMERROR' => '参数错误',
        'ERROR_STATUS_PROOFUPLOADSUCCESS' => '凭证上传成功',
    );

    static public function ReturnJson($code, $msg){
        $json_arr = ['code' => $code, 'msg' => $msg];
        return json_encode($json_arr);
    }

    static public function ReturnErrorStatus($code){
        return self::ReturnJson($code, Status::$ERROR_STATUS[$code]);
    }

    static public function ReturnJsonWithContent($code, $msg, $jsoncontent){
        $json_arr = ['code' => $code, 'msg' => $msg, 'jsoncontent' => $jsoncontent];
        return json_encode($json_arr);
    }
}
