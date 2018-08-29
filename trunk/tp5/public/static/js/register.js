//register
$(function () {
    $("#register_gettelidentify").click(function () {
        var tel = $("#register_tel").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/register/gettelidentify",
            async: true,
            dataType: "json",
            data: {
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
        sendCode($("#register_gettelidentify"));
    });

    $("#register_register").click(function () {
        var username = $("#register_username").val();
        var password = $("#register_password").val();
        var tel = $("#register_tel").val();
        var telidentify = $("#register_telidentify").val();
        var rankpre = $("#register_rankpre").val();
        var captcha = $("#register_captcha").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/register/register",
            async: true,
            dataType: "json",
            data: {
                username: username,
                password: password,
                tel: tel,
                telidentify: telidentify,
                rankpre: rankpre,
                captcha: captcha
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

