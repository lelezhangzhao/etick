var clock = "";
var nums = 60;
var btn;

function sendCode(thisBtn) {
    btn = thisBtn;
    btn.disabled = "disabled"; //将按钮置为不可点击
    btn.innerHTML = nums + '秒后可重新获取';
    clock = setInterval(doLoop, 1000); //一秒执行一次
}
function doLoop() {
    nums--;
    if (nums > 0) {
        btn.innerHTML = nums + '秒后可重新获取';
    } else {
        clearInterval(clock); //清除js定时器
        btn.disabled = "";
        btn.innerHTML = '点击发送验证码';
        nums = 60; //重置时间
    }
}

Date.prototype.Format = function(fmt) {
    var o = {
        "M+" : this.getMonth() + 1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth() + 3) / 3),
        "S" : this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function SetCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
function GetCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}


function GetUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function IsPhoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

function GetDiffMinutes(date1, date2) {
    var difftime = date2.getTime() - date1.getTime();   //时间差的毫秒数
    //计算相差分钟数
    var micro = difftime % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(micro / (60 * 1000));
    return minutes;
}


$(function () {
    $.ShowMsg = function (msg) {
        // alert(msg);
        layui.use("layer", function () {
            layer.msg(msg);
        });
    };

    $.OpenNewUrl = function (url) {
        window.location.href = url;
    };


});













