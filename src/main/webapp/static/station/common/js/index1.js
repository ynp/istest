$(function(){
	init();
//	getMenuData();
	buildMenu();
})

//初始化
function init(){
	//注销
	$('#SubBtn').click(function(){
        $.post('logout', function(result) {
            if(result.success){
                window.location.href='login';
            }
        }, 'json');
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
        			menuData1.push(tmpMenu1);
        			var tmpChildren = result[i].children;
        			for(var j=0;j<tmpChildren.length;j++){
        				var tmpMenu2 = {};
        				tmpMenu2.id = tmpChildren[j].id;
        				tmpMenu2.name = tmpChildren[j].text;
        				tmpMenu2.url = tmpChildren[j].attributes;
            			tmpMenu2.icon = tmpChildren[j].iconCls;
            			tmpMenu2.pid = tmpChildren[j].pid;
            			menuData2.push(tmpMenu2);
        			}
        		}
        	}
        	
//        	console.log(menuData1);
//        	console.log(menuData2);
        }
    });
}

//动态构建菜单
function buildMenu(){
	//模拟一级菜单数据
	var menuData1 = [{id:1,name:'首页',url:'static/common/demo/demo_index.html',icon:'fa icon01',pid:0},
	                 {id:2,name:'Demo演示',url:'#',icon:'fa icon03',pid:0},
	                 {id:3,name:'系统设置',url:'#',icon:'fa icon07',pid:0},
	                 {id:4,name:'功率预测',url:'#',icon:'fa icon02',pid:0},
	                 {id:5,name:'数据报表',url:'#',icon:'fa icon04',pid:0},
	                 {id:6,name:'气象信息',url:'#',icon:'fa icon05',pid:0},
	                 {id:7,name:'状态检测',url:'#',icon:'fa icon02',pid:0},
	                 {id:8,name:'统计分析',url:'#',icon:'fa icon06',pid:0},
	                 {id:9,name:'版本信息',url:'static/common/demo/version.html',icon:'fa icon03',pid:0},
	                 {id:10,name:'权限管理',url:'#',icon:'fa icon07',pid:0},
	                ];
	//模拟二级菜单数据(排好序的)
	var menuData2 = [{id:21,name:'demo1',url:'demo/demo1',icon:'fa icon01',pid:2},
	                 {id:22,name:'demo2',url:'demo/demo2',icon:'fa fa-circle-o',pid:2},
					 {id:22,name:'demo3(单页面)',url:'demo/demo3',icon:'fa fa-circle-o',pid:2},
					 {id:22,name:'demo4(页面切换)',url:'http://baidu.com',icon:'fa fa-circle-o',pid:2},
					
					 {id:22,name:'风场设置',url:'farminfo/turnjsp',icon:'fa fa-circle-o',pid:3},
					 {id:22,name:'预测设置',url:'farminfo/forecastset',icon:'fa fa-circle-o',pid:3},
					 {id:22,name:'限电设置',url:'limitPower/turnjsp',icon:'fa fa-circle-o',pid:3},
					 {id:22,name:'机组设置',url:'equipmentInfo/turnjsp',icon:'fa fa-circle-o',pid:3},
					 {id:22,name:'测风塔设置',url:'collectionInfo/turnjsp',icon:'fa fa-circle-o',pid:3},
					 {id:22,name:'计划开机容量设置',url:'farmcap/turnjsp',icon:'fa fa-circle-o',pid:3},
					 {id:22,name:'机组型号设置',url:'equipmentType/turnjsp',icon:'fa fa-circle-o',pid:3},
					 
					 {id:22,name:'短期预测',url:'forecast/forecast',icon:'fa fa-circle-o',pid:4},
					 {id:22,name:'超短期预测',url:'sforecast/sforecast',icon:'fa fa-circle-o',pid:4},

					 {id:22,name:'短期预测日报',url:'dayReport/dayReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'短期预测月报',url:'monReport/monReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'短期预测年报',url:'yearReport/yearReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'超短期预测日报',url:'sdayReport/sdayReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'超短期预测月报',url:'smonReport/smonReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'超短期预测年报',url:'syearReport/syearReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'电场累计日报',url:'farmAccumReport/fdayReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'电场累计月报',url:'farmAccumReport/fmonReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'电场累计年报',url:'farmAccumReport/fyearReport',icon:'fa fa-circle-o',pid:5},
					 {id:22,name:'实发预测功率日报',url:'otherReport/realfcstreport',icon:'fa fa-circle-o',pid:5},
					 
					 {id:22,name:'风速',url:'weather/windSpeed',icon:'fa fa-circle-o',pid:6},
					 {id:22,name:'风向',url:'weather/windDirection',icon:'fa fa-circle-o',pid:6},
					 {id:22,name:'温度',url:'weather/temperature',icon:'fa fa-circle-o',pid:6},
					 {id:22,name:'湿度',url:'weather/humidity',icon:'fa fa-circle-o',pid:6},
					 {id:22,name:'压力',url:'weather/pressure',icon:'fa fa-circle-o',pid:6},
					 
					 {id:22,name:'系统状态',url:'service/turnjsp',icon:'fa fa-circle-o',pid:7},
					 {id:22,name:'风机状态',url:'equipmentInfo/equipmentInfoState',icon:'fa fa-circle-o',pid:7},
					 
					 {id:22,name:'事件查询',url:'eventlog/turnjsp',icon:'fa fa-circle-o',pid:8},
					 {id:22,name:'完整性统计',url:'integrity/turnjsp',icon:'fa fa-circle-o',pid:8},
					 {id:22,name:'功率误差统计',url:'analysis/powerErrorStatics',icon:'fa fa-circle-o',pid:8},
					 {id:22,name:'风速误差统计',url:'analysis/windSpeedErrorStatics',icon:'fa fa-circle-o',pid:8},
					 {id:22,name:'上传率统计',url:'analysis/uploadStatics',icon:'fa fa-circle-o',pid:8},
					 {id:22,name:'上传状态统计',url:'analysis/uploadStatus',icon:'fa fa-circle-o',pid:8},
					 
					];
	
	var menu = $(".sidebar-menu").eq(0);
	menu.empty();
	
	//构建一级菜单
	for(var i=0;i<menuData1.length;i++){
		var liStr = '<li id="menu_'+ menuData1[i].id + '"';
		if(menuData1[i].url != '#')
			liStr += ' onclick="setOneMenuNav(this);"><a href=' + menuData1[i].url +' target="iframepage" ';
		else
			liStr += '><a href=' + '"#"';
		
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
		
		//添加二级菜单
		pMenu.find("ul.treeview-menu").append('<li><a href="'+ menuData2[i].url +'" target="iframepage">' + menuData2[i].name + '</a></li>');
	} 
	
	//设置二级菜单导航
	$(".treeview-menu").children("li").attr("onclick","setTwoMenuNav(this);");
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
	var twoMenuName = liObj.innerText;
	
	var nav = $(".breadcrumb").eq(0); 
	nav.empty();
	nav.append('<li><span class="glyphicon glyphicon-play"></span>当前位置: <i class="fa fa-dashboard"></i>' + oneMenuName + '</li>');
	nav.append('<li class="active">' + twoMenuName + '</li>');
}