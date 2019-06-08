<?php

namespace Admin\Controller;

use Think\Page;

class StuController extends BaseController
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
        $stus = $stu_model->alias('s')->field('s.*,c.name as class_name,d.name as depart_name')
            ->join('left join think_class as c on s.class_id=c.id')
            ->join('left join think_depart as d on c.depart_id=d.id')
            ->limit($page->firstRow, $page->listRows)->order("s.id desc")->select();
        if (IS_AJAX) {
            $this->ajaxReturn($stus);
        } else {
            $this->assign('stus', $stus);
            $this->assign('pageControl', $pageControl);
            $this->display();
        }


    }

    //实现学生修改功能
    public function update()
    {
        $stu = M('stu');
        $id = $_GET['id'];
        $stu_list = $stu->where("id=$id")->save($_POST);
        $this->redirect('showAll');//重定向到控制器的方法  display是本控制的方法

    }

    public function showUpdate()
    {

        $stu = M('stu');
        $id = $_GET['id'];
        $stu_list = $stu->where("id=$id")->find();
        $this->assign('stu_list', $stu_list);
        $classList = M('class')->select();
        $this->assign('classList', $classList);
        $this->display('update');
    }

    //实现学生删除功能
    public function del()
    {
        $stu = M('stu');
        $id = $_GET['id'];
        $stu->where("id=$id")->delete();
        $this->redirect('showAll');//重定向到控制器的方法  display是本控制的方法
    }

    //实现学生添加功能
    public function add()
    {
        $stu = M('stu');
        $stu->create();
        $result = $stu->add();
        if ($result) {
            $this->success('添加成功！！');
            $this->redirect('showAll');
        }
        if (!$result) {
            $this->error('添加失败！！');
        }
    }

    public function showAdd()
    {
        $classList = M('class')->select();
        $this->assign('classList', $classList);

        $this->display('add');
    }

}