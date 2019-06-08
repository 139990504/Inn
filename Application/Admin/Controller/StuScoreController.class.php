<?php
/**
 * Created by PhpStorm.
 * User: liu
 * Date: 2016/4/30
 * Time: 9:19
 */

namespace Admin\Controller;

use Think\Page;

class StuScoreController extends BaseController
{
    public function showAll()
    {
        $stu = M('stu_score');
        import('Org.Util.Page');
        $total = $stu->count();//记录总数
        $num_pre_page = 8;//每页显示8条记录
        $page = new Page($total, 20);
        $page->setConfig("header", "个用户");
        $pageControl = $page->show();
        $stus = $stu->alias('sc')->field('sc.*,s.name stu_name,concat(sb.name,"-",sb.code) sub_name')
            ->join('left join think_stu s on sc.stu_id=s.id')
            ->join('left join think_subject sb on sc.sub_id=sb.id')
            ->limit($page->firstRow, $page->listRows)->order("sc.id desc")->select();

        $this->assign('pageControl', $pageControl);
        $this->assign('stus', $stus);
        $this->display();

    }

    public function showAdd()
    {
        $subList = M('subject')->select();
        $this->assign('subList', $subList);
        $this->display('add');
    }

    public function add()
    {
        $stu = M('stu_score');
        $stu->create();
        $stu->add();
        $this->redirect('showAll');
    }

    //实现学生修改功能
    public function update()
    {
        header("Content-Type:text/html;charset=utf-8");
        $stu = M('stu_score');
        $id = $_GET['id'];
        $stu_list = $stu->where("id=$id")->save($_POST);
        $this->redirect('showAll');//重定向到控制器的方法  display是本控制的方法
    }

    public function showUpdate()
    {
        $stu = M('stu_score');
        $id = $_GET['id'];
        $user_list = $stu->where("id=$id")->find();
        $this->assign('user_list', $user_list);

        $subList = M('subject')->select();
        $this->assign('subList', $subList);
        $this->assign('stu_list', $user_list);
        $this->display('update');
    }

    //实现学生删除功能
    public function del()
    {
        $stu = M('stu_score');
        $id = $_GET['id'];
        $stu->where("id=$id")->delete();
        $this->redirect('StuScore:showAll');//重定向到控制器的方法  display是本控制的方法
    }

}