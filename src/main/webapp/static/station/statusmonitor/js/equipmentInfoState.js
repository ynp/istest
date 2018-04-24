$(function () {
	//初始化电场选择按钮
	initFarmSelect();
	$("#start").val(1);
	
	//下一页
	$("#downpage").click(function() {
        var start = $("#start").val();
        var tpages = $("#tpages").val();
        if (start >= tpages) {
        	swal("已经是最后一页");
        } else {
        	$("#start").val(start*1+1);
        	showDataTable();
        }

    });
	//上一页
    $("#uppage").click(function() {
        var start = $("#start").val();
        if(start <= 1){
        	swal("已经是第一页");
        } else {
        	$("#start").val(start*1-1);
        	showDataTable();
        }
    });
});

//加载数据
function showDataTable(){
	//清空原有数据
	$("#states").html("");
	var fid = $("#farmid").val();
	var start = $("#start").val();
	//将start重置为1，是为了避免查询出同样的数据
	if(start < 1){
		start = 1;
		$("#start").val(1);
	}
	var length=12;
	//根据datatable来设置起始页
	start=start*length-1;
	$.ajax({
		type: "POST",
		url: "equipmentInfo/getEquipmentInfosForPage",
		data: {
			fid : fid,
			start : start,
			length : length
		},
		dataType: "json", // 返回数据形式为json
		success: function(result) {
			var datas = result.aaData;
			$("#tpages").val(result.tpages);
			if(result.tpages <= 0){
				$("#start").val(0);
			}
			var formflag = $("#formflag").val();
			var contents="";
			if(formflag=="spfs"){//构造逆变器状态数据
				contents=buildInverters(datas);
			} else {//构造风机状态数据
				contents=buildTurbines(datas);
			}
			$("#states").append(contents);
		}
	});
}

//构造风机显示数据
function buildTurbines(datas){
	var contents="";
	$(datas).each(function (index,val){
		//显示风机状态
		var sStauts="";
		var pic="";
    	switch(val.status){
    	case 0:
    		sStauts="发电运行";
    		pic="normal.gif";
    		break;
    	case 1:
    		sStauts="检修服务";
    		pic="repair.jpg";
    		break;
    	case 2:
    		sStauts="故障";
    		pic="error.gif";
    		break;
    	case 3:
    		sStauts="待机";
    		pic="wait.jpg";
    		break;
    	case 4:
    		sStauts="离线";
    		pic="offline.jpg";
    		break;
    	case 5:
    		sStauts="限电";
    		pic="limit.gif";
    		break;
    	case 6:
    		sStauts="正常停机";
    		pic="stop.gif";
    		break;
    	case 7:
    		sStauts="大风停机";
    		pic="breezeStrongStop.gif";
    		break;
    	case 8:
    		sStauts="无风停机";
    		pic="breezelessStop.gif";
    		break;
    	default:
    		sStauts="未知";
    		pic="unknown.gif";
    		break;
    	}
    	var wwindspeed ="";
    	if(val.wwindspeed != null){
    		wwindspeed = val.wwindspeed;
    	}
    	var p ="";
    	if(val.p != null){
    		p = val.p;
    	}
    	contents +="<div class='col-sm-4 col-md-3 col-lg-3'><div class='panel_list'><h4>风机：" + val.equipname +"</h4><dl>"
    		+"<dt><img src='static/station/statusmonitor/images/turbine/"+pic+"' class='img-responsive'/></dt>"
            +"<dd><p><span>风速 : </span><strong>"+ wwindspeed +"</strong>m/s</p><p><span>有功 : </span><strong>"
            + p +"</strong>KW</p><p><span>状态 : </span><strong>"+ sStauts +"</strong></p></dd></dl></div></div>";
	});
	return contents;
}

//构造逆变器显示数据
function buildInverters(datas){
	var contents="";
	$(datas).each(function (index,val){
		//显示风机状态
		var sStauts="";
		var pic="";
    	switch(val.status){
    	case 0:
    		sStauts="正常运行";
    		pic="normal.gif";
    		break;
    	case 1:
    		sStauts="带故障运行";
    		pic="errorRun.jpg";
    		break;
    	case 2:
    		sStauts="非故障停机";
    		pic="normalStop.jpg";
    		break;
    	case 3:
    		sStauts="故障停机";
    		pic="errorStop.jpg";
    		break;
    	case 4:
    		sStauts="状态异常";
    		pic="errorState.gif";
    		break;
    	case 5:
    		sStauts="通讯中断";
    		pic="comloss.jpg";
    		break;
    	default:
    		sStauts="未知";
    		pic="unknown.gif";
    		break;
    	}
    	var p ="";
    	if(val.p != null){
    		p = val.p;
    	}
    	contents +="<div class='col-sm-4 col-md-3 col-lg-3'><div class='panel_list'><h4>光伏：" + val.equipname +"</h4><dl>"
    		+"<dt><img src='static/station/statusmonitor/images/inverter/"+pic+"' class='img-responsive'/></dt>"
            +"<dd><p><span>有功 : </span><strong>" + p +"</strong>KW</p><p><span>状态 : </span><strong>"
            + sStauts +"</strong></p></dd></dl></div></div>";
	});
	return contents;
}
