//match
function GetAntiwaveFootballMatchCompetitionGuessing(matchid) {
    var html =
        "<div class='panel-body'>" +
        "<div>" +
        "<table class='table table-hover table-striped'>" +
        "<caption class='text-center'>全场</caption>" +
        "<thead>" +
        "<tr>" +
        "<th>竞猜</th>" +
        "<th>波胆</th>" +
        "<th>赔率</th>" +
        "<th>额度</th>" +
        "<th>操作</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='antiwavefootballcompetitionguessinghole" + matchid + "'>" +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "<div>" +
        "<table class='table table-hover table-striped'>" +
        "<caption class='text-center'>半场</caption>" +
        "<thead>" +
        "<tr>" +
        "<th>竞猜</th>" +
        "<th>波胆</th>" +
        "<th>赔率</th>" +
        "<th>额度</th>" +
        "<th>操作</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='antiwavefootballcompetitionguessinghalf" + matchid + "'>" +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "<div>" +
        "<table class='table table-hover table-striped'>" +
        "<caption class='text-center'>角球</caption>" +
        "<thead>" +
        "<tr>" +
        "<th>竞猜</th>" +
        "<th>角球</th>" +
        "<th>赔率</th>" +
        "<th>额度</th>" +
        "<th>操作</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='antiwavefootballcompetitionguessingangle" + matchid + "'>" +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "<div>" +
        "<table class='table table-hover table-striped'>" +
        "<caption class='text-center'>总进球</caption>" +
        "<thead>" +
        "<tr>" +
        "<th>竞猜</th>" +
        "<th>进球</th>" +
        "<th>赔率</th>" +
        "<th>额度</th>" +
        "<th>操作</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='antiwavefootballcompetitionguessingtotal" + matchid + "'>" +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>";

    $("#antiwavefootballmatchcompetitionguessingcollapse" + matchid).html(html);



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
                    var htmlhole = "";
                    var htmlhalf = "";
                    var htmlangle = "";
                    var htmltotal = "";
                    for (var i = 0; i < matchobject.length; ++i) {
                        var match = matchobject[i];
                        if(match.type === 0){
                            htmlhole += $.AddAntiwaveFootballMatchCompetitionGuessing(match);
                        }else if(match.type === 1){
                            htmlhalf += $.AddAntiwaveFootballMatchCompetitionGuessing(match);
                        }else if(match.type === 2){
                            htmlangle += $.AddAntiwaveFootballMatchCompetitionGuessing(match);
                        }else if(match.type === 3){
                            htmltotal += $.AddAntiwaveFootballMatchCompetitionGuessing(match);
                        }
                    }
                    $("#antiwavefootballcompetitionguessinghole" + matchid).html(htmlhole);
                    $("#antiwavefootballcompetitionguessinghalf" + matchid).html(htmlhalf);
                    $("#antiwavefootballcompetitionguessingangle" + matchid).html(htmlangle);
                    $("#antiwavefootballcompetitionguessingtotal" + matchid).html(htmltotal);
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

            "<div class='row'>" +

            "<a data-toggle='collapse' data-parent='#antiwavefootballmatchcontainer' href='#antiwavefootballmatchcompetitionguessingcollapse" + match.id + "'>" +

            "<div class='col-xs-12 col-sm-12 col-md-12 match-div' >" +
            "<span class='match-caption-info'>" + match.caption + "</span>" +
            "</div>" +

            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 match-div' >" +
            "<div class='row'>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10'>" +
            "<p class='match-caption-info'>" + match.hostcaption + "  VS  " + match.guestcaption + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>" +
            "<span class='glyphicon glyphicon-chevron-down' id='antiwavefootballmatchglyphicon" + match.id + "'></span>" +
            "</div>" +
            "</div>" +
            "</div>" +

            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 match-div' >" +
            "<span class='match-caption'>比赛时间：</span>" +
            "<span class='match-caption-info'>" + new Date(match.matchtime).Format("MM/dd hh:mm") + "</span>" +
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
            "<tr>" +
            "<td>" + competitionGuessing.caption + "</td>" +
            "<td>" + competitionGuessing.score + "</td>" +
            "<td>" + competitionGuessing.theodds * 100 + "%</td>" +
            "<td>" + competitionGuessing.remaineti + "</td>" +
            "<td><button class='btn btn-default' onclick='BettingCompetitionGuessing(" + competitionGuessing.matchid + ", " + competitionGuessing.id + ")'>下注</button></td>" +
            "</tr>";

        return html;
    };

});
