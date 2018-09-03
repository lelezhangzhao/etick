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
                        if(recordobject.length === 0){
                            $("#matchrecordcontainer").html('当前无记录');
                            return;
                        }
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
        var bettingstatus = record.status;
        var bettingstatusinfo = record.statusinfo;
        var matchstatus = record.matchstatus;
        var matchstatusinfo = record.matchstatusinfo;


        var matchrecordstatus = $.GetMatchRecordStatus(bettingstatus, bettingstatusinfo, matchstatus, matchstatusinfo);

        var html =
            "<div class='panel panel-default' >" +
            "<div class='panel-heading' >" +
            "<div class='panel-title' >" +
            "<div class='row' >" +
            "<a data-toggle='collapse' data-parent='#matchrecordcontainer' href='#matchrecordcollapse" + ordernumber + "' style='text-decoration:none;'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 match-div' >" +
            "<p>" + etickmatchtypeinfo + "</p>" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 match-div' >" +
            "<p>" + matchcaption + "</p>" +
            "</div>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10 match-div' >" +
            "<p>下注金额：" + bettingeti + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2 ' >" +
            "<span class='glyphicon glyphicon-chevron-down' id='matchrecordglyphicon" + ordernumber + "'></span>" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 match-div' >" +
            matchrecordstatus +
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

    $.GetMatchRecordStatus = function(bettingstatus, bettingstatusinfo, matchstatus, matchstatusinfo){
        var html = "";
        if(bettingstatus === 1 || bettingstatus === 2){ //已结算、撤单
            html = bettingstatusinfo;
        }else if(bettingstatus === 0){ //未结算
            html = matchstatusinfo;
        }
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
        var bettingstatus = recorddetail.status;
        var bettingrevertstatus = recorddetail.revertstatus;


        //是否显示button，及button内容
        var displaystatus = "";
        var displaycontent = "";

        //matchstatus
        /*
         比赛状态：
         0 未开赛
         1 已开赛
         2 比赛推迟
         3 比赛取消
         4 结算成功
         */
        
        //bettingstatus
        /*
         注单状态
         0 未结算
         1 已结算
         2 撤单  --正常撤销
         3 撤单  --比赛推迟撤销
         */
        if(bettingstatus === 0){ //未结算
            if(matchstatus === 0){ //未开赛
                var now = new Date();
                var bettingDiffMinutes = GetDiffMinutes(new Date(bettingtime), now);
                //开赛前，并且下注五分钟内可撤销
                if (now < new Date(matchtime) && bettingDiffMinutes >= 0 && bettingDiffMinutes <= 5) {
                    displaystatus = "";
                    displaycontent = "撤销";
                }else {
                    displaystatus = "none";
                }
            }else if(matchstatus === 2){ //比赛推迟
                displaystatus = "";
                displaycontent = "撤销";
            }
        }else{
            displaystatus = "none";
        }


        /*
         0x01 下注
         0x02 比赛
         0x04 取消
         0x08 撤销
         0x10 结算
         */
        var matchrecordtimescontent = "";

        if(bettingstatus === 2){ //撤销
            matchrecordtimescontent = $.AddBettingTimeInfo(0x01 | 0x02 | 0x08, recorddetail)
        }else if(matchstatus === 0 || matchstatus === 1 || matchstatus === 2){ //未开赛，已开赛，推迟
            matchrecordtimescontent = $.AddBettingTimeInfo(0x01 | 0x02, recorddetail)
        }else if(matchstatus === 3){ //取消
            matchrecordtimescontent = $.AddBettingTimeInfo(0x01 | 0x02 | 0x04, recorddetail)
        }else if(matchstatus === 4){ //结算
            matchrecordtimescontent = $.AddBettingTimeInfo(0x01 | 0x02 | 0x10, recorddetail)
        }


        // //结算
        // if (matchstatus === 0 || matchstatus === 1 || matchstatus === 2) { //未开赛，已开赛，比赛推迟
        //     matchrecordtimescontent = "<span>比赛时间：" + matchtime + "</span>";
        // } else if (matchstatus === 3) { //比赛取消
        //     matchrecordtimescontent = "<span>取消时间：" + canceltime + "</span>";
        // } else if (bettingstatus === 4) { //结算成功
        //     matchrecordtimescontent = "<div>比赛时间：" + matchtime + "</div><div>结算时间：" + balancetime + "</div>";
        // }

        var matchrecordresult = "";

        if(matchstatus === 4){ //比赛结束，显示比分
            matchrecordresult = $.AddMatchRecordResult(recorddetail);
        }

        var html =
            "<div class='panel-body' >" +
            "<div class='match-info-div'>" +
            "<span>订单号：" + ordernumber + "</span>" +
            "</div>" +
            "<div class='match-info-div'>" +
            matchrecordresult +
            "<span>下注类型：" + guessingcaption + "</span>" +
            "</div>" +
            "<div class='match-info-div'>" +
            "<div class='row'>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10'>" +
            "<span>赔率：" + parseFloat(theodds) * 100  + "%</span>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>" +
            "<button type='button' class='btn btn-default btn-xs' id='matchrecordrevert" + ordernumber + "'>" + displaycontent + "</button>" +
            "</div>" +
            "</div>" +
            "</div>" +


            //比赛时间
            //撤销时间
            //结算时间
            "<div id='matchrecordtimes" + ordernumber + "'>" +
            // "<span>比赛时间：" + matchtime + "</span>" +
            "</div>" +
            "</div>" +
            "<script>" +
            "$(function(){" +
            "$('#matchrecordrevert" + ordernumber + "').click(function(){" +
            "$.MatchRecordRevert('" + ordernumber.toString() + "');" +
            "});" +
            "$('#matchrecordrevert" + ordernumber + "').css('display', '" + displaystatus + "');" +
            "$('#matchrecordtimes" + ordernumber + "').html('" + matchrecordtimescontent + "');" +
            "});" +
            "</script>" +
            "<br />";

        return html;
    }

    $.AddMatchRecordResult = function(recorddetail){
        var score = recorddetail.score;
        var firsthalfscore = recorddetail.firsthalfscore;
        var angle = recorddetail.angle;
        var total = recorddetail.total;


        var html =
            "<div class='match-info-div'>" +
            "<span>角球：" + angle + "</span>" +
            "</div>" +
            "<div class='match-info-div'>" +
            "<span>全场比分：" + score + "</span>" +
            "</div>" +
            "<div class='match-info-div'>" +
            "<span>上半场比分：" + firsthalfscore + "</span>" +
            "</div>";

        return html;
    }

    //增加比赛时间信息
    $.AddBettingTimeInfo = function(status, recorddetail){
        /*
        0x01 下注
        0x02 比赛
        0x04 取消
        0x08 撤销
        0x10 结算
         */
        var html = "";
        if(status & 0x01){
            html += '<div class="match-info-div">下注时间：' + recorddetail.bettingtime + '</div>';
        }
        if(status & 0x02){
            html += '<div class="match-info-div">比赛时间：' + recorddetail.matchtime + '</div>';
        }
        if(status & 0x04){
            html += '<div class="match-info-div">取消时间：' + recorddetail.canceltime + '</div>';
        }
        if(status & 0x08){
            html += '<div class="match-info-div">撤销时间：' + recorddetail.reverttime + '</div>';
        }
        if(status & 0x10){
            html += '<div class="match-info-div">结算时间：' + recorddetail.balancetime + '</div>';
        }

        return html;
    }

    $.MatchRecordRevert = function(ordernumber) {
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

});
