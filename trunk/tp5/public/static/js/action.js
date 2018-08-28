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

Date.prototype.Format = function(fmt) {
    var o = {
        "M+" : this.getMonth() + 1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth() + 3) / 3),
        "S" : this.getMilliseconds()
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


});


//register
$(function () {
    $("#register_gettelidentify").click(function () {
        var tel = $("#register_tel").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/register/gettelidentify",
            async: true,
            dataType: "json",
            data: {
                tel: tel
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
        sendCode($("#register_gettelidentify"));
    });

    $("#register_register").click(function () {
        var username = $("#register_username").val();
        var password = $("#register_password").val();
        var tel = $("#register_tel").val();
        var telidentify = $("#register_telidentify").val();
        var rankpre = $("#register_rankpre").val();
        var captcha = $("#register_captcha").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/register/register",
            async: true,
            dataType: "json",
            data: {
                username: username,
                password: password,
                tel: tel,
                telidentify: telidentify,
                rankpre: rankpre,
                captcha: captcha
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/login/index");
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });
});


//login
$(function () {
    $("#login_login").click(function () {
        var username = $("#login_username").val();
        var password = $("#login_password").val();
        var passwordmd5 = hex_md5(password);
        var captcha = $("#login_captcha").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/login/login",
            async: true,
            dataType: "json",
            data: {
                username: username,
                passwordmd5: passwordmd5,
                captcha: captcha
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        //保存username,id
                        SetCookie('username', username);
                        SetCookie('password', password);
                        localStorage.setItem('userid', data.jsoncontent);
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/match/index");
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });
});


//forgetpassword
$(function () {
    $("#forgetpassword_gettelidentify").click(function () {
        var username = $("#forgetpassword_username").val();
        var tel = $("#forgetpassword_tel").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/forgetpassword/gettelidentify",
            async: true,
            dataType: "json",
            data: {
                username: username,
                tel: tel
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
        sendCode($("#forgetpassword_gettelidentify"));

    });

    $("#forgetpassword_fixpassword").click(function () {
        var captcha = $("#forgetpassword_captcha").val();
        var newpassword = $("#forgetpassword_newpassword").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/forgetpassword/fixpassword",
            async: true,
            dataType: "json",
            data: {
                captcha: captcha,
                newpassword: newpassword
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/login/index");
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });
});


//match
function GetAntiwaveFootballMatchCompetitionGuessing(matchid) {
    $.ajax({
        type: "get",
        url: "/tp5/public/index.php/etick/match/getantiwavefootballmatchcompetitionguessing",
        async: true,
        dataType: "json",
        data: {
            matchid: matchid
        },
        success: function (data) {
            data = JSON.parse(data);
            switch (data.code) {
                case 'ERROR_STATUS_SUCCESS':
                    var matchobject = JSON.parse(data.jsoncontent);
                    var html = "";
                    for (var i = 0; i < matchobject.length; ++i) {
                        var match = matchobject[i];
                        html += $.AddAntiwaveFootballMatchCompetitionGuessing(match);
                    }
                    $("#antiwavefootballmatchcompetitionguessingcollapse" + matchid).html(html);
                    break;
                case 'ERROR_STATUS_MATCHCANTCOMPETITION':
                    $.ShowMsg(data.msg);
                    break;
                default:
                    break;
            }
        },
        error: function (hd, msg) {
            $.ShowMsg(msg);
        }
    });
}

function BettingCompetitionGuessing(matchid, guessingid) {
    //弹出下注框
    var eti = prompt("下注ETI：", ""); //将输入的内容赋给变量 name ，
    //这里需要注意的是，prompt有两个参数，前面是提示的话，后面是当对话框出来后，在对话框里的默认值
    if (!eti) {
        return false;
    }
    $.ajax({
        type: "get",
        url: "/tp5/public/index.php/etick/antiwave_football_competition_guessing/bettingcompetitionguessing",
        async: true,
        dataType: "json",
        data: {
            matchid: matchid,
            guessingid: guessingid,
            eti: eti
        },
        success: function (data) {
            data = JSON.parse(data);
            switch (data.code) {
                case 'ERROR_STATUS_SUCCESS':
                    $.ShowMsg(data.msg);
                    break;
                default:
                    $.ShowMsg(data.msg);
                    break;
            }
        },
        error: function (hd, msg) {
            $.ShowMsg(msg);
        }
    });
}

$(function () {
    $.GetAntiwaveFootballMatch = function () {
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/match/getantiwavefootballmatchlist",
            async: true,
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var matchobject = JSON.parse(data.jsoncontent);
                        var html = "";
                        for (var i = 0; i < matchobject.length; ++i) {
                            var match = matchobject[i];
                            html += $.AddAntiwaveFootballMatch(match);
                        }
                        $("#antiwavefootballmatchcontainer").html(html);

                        break;
                    default:
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    };

    //添加反波胆赛事
    $.AddAntiwaveFootballMatch = function (match) {
        var html =
            "<div class='panel panel-default' >" +
            "<div class='panel-heading' >" +
            "<div class='panel-title' >" +
            "<div class='row' style='background-color:#ccc'>" +
            "<a data-toggle='collapse' data-parent='#antiwavefootballmatchcontainer' href='#antiwavefootballmatchcompetitionguessingcollapse" + match.id + "'>" +
            "<div class='col-xs-10 col-sm-10 col-md-10' >" +
            "<p>" + match.caption + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2' >" +
            "<span class='glyphicon glyphicon-chevron-down' id='antiwavefootballmatchglyphicon" + match.id + "'></span>" +
            "</div>" +
            "<div class='col-xs-5 col-sm-5 col-md-5 col-lg-5' >" +
            "<p>" + match.matchteamhostid + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2' >" +
            "<p>VS</p>" +
            "</div>" +
            "<div class='col-xs-5 col-sm-5 col-md-5 col-lg-5' >" +
            "<p>" + match.matchteamguestid + "</p>" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
            "<p>" + match.matchtime + "</p>" +
            "</div>" +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div id='antiwavefootballmatchcompetitionguessingcollapse" + match.id + "' class='panel-collapse collapse'>" +
            "</div>" +
            "</div>" +
            "<script tepe='text/javascript'>" +
            "$(function () {" +
            "var antiwavefootballmatchcompetitionguessingcollapse = $('#antiwavefootballmatchcompetitionguessingcollapse" + match.id + "');" +
            "antiwavefootballmatchcompetitionguessingcollapse.on('show.bs.collapse', function () {" +
            "GetAntiwaveFootballMatchCompetitionGuessing('" + match.id + "');" +
            "});" +
            "antiwavefootballmatchcompetitionguessingcollapse.on('shown.bs.collapse', function () {" +
            "$('#antiwavefootballmatchglyphicon" + match.id + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "antiwavefootballmatchcompetitionguessingcollapse.on('hidden.bs.collapse', function () {" +
            "$('#antiwavefootballmatchglyphicon" + match.id + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "});" +
            "</script>" +

            "<br />";
        return html;
    };
    //添加反波胆下注赛事
    $.AddAntiwaveFootballMatchCompetitionGuessing = function (competitionGuessing) {
        var html =
            "<div class='panel-body' id='antiwavefootballmatchcompetitionguessing" + competitionGuessing.id + "' " +
            "onclick='BettingCompetitionGuessing(" + competitionGuessing.matchid + ", " + competitionGuessing.id + ")'>" +
            "<a class='' href='#' >" +
            "<div class='container'>" +
            "<span>" + competitionGuessing.caption + "</span>" +
            "<span>赔率：" + competitionGuessing.theodds * 100 + "%</span>" +
            "<span>剩余额度：" + competitionGuessing.remaineti + "</span>" +
            "</div>" +
            "</a>" +
            "</div><br />";

        return html;
    };

});


//matchrecord
function MatchRecordDetailInfo(ordernumber) {
    //获取详细记录
    $.ajax({
        type: "get",
        url: "/tp5/public/index.php/etick/match_record/getbettingrecorddetailinfo",
        async: true,
        dataType: "json",
        data: {
            ordernumber: ordernumber
        },
        success: function (data) {
            data = JSON.parse(data);
            switch (data.code) {
                case 'ERROR_STATUS_SUCCESS':
                    var recordobject = JSON.parse(data.jsoncontent);
                    var html = "";
                    for (var i = 0; i < recordobject.length; ++i) {
                        var recorddetail = recordobject[i];
                        html += $.AddMatchRecordDetailInfo(recorddetail);
                    }
                    $("#matchrecordcollapse" + ordernumber).html(html);
                    break;
                default:
                    break;
            }
        },
        error: function (hd, msg) {
            $.ShowMsg(msg);
        }
    });
}

function MatchRecordRevert(ordernumber) {
    $.ajax({
        type: "get",
        url: "/tp5/public/index.php/etick/match_record/matchrecordrevert",
        async: true,
        dataType: "json",
        data: {
            ordernumber: ordernumber
        },
        success: function (data) {
            data = JSON.parse(data);
            switch (data.code) {
                case 'ERROR_STATUS_SUCCESS':
                    $.ShowMsg(data.msg);
                    //隐藏当前btn
                    $('#matchrecordrevert' + ordernumber).css('display', 'none');
                    break;
                default:
                    break;
            }
        },
        error: function (hd, msg) {
            $.ShowMsg(msg);
        }
    });
}

$(function () {
    $.GetMatchRecord = function () {
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/match_record/getmatchrecord",
            async: true,
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var recordobject = JSON.parse(data.jsoncontent);
                        var html = "";
                        for (var i = 0; i < recordobject.length; ++i) {
                            var record = recordobject[i];
                            html += $.AddMatchRecord(record);
                        }
                        $("#matchrecordcontainer").html(html);
                        break;
                    default:
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }


    $.AddMatchRecord = function (record) {
        var etickmatchtypeinfo = record.etickmatchtypeinfo;
        var ordernumber = record.ordernumber;
        var matchcaption = record.matchcaption;
        var bettingeti = record.bettingeti;
        var statusinfo = record.statusinfo;
        var html =
            "<div class='panel panel-default' >" +
            "<div class='panel-heading' >" +
            "<div class='panel-title' >" +
            "<div class='row' style='background-color:#ccc'>" +
            "<a data-toggle='collapse' data-parent='#matchrecordcontainer' href='#matchrecordcollapse" + ordernumber + "'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
            "<p>" + etickmatchtypeinfo + "</p>" +
            "</div>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
            "<p>" + matchcaption + "</p>" +
            "</div>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
            "<p>下注金额：" + bettingeti + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2' >" +
            "<span class='glyphicon glyphicon-chevron-down' id='matchrecordglyphicon" + ordernumber + "'></span>" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
            "<p>" + statusinfo + "</p>" +
            "</div>" +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div id='matchrecordcollapse" + ordernumber + "' class='panel-collapse collapse'>" +
            "</div>" +
            "</div>" +
            "<script tepe='text/javascript'>" +
            "$(function () {" +
            "var matchrecordcollapse = $('#matchrecordcollapse" + ordernumber + "');" +
            "matchrecordcollapse.on('show.bs.collapse', function () {" +
            "MatchRecordDetailInfo('" + ordernumber + "');" +
            "});" +
            "matchrecordcollapse.on('shown.bs.collapse', function () {" +
            "$('#matchrecordglyphicon" + ordernumber + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "matchrecordcollapse.on('hidden.bs.collapse', function () {" +
            "$('#matchrecordglyphicon" + ordernumber + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "});" +
            "</script>" +
            "<br />";
        return html;
    }


    $.AddMatchRecordDetailInfo = function (recorddetail) {
        var ordernumber = recorddetail.ordernumber;
        var guessingcaption = recorddetail.guessingcaption;
        var bettingtime = recorddetail.bettingtime;
        var matchtime = recorddetail.matchtime; //未开赛，下注五分钟内，开赛前可取消
        var balancetime = recorddetail.balancetime;
        var reverttime = recorddetail.reverttime;
        var canceltime = recorddetail.canceltime;
        var matchstatus = recorddetail.matchstatus; //推迟状态比赛可取消
        var theodds = recorddetail.theodds;
        var bettingrecordstatus = recorddetail.status;


        //是否显示button，及button内容
        var displaystatus = "";
        var displaycontent = "";
        switch (bettingrecordstatus) {
            case 0: //未开赛
                var now = new Date();
                var bettingDiffMinutes = GetDiffMinutes(new Date(bettingtime), now);
                //开赛前，并且下注五分钟内可撤销
                if (now < new Date(matchtime) && bettingDiffMinutes >= 0 && bettingDiffMinutes <= 5) {
                    displaystatus = "";
                    displaycontent = "撤销";
                } else {
                    displaystatus = "none";
                }
                break;
            case 1: //比赛推迟
                displaystatus = "";
                displaycontent = "撤销";
                break;
            case 2: //比赛取消
            case 3: //已开赛 未结算
            case 4: //只进行上半场
            case 5: //比赛结束，盈利
            case 6: //比赛结束，亏损
            case 7: //撤销
                displaystatus = "none";
                break;
            default:
                return;
                break;
        }


        var matchrecordtimescontent = "";
        if (bettingrecordstatus === 0 || bettingrecordstatus === 1 || bettingrecordstatus === 3) {
            matchrecordtimescontent = "<span>比赛时间：" + matchtime + "</span>";
        } else if (bettingrecordstatus === 2) {
            matchrecordtimescontent = "<span>取消时间：" + canceltime + "</span>";
        } else if (bettingrecordstatus === 4 || bettingrecordstatus === 5) {
            matchrecordtimescontent = "<div>比赛时间：" + matchtime + "</div><div>结算时间：" + balancetime + "</div>";
        } else if (bettingrecordstatus === 6) {
            matchrecordtimescontent = "<span>撤销时间：" + reverttime + "</span>";
        }

        var html =
            "<div class='panel-body' >" +
            "<div class='container'>" +
            "<span>订单号：" + ordernumber + "</span>" +
            "</div>" +
            "<div class='container'>" +
            "<span>比分：" + guessingcaption + "</span>" +
            "</div>" +
            "<div class='container'>" +
            "<span>赔率：" + theodds + "</span>" +
            "<button type='button' class='btn btn-default' id='matchrecordrevert" + ordernumber + "' onclick='MatchRecordRevert(" + ordernumber.toString() + ")'>" + displaycontent + "</button>" +
            "</div>" +
            "<div class='container'>" +
            "<span>下注时间：" + bettingtime + "</span>" +
            "</div>" +

            //比赛时间
            //撤销时间
            //结算时间
            "<div class='container' id='matchrecordtimes" + ordernumber + "'>" +
            // "<span>比赛时间：" + matchtime + "</span>" +
            "</div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#matchrecordrevert" + ordernumber + "').css('display', '" + displaystatus + "');" +
            "$('#matchrecordtimes" + ordernumber + "').html('" + matchrecordtimescontent + "');" +
            "});" +
            "</script>" +
            "<br />";

        return html;
    }
});


//score
$(function () {
    $.GetScoreFinished = function (beginrecord) {
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/score/getpurchaserecordfinished",
            async: true,
            dataType: "json",
            data: {
                beginrecord: beginrecord,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var html = "";
                        if (data.jsoncontent.length !== 0) {
                            var scoreFinishedRecords = data.jsoncontent;
                            for (var i = 0; i < scoreFinishedRecords.length; ++i) {
                                html += $.AddScoreRecord(scoreFinishedRecords[i], "scorecontainerfinished");
                            }
                        } else {
                            html = "没有记录";
                        }

                        $("#scorecontainerfinished").html(html);
                        // var purchaserecords = JSON.parse(data.jsoncontent);
                        break;
                    default:
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    //获取未完成订单
    $.GetScoreRunning = function (beginrecord) {
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/score/getpruchaserecordrunning",
            async: true,
            dataType: "json",
            data: {
                beginrecord: beginrecord,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var html = "";

                        if (data.jsoncontent.length !== 0) {
                            var scoreRunningRecords = JSON.parse(data.jsoncontent);
                            for (var i = 0; i < scoreRunningRecords.length; ++i) {
                                html += $.AddScoreRecord(scoreRunningRecords[i], "scorecontainerrunning");
                            }
                        }

                        $("#scorecontainerrunning").html(html);
                        // var purchaserecords = JSON.parse(data.jsoncontent);
                        break;
                    default:
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    //添加订单列表--已完成订单和未完成订单
    $.AddScoreRecord = function (record, parent) {
        var purchaseType = record.purchasetype;
        var orderNumber = record.ordernumber;
        var status = record.status;
        var statusinfo = record.statusinfo;
        var rmbpereti = record.rmbpereti;
        var eticount = record.eticount;
        var type = record.type;

        var purchaseCaption = $.GetPurchaseCaption(purchaseType, type);

        var html =
            "<div class='panel panel-default' >" +
            "<div class='panel-heading' >" +
            "<div class='panel-title' >" +
            "<div class='row' style='background-color:#ccc'>" +
            "<a data-toggle='collapse' data-parent='#" + parent + "' href='#scorerecordcollapse" + orderNumber + "'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
            "<p>" + purchaseCaption + "</p>" +
            "</div>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
            "<p>" + rmbpereti + " : 1</p>" +
            "</div>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
            "<p>" + eticount + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2' >" +
            "<span class='glyphicon glyphicon-chevron-down' id='scorerecordglyphicon" + orderNumber + "'></span>" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
            "<p>" + statusinfo + "</p>" +
            "</div>" +
            "</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div id='scorerecordcollapse" + orderNumber + "' class='panel-collapse collapse'>" +
            "</div>" +
            "</div>" +
            "<script tepe='text/javascript'>" +
            "$(function () {" +
            "var scorerecordcollapse = $('#scorerecordcollapse" + orderNumber + "');" +
            "scorerecordcollapse.on('show.bs.collapse', function () {" +
            "$.ScoreRecordDetailInfo(" + purchaseType + ", '" + orderNumber + "');" +
            "});" +
            "scorerecordcollapse.on('shown.bs.collapse', function () {" +
            "$('#scorerecordglyphicon" + orderNumber + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "scorerecordcollapse.on('hidden.bs.collapse', function () {" +
            "$('#scorerecordglyphicon" + orderNumber + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "});" +
            "</script>" +
            "<br />";
        return html;
    }

    $.GetPurchaseCaption = function (purchaseType, type) {
        var typeCaption = purchaseType === 0 ? "挂单" : "直接";
        var statusCaption = type === 0 ? "买入" : "卖出";
        return typeCaption + statusCaption;
    }


    //获取订单详情
    $.ScoreRecordDetailInfo = function (purchaseType, orderNumber) {
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/score/getpurchasedetail",
            async: true,
            dataType: "json",
            data: {
                purchasetype: purchaseType,
                ordernumber: orderNumber
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var recordobject = JSON.parse(data.jsoncontent);
                        var html = "";
                        for (var i = 0; i < recordobject.length; ++i) {
                            var recorddetail = recordobject[i];
                            html += $.AddScoreRecordDetailInfo(recorddetail, purchaseType);
                        }
                        $("#scorerecordcollapse" + orderNumber).html(html);
                        $.UpdateScoreRecordDetailInfo(recorddetail, purchaseType);
                        break;
                    default:
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    $.AddScoreRecordDetailInfo = function (recordDetail, purchaseType) {
        var orderNumber = recordDetail.ordernumber;
        var etiCount = recordDetail.eticount;
        var rmbPerEti = recordDetail.rmbpereti;
        var status = recordDetail.status;
        var statusInfo = recordDetail.statusinfo;
        var lockTime = recordDetail.locktime;
        var payTime = recordDetail.paytime;
        var confirmTime = recordDetail.confirmtime;
        var directType = recordDetail.directtype;
        var recordUserid = recordDetail.userid;
        var userid = parseInt(localStorage.getItem('userid'));

        var html =
            "<div class='panel-body' >" +
            "<div class='container'>" +
            "<div class='container' id='scorerecordbasicinfo" + orderNumber + "'></div>" +
            "</div>" +
            "<div class='container'>" +
            "<button class='btn btn-default' id='scorerecordoperator" + orderNumber + "' style='display:none;'></button>" +
            "</div>" +
            "<div class='container'>" +
            "<button type='button' class='btn btn-default' id='scorerecordproof" + orderNumber + "' style='display:none;'>上传凭证</button>" +
            "</div>" +
            "<div class='container' id='scorerecorduserinfo" + orderNumber + "' style='display:none;'></div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#scorerecordoperator" + orderNumber + "').click(function(){$.ScoreRecordOperator(" + JSON.stringify(recordDetail) + ");});" +
            "$('#scorerecordproof" + orderNumber + "').click(function(){$.ScoreRecordProof('" + orderNumber + "');});" +
            "});" +
            "</script>";


        return html;
    }

    $.UpdateScoreRecordDetailInfo = function (recordDetail, purchaseType) {
        var orderNumber = recordDetail.ordernumber;
        var etiCount = recordDetail.eticount;
        var rmbPerEti = recordDetail.rmbpereti;
        var status = recordDetail.status;
        var statusInfo = recordDetail.statusinfo;
        var lockTime = recordDetail.locktime;
        var payTime = recordDetail.paytime;
        var confirmTime = recordDetail.confirmtime;
        var directType = recordDetail.directtype;
        var recordUserid = recordDetail.userid;
        var userid = parseInt(localStorage.getItem('userid'));

        // var basicInfo = "";
        // var userInfo = "";
        // var userDisplayInfo = "";
        // var operatorInfo = "";
        // var operatorDisplayInfo = "";
        // var proofDisplayInfo = "";
        // var userCurStatus = ""; //当前purchase状态
        // 0 挂买锁定
        // 1 挂买打款
        // 2 挂买确认
        // 3 挂买买家撤销
        // 4 挂买卖家撤销
        // 5 直接买锁定
        // 6 直接买打款
        // 7 直接买确认
        // 8 直接买买家撤销
        // 9 直接买卖家撤销
        // 10 挂卖锁定
        // 11 挂卖打款
        // 12 挂卖确认
        // 13 挂卖买家撤销
        // 14 挂卖卖家撤销
        // 15 直接卖锁定
        // 16 直接卖打款
        // 17 直接卖确认
        // 18 直接卖买家撤销
        // 19 直接卖卖家撤销

        //显示内容
        if ((purchaseType === 0 && directType === 1 && recordUserid !== userid)
            || (purchaseType === 0 && directType === 0 && recordUserid === userid)
            || (purchaseType === 1 && directType === 0 && recordUserid === userid)
            || (purchaseType === 1 && directType === 1 && recordUserid !== userid)) {
            //已方买
            $.GetBuyingInfo(recordDetail);
        } else if ((purchaseType === 0 && directType === 0 && recordUserid !== userid)
            || (purchaseType === 0 && directType === 1 && recordUserid === userid)
            || (purchaseType === 1 && directType === 1 && recordUserid === userid)
            || (purchaseType === 1 && directType === 0 && recordUserid !== userid)) {
            //已方卖
            $.GetSalingInfo(recordDetail);
        }

    }

    $.ScoreRecordOperator = function (recordDetail) {
        var purchaseType = recordDetail.purchasetype;
        var orderNumber = recordDetail.ordernumber;
        var etiCount = recordDetail.eticount;
        var rmbPerEti = recordDetail.rmbpereti;
        var status = recordDetail.status;
        var statusInfo = recordDetail.statusinfo;
        var lockTime = recordDetail.locktime;
        var payTime = recordDetail.paytime;
        var confirmTime = recordDetail.confirmtime;
        var directType = recordDetail.directtype;
        var recordUserid = recordDetail.userid;
        var userid = parseInt(localStorage.getItem('userid'));

        if ((purchaseType === 0 && directType === 1 && recordUserid !== userid)
            || (purchaseType === 1 && directType === 1 && recordUserid !== userid)) {
            //挂买
            $.ajax({
                type: "get",
                url: "/tp5/public/index.php/etick/score/entrustmentbuyingpurchase",
                async: true,
                dataType: "json",
                data: {
                    ordernumber: orderNumber
                },
                success: function (data) {
                    data = JSON.parse(data);
                    switch (data.code) {
                        case 'ERROR_STATUS_SUCCESS':
                            var recordobject = JSON.parse(data.jsoncontent);
                            break;
                        default:
                            break;
                    }
                },
                error: function (hd, msg) {
                    $.ShowMsg(msg);
                }
            });

        } else if ((purchaseType === 1 && directType === 0 && recordUserid === userid)
            || (purchaseType === 0 && directType === 0 && recordUserid === userid)) {
            //直接买
            //直接买已打款
            $.ajax({
                type: "get",
                url: "/tp5/public/index.php/etick/score/directbuyingpurchase",
                async: true,
                dataType: "json",
                data: {
                    ordernumber: orderNumber,
                },
                success: function (data) {
                    data = JSON.parse(data);
                    switch (data.code) {
                        case 'ERROR_STATUS_SUCCESS':
                            var recordobject = JSON.parse(data.jsoncontent);
                            break;
                        default:
                            break;
                    }
                },
                error: function (hd, msg) {
                    $.ShowMsg(msg);
                }
            });

        } else if ((purchaseType === 0 && directType === 0 && recordUserid !== userid)
            || (purchaseType === 1 && directType === 0 && recordUserid !== userid)) {
            //挂卖
            $.ajax({
                type: "get",
                url: "/tp5/public/index.php/etick/score/entrustmentsalingconfirm",
                async: true,
                dataType: "json",
                data: {
                    ordernumber: orderNumber
                },
                success: function (data) {
                    data = JSON.parse(data);
                    switch (data.code) {
                        case 'ERROR_STATUS_SUCCESS':
                            var recordobject = JSON.parse(data.jsoncontent);
                            break;
                        default:
                            break;
                    }
                },
                error: function (hd, msg) {
                    $.ShowMsg(msg);
                }
            });

        } else if ((purchaseType === 0 && directType === 1 && recordUserid === userid)
            || (purchaseType === 1 && directType === 1 && recordUserid === userid)) {
            //直接卖
            $.ajax({
                type: "get",
                url: "/tp5/public/index.php/etick/score/directsalingconfirm",
                async: true,
                dataType: "json",
                data: {
                    ordernumber: orderNumber,
                },
                success: function (data) {
                    data = JSON.parse(data);
                    switch (data.code) {
                        case 'ERROR_STATUS_SUCCESS':
                            var recordobject = JSON.parse(data.jsoncontent);
                            break;
                        default:
                            break;
                    }
                },
                error: function (hd, msg) {
                    $.ShowMsg(msg);
                }
            });
        }
    }

    $.ScoreRecordProof = function (userCurStatus) {

    }

    // var basicInfo = "";
    // var userInfo = "";
    // var userDisplayInfo = "";
    // var operatorInfo = "";
    // var operatorDisplayInfo = "";
    // var proofDisplayInfo = "";

    $.GetBuyingInfo = function (recordDetail) {
        var status = recordDetail.status;
        var orderNumber = recordDetail.ordernumber;
        basicInfo =
            "<div class='container'>" +
            "<div>" +
            "<p>" + orderNumber + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.eticount + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.eti + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.statusinfo + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.locktime + "</p>" +
            "</div>";


        if (status === 0) {
            // userInfo = $.GetScoreBuyingUserInfo(orderNumber);
            userDisplayInfo = "";
            operatorInfo = "已打款";
            operatorDisplayInfo = "";
            proofDisplayInfo = "";

        } else if (status === 1) {
            // userInfo = $.GetScoreBuyingUserInfo(orderNumber);
            userDisplayInfo = "";
            operatorDisplayInfo = "none";
            proofDisplayInfo = "";

            basicInfo +=
                "<div>" +
                "<p>" + recordDetail.paytime + "</p>" +
                "</div>";

        } else if (status === 2) {
            userDisplayInfo = "none";
            operatorDisplayInfo = "none";
            proofDisplayInfo = "none";

            basicInfo +=
                "<div>" +
                "<p>" + recordDetail.paytime + "</p>" +
                "</div>" +
                "<div>" +
                "<p>" + recordDetail.confirmtime + "</p>" +
                "</div>";
        } else if (status === 3 || status === 4) {
            userDisplayInfo = "none";
            operatorDisplayInfo = "none";
            proofDisplayInfo = "none";

            basicInfo +=
                "<div>" +
                "<p>" + recordDetail.reverttime + "</p>" +
                "</div>";

        }

        basicInfo += "</div>";

        $("#scorerecordbasicinfo" + orderNumber).html(basicInfo);
        $("#scorerecordoperator" + orderNumber).css('display', operatorDisplayInfo);
        if (operatorDisplayInfo === "") {
            $("#scorerecordoperator" + orderNumber).html(operatorInfo);
        }
        $("#scorerecordproof" + orderNumber).css('display', proofDisplayInfo);
        $("#scorerecorduserinfo" + orderNumber).css('display', userDisplayInfo);

        if ((status === 0 || status === 1) && userDisplayInfo === "") {
            $.GetScoreSalingUserInfo(orderNumber);
        }
    }
    $.GetSalingInfo = function (recordDetail) {
        var status = recordDetail.status;
        var orderNumber = recordDetail.ordernumber;
        basicInfo =
            "<div class='container'>" +
            "<div>" +
            "<p>" + orderNumber + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.eticount + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.eti + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.statusinfo + "</p>" +
            "</div>" +
            "<div>" +
            "<p>" + recordDetail.locktime + "</p>" +
            "</div>";


        proofDisplayInfo = "none";

        if (status === 0) {
            // userInfo = $.GetScoreSalingUserInfo(orderNumber);
            userDisplayInfo = "";
            operatorDisplayInfo = "none";

        } else if (status === 1) {
            userDisplayInfo = "";
            operatorDisplayInfo = "";
            operatorInfo = "确认";
            basicInfo +=
                "<div>" +
                "<p>" + recordDetail.paytime + "</p>" +
                "</div>";
        } else if (status === 2) {
            userDisplayInfo = "none";
            operatorDisplayInfo = "none";

            basicInfo +=
                "<div>" +
                "<p>" + recordDetail.paytime + "</p>" +
                "</div>" +
                "<div>" +
                "<p>" + recordDetail.confirmtime + "</p>" +
                "</div>";
        } else if (status === 3 || status === 4) {
            userDisplayInfo = "none";
            operatorDisplayInfo = "none";

            basicInfo +=
                "<div>" +
                "<p>" + recordDetail.reverttime + "</p>" +
                "</div>";
        }


        basicInfo += "</div>";


        $("#scorerecordbasicinfo" + orderNumber).html(basicInfo);
        $("#scorerecordoperator" + orderNumber).css('display', operatorDisplayInfo);
        if (operatorDisplayInfo === "") {
            $("#scorerecordoperator" + orderNumber).html(operatorInfo);
        }
        $("#scorerecordproof" + orderNumber).css('display', proofDisplayInfo);
        $("#scorerecorduserinfo" + orderNumber).css('display', userDisplayInfo);

        if ((status === 0 || status === 1) && userDisplayInfo === "") {
            $.GetScoreBuyingUserInfo(orderNumber);
        }

    }

    // $.GetUserCurStatus = function(objInfo, recordDetail){
    //     var purchaseType = recordDetail.purchasetype;
    //     var directType = recordDetail.directtype;
    //     var status = recordDetail.status;
    //
    //     if(purchaseType === 0){
    //         //挂单
    //         if(directType === 0){
    //             //挂买
    //             if(status === 0){
    //                 objInfo.userCurStatus = 0;
    //                 //挂买锁定
    //             }else if(status === 1){
    //                 //挂买打款
    //                 objInfo.userCurStatus = 1;
    //
    //             }else if(status === 2){
    //                 //挂买确认
    //                 objInfo.userCurStatus = 2;
    //
    //             }else if(status === 3){
    //                 //挂买买家撤销
    //                 objInfo.userCurStatus = 3;
    //
    //             }else if(status === 4){
    //                 //挂买卖家撤销
    //                 objInfo.userCurStatus = 4;
    //
    //             }
    //         }else if(directType === 1){
    //             //挂卖
    //             if(status === 0){
    //                 //挂卖锁定
    //                 objInfo.userCurStatus = 5;
    //
    //             }else if(status === 1){
    //                 //挂卖打款
    //                 objInfo.userCurStatus = 6;
    //
    //             }else if(status === 2){
    //                 //挂卖确认
    //                 objInfo.userCurStatus = 7;
    //
    //             }else if(status === 3){
    //                 //挂卖买家撤销
    //                 objInfo.userCurStatus = 8;
    //
    //             }else if(status === 4){
    //                 //挂卖卖家撤销
    //                 objInfo.userCurStatus = 9;
    //
    //             }
    //         }
    //     }else if(purchaseType === 1){
    //         //直接下单
    //         if(directType === 0){
    //             //直接买
    //             if(status === 0){
    //                 //直接买锁定
    //                 objInfo.userCurStatus = 10;
    //
    //             }else if(status === 1){
    //                 //直接买打款
    //                 objInfo.userCurStatus = 11;
    //
    //             }else if(status === 2){
    //                 //直接买确认
    //                 objInfo.userCurStatus = 12;
    //
    //             }else if(status === 3){
    //                 //直接买买家撤销
    //                 objInfo.userCurStatus = 13;
    //
    //             }else if(status === 4){
    //                 //直接买卖家撤销
    //                 objInfo.userCurStatus = 14;
    //
    //             }
    //         }else if(directType === 1){
    //             //直接卖
    //             if(status === 0){
    //                 //直接卖锁定
    //                 objInfo.userCurStatus = 15;
    //
    //             }else if(status === 1){
    //                 //直接卖打款
    //                 objInfo.userCurStatus = 16;
    //
    //             }else if(status === 2){
    //                 //直接卖确认
    //                 objInfo.userCurStatus = 17;
    //
    //             }else if(status === 3){
    //                 //直接卖买家撤销
    //                 objInfo.userCurStatus = 18;
    //
    //             }else if(status === 4){
    //                 //直接卖卖家撤销
    //                 objInfo.userCurStatus = 19;
    //             }
    //         }
    //     }
    //
    //     // if((purchaseType === 0 && directType === 1) || (purchaseType === 1 && directType === 0)){
    //     //     //买
    //     //     $.GetBuyingInfo(objInfo, recordDetail);
    //     // }else if((purchaseType === 0 && directType === 0) || (purchaseType === 1 && directType === 1)){
    //     //     //卖
    //     //     $.GetSalingInfo(objInfo, recordDetail);
    //     // }
    //
    // }

    $.GetScoreBuyingUserInfo = function (orderNumber) {
        var html = "";
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/score/getbuyinguserinfo",
            async: true,
            dataType: "json",
            data: {
                ordernumber: orderNumber
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var recorddetail = data.jsoncontent;
                        html =
                            "<div class='container'>" +
                            "<div>" +
                            "<p>" + recorddetail.name + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.tel + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.banknum + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.bankname + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.alipaynum + "</p>" +
                            "</div>" +
                            "</div>";
                        $("#scorerecorduserinfo" + orderNumber).html(html);
                        break;
                    default:
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    $.GetScoreSalingUserInfo = function (orderNumber) {
        var html = "";
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/score/getsalinguseraccount",
            async: true,
            dataType: "json",
            data: {
                ordernumber: orderNumber
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var recorddetail = data.jsoncontent;
                        // for(var i = 0; i < recordobject.length; ++i){
                        //     var recorddetail = recordobject[i];
                        html =
                            "<div class='container'>" +
                            "<div>" +
                            "<p>" + recorddetail.name + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.tel + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.banknum + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.bankname + "</p>" +
                            "</div>" +
                            "<div>" +
                            "<p>" + recorddetail.alipaynum + "</p>" +
                            "</div>" +
                            "</div>";
                        // }
                        $("#scorerecorduserinfo" + orderNumber).html(html);

                        break;
                    default:
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    //买入积分
    $("#scorebuyeti").click(function () {
        //买入积分，显示所有挂卖记录
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/score/getentrustmentsalingetirecord",
            async: true,
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var html = "";

                        if (data.jsoncontent.length !== 0) {
                            var salingRecord = JSON.parse(data.jsoncontent);
                            for (var i = 0; i < salingRecord.length; ++i) {
                                html += $.GetSalingRecord(salingRecord[i]);
                            }
                        }
                        html += "<button class='btn btn-default' id='scoreentrustmentbuying'>挂单买入</button>" +
                            "<script>" +
                            "$(function(){" +
                            "$('#scoreentrustmentbuying').click(function(){$.ScoreEntrustmentBuying();});});" +
                            "</script>";
                        $("#scorecontainer").html(html);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });

    //买入积分列表--挂单卖出列表
    $.GetSalingRecord = function (salingRecord) {
        var html =
            "<div class='container'>" +
            "<a href='#' id='scoresalingrecordentrustmentpurchase" + salingRecord.ordernumber + "'>" +
            "<div>" +
            "<p>" + salingRecord.username + "</p>" +
            "<p>" + salingRecord.rmbpereti + "</p>" +
            "<p>" + salingRecord.eticount + "</p>" +
            "<p>" + salingRecord.mineti + "~" + salingRecord.maxeti + "</p>" +
            "</div>" +
            "</a>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#scoresalingrecordentrustmentpurchase" + salingRecord.ordernumber + "').click(function(){" +
            "$.ScoreSalingRecordEntrustmentPurchase('" + salingRecord.ordernumber + "');});});" +
            "</script>";


        return html;
    }

    //直接买入
    $.ScoreSalingRecordEntrustmentPurchase = function (ordernumber) {
        var eti = prompt("买入积分：", ""); //将输入的内容赋给变量 name ，
        if (!eti) {
            return false;
        }
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/score/directbuyinglock",
            async: true,
            dataType: "json",
            data: {
                ordernumber: ordernumber,
                eticount: eti,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });


    }

    //挂单买入
    $.ScoreEntrustmentBuying = function () {
        var html =
            "<div class='container'>" +
            "<div>" +
            "<input type='text' id='scoreentrustmentbuyingrmbpereti'/> / ETI" +
            "</div>" +
            "<div>" +
            "<input type='text' id='scoreentrustmentbuyingeticount'/> ETI" +
            "</div>" +
            "<div>" +
            "<input type='text' id='scoreentrustmentbuyingmineti'/> ~ <input type='text' id='scoreentrustmentbuyingmaxeti'/>" +
            "</div>" +
            "<div>" +
            "<button type='button' class='btn btn-default' id='scoreentrustmentbuyingconfirm'>确认</button>" +
            "</div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#scoreentrustmentbuyingconfirm').click(function(){$.ScoreEntrustmentBuyingConfirm();});});" +
            "</script>";

        $("#scorecontainer").html(html);

    }

    //发布挂单买入
    $.ScoreEntrustmentBuyingConfirm = function () {
        var rmbpereti = $("#scoreentrustmentbuyingrmbpereti").val();
        var eticount = $("#scoreentrustmentbuyingeticount").val();
        var mineti = $("#scoreentrustmentbuyingmineti").val();
        var maxeti = $("#scoreentrustmentbuyingmaxeti").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/score/entrustmentbuyingeti",
            async: true,
            dataType: "json",
            data: {
                eticount: eticount,
                rmbpereti: rmbpereti,
                mineti: mineti,
                maxeti: maxeti,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    //卖出积分
    $("#scoresaleeti").click(function () {
        //卖出积分，显示所有挂买记录
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/score/getentrustmentbuyingetirecord",
            async: true,
            dataType: "json",

            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        var html = "";
                        if (data.jsoncontent.length !== 0) {
                            var buyingRecord = JSON.parse(data.jsoncontent);
                            for (var i = 0; i < buyingRecord.length; ++i) {
                                html += $.GetBuyingRecord(buyingRecord[i]);
                            }
                        }
                        html += "<button class='btn btn-default' id='scoreentrustmentsaling'>挂单卖出</button>" +
                            "<script>" +
                            "$(function(){" +
                            "$('#scoreentrustmentsaling').click(function(){$.ScoreEntrustmentSaling();});});" +
                            "</script>";
                        $("#scorecontainer").html(html);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });

    //卖出积分列表--挂单买入列表
    $.GetBuyingRecord = function (buyingRecord) {
        var html =
            "<div class='container'>" +
            "<a href='#' id='scorebuyingrecordentrustmentpurchase" + buyingRecord.ordernumber + "'>" +
            "<div>" +
            "<p>" + buyingRecord.username + "</p>" +
            "<p>" + buyingRecord.rmbpereti + "</p>" +
            "<p>" + buyingRecord.eticount + "</p>" +
            "<p>" + buyingRecord.mineti + "~" + buyingRecord.maxeti + "</p>" +
            "</div>" +
            "</a>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#scorebuyingrecordentrustmentpurchase" + buyingRecord.ordernumber + "').click(function(){" +
            "$.ScoreBuyingRecordEntrustmentPurchase('" + buyingRecord.ordernumber + "');});});" +
            "</script>";


        return html;
    }

    //直接卖出积分
    $.ScoreBuyingRecordEntrustmentPurchase = function (ordernumber) {
        var eti = prompt("卖出积分：", ""); //将输入的内容赋给变量 name ，
        if (!eti) {
            return false;
        }
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/score/directsalinglock",
            async: true,
            dataType: "json",
            data: {
                ordernumber: ordernumber,
                eti: eti,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    //挂单卖出
    $.ScoreEntrustmentSaling = function () {
        var html =
            "<div class='container'>" +
            "<div>" +
            "<input type='text' id='scoreentrustmentsalingrmbpereti'/> / ETI" +
            "</div>" +
            "<div>" +
            "<input type='text' id='scoreentrustmentsalingeticount'/> ETI" +
            "</div>" +
            "<div>" +
            "<input type='text' id='scoreentrustmentsalingmineti'/> ~ <input type='text' id='scoreentrustmentsalingmaxeti'/>" +
            "</div>" +
            "<div>" +
            "<button type='button' class='btn btn-default' id='scoreentrustmentsalingconfirm'>确认</button>" +
            "</div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#scoreentrustmentsalingconfirm').click(function(){$.ScoreEntrustmentSalingConfirm();});});" +
            "</script>";

        $("#scorecontainer").html(html);
    }


    //发布挂单卖出
    $.ScoreEntrustmentSalingConfirm = function () {
        var rmbpereti = $("#scoreentrustmentsalingrmbpereti").val();
        var eticount = $("#scoreentrustmentsalingeticount").val();
        var mineti = $("#scoreentrustmentsalingmineti").val();
        var maxeti = $("#scoreentrustmentsalingmaxeti").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/score/entrustmentsalingeti",
            async: true,
            dataType: "json",
            data: {
                eticount: eticount,
                rmbpereti: rmbpereti,
                mineti: mineti,
                maxeti: maxeti,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }


});

//mine
$(function () {
    $("#minefixpassword").click(function () {
        html =
            "<div class='container'>" +
            "<h4>修改密码</h4>" +
            "<div>" +
            "<input type='text' placeholder='原密码' id='fixpassword_oldpassword'/>" +
            "</div>" +
            "<div>" +
            "<input type='text' placeholder='新密码' id='fixpassword_newpassword'/>" +
            "</div>" +
            "<div>" +
            "<button type='button' class='btn btn-default' id='fixpassword_get_telidentify'>获取验证码</button>" +
            "</div>" +
            "<div>" +
            "<input type='text' placeholder='手机验证码' id='fixpassword_telidentify'/>" +
            "</div>" +
            "<div>" +
            "<input type='text' placeholder='图片验证码' id='fixpassword_captcha'/>" +
            "<div>" +
            "<img id='fixpassword_captcha_img' src=\"/tp5/public/index.php/captcha?id=" + Math.random() + "\" onclick='this.src=\"/tp5/public/index.php/captcha?id=" + Math.random() + "\"' style='cursor:pointer;position:relative;left:0%;' /><br/>" +
            "</div>" +
            "<div>" +
            "<button type='button' class='btn btn-default' id='fixpassword_confirm'>确认修改</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#fixpassword_get_telidentify').click(function(){" +
            "$.GetFixPasswordTelidentify();" +
            "});" +
            "$('#fixpassword_confirm').click(function(){" +
            "$.ConfirmFixPassword();" +
            "});" +
            "});" +
            "</script>";

        $("#minecontainer").html(html);

    });

    $.GetFixPasswordTelidentify = function(){
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/mine/getfixpasswordtelidentify",
            async: true,
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
        sendCode($("#fixpassword_get_telidentify"));
    }


    $.ConfirmFixPassword = function(){
        var oldpasswordmd5 = hex_md5($("#fixpassword_oldpassword").val());
        var newpassword = ($("#fixpassword_newpassword").val());
        var telidentify = ($("#fixpassword_telidentify").val());
        var captcha = ($("#fixpassword_captcha").val());

        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/mine/fixpassword",
            async: true,
            dataType: "json",
            data:{
                oldpasswordmd5: oldpasswordmd5,
                newpassword: newpassword,
                telidentify: telidentify,
                captcha: captcha,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });

    }

    $("#mineaccountinfo").click(function () {
        html =
            "<div class='container'>" +
            "<h4>账户信息</h4>" +
            "<div>" +
            "<input type='text' placeholder='姓名' id='account_name' />" +
            "</div>" +
            "<div>" +
            "<input type='text' placeholder='银行卡号' id='account_banknum' />" +
            "</div>" +
            "<div>" +
            "<input type='text' placeholder='开户行' id='account_bankname'" +
            "<div>" +
            "<input type='text' placeholder='支付宝账户' id='account_alipaynum' />" +
            "</div>" +
            "<div>" +
            "<button type='button' class='btn btn-default' id='account_confirm' >确定</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#account_confirm').click(function(){" +
            "$.AccountConfirm();" +
            "})" +
            "});" +
            "</script>";

        $("#minecontainer").html(html);

        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/mine/getuseraccount",
            async: true,
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        if(data.jsoncontent.length !== 0){
                            $("#account_name").val(data.jsoncontent.name);
                            $("#account_banknum").val(data.jsoncontent.banknum);
                            $("#account_bankname").val(data.jsoncontent.bankname);
                            $("#account_alipaynum").val(data.jsoncontent.alipaynum);
                        }
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });


    $.AccountConfirm = function(){
        var name = $("#account_name").val();
        var banknum = $("#account_banknum").val();
        var bankname = $("#account_bankname").val();
        var alipaynum = $("#account_alipaynum").val();

        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/mine/setuseraccount",
            async: true,
            dataType: "json",
            data:{
                name: name,
                banknum: banknum,
                bankname: bankname,
                alipaynum: alipaynum
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    $("#minelogout").click(function () {
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/mine/logout",
            async: true,
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });
});



//admin
$(function(){
    $("#admin_publish_match").click(function(){
        var html =
            "<div class='container'>" +
            "<form >" +
            "<div class='form-group'>" +
            "<label >赛事类型</label>" +
            "<select class='form-control' id='admin_publish_etick_match_type' ></select>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label >赛事类别</label>" +
            "<select class='form-control' id='admin_publish_match_type' ></select>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label >主场</label>" +
            "<select class='form-control' id='admin_publish_host_team' ></select>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label >客场</label>" +
            "<select class='form-control' id='admin_publish_guest_team' ></select>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label >赛事名称</label>" +
            "<input type='text' class='form-control' id='admin_publish_match_caption'/>" +
            "</div>" +
            "</form>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label>比赛时间</label>" +
            "<input type='text' id='admin_publish_match_date_time' placeholder='yyyy-MM-dd HH:mm:ss' class='form-control'>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label>显示时间</label>" +
            "<input type='text' id='admin_publish_display_date_time' placeholder='yyyy-MM-dd HH:mm:ss' class='form-control'>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label>消失时间</label>" +
            "<input type='text' id='admin_publish_disappear_date_time' placeholder='yyyy-MM-dd HH:mm:ss' class='form-control'>" +
            "</div>" +
            "<div class='form-group' id='admin_publish_competition_guessing'>" +
            "</div>" +
            "<div>" +
            "<button type='button' class='btn btn-default' id='admin_publish_confirm'>确认发布</button>" +
            "</div>" +
            "<script>" +
                "$('#admin_publish_etick_match_type').change(function(){" +
                    "$.AdminPublishEtickMatchTypeChange();" +
                    "$.AdminPublishMatchTypeChange();" +
                "});" +
            "$('#admin_publish_confirm').click(function(){" +
            "$.AdminPublishConfirm();" +
            "});" +
            "layui.use('laydate', function(){" +
            "var laydate = layui.laydate;" +
            "laydate.render({" +
                "elem:'#admin_publish_match_date_time'" +
                ",type:'datetime'" +
                ",done:function(value, datetime){" +
                    "$.AdminPublishMatchDatetimeDone(value, datetime);" +
                "}" +
            "});" +
            "laydate.render({" +
                "elem:'#admin_publish_display_date_time'" +
                ",type:'datetime'" +
            "});" +
            "laydate.render({" +
                "elem:'#admin_publish_disappear_date_time'" +
                ",type:'datetime'" +
            "});" +
            "});" +
            "</script>";

        $("#admincontainer").html(html);

        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/admin/getetickmatchtype",
            async: true,
            dataType: "json",
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        if(data.jsoncontent.length !== 0){
                            var etickMatchType = JSON.parse(data.jsoncontent);

                            //添加一个无用项
                            $("#admin_publish_etick_match_type").append("<option value=-1>选择赛事类型</option>");

                            for(var i = 0; i < etickMatchType.length; ++i){
                                $("#admin_publish_etick_match_type").append("<option value=" + etickMatchType[i].id + ">" + etickMatchType[i].etickmatchtypeinfo + "</option>");
                            }
                        }
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    });

    $.AdminPublishEtickMatchTypeChange = function(){
        var etickmatchtype = $("#admin_publish_etick_match_type").val();
        if(etickmatchtype === '-1'){
            return;
        }

        if(etickmatchtype === "1"){
            //足球返波胆
            $.AdminPublishAddAntiwaveFootballCompetitionGuessing();
        }else if(etickmatchtype === "2"){
            //英雄联盟返波胆
            $.AdminPublishAddLolCompetitionGuessing();

        }
        //获取赛事类别
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/admin/getmatchtype",
            async: true,
            dataType: "json",
            data:{
                etickmatchtype:etickmatchtype,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        if(data.jsoncontent.length !== 0){
                            var matchType = JSON.parse(data.jsoncontent);
                            $("#admin_publish_match_type").empty();
                            for(var i = 0; i < matchType.length; ++i){
                                $("#admin_publish_match_type").append("<option value=" + matchType[i].id + ">" + matchType[i].caption + "</option>");
                            }
                        }
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    $.AdminPublishMatchTypeChange = function(){
        var etickmatchtype = $("#admin_publish_etick_match_type").val();
        if(etickmatchtype === '-1'){
            return;
        }
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/admin/gethostandguestteam",
            async: true,
            dataType: "json",
            data:{
                etickmatchtype:etickmatchtype,
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        if(data.jsoncontent.length !== 0){
                            $("#admin_publish_host_team").empty();
                            $("#admin_publish_guest_team").empty();
                            var matchTeam = JSON.parse(data.jsoncontent);
                            for(var i = 0; i < matchTeam.length; ++i){
                                $("#admin_publish_host_team").append("<option value=" + matchTeam[i].id + ">" + matchTeam[i].caption + "</option>");
                                $("#admin_publish_guest_team").append("<option value=" + matchTeam[i].id + ">" + matchTeam[i].caption + "</option>");
                            }
                        }
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error: function (hd, msg) {
                $.ShowMsg(msg);
            }
        });
    }

    $.AdminPublishMatchDatetimeDone = function(value, datetime){
        var date = new Date(value);
        var time = date.getTime();
        date.setTime(time - 12 * 3600 * 1000);
        $("#admin_publish_display_date_time").val(date.Format("yyyy-MM-dd hh:mm:ss"));
        $("#admin_publish_disappear_date_time").val(value);
    }

    $.AdminPublishAddAntiwaveFootballCompetitionGuessing = function(){
        var scoreHole = ["3_0", "3_1", "3_2", "3_3", "2_3", "2_2", "2_1", "2_0", "1_3", "1_2", "1_1", "1_0", "0_3", "0_2", "0_1", "0_0"];
        var scoreHalf = ["2_2", "2_1", "2_0", "1_2", "1_1", "1_0", "0_2", "0_1", "0_0"];
        var scoreAngle = ["12", "13", "14", "15", "16", "17"];
        var html =
            "<div class='container'>" +
            "<div>" +
            "<h4>全场</h4>" +
            "</div>";
        for(var i = 0; i < scoreHole.length; ++i){
            html +=
                "<div>" +
                scoreHole[i] +
                "</div>" +
                "<div>" +
                "<input type='text' id='admin_publish_antiwave_football_hole_" + scoreHole[i] +"' value='5%' />" +
                "</div>";
        }
        html += "<div><h4>上半场</h4></div>";
        for(var i = 0; i < scoreHalf.length; ++i){
            html +=
                "<div>" +
                scoreHalf[i] +
                "</div>" +
                "<div>" +
                "<input type='text' id='admin_publish_antiwave_football_half_" + scoreHalf[i] +"' value='5%' />" +
                "</div>";
        }
        html += "<div><h4>角球</h4></div>";
        for(var i = 0; i < scoreAngle.length; ++i){
            html +=
                "<div>" +
                scoreAngle[i] +
                "</div>" +
                "<div>" +
                "<input type='text' id='admin_publish_antiwave_football_angle_" + scoreAngle[i] +"' value='5%' />" +
                "</div>";
        }

        html += "</div>";


        $("#admin_publish_competition_guessing").html(html);
    }

    $.AdminPublishAddLolCompetitionGuessing = function(){
        var html =
            "<div class='container'>" +
            "<div>" +
            "<h4>局数</h4>" +
            "</div>" +
            "<div>" +
            "<select id='admin_publish_lol_match_times' >" +
            "<option value='0'>选择局数</option>" +
            "<option value='5'>5局</option>" +
            "<option value='3'>3局</option>" +
            "</select>" +
            "</div>" +
            "<div id='admin_publish_lol_match_competition'>" +
            "</div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#admin_publish_lol_match_times').change(function(){" +
            "$.AdminPublishLolMatchTimesChange();" +
            "});" +
            "});" +
            "</script>";

        $("#admin_publish_competition_guessing").html(html);
    }

    $.AdminPublishLolMatchTimesChange = function(){
        var matchTimes = $("#admin_publish_lol_match_times").val();

        var match_3 = ["2_1", "2_0", "0_2", "1_2"];
        var match_5 = ["3_2", "3_1", "3_0", "0_3", "1_3", "2_3"];

        var html =
            "<div class='contaienr'>";

        if(matchTimes === "3"){
            for (var i = 0; i < match_3.length; ++i){
                html +=
                    "<div>" +
                    "<div>" +
                    match_3[i] +
                    "</div>" +
                    "<div>" +
                    "<input type='text' id='admin_publish_lol_match_3_score" + match_3[i] + "' value='5%' />" +
                    "</div>" +
                    "</div>";
            }
        }
        if(matchTimes === "5"){
            for (var i = 0; i < match_5.length; ++i){
                html +=
                    "<div>" +
                    "<div>" +
                    match_5[i] +
                    "</div>" +
                    "<div>" +
                    "<input type='text' id='admin_publish_lol_match_5_score" + match_5[i] + "' value='5%' />" +
                    "</div>" +
                    "</div>";
            }
        }
        html += "</div>";

        $("#admin_publish_lol_match_competition").html(html);
    }

    $.AdminPublishConfirm = function(){

        //etickmatchtype
        var etickmatchtypeid = $("#admin_publish_etick_match_type").val();
        var matchtypeid = $("#admin_publish_match_type").val();
        var hostteamid = $("#admin_publish_host_team").val();
        var guestteamid = $("#admin_publish_guest_team").val();
        var matchcaption = $("#admin_publish_match_caption").val();
        var matchtime = $("#admin_publish_match_date_time").val();
        var displaytime = $("#admin_publish_display_date_time").val();
        var disappeartime = $("#admin_publish_disappear_date_time").val();
        if(etickmatchtypeid === "1"){
            //足球返波胆
            var scoreHole = ["3_0", "3_1", "3_2", "3_3", "2_3", "2_2", "2_1", "2_0", "1_3", "1_2", "1_1", "1_0", "0_3", "0_2", "0_1", "0_0"];
            var scoreHalf = ["2_2", "2_1", "2_0", "1_2", "1_1", "1_0", "0_2", "0_1", "0_0"];
            var scoreAngle = ["12", "13", "14", "15", "16", "17"];

            var json_score_hole = "[";
            var json_score_half = "[";
            var json_score_angle = "[";

            for(var i = 0; i < scoreHole.length; ++i){
                json_score_hole += "'{\"score\":\"" + scoreHole[i] + "\"";
                json_score_hole += ",";
                json_score_hole += "\"theodds\":\"" + $("#admin_publish_antiwave_football_hole_" + scoreHole[i]).val() + "\"}'";
                if(i !== scoreHole.length - 1){
                    json_score_hole += ",";
                }
            }
            json_score_hole += "]";


            for(var i = 0; i < scoreHalf.length; ++i){
                json_score_half += "{score:'" + scoreHalf[i] + "'";
                json_score_half += ",";
                json_score_half += "theodds:'" + $("#admin_publish_antiwave_football_half_" + scoreHalf[i]).val() + "'";
                if(i !== scoreHalf.length){
                    json_score_half += "},";
                }
            }
            json_score_half += "]";

            for(var i = 0; i < scoreAngle.length; ++i){
                json_score_angle += "{score:'" + scoreAngle[i] + "'";
                json_score_angle += ",";
                json_score_angle += "theodds:'" + $("#admin_publish_antiwave_football_angle_" + scoreAngle[i]).val() + "'";
                if(i !== scoreAngle.length){
                    json_score_angle += "},";
                }
            }
            json_score_angle += "]";

            $.ajax({
                type: "post",
                url: "/tp5/public/index.php/etick/admin/addantiwavefootballmatch",
                async: true,
                dataType: "json",
                data:{
                    matchtypeid:matchtypeid,
                    hostteamid:hostteamid,
                    guestteamid:guestteamid,
                    matchcaption:matchcaption,
                    matchtime:matchtime,
                    displaytime:displaytime,
                    disappeartime:disappeartime,
                    scoreHole:json_score_hole,
                    scoreHalf:json_score_half,
                    scoreAngle:json_score_angle,
                },
                success: function (data) {
                    data = JSON.parse(data);
                    switch (data.code) {
                        case 'ERROR_STATUS_SUCCESS':
                            $.ShowMsg(data.msg);
                            break;
                        default:
                            $.ShowMsg(data.msg);
                            break;
                    }
                },
                error: function (hd, msg) {
                    $.ShowMsg(msg);
                }
            });

        }else if(etickmatchtypeid === "2"){
            //英雄联盟
            var lolmatchtimes = $("#admin_publish_lol_match_times").val();
                var match_3 = ["2_1", "2_0", "0_2", "1_2"];
                var match_5 = ["3_2", "3_1", "3_0", "0_3", "1_3", "2_3"];
                var json_match = "{";
            if(lolmatchtimes === "3"){
                //英雄联盟3局
                for(var i = 0; i < match_3.length; ++i){
                    json_match += "'" + match_3[i] + "'";
                    json_match += ":";
                    json_match += "'" + $("#admin_publish_lol_match_3_score" + match_3[i]).val() + "'";
                    if(i !== match_3.length){
                        json_match += ",";
                    }
                }
            }else if(lolmatchtimes === "5") {
                //英雄联盟5局
                for (var i = 0; i < match_5.length; ++i) {
                    json_match += "'" + match_5[i] + "'";
                    json_match += ":";
                    json_match += "'" + $("#admin_publish_lol_match_5_score" + match_5[i]).val() + "'";
                    if (i !== match_5.length) {
                        json_match += ",";
                    }
                }
            }

            $.ajax({
                type: "post",
                url: "/tp5/public/index.php/etick/admin/addlolmatch",
                async: true,
                dataType: "json",
                data:{
                    matchtypeid:matchtypeid,
                    hostteamid:hostteamid,
                    guestteamid:guestteamid,
                    matchcaption:matchcaption,
                    json_match:json_match,
                },
                success: function (data) {
                    data = JSON.parse(data);
                    switch (data.code) {
                        case 'ERROR_STATUS_SUCCESS':
                            $.ShowMsg(data.msg);
                            break;
                        default:
                            $.ShowMsg(data.msg);
                            break;
                    }
                },
                error: function (hd, msg) {
                    $.ShowMsg(msg);
                }
            });



        }




    }

});