/*!
 * jquery.date.js v1.3.7
 * By ��� https://github.com/weijhfly/jqueryDatePlugin
 * Time:2017/1/24
*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var d = new Date(),
        doc = window.document,
        nowYear = d.getFullYear(),
        nowMonth = d.getMonth() + 1,
        domDate,
        createDate,
        time,
        body = $('body'),
        emptyStr = "<li></li>",
        isTouch = "ontouchend" in doc,
        tstart = isTouch ? "touchstart" : "mousedown",
        tmove = isTouch ? "touchmove" : "mousemove",
        tend = isTouch ? "touchend" : "mouseup",
        tcancel = isTouch ? "touchcancel" : "mouseleave",
        isEnglish = (navigator.language || navigator.browserLanguage).toLowerCase().indexOf('zh') == -1,
        //����40px�ĸ߶Ȼ���,����Ӧ�͸Ķ������dpr
        h = 40,
        dpr = $('html').attr('data-dpr') || 1,
        resH = h * dpr,
        //֧�ֵ�ʱ���ʽչʾ
        dateFormat = [
            //������ ʱ����
            ['YYYY-MM-DD hh:mm:ss', 'YY-MM-DD hh:mm:ss', 'YYYY/MM/DD hh:mm:ss', 'YY/MM/DD hh:mm:ss'],
            //������ ʱ��
            ['YYYY-MM-DD hh:mm', 'YY-MM-DD hh:mm', 'YYYY/MM/DD hh:mm', 'YY/MM/DD hh:mm'],
            //������
            ['YYYY-MM-DD', 'YY-MM-DD', 'YYYY/MM/DD', 'YY/MM/DD'],
            //����
            ['YYYY-MM', 'YY-MM', 'YYYY/MM', 'YY/MM']
        ],

        opts = {
            beginYear: 2010,
            endYear: 2088, //�ɲ��������ݲ���С�ڵ�ǰ���           
            type: 'YYYY-MM-DD',
            limitTime: false//����ѡ��ʱ�� today ����֮ǰ��ʱ�䲻��ѡ tomorrow ����֮ǰ�Ĳ���ѡ
        };
    //dom��Ⱦ
    domDate = '<div id="date-wrapper"><h3>ѡ������</h3><div id="d-content"><div id="d-tit"><div class="t1">��</div><div class="t2">��</div><div class="t3">��</div><div class="t4">ʱ</div><div class="t5">��</div><div class="t6">��</div></div><div id="d-bg"><ol id="d-year"></ol><ol id="d-month"></ol><ol id="d-day"></ol><ol id="d-hours"></ol><ol id="d-minutes"></ol><ol id="d-seconds"></ol></div></div><a id="d-cancel" href="javascript:">ȡ��</a><a id="d-confirm" href="javascript:">ȷ��</a></div><div id="d-mask"></div>';
    var css = '<style type="text/css">a{text-decoration:none;}ol,li{margin:0;padding:0}li{list-style-type:none}#date-wrapper{position:fixed;top:50%;left:50%;width:90%;margin: -139px 0 0 -45%;z-index:56;text-align:center;background:#fff;border-radius:3px;padding-bottom:15px;display:none}#d-mask{position:fixed;width:100%;height:100%;top:0;left:0;background:#000;filter:alpha(Opacity=50);-moz-opacity:.5;opacity:.5;z-index:55;display:none}#date-wrapper h3{line-height:50px;background:#79c12f;color:#fff;font-size:20px;margin:0;border-radius:3px 3px 0 0}#date-wrapper ol,#d-tit>div{width:16.6666666%;float:left;position:relative}#d-content{padding:10px}#d-content #d-bg{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:0 0 5px 5px;height:120px;overflow:hidden;margin-bottom:10px;position:relative}#d-cancel,#d-confirm{border-radius:3px;float:left;width:40%;line-height:30px;font-size:16px;background:#dcdddd;color:#666;margin:0 5%}#d-confirm{background:#79c12f;color:#fff}#date-wrapper li{line-height:40px;height:40px;cursor:pointer;position:relative}#d-tit{background:#f8f8f8;overflow:hidden;border-radius:5px 5px 0 0;line-height:30px;border:1px solid #e0e0e0;margin-bottom:-1px}#date-wrapper ol{-webkit-overflow-scrolling:touch;position:absolute;top:0;left:0}#date-wrapper ol:nth-child(2){left:16.6666666%}#date-wrapper ol:nth-child(3){left:33.3333332%}#date-wrapper ol:nth-child(4){left:49.9999998%}#date-wrapper ol:nth-child(5){left:66.6666664%}#date-wrapper ol:nth-child(6){left:83.333333%}#d-content #d-bg:after{content:\'\';height:40px;background:#ddd;position:absolute;top:40px;left:0;width:100%;z-index:1}#date-wrapper li span{position:absolute;width:100%;z-index:99;height:100%;left:0;top:0}#date-wrapper.two ol,.two #d-tit>div{width:50%}#date-wrapper.two ol:nth-child(2){left:50%}#date-wrapper.three ol,.three #d-tit>div{width:33.333333%}#date-wrapper.three ol:nth-child(2){left:33.333333%}#date-wrapper.three ol:nth-child(3){left:66.666666%}#date-wrapper.four ol,.four #d-tit>div{width:25%}#date-wrapper.four ol:nth-child(2){left:25%}#date-wrapper.four ol:nth-child(3){left:50%}#date-wrapper.four ol:nth-child(4){left:75%}#date-wrapper.five ol,.five #d-tit>div{width:20%}#date-wrapper.five ol:nth-child(2){left:20%}#date-wrapper.five ol:nth-child(3){left:40%}#date-wrapper.five ol:nth-child(4){left:60%}#date-wrapper.five ol:nth-child(5){left:80%}</style>';

    if (isEnglish) {
        domDate = domDate.replace('ѡ������', 'DatePicker').replace('ȡ��', 'cancel').replace('ȷ��', 'confirm');
        css = css.replace('</style>', '#date-wrapper #d-tit{display:none;}</style>');
    }
    if (h != 40) {
        css = css.replace('40px', h + 'px');
    }
    if (dpr != 1) {
        css = css.replace(/(\d+)px/g, function (i) {
            return i.replace(/\D/g, '') * dpr + 'px';
        });
    }
    body.append(css).append(domDate);

    createDate = {
        y: function (begin, end) {
            var domYear = '',
                end = end <= nowYear ? (end + 10) : end;

            for (var i = begin; i <= end; i++) {
                domYear += '<li><span>' + i + '</span></li>';
            }
            $('#d-year').html(emptyStr + domYear + emptyStr);
        },
        m: function () {
            var domMonth = '';
            for (var j = 1; j <= 12; j++) {
                j = j < 10 ? '0' + j : j;
                domMonth += '<li><span>' + j + '</span></li>';
            }
            $('#d-month').html(emptyStr + domMonth + emptyStr);
        },
        d: function (end, active) {
            var end = end || createDate.bissextile(nowYear, nowMonth),
                domDay = '';
            for (var k = 1; k <= end; k++) {
                k = k < 10 ? '0' + k : k;
                if (active && active == k) {
                    domDay += '<li class="active"><span>' + k + '</span></li>';
                } else {
                    domDay += '<li><span>' + k + '</span></li>';
                }
            }
            $('#d-day').html(emptyStr + domDay + emptyStr);
        },
        hm: function () {
            var domHours = '', domMinutes = '';

            for (var i = 0; i <= 23; i++) {
                i = i < 10 ? '0' + i : i;
                domHours += '<li><span>' + i + '</span></li>';
            }
            $('#d-hours').html(emptyStr + domHours + emptyStr);

            for (var j = 0; j <= 59; j++) {
                j = j < 10 ? '0' + j : j;
                domMinutes += '<li><span>' + j + '</span></li>';
            }
            $('#d-minutes').html(emptyStr + domMinutes + emptyStr);

        },
        s: function () {
            var domSeconds = '';

            for (var i = 0; i <= 59; i++) {
                i = i < 10 ? '0' + i : i;
                domSeconds += '<li><span>' + i + '</span></li>';
            }
            $('#d-seconds').html(emptyStr + domSeconds + emptyStr);
        },
        bissextile: function (year, month) {
            var day;
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                day = 31
            } else if (month == 4 || month == 6 || month == 11 || month == 9) {
                day = 30
            } else if (month == 2) {
                if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) { //����
                    day = 29
                } else {
                    day = 28
                }

            }
            return day;
        },
        slide: function (el) {
            //����
            var T, mT, isPress = false;
            $(doc).on(tstart, '#date-wrapper ol', function (e) {
                var e = e.originalEvent;
                e.stopPropagation();
                e.preventDefault();
                T = e.pageY || e.touches[0].pageY;
                if (!isTouch) {
                    isPress = true;
                }
            })
            $(doc).on(tmove, '#date-wrapper ol', function (e) {
                var e = e.originalEvent, that = $(this);
                e.stopPropagation();
                e.preventDefault();
                if (!isTouch && !isPress) {
                    return false
                }
                ;
                mT = e.pageY || e.touches[0].pageY;
                that.css('top', that.position().top + (mT - T) + 'px');
                T = mT;
                if (that.position().top > 0) that.css('top', '0');
                if (that.position().top < -(that.height() - (3 * resH))) that.css('top', '-' + (that.height() - (3 * resH)) + 'px');
            })
            $(doc).on(tend, '#date-wrapper ol', function (e) {
                var e = e.originalEvent, that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                dragEnd(that);
            })
            $(doc).on(tcancel, '#date-wrapper ol', function (e) {
                var e = e.originalEvent, that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                // ���һ��pc��Ī����������
                if (!isTouch && +new Date() > time + 600) {
                    dragEnd(that);
                }
            })

            function dragEnd(that) {
                //��������
                var t = that.position().top;
                that.css('top', Math.round(t / resH) * resH + 'px');
                //��λactive
                t = Math.round(Math.abs($(that).position().top));
                var li = that.children('li').get(t / resH + 1);
                $(li).addClass('active').siblings().removeClass('active');
                //��������
                var id = that.attr('id');
                if (id == 'd-month' || id == 'd-year') {
                    var elDay = $('#d-day');
                    if (elDay.length == 0) {
                        return false;
                    }
                    var end = createDate.bissextile($('#d-year .active').text(), $('#d-month .active').text());
                    if (end != (elDay.children().length - 2)) {
                        var active = elDay.children('.active').text();

                        active > end && (active = end);
                        createDate.d(end, active);
                        if (Math.abs(elDay.position().top) > elDay.height() - 3 * resH) elDay.css('top', '-' + (elDay.height() - 3 * resH) + 'px');
                    }
                }
            }
        },
        show: function (isShow) {
            var domMain = $('#date-wrapper'),
                domMask = $('#d-mask');
            if (isShow) {
                domMain.show();
                domMask.show();
                time = +new Date();
                body.css('overflow', 'hidden');
            } else {
                domMain.hide();
                domMask.hide();
                body.css('overflow', 'auto');
            }
        },
        resetActive: function () {
            var d = new Date();
            if (opt.limitTime == 'tomorrow') {
                d.setDate(d.getDate() + 1);
            }
            $('#date-wrapper ol').each(function () {
                var e = $(this),
                    eId = e.attr('id');
                e.children('li').each(function () {
                    var li = $(this), liText = Number(li.text() == '' ? 'false' : li.text());
                    if (eId == 'd-year' && liText === d.getFullYear()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-month' && liText === (d.getMonth() + 1)) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-day' && liText === d.getDate()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-hours' && liText === d.getHours()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-minutes' && liText === d.getMinutes()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-seconds' && liText === d.getSeconds()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    }
                })
            })
        },
        toNow: function (refresh) {
            if (!refresh) {
                $('#date-wrapper ol').each(function () {
                    var that = $(this);
                    var liTop = -(that.children('.active').position().top - resH);
                    that.animate({
                            top: liTop
                        },
                        600);
                })
            } else {
                $('#date-wrapper ol').each(function () {
                    $(this).animate({
                            top: 0
                        },
                        0);
                })
            }
        },
        clear: function () {
            createDate.toNow(true);
            createDate.show(false);
        }
    }
    createDate.m();
    createDate.d();
    createDate.hm();
    createDate.s();
    createDate.slide();

    var opt,
        userOption,
        el = $('#date-wrapper'),
        elTit = $('#d-tit'),
        elBg = $('#d-bg'),
        prevY = '';

    function DateTool(obj) {
        var that = $(obj);
        that.bind('click', function () {
            if (that.get(0).tagName == 'INPUT') {
                that.blur();
            }
            userOption = that.data('options');
            if (typeof (userOption) == 'string') {
                userOption = JSON.parse(userOption.replace(/'/g, '"'));
            }
            if (!el.is(':visible')) {
                opt = null;
                opt = $.extend({}, opts, userOption || {});
                var y = '' + opt.beginYear + opt.endYear;
                if (prevY != y) {
                    createDate.y(opt.beginYear, opt.endYear);
                    prevY = y;
                }
                if (dateFormat[0].indexOf(opt.type) != -1) {//������ ʱ����
                    elTit.children().show();
                    elBg.children().show();
                    el.attr('class', '');
                } else if (dateFormat[1].indexOf(opt.type) != -1) {//������ ʱ��
                    elTit.children().show().end().children(':gt(4)').hide();
                    elBg.children().show().end().children(':gt(4)').hide();
                    el.attr('class', 'five');
                } else if (dateFormat[2].indexOf(opt.type) != -1) {//������
                    elTit.children().show().end().children(':gt(2)').hide();
                    elBg.children().show().end().children(':gt(2)').hide();
                    el.attr('class', 'three');
                } else if (dateFormat[3].indexOf(opt.type) != -1) {//����
                    elTit.children().show().end().children(':gt(1)').hide();
                    elBg.children().show().end().children(':gt(1)').hide();
                    el.attr('class', 'two');
                }
                createDate.resetActive();
                createDate.show(true);
                createDate.toNow(false);
                $('#d-confirm').attr('d-id', obj);
            }
        });
    }

    $.date = function (obj) {
        DateTool(obj);
    }
    //ȡ��
    $('#d-cancel,#d-mask').bind('click', function () {
        createDate.clear();
    })
    //ȷ��
    $('#d-confirm').bind('click', function () {
        var y = $('#d-year .active').text(),
            m = $('#d-month .active').text(),
            d = $('#d-day .active').text(),
            h = $('#d-hours .active').text(),
            min = $('#d-minutes .active').text(),
            s = $('#d-seconds .active').text(),
            str,
            that = $($(this).attr('d-id')),
            index = dateFormat[0].indexOf(opt.type),
            index1 = dateFormat[1].indexOf(opt.type),
            index2 = dateFormat[2].indexOf(opt.type),
            index3 = dateFormat[3].indexOf(opt.type);

        if (index != -1) {//������ ʱ����
            switch (index) {
                case 0:
                    str = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
                    break;
                case 2:
                    str = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
                    break;
            }
        } else if (index1 != -1) {//������ ʱ��
            switch (index1) {
                case 0:
                    str = y + '-' + m + '-' + d + ' ' + h + ':' + min;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m + '-' + d + ' ' + h + ':' + min;
                    break;
                case 2:
                    str = y + '/' + m + '/' + d + ' ' + h + ':' + min;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m + '/' + d + ' ' + h + ':' + min;
                    break;
            }
        } else if (index2 != -1) {//������
            switch (index2) {
                case 0:
                    str = y + '-' + m + '-' + d;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m + '-' + d;
                    break;
                case 2:
                    str = y + '/' + m + '/' + d;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m + '/' + d;
                    break;
            }
        } else if (index3 != -1) {//����
            switch (index3) {
                case 0:
                    str = y + '-' + m;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m;
                    break;
                case 2:
                    str = y + '/' + m;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m;
                    break;
            }
        }
        if (opt.limitTime == 'today') {
            var d = new Date(),
                error = !isEnglish ? '����ѡ���ȥ��ʱ��' : 'You can\'t choose the past time';
            //��ǰ����
            var day = String(d.getFullYear()) + '-' + String(d.getMonth() + 1) + '-' + String(d.getDate());
            var d1 = new Date(str.replace(/\-/g, "\/"));
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if (d1 < d2) {
                alert(error);
                return false;
            }
        } else if (opt.limitTime == 'tomorrow') {
            var d = new Date(),
                error = !isEnglish ? 'ʱ������ѡ������' : 'Choose tomorrow at least';
            //��ǰ����+1
            var day = String(d.getFullYear()) + '-' + String(d.getMonth() + 1) + '-' + String(d.getDate() + 1);
            var d1 = new Date(str.replace(/\-/g, "\/"));
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if (d1 < d2) {
                alert(error);
                return false;
            }
        }
        //��ֵ
        if (that.get(0).tagName == 'INPUT') {
            that.val(str);
        } else {
            that.text(str);
        }

        createDate.show(false);
        createDate.toNow(true);
    })
}))