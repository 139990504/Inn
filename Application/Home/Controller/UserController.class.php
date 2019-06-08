<?php
/**
 * Created by PhpStorm.
 * User: liu
 * Date: 2016/4/30
 * Time: 9:19
 */

namespace Home\Controller;

use Think\Controller;
use Think\Page;

class UserController extends Controller
{

    public function showAll()
    {
        $stu_model = M('stu');
        //导入分页助手类
        import('Org.Util.Page');
        $total = $stu_model->count();//记录总数
        $page = new Page($total, 8);
        $page->setConfig("header", '个用户');
        $pageControl = $page->show();
        $class = $_SESSION['class'];
        $grade = $_SESSION['grade'];
        // $stus=$stu_model->limit("$page->firstRow,$page->listRows")->select();
        if ($_SESSION['role'] == '班主任') {

            $stus = $stu_model->limit("$page->firstRow,$page->listRows")->where("class='$class'&&grade='$grade'")->order("id desc")->select();
        }
        if ($_SESSION['role'] == '年级主任') {
            $grade = $_SESSION['grade'];
            $stus = $stu_model->limit("$page->firstRow,$page->listRows")->where("grade='$grade'")->order("id desc")->select();

        }
        $this->assign('stus', $stus);
        $this->assign('username', $_SESSION['username']);
        $this->assign('role', $_SESSION['role']);
        $this->assign('pageControl', $pageControl);
        $this->display();

    }

    public function showAdd()
    {
        $this->assign('username', $_SESSION['username']);
        if ($_SESSION['role'] == '年级主任') {
            $this->error('你没有添加学生的权限！');

        }
        if ($_SESSION['role'] == '班主任') {
            $this->display('add');
        }
    }

    public function add()
    {


        $stu = M('stu');
        $stuinfo['name'] = $_POST['name'];
        $stuinfo['sex'] = $_POST['sex'];
        $stuinfo['age'] = $_POST['age'];
        $stuinfo['score'] = $_POST['score'];
        $stuinfo['grade'] = $_POST['grade'];
        $stuinfo['class'] = $_POST['class'];
        $stu->add($stuinfo);
        // $this->success('添加成功！');
        $this->redirect('showAll');

    }

    //实现学生修改功能
    public function update()
    {
        header("Content-Type:text/html;charset=utf-8");
        $stu = M('stu');
        $id = $_GET['id'];
        $stu_list = $stu->where("id=$id")->save($_POST);
        //  $this->success('修改成功！');
        $this->redirect('showAll');//重定向到控制器的方法  display是本控制的方法


    }

    public function showUpdate()
    {
        if ($_SESSION['role'] == '年级主任') {
            $this->error('你没有编辑学生的权限！');

        }
        if ($_SESSION['role'] == '班主任') {
            $stu = M('stu');
            $id = $_GET['id'];
            $stu_list = $stu->where("id=$id")->find();
            $this->assign('username', $_SESSION['username']);
            $this->assign('stu_list', $stu_list);
            $this->display('update');
        }
    }
    //实现学生删除功能

    //实现学生删除功能
    public function del()
    {
        if ($_SESSION['role'] == '年级主任') {
            $this->error('你没有删除学生的权限！！');

        }
        if ($_SESSION['role'] == '班主任') {
            $stu = M('stu');
            $id = $_GET['id'];
            $result = $stu->where("id=$id")->delete();
            if ($result) {
                //   $this->success('学生删除成功！');
            } else {
                $this->error('学生删除失败！');
            }
        }
    }

//用户注册方法显示
    public function showReg()
    {
        $this->display('reg');
    }

    //验证码方法
    public function verify()
    {//加载图形类
        $config = array(
            'imageH' => 50,               // 验证码图片高度
            'imageW' => 120,               // 验证码图片宽度
            'fontSize' => 18,    // 验证码字体大小
            'length' => 4,     // 验证码位数
            'useNoise' => false, // 关闭验证码杂点
        );
        $Verify = new \Think\Verify($config);
        $Verify->entry();
    }

    public function reg()
    {
        if ($_POST['reg']) {
            $verify = new \Think\Verify();
            $verify_result = $verify->check($_POST['verify'], '');
            if (!$verify_result) {
                $this->error('验证码错误！');
            }
            if ($_POST['password'] != $_POST['passwordq']) {
                $this->error('两次输入的密码不一致！');
            } else {
                $user = M('user');
                if ($_POST['role'] == 1) {//班级老师
                    $stuinfo['username'] = $_POST['username'];
                    $stuinfo['password'] = md5($_POST['password']);
                    $stuinfo['role'] = $_POST['role'];
                    $stuinfo['grade'] = $_POST['grade'];
                    $stuinfo['class'] = $_POST['class'];
                }
                if ($_POST['role'] != 1) { //年级主任
                    $stuinfo['username'] = $_POST['username'];
                    $stuinfo['password'] = md5($_POST['password']);
                    $stuinfo['role'] = $_POST['role'];
                    $stuinfo['grade'] = $_POST['grade'];
                    $stuinfo['class'] = 0;
                }
                $user->add($stuinfo);
                $this->success('数据添加成功');

            }
        }

    }

//用户登录页面的展示
    public function showLogin()
    {

        $this->redirect('index/index'); //redirect下面跟控制器
    }

    //用户登录页面方法展示
    public function login()
    {
        $username = $_POST['username'];
        $password = md5($_POST['password']);
        $user = M('user');
        $ls = $user->where("username='$username'&&password='$password'")->find();

        if ($ls) {
            // $this->success('用户登录成功！');
            //记住用户的登录session
            $_SESSION['username'] = $_POST['username'];
            $_SESSION['role'] = $ls['role'] == 1 ? "班主任" : "年级主任";
            $_SESSION['class'] = $ls['class'];
            $_SESSION['grade'] = $ls['grade'];
            $this->assign('username', $_SESSION['username']);
            $this->assign('role', $_SESSION['role']);
            $this->display('showIndex');//display下面跟模板
        } else {
            $this->error('用户名或密码错误！');
            $this->redirect('index/index'); //redirect下面跟控制器
        }
    }

    //修改密码
    function showPwdUpdate()
    {
        $this->assign('username', $_SESSION['username']);
        $this->display('PwdUpdate');
    }

    function PwdUpdate()
    {
        header("Content-Type:text/html;charset=utf-8");
        $user = M('user');
        $username = $_SESSION['username'];
        $userinfo = $user->where("username='$username'")->find();

        //判断原密码是否输入正确
        if ($userinfo['password'] != md5($_POST['password'])) {
            $this->error('原密码输入错误！！');
            $this->redirect('showPwdUpdate');
        }
        if ($_POST['passwordNew'] != $_POST['passwordNewq']) {
            $this->error('两次新密码输入不一致！！');
            $this->redirect('showPwdUpdate');
        } else {
            $userinfo2['password'] = md5($_POST['passwordNew']);
            $result = $user->where("username='$username'")->save($userinfo2);

            if ($result) {
                //   $this->success('修改成功！！');
                //$this->redirect('showAll');
            } else {
                $this->error('修改失败！！');
                $this->redirect('showPwdUpdate');

            }
            $this->redirect('showAll');
        }
    }

    function logout()
    {
        unset($_SESSION['username']);
        //  $this->success('退出成功！！');
        $this->redirect('showLogin');//重定向到控制器的方法  display是本控制的方法

    }
}