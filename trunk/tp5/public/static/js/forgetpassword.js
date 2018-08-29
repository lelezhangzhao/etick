//forgetpassword
$(function () {
    $("#forgetpassword_gettelidentify").click(function () {
        var username = $("#forgetpassword_username").val();
        var tel = $("#forgetpassword_tel").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/forgetpassword/gettelidentify",
            async: true,
            dataType: "json",
            data: {
                username: username,
                tel: tel
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
        sendCode($("#forgetpassword_gettelidentify"));

    });

    $("#forgetpassword_fixpassword").click(function () {
        var captcha = $("#forgetpassword_captcha").val();
        var newpassword = $("#forgetpassword_newpassword").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/forgetpassword/fixpassword",
            async: true,
            dataType: "json",
            data: {
                captcha: captcha,
                newpassword: newpassword
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/login/index");
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
});
