<?php


namespace app\index\validate;

use think\Validate;

class User extends Validate{
    protected $rule = [
        ['username', 'require|min:5|max:30', '用户名为空|用户名至少5个字符|用户名最多30个字符'],
        ['password', 'require|min:5|max:30', '密码为空|密码至少5个字符|密码最多30个字符'],
    ];
}