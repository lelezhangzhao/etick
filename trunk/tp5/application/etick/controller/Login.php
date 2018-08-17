<?php
namespace app\etick\controller;

use think\Controller;

class Login extends Controller{
	public function Login(){
		return $this->fetch('login');
	}
}