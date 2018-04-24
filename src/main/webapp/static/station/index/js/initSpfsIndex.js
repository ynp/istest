function initPlants(){
	var plantId= $("#plantId").val();
	//设置光伏组件下拉列表
	getPvEndetectors(plantId);
	//触发加载电场信息事件
	initPlant(plantId)
	//显示电场拥有的光伏组件
	initPvUnits(plantId)
	//加载功率曲线
	initPsEcharts(plantId);
	setInterval(function() {
		initPsEcharts(plantId)
	}, refreshTime);
	//加载短期精度等数据
	initPrecisionAndUploadratesEcharts(plantId);
	//加载轮播图
	initImage(plantId);
}


/**
 * 显示电场拥有设备的数量以及其运行状态的统计
 * @param plantId
 */
function initPvUnits(plantId){
	//设置光伏组件的运行状态
	setEquipmentRunStatus(plantId,"pvUnit/getPvUnits");
}

/**
 * 初始化电场的气象站下拉选择框，数据加载成功后加载与气象站相关的数据
 */
function getPvEndetectors(plantId){
	$("#pvEndetectorId").html("");
	$("#pvEndetectorId").select2();
	$.ajax({
		type: "POST",
		url: "pvEndetector/getPvEndetectors",
		data:{
			plantId : plantId
		},
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				var pvEndetectors = data.obj;
				var option="";
				$(pvEndetectors).each(function (index,val){
					option += "<option value='"+ val.id +"'>"+ val.aliasname +"</option>";
				});
				$("#pvEndetectorId").append(option);
				//加载气象站
				initPvEndetectorData();
			}
		}
	});
}

/**
 * 显示气象站的实测数据
 */
function initPvEndetectorData(){
	var pvEndetectorId = $("#pvEndetectorId").val();
	var startTime = $("#startTime").val();
	
	$.ajax({
		type: "POST",
		url: "spfsIndex/getPvEndetectorData",
		data:{
			pvEndetectorId : pvEndetectorId,
			startTime : startTime
		},
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				var pvEndetectorData = data.obj;
				if(pvEndetectorData){
					$("#radiation").html(convertNull(pvEndetectorData.radiation));//总辐照度
					$("#directRadiation").html(convertNull(pvEndetectorData.directRadiation));//直辐照度
					$("#scateredRadiation").html(convertNull(pvEndetectorData.scateredRadiation));//散辐照度
					$("#windSpeed").html(convertNull(pvEndetectorData.windSpeed));//风速
					$("#windDirection").html(convertNull(pvEndetectorData.windDirection));//风向
					$("#temperature").html(convertNull(pvEndetectorData.temperature));//温度
					$("#humidity").html(convertNull(pvEndetectorData.humidity));//湿度
					$("#pressure").html(convertNull(pvEndetectorData.pressure));//气压
				} else {
					$("#radiation").html(0);
					$("#directRadiation").html(0);
					$("#scateredRadiation").html(0);
					$("#windSpeed").html(0);
					$("#windDirection").html(0);
					$("#temperature").html(0);
					$("#humidity").html(0);
					$("#pressure").html(0);
				}
			}
		}
	});
}
