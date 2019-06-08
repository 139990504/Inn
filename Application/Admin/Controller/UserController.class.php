<?php
/**
 * Created by PhpStorm.
 * User: liu
 * Date: 2016/4/30
 * Time: 9:19
 */

namespace Admin\Controller;

use Think\Page;

class UserController extends BaseController
{
    public function showAll()
    {
        $user = M('user');
        import('Org.Util.Page');
        $total = $user->count();//记录总数
        $num_pre_page = 8;//每页显示8条记录
        $page = new Page($total, 8);
        $page->setConfig("header", "个用户");
        $pageControl = $page->show();
        $users = $user->limit("$page->firstRow,$page->listRows")->order("id desc")->select();
        //处理班级主任年级主任问题
        foreach ($users as $k => $userinfo) {
            $users[$k]['role'] = $userinfo['role'] == 1 ? '班主任' : '年级主任';
        }
        $this->assign('pageControl', $pageControl);
        $this->assign('users', $users);
        $this->display();

    }

    public function showAdd()
    {
        $this->display('add');
    }

    public function add()
    {
        $stu = M('user');
        $stuinfo['username'] = $_POST['username'];
        $stuinfo['password'] = md5($_POST['password']);
        $stuinfo['role'] = $_POST['role'];
        $stuinfo['grade'] = $_POST['grade'];
        $stuinfo['class'] = $_POST['class'];
        $stu->add($stuinfo);
        $this->redirect('showAll');
    }

    //实现学生修改功能
    public function update()
    {
        header("Content-Type:text/html;charset=utf-8");
        $stu = M('user');
        $id = $_GET['id'];
        $stu_list = $stu->where("id=$id")->save($_POST);
        $this->redirect('showAll');//重定向到控制器的方法  display是本控制的方法
    }

    public function showUpdate()
    {
        $stu = M('user');
        $id = $_GET['id'];
        $user_list = $stu->where("id=$id")->find();
        $this->assign('user_list', $user_list);
        $this->display('update');
    }

    //实现学生删除功能
    public function del()
    {
        $stu = M('user');
        $id = $_GET['id'];
        $stu->where("id=$id")->delete();
        $this->redirect('User:showAll');//重定向到控制器的方法  display是本控制的方法
    }

}