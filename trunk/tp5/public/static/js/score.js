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
            "<div class='row'>" +
            "<a data-toggle='collapse' data-parent='#" + parent + "' href='#scorerecordcollapse" + orderNumber + "'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
            "<p>" + purchaseCaption + "</p>" +
            "</div>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
            "<p>RMB：ETI " + rmbpereti + " ： 1</p>" +
            "</div>" +
            "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10' >" +
            "<p>购买数量：" + eticount + "</p>" +
            "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2' >" +
            "<span class='glyphicon glyphicon-chevron-down' id='scorerecordglyphicon" + orderNumber + "'></span>" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' >" +
            "<p>挂单状态：" + statusinfo + "</p>" +
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
            "<div>" +
            "<div id='scorerecordbasicinfo" + orderNumber + "'></div>" +
            "</div>" +
            "<div>" +
            "<button class='btn btn-default' id='scorerecordoperator" + orderNumber + "' style='display:none;'></button>" +
            "</div>" +
            "<div>" +
            "<button type='button' class='btn btn-default' id='scorerecordproof" + orderNumber + "' style='display:none;'>上传凭证</button>" +
            "</div>" +
            "<div id='scorerecorduserinfo" + orderNumber + "' style='display:none;'></div>" +
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
            "<div>" +
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
            "<div>" +
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
                            "<div>" +
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
                            "<div>" +
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
    $.BuyEti = function(){
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
    };

    //买入积分列表--挂单卖出列表
    $.GetSalingRecord = function (salingRecord) {
        var html =
            "<div>" +
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
            "<div>" +
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
    $.SaleEti = function(){
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
    };

    //卖出积分列表--挂单买入列表
    $.GetBuyingRecord = function (buyingRecord) {
        var html =
            "<div>" +
            "<a href='#' id='scorebuyingrecordentrustmentpurchase" + buyingRecord.ordernumber + "' style='text-decoration:none;'>" +
            "<div>" +
            "<p>" + buyingRecord.username + "</p>" +
            "<p>RMB：ETI " + buyingRecord.rmbpereti + "： 1</p>" +
            "<p>购买数量：" + buyingRecord.eticount + "</p>" +
            "<p>购买区间" + buyingRecord.mineti + "~" + buyingRecord.maxeti + "</p>" +
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
            "<div>" +
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
