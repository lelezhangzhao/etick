//发布赛事
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
                "<input type='text' id='admin_publish_antiwave_football_hole_theodds_" + scoreHole[i] +"' value='0.05' />" +
                "<input type='text' id='admin_publish_antiwave_football_hole_totaleti_" + scoreHole[i] + "' value='400000' />" +
                "<input type='text' id='admin_publish_antiwave_football_hole_frozeneti_" + scoreHole[i] + "' value='0' />" +
                "</div>";
        }
        html += "<div><h4>上半场</h4></div>";
        for(var i = 0; i < scoreHalf.length; ++i){
            html +=
                "<div>" +
                scoreHalf[i] +
                "</div>" +
                "<div>" +
                "<input type='text' id='admin_publish_antiwave_football_half_theodds_" + scoreHalf[i] +"' value='0.05' />" +
                "<input type='text' id='admin_publish_antiwave_football_half_totaleti_" + scoreHalf[i] + "' value='400000' />" +
                "<input type='text' id='admin_publish_antiwave_football_half_frozeneti_" + scoreHalf[i] + "' value='0' />" +
                "</div>";
        }
        html += "<div><h4>角球</h4></div>";
        for(var i = 0; i < scoreAngle.length; ++i){
            html +=
                "<div>" +
                scoreAngle[i] +
                "</div>" +
                "<div>" +
                "<input type='text' id='admin_publish_antiwave_football_angle_theodds_" + scoreAngle[i] +"' value='0.05' />" +
                "<input type='text' id='admin_publish_antiwave_football_angle_totaleti_" + scoreAngle[i] + "' value='400000' />" +
                "<input type='text' id='admin_publish_antiwave_football_angle_frozeneti_" + scoreAngle[i] + "' value='0' />" +
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
                    "<input type='text' id='admin_publish_lol_match_3_score_theodds_" + match_3[i] + "' value='0.05' />" +
                    "<input type='text' id='admin_publish_lol_match_3_score_totaleti_" + match_3[i] + "' value='400000' />" +
                    "<input type='text' id='admin_publish_lol_match_3_score_frozeneti_" + match_3[i] + "' value='0' />" +
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
                    "<input type='text' id='admin_publish_lol_match_5_score_theodds_" + match_5[i] + "' value='0.05' />" +
                    "<input type='text' id='admin_publish_lol_match_5_score_totaleti_" + match_5[i] + "' value='400000' />" +
                    "<input type='text' id='admin_publish_lol_match_5_score_frozeneti_" + match_5[i] + "' value='0' />" +
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

            var score_hole = [];
            var score_half = [];
            var score_angle = [];

            for(var i = 0; i < scoreHole.length; ++i){
                var one_score_hole = {};
                one_score_hole["score"] = scoreHole[i];
                one_score_hole["theodds"]  = $("#admin_publish_antiwave_football_hole_theodds_" + scoreHole[i]).val();
                one_score_hole["totaleti"]  = $("#admin_publish_antiwave_football_hole_totaleti_" + scoreHole[i]).val();
                one_score_hole["frozeneti"]  = $("#admin_publish_antiwave_football_hole_frozeneti_" + scoreHole[i]).val();
                score_hole.push(one_score_hole);

                // json_score_hole += "\"{\\\"score\\\":\\\"" + scoreHole[i] + "\\\"";
                // json_score_hole += ",";
                // json_score_hole += "\\\"theodds\\\":\\\"" + $("#admin_publish_antiwave_football_hole_" + scoreHole[i]).val() + "\\\"}\"";
                // if(i !== scoreHole.length - 1){
                //     json_score_hole += ",";
                // }
            }
            // json_score_hole += "]";
            var json_score_hole = JSON.stringify(score_hole);



            for(var i = 0; i < scoreHalf.length; ++i){
                var one_score_half = {};
                one_score_half["score"] = scoreHalf[i];
                one_score_half["theodds"]  = $("#admin_publish_antiwave_football_half_theodds_" + scoreHalf[i]).val();
                one_score_half["totaleti"]  = $("#admin_publish_antiwave_football_half_totaleti_" + scoreHalf[i]).val();
                one_score_half["frozeneti"]  = $("#admin_publish_antiwave_football_half_frozeneti_" + scoreHalf[i]).val();
                score_half.push(one_score_half);
            }
            var json_score_half = JSON.stringify(score_half);

            for(var i = 0; i < scoreAngle.length; ++i){
                var one_score_angle = {};
                one_score_angle["score"] = scoreAngle[i];
                one_score_angle["theodds"]  = $("#admin_publish_antiwave_football_angle_theodds_" + scoreAngle[i]).val();
                one_score_angle["totaleti"]  = $("#admin_publish_antiwave_football_angle_totaleti_" + scoreAngle[i]).val();
                one_score_angle["frozeneti"]  = $("#admin_publish_antiwave_football_angle_frozeneti_" + scoreAngle[i]).val();
                score_angle.push(one_score_angle);
            }
            var json_score_angle = JSON.stringify(score_angle);

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

            var score = [];

            if(lolmatchtimes === "3"){
                //英雄联盟3局
                for(var i = 0; i < match_3.length; ++i){
                    var one_score = {};

                    one_score["score"] = match_3[i];
                    one_score["theodds"] = $("#admin_publish_lol_match_3_score_theodds_" + match_3[i]).val();
                    one_score["totaleti"] = $("#admin_publish_lol_match_3_score_totaleti_" + match_3[i]).val();
                    one_score["frozeneti"] = $("#admin_publish_lol_match_3_score_frozeneti_" + match_3[i]).val();
                    score.push(one_score);
                }
            }else if(lolmatchtimes === "5") {
                //英雄联盟5局
                for (var i = 0; i < match_5.length; ++i) {
                    var one_score = {};

                    one_score["score"] = match_5[i];
                    one_score["theodds"] = $("#admin_publish_lol_match_5_score_theodds_" + match_5[i]).val();
                    one_score["totaleti"] = $("#admin_publish_lol_match_5_score_totaleti_" + match_5[i]).val();
                    one_score["frozeneti"] = $("#admin_publish_lol_match_5_score_frozeneti_" + match_5[i]).val();
                    score.push(one_score);

                }
            }

            var json_score = JSON.stringify(score);

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
                    matchtime:matchtime,
                    displaytime:displaytime,
                    disappeartime:disappeartime,
                    score:json_score,
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

//变更比赛
$(function(){
    $("#admin_balance_match").click(function(){

        var html =
            "<div class='container'>" +
            "<form >" +
            "<div class='form-group'>" +
            "<label >赛事类型</label>" +
            "<select class='form-control' id='admin_balance_etick_match_type' ></select>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label >赛事类别</label>" +
            "<select class='form-control' id='admin_balance_match_type' ></select>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label>当前赛事</label>" +
            "<select class='form-control' id='admin_balance_match' ></select>" +
            "</div>" +
            "<div class='form-group'>" +
            "<label>变更类型</label>" +
            "<select class='form-control' id='admin_balance_type' ></select>" +
            "</div>" +
            "<div class='form-group' id='admin_balance_type_info'></div>" +
            "</div>" +
            "<script>" +
            "$('#admin_balance_etick_match_type').change(function(){" +
            "$.AdminBalanceEtickMatchTypeChange();" +
            "$.AdminBalanceMatchTypeChange();" +
            "});" +
            "</script>";
    });

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
                            $("#admin_balance_etick_match_type").append("<option value=" + etickMatchType[i].id + ">" + etickMatchType[i].etickmatchtypeinfo + "</option>");
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


    $.AdminBalanceEtickMatchTypeChange = function(){

    }

    $.AdminBalanceMatchTypeChange = function(){

    }


});