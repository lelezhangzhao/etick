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

function BettingCompetitionGuessing(matchid, guessingtype, guessingid){
    $.ajax({
        type:"get",
        url:"/tp5/public/index.php/etick/antiwave_football_competition_guessing/bettingcompetitionguessing",
        async:true,
        dataType:"json",
        data:{
            matchid:matchid,
            guessingtype:guessingtype,
            guessingid:guessingid,
            eti:100
        },
        success:function(data){
            data = JSON.parse(data);
            switch(data.code){
                case 'ERROR_STATUS_SUCCESS':
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
                                    "<p>" + match.footballmatchteamhostid + "</p>" +
                                "</div>" +
                                "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2' >" +
                                    "<p>VS</p>" +
                                "</div>" +
                                "<div class='col-xs-5 col-sm-5 col-md-5 col-lg-5' >" +
                                    "<p>" + match.footballmatchteamguestid + "</p>" +
                                "</div>" +
                                "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
                                    "<p>" + match.matchtime + "</p>" +
                                "</div>" +
                            "</a>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div id='antiwavefootballmatchcompetitionguessingcollapse" + match.id + "' class='panel-collapse collapse'>" +
                    // "<div id='antiwavefootballmatchcompetitionguessingcontainer" + match.id + "' class='panel-body'>" +
                    // "</div>" +
                "</div>" +
            "</div>" +
            "<br />";
        return html;
    };
    //添加反波胆下注赛事
    $.AddAntiwaveFootballMatchCompetitionGuessing = function(competitionGuessing){
        var html =
            "<div class='panel-body' id='antiwavefootballmatchcompetitionguessing" + competitionGuessing.id + "'>" +
                "<a class='' href='#' onclick='BettingCompetitionGuessing(" + competitionGuessing.antiwavefootballmatchid + ", 0, " + competitionGuessing.id + ")'>" +
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


