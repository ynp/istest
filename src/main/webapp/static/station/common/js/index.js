$(function(){
	init();
	getMenuData();
})

//初始化
function init(){
	//注销
	$('#SubBtn').click(function(){
		swal({
				title : "您确定要退出吗?",
				type : "warning",
				showCancelButton : true,
				confirmButtonColor : "#DD6B55",
				cancelButtonText:"取消",
				confirmButtonText : "是的，退出",
				closeOnConfirm : false
				}, function() {
					$.ajax({
				        type: "POST",
				        url: 'logout',
				        async:false,
				        success: function(data){
				        	window.location.href='login';
				        }
				    });
			});
	})
	
}

//获取menu数据
function getMenuData(){
	$.ajax({
        type: "POST",
        url: "resource/tree",
        dataType: "json", 
        success: function(result) {
        	var menuData1 = [];
        	var menuData2 = [];
        	
        	if(result.length > 0){
        		for(var i=0;i<result.length;i++){
        			var tmpMenu1 = {};
        			tmpMenu1.id = result[i].id;
        			tmpMenu1.name = result[i].text;
        			tmpMenu1.url = result[i].attributes;
        			tmpMenu1.icon = result[i].iconCls;
        			tmpMenu1.pid = result[i].pid;
        			tmpMenu1.seq = result[i].seq;
        			menuData1.push(tmpMenu1);
        			var tmpChildren = result[i].children;
        			for(var j=0;j<tmpChildren.length;j++){
        				var tmpMenu2 = {};
        				tmpMenu2.id = tmpChildren[j].id;
        				tmpMenu2.name = tmpChildren[j].text;
        				tmpMenu2.url = tmpChildren[j].attributes;
            			tmpMenu2.icon = tmpChildren[j].iconCls;
            			tmpMenu2.pid = tmpChildren[j].pid;
            			tmpMenu2.seq = tmpChildren[j].seq;
            			menuData2.push(tmpMenu2);
        			}
        		}
        	}
        	
        	var compare = function (obj1, obj2) {
        	    var val1 = obj1.seq;
        	    var val2 = obj2.seq;
        	    if (val1 < val2) {
        	        return -1;
        	    } else if (val1 > val2) {
        	        return 1;
        	    } else {
        	        return 0;
        	    }            
        	} 
        	
        	menuData1 = menuData1.sort(compare);
        	menuData2 = menuData2.sort(compare);
        	
        	buildMenu(menuData1,menuData2);
        }
    });
}

//动态构建菜单
function buildMenu(menuData1,menuData2){
	//首页链接obj
	var indexUrlObj = null;
	var menu = $(".sidebar-menu").eq(0);
	menu.empty();
	
	//构建一级菜单
	for(var i=0;i<menuData1.length;i++){
		var liStr = '<li id="menu_'+ menuData1[i].id + '"';
		if(menuData1[i].url != '#'){
			liStr += ' onclick="setOneMenuNav(this);"><a href=' + menuData1[i].url +' target="iframepage" ';
			if(menuData1[i].url.indexOf("Index") != -1)
				indexUrlObj = menuData1[i];
//				$("#iframepage").attr("src", menuData1[i].url);
		}else{
			liStr += '><a href=' + '"#"';
		}
		
		liStr += '><i class="' + menuData1[i].icon +'"></i> <span>'+ menuData1[i].name +'</span></a></li>';
		menu.append(liStr);
	}
		
		//构建二级菜单
	for(var i=0;i<menuData2.length;i++){			
		if(!menuData2[i].pid)
			continue;
		var pMenu = $("#menu_" + menuData2[i].pid);
		
		if(!pMenu.attr("class"))
			pMenu.addClass("treeview");
		
		//添加一级菜单展开折叠状态图标（是否存在二级菜单）
		if(pMenu.find("span.pull-right-container").length == 0){
			pMenu.children("a").eq(0).append('<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>');
		}
		
		//添加二级菜单列表
		if(pMenu.find("ul.treeview-menu").length == 0){
			pMenu.append('<ul class="treeview-menu"></ul>');
		}
		
		var icon = "fa fa-circle-o";
		if(menuData2[i].icon)
			icon = menuData2[i].icon;
			
		//添加二级菜单
		pMenu.find("ul.treeview-menu").append('<li><a href="'+ menuData2[i].url +'" target="iframepage"><i class="' + icon + '"> ' + menuData2[i].name + '</i></a></li>');
	} 
	
	//设置二级菜单导航
	$(".treeview-menu").children("li").attr("onclick","setTwoMenuNav(this);");
	
	//设置初始化显示内容为第一个菜单为显示内容页
	if(indexUrlObj  == null){
		indexUrlObj = menuData2[0];
		var nav = $(".breadcrumb").eq(0); 
		nav.empty();
		nav.append('<li><span class="glyphicon glyphicon-play"></span>当前位置: <i class="fa fa-dashboard"></i>' + menuData1[0].name + ">" + menuData2[0].name + '</li>');
	}else{
		var firstMenu="#menu_"+indexUrlObj.id;
		setOneMenuNav(firstMenu);
	}
	$("#iframepage").attr("src", indexUrlObj.url);
	
	//若是当前页面阻止再次跳转
	checkUrl();
}

//设置首页菜单导航
function setOneMenuNav(ulObj){
	var oneMenuName = $(ulObj).find("span").eq(0).text();
	var nav = $(".breadcrumb").eq(0); 
	nav.empty();
	nav.append('<li><span class="glyphicon glyphicon-play"></span>当前位置: <i class="fa fa-dashboard"></i>' + oneMenuName + '</li>');
}

//设置二级菜单导航
function setTwoMenuNav(liObj){
	var oneMenuName = $(liObj).parent().siblings().children("span").eq(0).text();
	var twoMenuName = $.trim(liObj.textContent);
	
	var nav = $(".breadcrumb").eq(0); 
	nav.empty();
	nav.append('<li><span class="glyphicon glyphicon-play"></span>当前位置: <i class="fa fa-dashboard"></i>' + oneMenuName + '</li>');
	nav.append('<li class="active">' + twoMenuName + '</li>');
}

//若是当前页面阻止再次跳转
var menu = "";
function checkUrl(){
	$("a[target]").click(function(event){
		if(event.target.innerText == menu){
			event.preventDefault(); 
			event.stopPropagation(); 
		}
		menu = event.target.innerText;
	}) 
}