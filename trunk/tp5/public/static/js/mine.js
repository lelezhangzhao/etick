//mine
$(function () {
    $.FixPassword = function(){
        html =
            "<div class='div-border'>" +
            "<div class='row'>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 div-single-line'>" +
            "修改密码" +
            "</div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 div-single-line'>" +
            "<span class='input-group-addon'><i class='fa fa-lock fa-fw'></i></span>" +
            "<input type='text' class='input-text-100' placeholder='原密码' id='fixpassword_oldpassword'/>" +
            "</div>" +
            "</div>" +
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

    };

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

    $.AccountInfo = function () {
        html =
            "<div>" +
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
    };


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

    $.Logout = function () {
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
    };
});

