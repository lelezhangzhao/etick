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
