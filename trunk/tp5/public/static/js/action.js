var clock = "";
var nums = 60;
var btn;

function sendCode(thisBtn) {
    btn = thisBtn;
    btn.disabled = "disabled"; //将按钮置为不可点击
    btn.innerHTML = nums + '秒后可重新获取';
    clock = setInterval(doLoop, 1000); //一秒执行一次
}
function doLoop() {
    nums--;
    if (nums > 0) {
        btn.innerHTML = nums + '秒后可重新获取';
    } else {
        clearInterval(clock); //清除js定时器
        btn.disabled = "";
        btn.innerHTML = '点击发送验证码';
        nums = 60; //重置时间
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function SetCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
function GetCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}


function GetUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function IsPhoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

function GetDiffMinutes(date1, date2) {
    var difftime = date2.getTime() - date1.getTime();   //时间差的毫秒数
    //计算相差分钟数
    var micro = difftime % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(micro / (60 * 1000));
    return minutes;
}


$(function () {
    $.ShowMsg = function (msg) {
        // alert(msg);
        layui.use("layer", function () {
            layer.msg(msg);
        });
    };

    $.OpenNewUrl = function (url) {
        window.location.href = url;
    };

    $("#header_nav_match").click(function () {
        $.ShowMatchInfo();
    });
    $("#header_nav_record").click(function () {
        $.ShowMatchRecordInfo();
    });
    $("#header_nav_score").click(function () {
        $.ShowScoreInfo();

    });
    $("#header_nav_mine").click(function () {
        $.ShowMineInfo();

    });

    $.ToggleNavbar = function () {
        $("#header_nav_match").removeClass("active");
        $("#header_nav_record").removeClass("active");
        $("#header_nav_score").removeClass("active");
        $("#header_nav_mine").removeClass("active");
    }

    $.ShowMatchInfo = function () {
        $.ToggleNavbar();
        $("#header_nav_match").addClass("active");

        var html = $.AddMatchInfo();

        $("#header_content").html(html);
        $.GetAntiwaveFootballMatch();

    }


    $.AddMatchInfo = function () {
        var html =
            '<div>' +
            '<div class="layui-tab layui-tab-card" lay-filter="matchtab">' +
            '<ul class="layui-tab-title">' +
            '<li class="layui-this">足球</li>' +
            '<li>英雄联盟</li>' +
            '</ul>' +
            '<div class="layui-tab-content">' +
            '<div class="layui-tab-item layui-show">' +
            '<div class="panel-group" id="antiwavefootballmatchcontainer"></div>' +
            '</div>' +
            '<div class="layui-tab-item">' +
            '<div class="panel-group" id="antiwavelolmatchcontainer"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<script>' +
            'layui.use("element", function(){' +
            'var $ = layui.jquery' +
            ',element = layui.element;' +
            'element.on("tab(matchtab)", function(elem){' +
            'if(elem.index === 0){' + //反波胆
            '$.GetAntiwaveFootballMatch();' +
            '}else if(elem.index === 1){' + //英雄联盟
            '$.GetLolMatch();' +
            '}' +
            '});' +
            '});' +
            '</script>';

        return html;
    }

    $.ShowMatchRecordInfo = function () {
        $.ToggleNavbar();
        $("#header_nav_record").addClass("active");

        var html = $.AddMatchRecordInfo();
        $("#header_content").html(html);

        $.GetMatchRecord();

    }
    $.AddMatchRecordInfo = function () {
        var html =
            '<div>' +
            '<div id = "matchrecordcontainer">' +
            '</div>' +
            '</div>';

        return html;
    }

    $.ShowScoreInfo = function () {
        $.ToggleNavbar();
        $("#header_nav_score").addClass("active");


        var html = $.AddScoreInfo();

        $("#header_content").html(html);
        $.GetScoreFinished(0);

    }

    $.AddScoreInfo = function () {
        var html =
            '<div class="div-center">' +
            '<div class="layui-tab" lay-filter="scoretab" id="scorecontainer">' +
            '<ul class="layui-tab-title">' +
            '<li class="layui-this">已完成</li>' +
            '<li>进行中</li>' +
            '</ul>' +
            '<div>' +
            '<br/>' +
            '<button type="button" class="btn-sm btn-default" id="scorebuyeti">买积分</button>' +
            '<button type="button" class="btn-sm btn-default" id="scoresaleeti">卖积分</button>' +
            '</div>' +

            '<div class="layui-tab-content">' +
            '<div class="layui-tab-item layui-show" id="scorecontainerfinished"></div>' +
            '<div class="layui-tab-item" id="scorecontainerrunning"></div>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '<script>' +
            '$("#scorebuyeti").click(function(){' +
            '$.BuyEti();' +
            '});' +
            '$("#scoresaleeti").click(function(){' +
            '$.SaleEti();' +
            '});' +
            '</script>' +

            '<script>' +
            'layui.use("element", function(){' +
            'var $ = layui.jquery' +
            ',element = layui.element;' +
            'element.on("tab(scoretab)", function(elem){' +
            'if(elem.index === 0){' +
            '$.GetScoreFinished(0);' +
            '}else if(elem.index === 1){' +
            '$.GetScoreRunning(0);' +
            '}' +
            '});' +
            '});' +
            '</script>';

        return html;
    }

    $.ShowMineInfo = function () {
        $.ToggleNavbar();
        $("#header_nav_mine").addClass("active");


        var html = $.AddMineInfo();

        $("#header_content").html(html);

    }

    $.AddMineInfo = function () {
        var html =
            '<div id="minecontainer">' +

            '<a href="#" id="minefixpassword" class="list-group-item">修改密码</a>' +
            '<a href="#" id="mineaccountinfo" class="list-group-item">账户信息</a>' +
            '<a href="#" id="minelogout" class="list-group-item">退出</a>' +


            '</div>' +
            '<script>' +
            '$(function(){' +
            '$("#minefixpassword").click(function(){' +
            '$.FixPassword();' +
            '});' +
            '$("#mineaccountinfo").click(function(){' +
            '$.AccountInfo();' +
            '});' +
            '$("#minelogout").click(function(){' +
            '$.Logout();' +
            '});' +
            '});' +
            '</script>';

        return html;
    }

    $.GetUserInfo = function () {
        $.ajax({

            type: "get",
            url: "/tp5/public/index.php/etick/user/getuserinfo",
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                if (data.jsoncontent.length !== 0) {
                    userinfo = JSON.parse(data.jsoncontent);
                    $("#header_username").html(userinfo.username);
                    $("#header_eti").html(userinfo.eti);
                }
            }
        });
    }

    $("#header_refresh").click(function () {

        $("#header_refresh_span").addClass("fa-spin");
    });
});













