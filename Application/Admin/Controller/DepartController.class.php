<?php
/**
 * Created by PhpStorm.
 * User: liu
 * Date: 2016/4/30
 * Time: 9:19
 */

namespace Admin\Controller;

use Think\Page;

class DepartController extends BaseController
{
    public function showAll()
    {
        $model = M('depart');
        import('Org.Util.Page');
        $total = $model->count();//记录总数
        $num_pre_page = 8;//每页显示8条记录
        $page = new Page($total, 20);
        $page->setConfig("header", "个院系");
        $pageControl = $page->show();
        $list = $model->limit("$page->firstRow,$page->listRows")->order("id desc")->select();

        $this->assign('pageControl', $pageControl);
        $this->assign('list', $list);
        $this->display();

    }

    public function showAdd()
    {
        $this->display('add');
    }

    public function add()
    {
        $model = M('depart');
        $model->create();
        $model->add();
        $this->redirect('showAll');
    }

    //实现学生修改功能
    public function update()
    {
        header("Content-Type:text/html;charset=utf-8");
        $model = M('depart');
        $id = $_GET['id'];
        $model->where("id=$id")->save($_POST);
        $this->redirect('showAll');//重定向到控制器的方法  display是本控制的方法
    }

    public function showUpdate()
    {
        $model = M('depart');
        $id = $_GET['id'];
        $info = $model->where("id=$id")->find();
        $this->assign('info', $info);
        $this->display('update');
    }

    //实现学生删除功能
    public function del()
    {
        $model = M('depart');
        $id = $_GET['id'];
        $model->where("id=$id")->delete();
        $this->redirect('Depart:showAll');//重定向到控制器的方法  display是本控制的方法
    }

}