<?php
/**
 * Created by PhpStorm.
 * User: liu
 * Date: 2016/4/30
 * Time: 9:19
 */

namespace Admin\Controller;

use Think\Page;

class ClassController extends BaseController
{
    public function showAll()
    {
        $model = M('class');
        import('Org.Util.Page');
        $total = $model->count();//记录总数
        $num_pre_page = 8;//每页显示8条记录
        $page = new Page($total, 20);
        $page->setConfig("header", "个班别");
        $pageControl = $page->show();
        $classList = $model->limit("$page->firstRow,$page->listRows")->order("id desc")->select();
        $departList = M('depart')->getField('id,name');
        $this->assign('pageControl', $pageControl);
        $this->assign('departList', $departList);
        $this->assign('classList', $classList);
        $this->display();

    }

    public function showAdd()
    {
        $departList = M('depart')->select();
        $this->assign('departList', $departList);
        $this->display('add');
    }

    public function add()
    {
        $model = M('class');
        $model->create();
        $model->add();
        $this->redirect('showAll');
    }

    //实现学生修改功能
    public function update()
    {
        header("Content-Type:text/html;charset=utf-8");
        $model = M('class');
        $id = $_GET['id'];
        $model->where("id=$id")->save($_POST);
        $this->redirect('showAll');//重定向到控制器的方法  display是本控制的方法
    }

    public function showUpdate()
    {
        $model = M('class');
        $id = $_GET['id'];
        $info = $model->where("id=$id")->find();
        $departList = M('depart')->select();
        $this->assign('departList', $departList);
        $this->assign('info', $info);
        $this->display('update');
    }

    //实现学生删除功能
    public function del()
    {
        $model = M('class');
        $id = $_GET['id'];
        $model->where("id=$id")->delete();
        $this->redirect('Class:showAll');//重定向到控制器的方法  display是本控制的方法
    }

}