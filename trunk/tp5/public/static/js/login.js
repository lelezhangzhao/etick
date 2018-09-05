//login
$(function () {
    $("#login_login").click(function () {
        var username = $("#login_username").val();
        var password = $("#login_password").val();
        var passwordmd5 = hex_md5(password);
        var captcha = $("#login_captcha").val();
        $.ajax({
            type: "post",
            url: "/tp5/public/index.php/etick/login/login",
            async: true,
            dataType: "json",
            data: {
                username: username,
                passwordmd5: passwordmd5,
                captcha: captcha
            },
            success: function (data) {
                data = JSON.parse(data);
                switch (data.code) {
                    case 'ERROR_STATUS_SUCCESS':
                        //保存username,id
                        SetCookie('username', username);
                        SetCookie('password', password);
                        localStorage.setItem('userid', data.jsoncontent);
                        $.ShowMsg(data.msg);
                        $.OpenNewUrl("/tp5/public/index.php/etick/index/index");
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

