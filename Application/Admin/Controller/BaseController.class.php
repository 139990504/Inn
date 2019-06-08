<?php
/**
 * Created by IntelliJ IDEA.
 * User: huajun102
 * Date: 2019/1/2
 * Time: 14:16
 */

namespace Admin\Controller;

use Think\Controller;

abstract class BaseController extends Controller
{
    protected $admin;

    protected function _initialize()
    {
        parent::_initialize();
        $this->admin = session('admin');
        $path = strtolower(CONTROLLER_NAME . '/' . ACTION_NAME);
        if (!is_array($this->admin)) {
            //print_r([$path,$this->admin]);die;
            if ($path != 'admin/login') {
                $this->redirect('admin/login');
            }

        }
    }
}