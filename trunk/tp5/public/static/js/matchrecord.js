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
        var bettingstatus = recorddetail.status;


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

        if(matchstatus === 0 && bettingstatus === 0){ //未开赛,未撤单
            var now = new Date();
            var bettingDiffMinutes = GetDiffMinutes(new Date(bettingtime), now);
            //开赛前，并且下注五分钟内可撤销
            if (now < new Date(matchtime) && bettingDiffMinutes >= 0 && bettingDiffMinutes <= 5) {
                displaystatus = "";
                displaycontent = "撤销";
            } else {
                displaystatus = "none";
            }
        }
        switch (bettingstatus) {
            case 0: //未结算
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
            case 1: //已结算
            case 3: //撤单
            case 4: //比赛取消
                displaystatus = "none";
                break;
            case 2:
                displaystatus = "";
                displaycontent = "撤销";
                break;
            default:
                return;
                break;
        }


        var matchrecordtimescontent = "";
        if (bettingstatus === 0 || bettingstatus === 2) {
            matchrecordtimescontent = "<span>比赛时间：" + matchtime + "</span>";
        } else if (bettingrecordstatus === 4) {
            matchrecordtimescontent = "<span>取消时间：" + canceltime + "</span>";
        } else if (bettingrecordstatus === 1) {
            matchrecordtimescontent = "<div>比赛时间：" + matchtime + "</div><div>结算时间：" + balancetime + "</div>";
        } else if (bettingrecordstatus === 3) {
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
            "<button type='button' class='btn btn-default' id='matchrecordrevert" + ordernumber + "'>" + displaycontent + "</button>" +
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
