<?php
namespace app\etick\validate;

use think\Validate;

class User extends Validate{
    protected $rule = [
        ['username', 'require|min:5|max:30', 'ERROR_STATUS_USERNAMEISEMPTY|ERROR_STATUS_USERNAMEMIN5|ERROR_STATUS_USERNAMEMAX30'],
        ['password', 'require|min:5|max:30', 'ERROR_STATUS_PASSWORDISEMPTY|ERROR_STATUS_PASSWORDMIN5|ERROR_STATUS_PASSWORDMAX30'],
        ['tel', 'require|length:11|/^1\\d{10}$/', 'ERROR_STATUS_TELISEMPTY|ERROR_STATUS_TELLENGTHERROR|ERROR_STATUS_TELFORMATERROR'],
    ];

    protected $scene = [
        'tel' => 'tel',
        'forgetpasswordgettelidentify' => ['username', 'tel'],
        ];

}