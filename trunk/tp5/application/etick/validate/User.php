<?php
namespace app\etick\validate;

use think\Validate;

class User extends Validate{
    protected $rule = [
        ['username', 'require|min:5|max:30', '109|110|111'],
        ['password', 'require|min:5|max:30', '112|113|114'],
        ['tel', 'require|length:11|/^1[3-8]{1}[0-9]{9}$/', '115|107|116'],
    ];
}