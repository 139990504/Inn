<?php

namespace Admin\Controller;
class AdminController extends BaseController
{

    public function index()
    {
        $this->display('index');
    }

    public function login()
    {
        //print_r([__ACTION__,$this->admin]);die;
        if (IS_POST) {
            $username = $_POST['username'];
            $password = $_POST['password'];
            if ($username == 'admin' && $password == 'admin888') {
                session('admin', ['username' => $username, 'last_login' => time()]);
                //$this->redirect('admin/index');//display下面跟模板
                $this->display('index');
            } else {
                $this->error('用户名或者密码不对！！');

            }
        } else {
            if (is_array($this->admin)) {
                $this->redirect('admin/index');
            }
            $this->display('login');
        }


    }

    public function logout()
    {
        session('admin', null);
        $this->redirect('index');//重定向到控制器的方法  display是本控制的方法

    }
}