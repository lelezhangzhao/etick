var clock="";
var nums = 60;
var btn;

function sendCode(thisBtn) {
    btn = thisBtn;
    btn.disabled = "disabled"; //将按钮置为不可点击
    btn.innerHTML = nums+'秒后可重新获取';
    clock = setInterval(doLoop, 1000); //一秒执行一次
}
function doLoop() {
    nums--;
    if(nums > 0){
        btn.innerHTML = nums+'秒后可重新获取';
    }else{
        clearInterval(clock); //清除js定时器
        btn.disabled = "";
        btn.innerHTML = '点击发送验证码';
        nums = 60; //重置时间
    }
}

function GetUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function IsPhoneAvailable(str) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}



$(function(){
    $.ShowMsg = function(msg){
        // alert(msg);
        layui.use("layer", function(){
            layer.msg(msg);
        });
    };

    $.OpenNewUrl = function(url){
        window.location.href = url;
    };


});


//register
$(function() {
    $("#register_gettelidentify").click(function(){
        var tel = $("#register_tel").val();
        $.ajax({
            type:"post",
            url:"/tp5/public/index.php/etick/register/gettelidentify",
            async:true,
            dataType:"json",
            data:{
                tel:tel
            },
            success:function(data){
                data = JSON.parse(data);
                switch(data.code){
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error:function(hd, msg){
                $.ShowMsg(msg);
            }
        });
        sendCode($("#register_gettelidentify"));
    });

    $("#register_register").click(function(){
        var username = $("#register_username").val();
        var password = $("#register_password").val();
        var tel = $("#register_tel").val();
        var telidentify = $("#register_telidentify").val();
        var rankpre = $("#register_rankpre").val();
        var captcha = $("#register_captcha").val();
        $.ajax({
            type:"post",
            url:"/tp5/public/index.php/etick/register/register",
            async:true,
            dataType:"json",
            data:{
                username:username,
                password:password,
                tel:tel,
                telidentify:telidentify,
                rankpre:rankpre,
                captcha:captcha
            },
            success:function(data){
                data = JSON.parse(data);
                switch(data.code){
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/login/index");
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error:function(hd, msg){
                $.ShowMsg(msg);
            }
        });
    });
});


//login
$(function(){
    $("#login_login").click(function(){
        var username = $("#login_username").val();
        var passwordmd5 = hex_md5($("#login_password").val());
        var captcha = $("#login_captcha").val();
        $.ajax({
            type:"post",
            url:"/tp5/public/index.php/etick/login/login",
            async:true,
            dataType:"json",
            data:{
                username:username,
                passwordmd5:passwordmd5,
                captcha:captcha
            },
            success:function(data){
                data = JSON.parse(data);
                switch(data.code){
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/match/index");
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error:function(hd, msg){
                $.ShowMsg(msg);
            }
        });
    });
});


//forgetpassword
$(function(){
    $("#forgetpassword_gettelidentify").click(function(){
        var username = $("#forgetpassword_username").val();
        var tel = $("#forgetpassword_tel").val();
        $.ajax({
            type:"post",
            url:"/tp5/public/index.php/etick/forgetpassword/gettelidentify",
            async:true,
            dataType:"json",
            data:{
                username:username,
                tel:tel
            },
            success:function(data){
                data = JSON.parse(data);
                switch(data.code){
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error:function(hd, msg){
                $.ShowMsg(msg);
            }
        });
        sendCode($("#forgetpassword_gettelidentify"));

    });

    $("#forgetpassword_fixpassword").click(function(){
        var captcha = $("#forgetpassword_captcha").val();
        var newpassword = $("#forgetpassword_newpassword").val();
        $.ajax({
            type:"post",
            url:"/tp5/public/index.php/etick/forgetpassword/fixpassword",
            async:true,
            dataType:"json",
            data:{
                captcha:captcha,
                newpassword:newpassword
            },
            success:function(data){
                data = JSON.parse(data);
                switch(data.code){
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/login/index");
                        break;
                    default:
                        $.ShowMsg(data.msg);
                        break;
                }
            },
            error:function(hd, msg){
                $.ShowMsg(msg);
            }
        });
    });
});


//match
function GetAntiwaveFootballMatchCompetitionGuessing(matchid){
    $.ajax({
        type:"get",
        url:"/tp5/public/index.php/etick/match/getantiwavefootballmatchcompetitionguessing",
        async:true,
        dataType:"json",
        data:{
            matchid:matchid
        },
        success:function(data){
            data = JSON.parse(data);
            switch(data.code){
                case 'ERROR_STATUS_SUCCESS':
                    var matchobject = JSON.parse(data.jsoncontent);
                    var html = "";
                    for(var i = 0; i < matchobject.length; ++i){
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
        error:function(hd, msg){
            $.ShowMsg(msg);
        }
    });
}

function BettingCompetitionGuessing(matchid, guessingid){
    //弹出下注框
    var eti = prompt("下注ETI：", ""); //将输入的内容赋给变量 name ，
    //这里需要注意的是，prompt有两个参数，前面是提示的话，后面是当对话框出来后，在对话框里的默认值
    if (!eti){
        return false;
    }
    $.ajax({
        type:"get",
        url:"/tp5/public/index.php/etick/antiwave_football_competition_guessing/bettingcompetitionguessing",
        async:true,
        dataType:"json",
        data:{
            matchid:matchid,
            guessingid:guessingid,
            eti:eti
        },
        success:function(data){
            data = JSON.parse(data);
            switch(data.code){
                case 'ERROR_STATUS_SUCCESS':
                    $.ShowMsg(data.msg);
                    break;
                default:
                    $.ShowMsg(data.msg);
                    break;
            }
        },
        error:function(hd, msg){
            $.ShowMsg(msg);
        }
    });
}

$(function(){
    $.GetAntiwaveFootballMatch = function(){
        $.ajax({
            type:"get",
            url:"/tp5/public/index.php/etick/match/getantiwavefootballmatchlist",
            async:true,
            dataType:"json",
            success:function(data){
                data = JSON.parse(data);
                switch(data.code){
                    case 'ERROR_STATUS_SUCCESS':
                        var matchobject = JSON.parse(data.jsoncontent);
                        var html = "";
                        for(var i = 0; i < matchobject.length; ++i){
                            var match = matchobject[i];
                            html += $.AddAntiwaveFootballMatch(match);
                        }
                        $("#antiwavefootballmatchcontainer").html(html);

                        break;
                    default:
                        break;
                }
            },
            error:function(hd, msg){
                $.ShowMsg(msg);
            }
        });
    };

    //添加反波胆赛事
    $.AddAntiwaveFootballMatch = function(match){
        var html =
            "<div class='panel panel-default' id='antiwavefootballmatchid" + match.id + "' onclick='GetAntiwaveFootballMatchCompetitionGuessing(" + match.id + ")'>" +
                "<div class='panel-heading' >" +
                    "<div class='panel-title' >" +
                        "<div class='row' style='background-color:#ccc'>" +
                            "<a data-toggle='collapse' data-parent='#antiwavefootballmatchcontainer' href='#antiwavefootballmatchcompetitionguessingcollapse" + match.id + "'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12' >" +
                                    "<p>" + match.caption + "</p>" +
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
            "<br />";
        return html;
    };
    //添加反波胆下注赛事
    $.AddAntiwaveFootballMatchCompetitionGuessing = function(competitionGuessing){
        var html =
            "<div class='panel-body' id='antiwavefootballmatchcompetitionguessing" + competitionGuessing.id + "' onclick='BettingCompetitionGuessing(" + competitionGuessing.matchid + ", " + competitionGuessing.id + ")'>" +
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
function MatchRecordDetailInfo(matchtype, matchid, guessingid, ordernumber){
    //获取详细记录
    $.ajax({
        type:"get",
        url:"/tp5/public/index.php/etick/match_record/getbettingrecorddetailinfo",
        async:true,
        dataType:"json",
        data:{
            ordernumber:ordernumber
        },
        success:function(data){
            data = JSON.parse(data);
            switch(data.code){
                case 'ERROR_STATUS_SUCCESS':
                    var recordobject = JSON.parse(data.jsoncontent);
                    var html = "";
                    for(var i = 0; i < recordobject.length; ++i){
                        var recorddetail = recordobject[i];
                        switch(recorddetail.status){
                            case 0: html+= $.AddMatchRecordDetailInfoZero(recorddetail); break;
                            case 1: html+= $.AddMatchRecordDetailInfoOne(recorddetail); break;
                            case 2: html+= $.AddMatchRecordDetailInfoTwo(recorddetail); break;
                            case 3: html+= $.AddMatchRecordDetailInfoThree(recorddetail); break;
                            case 4: html+= $.AddMatchRecordDetailInfoFour(recorddetail); break;
                            case 5: html+= $.AddMatchRecordDetailInfoFive(recorddetail); break;
                            case 6: html+= $.AddMatchRecordDetailInfoSix(recorddetail); break;
                            case 7: html+= $.AddMatchRecordDetailInfoSeven(recorddetail); break;
                            default:break;
                        }
                    }
                    $("#matchrecordcollapse" + matchtype + matchid + guessingid).html(html);
                    break;
                default:
                    break;
            }
        },
        error:function(hd, msg){
            $.ShowMsg(msg);
        }
    });

}

$(function(){
    $.GetMatchRecord = function(){
        $.ajax({
            type:"get",
            url:"/tp5/public/index.php/etick/match_record/getmatchrecord",
            async:true,
            dataType:"json",
            success:function(data){
                data = JSON.parse(data);
                switch(data.code){
                    case 'ERROR_STATUS_SUCCESS':
                        var recordobject = JSON.parse(data.jsoncontent);
                        var html = "";
                        for(var i = 0; i < recordobject.length; ++i){
                            var record = recordobject[i];
                            switch(record.status){
                                case 0: html+= $.AddMatchRecordStatusZero(record); break;
                                case 1: html+= $.AddMatchRecordStatusOne(record); break;
                                case 2: html+= $.AddMatchRecordStatusTwo(record); break;
                                case 3: html+= $.AddMatchRecordStatusThree(record); break;
                                case 4: html+= $.AddMatchRecordStatusFour(record); break;
                                case 5: html+= $.AddMatchRecordStatusFive(record); break;
                                case 6: html+= $.AddMatchRecordStatusSix(record); break;
                                case 7: html+= $.AddMatchRecordStatusSeven(record); break;
                                default:break;
                            }
                        }
                        $("#matchrecordcontainer").html(html);
                        break;
                    default:
                        break;
                }
            },
            error:function(hd, msg){
                $.ShowMsg(msg);
            }
        });
    }

    //未开赛
    $.AddMatchRecordStatusZero = function(record){
        var html =
            "<div class='panel panel-default' id='matchrecord" + record.etickmatchtype + record.matchid + record.guessingid + "' onclick='MatchRecordDetailInfo(" + record.etickmatchtype + "," + record.matchid + "," + record.guessingid + "," + record.ordernumber + ")'>" +
                "<div class='panel-heading' >" +
                    "<div class='panel-title' >" +
                        "<div class='row' style='background-color:#ccc'>" +
                            "<a data-toggle='collapse' data-parent='#matchrecordcontainer' href='#matchrecordcollapse" + record.etickmatchtype + record.matchid + record.guessingid + "'>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
                                    "<p>" + record.etickmatchtypeinfo + "</p>" +
                                "</div>" +
                                "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
                                    "<p>" + record.matchcaption + "</p>" +
                                "</div>" +
                                "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
                                    "<p>下注金额：" + record.bettingeti + "</p>" +
                                "</div>" +
                                "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2' >" +
                                    "<span class='glyphicon glyphicon-chevron-down' id='matchrecordglyphicon" + record.etickmatchtype + record.matchid + record.guessingid + "'></span>" +
                                "</div>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
                                    "<p>结算：未开赛</p>" +
                                "</div>" +
                            "</a>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div id='matchrecordcollapse" + record.etickmatchtype + record.matchid + record.guessingid + "' class='panel-collapse collapse'>" +
                "</div>" +
            "</div>" +
            "<br />";
        return html;
    }
    //比赛延迟
    $.AddMatchRecordStatusOne = function(record){
        var html =
            "<div class='container'>" +

            "</div>";

        return html;
    }
    //比赛取消
    $.AddMatchRecordStatusTwo = function(record){
        var html =
            "<div class='container'>" +

            "</div>";

        return html;
    }
    //已开赛，未结算
    $.AddMatchRecordStatusThree = function(record){
        var html =
            "<div class='container'>" +

            "</div>";

        return html;
    }
    //只进行上半场
    $.AddMatchRecordStatusFour = function(record){
        var html =
            "<div class='container'>" +

            "</div>";

        return html;
    }
    //比赛结束，盈利
    $.AddMatchRecordStatusFive = function(record){
        var html =
            "<div class='container'>" +

            "</div>";

        return html;
    }
    //比赛结束，亏损
    $.AddMatchRecordStatusSix = function(record){
        var html =
            "<div class='container'>" +

            "</div>";

        return html;
    }
    //撤销
    $.AddMatchRecordStatusSeven = function(record){
        var html =
            "<div class='container'>" +

            "</div>";

        return html;
    }

    $.AddMatchRecordDetailInfoZero = function(recorddetail){
        var html =
            "<div class='panel-body' id='matchrecorddetail" + recorddetail.etickmatchtype + recorddetail.matchid + recorddetail.guessingid + "'>" +
                "<a class='' href='#' >" +
                    "<div class='container'>" +
                        "<span>" + recorddetail.bettingtime + "</span>" +
                    "</div>" +
                "</a>" +
            "</div><br />";

        return html;
    }
    $.AddMatchRecordDetailInfoOne = function(recorddetail){

    }
    $.AddMatchRecordDetailInfoTwo = function(recorddetail){

    }
    $.AddMatchRecordDetailInfoThree = function(recorddetail){

    }
    $.AddMatchRecordDetailInfoFour = function(recorddetail){

    }
    $.AddMatchRecordDetailInfoFive = function(recorddetail){

    }
    $.AddMatchRecordDetailInfoSix = function(recorddetail){

    }
    $.AddMatchRecordDetailInfoSeven = function(recorddetail){

    }

});




