$(function(){
	// 如果低于指定版本的浏览器，则将其跳转到浏览器下载界面
	if(checkBrowserVersion()){
		window.location.href = "browser";
	} else {
		sessionOutHandler();
		initLogin();
	}
})

// 检查当前浏览器的版本，如果低于指定版本，则返回ture
function checkBrowserVersion(){
	// 是否为低版本浏览器标志位
	var flag = false;
	
	// 检查浏览器功能的开关
    $.ajax({
        type: "GET",
        url: "onCheckBrowser",
        dataType: "json",
        async: false,
        success: function(data){
           if (!data.success){// flase为关闭
               flag = true;
           }
        }
    });
    if (flag){// 关闭检验浏览器版本
        return false;
    }
	
	// 获取浏览器的信息数组
	var browserVersion = BroswerUtil.getBrowserVersion();
	var browserName = browserVersion[0];
	var version = parseInt(browserVersion[1].substring(0,browserVersion[1].indexOf(".")));
	
	// 设置低版本浏览器标志位
	if((browserName == "chrome" && version < 31) || (browserName == "firefox" && version <= 50)  || (browserName == "IE" && version <= 50)){
		flag = true;
	}
	return flag;
}

//
function sessionOutHandler(){
	var parentUrl = parent.location;
	// session过期调整到登录页
	if(parentUrl.pathname.indexOf("index") != -1){
		parent.location.reload();
	}
}

function initLogin(){
	$("#submit").click(loginHandler);
	
	$("body").eq(0).keydown(function(event){
	    if (event.keyCode == 13){
	        event.returnValue=false;
	        event.cancel = true;
	        loginHandler();
	    }
	})
}

function loginHandler(){
	if(!$.trim($("#username").val())){
		$("#pmsg").html("<font color='red'>用户名不能为空</font>");
		return
	}
	
	if(!$.trim($("#password").val())){
		$("#pmsg").html("<font color='red'>密码不能为空</font>");
		return
	}
	
	$.ajax({
        type: "POST",
        url: "login",
        data:$("#loginform").serialize(),
        dataType: "json", 
        success: function(result) {
        	if(result.success){
        		window.location.href = 'index';
        	} else {
        		$("#pmsg").html("<font color='red'>用户名或者密码错误</font>");
        	}
        }
    });
}

