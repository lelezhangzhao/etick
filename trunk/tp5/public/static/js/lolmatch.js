$(function(){
    $.GetLolMatch = function() {
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/match/getantiwavelolmatchlist",
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
                            html += $.AddAntiwaveLolMatch(match);
                        }
                        $("#antiwavelolmatchcontainer").html(html);

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

    $.GetAntiwaveLolMatch = function() {
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/match/getantiwavelolmatchlist",
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
                            html += $.AddAntiwaveLolMatch(match);
                        }
                        $("#antiwavelolmatchcontainer").html(html);

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

    $.AddAntiwaveLolMatch = function(match){
        var matchid = match.id;
        var caption = match.caption;
        var hostcaption = match.hostcaption;
        var guestcaption = match.guestcaption;
        var matchtime = match.matchtime;
        var html =
            "<div class='panel panel-default' >" +
            "<div class='panel-heading' >" +

            "<div class='panel-title' >" +

            "<div class='row'>" +

            "<a data-toggle='collapse' data-parent='#antiwavelolmatchcontainer' href='#antiwavelolmatchcompetitionguessingcollapse" + matchid + "'>" +

            "<div class='col-xs-12 col-sm-12 col-md-12 match-div' >" +
            "<span class='match-caption-info'>" +caption + "</span>" +
            "</div>" +

            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 match-div' >" +
            "<div class='row'>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10'>" +
            "<p class='match-caption-info'>" + hostcaption + "  VS  " + guestcaption + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>" +
            "<span class='glyphicon glyphicon-chevron-down' id='antiwavelolmatchglyphicon" + matchid + "'></span>" +
            "</div>" +
            "</div>" +
            "</div>" +

            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 match-div' >" +
            "<span class='match-caption'>比赛时间：</span>" +
            "<span class='match-caption-info'>" + new Date(matchtime).Format("MM/dd hh:mm") + "</span>" +
            "</div>" +

            "</a>" +


            "</div>" +

            "</div>" +

            "</div>" +
            "<div id='antiwavelolmatchcompetitionguessingcollapse" + matchid + "' class='panel-collapse collapse'>" +
            "</div>" +
            "</div>" +
            "<script tepe='text/javascript'>" +
            "$(function () {" +
            "var antiwavelolmatchcompetitionguessingcollapse = $('#antiwavelolmatchcompetitionguessingcollapse" + matchid + "');" +
            "antiwavelolmatchcompetitionguessingcollapse.on('show.bs.collapse', function () {" +
            "$.GetAntiwaveLolMatchCompetitionGuessing('" + matchid + "');" +
            "});" +
            "antiwavelolmatchcompetitionguessingcollapse.on('shown.bs.collapse', function () {" +
            "$('#antiwavelolmatchglyphicon" + matchid + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "antiwavelolmatchcompetitionguessingcollapse.on('hidden.bs.collapse', function () {" +
            "$('#antiwavelolmatchglyphicon" + matchid + "').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');" +
            "});" +
            "});" +
            "</script>" +

            "<br />";
        return html;
    }

    $.GetAntiwaveLolMatchCompetitionGuessing = function(matchid){
        var html =
            "<div class='panel-body'>" +
            "<div>" +
            "<table class='table table-hover table-striped'>" +
            "<caption class='text-center'></caption>" +
            "<thead>" +
            "<tr>" +
            "<th>竞猜</th>" +
            "<th>积分</th>" +
            "<th>赔率</th>" +
            "<th>额度</th>" +
            "<th>操作</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='antiwavelolcompetitionguessing" + matchid + "'>" +
            "</tbody>" +
            "</table>" +
            "</div>" +
            "</div>";

        $("#antiwavelolmatchcompetitionguessingcollapse" + matchid).html(html);



        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/match/getantiwavelolmatchcompetitionguessing",
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
                            html += $.AddantiwavelolMatchCompetitionGuessing(match);
                        }
                        $("#antiwavelolcompetitionguessing" + matchid).html(html);

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

    $.AddantiwavelolMatchCompetitionGuessing = function(competitionGuessing){
        var html =
            "<tr>" +
            "<td>" + competitionGuessing.caption + "</td>" +
            "<td>" + competitionGuessing.score + "</td>" +
            "<td>" + competitionGuessing.theodds * 100 + "%</td>" +
            "<td>" + competitionGuessing.remaineti + "</td>" +
            "<td><button class='btn btn-default' id='bettingantiwavelolcompeititonguessing" + competitionGuessing.matchid + competitionGuessing.id + "'>下注</button></td>" +
            "</tr>" +
            "<script>" +
            "$.('#bettingantiwavelolcompeititonguessing" + competitionGuessing.matchid + competitionGuessing.id +"').click(function(){" +
            "$.BettingAntiwaveLolCompetitionGuessing(" + competitionGuessing.matchid + ", " + competitionGuessing.id + ")" +
            "});"
        "</script>";

        return html;

    }

    $.BettingAntiwavelolCompetitionGuessing = function(){
        //弹出下注框
        var eti = prompt("下注ETI：", ""); //将输入的内容赋给变量 name ，
        //这里需要注意的是，prompt有两个参数，前面是提示的话，后面是当对话框出来后，在对话框里的默认值
        if (!eti) {
            return false;
        }
        $.ajax({
            type: "get",
            url: "/tp5/public/index.php/etick/antiwave_lol_competition_guessing/bettingcompetitionguessing",
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



});
