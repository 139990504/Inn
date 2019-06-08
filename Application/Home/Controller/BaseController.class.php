<?php
/**
 * Created by IntelliJ IDEA.
 * User: huajun102
 * Date: 2019/1/2
 * Time: 14:16
 */

namespace Home\Controller;

use Think\Controller;

class BaseController extends Controller
{
    protected $user;

    protected function _initialize()
    {
        parent::_initialize();
        $this->user = session('user');
        $path = strtolower(CONTROLLER_NAME . '/' . ACTION_NAME);
        if ($path !== 'index.login' && !is_array($this->user)) {
            $this->redirect('index/login');
        }
    }
}