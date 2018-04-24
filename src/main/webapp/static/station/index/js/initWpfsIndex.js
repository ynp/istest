//初始化风电场首页数据
function initPlants(){
	var plantId = $("#plantId").val();
	//设置测风塔下拉列表
	getWindMetertowers(plantId);
	//触发切换不同电场显示电场信息事件
	initPlant(plantId)
	//显示电场拥有的设备
	initWindturbines(plantId)
	//加载功率曲线-今日预测
	setInterval(function() {
		initPsEcharts(plantId)
	}, refreshTime);
	initPsEcharts(plantId);
	//加载短期精度等数据
	initPrecisionAndUploadratesEcharts(plantId);
	//加载轮播图
	initImage(plantId);
}

/**
 * 显示电场拥有设备的数量以及其运行状态的统计
 * @param plantId
 */
function initWindturbines(plantId){
	//设置风机的运行状态
	setEquipmentRunStatus(plantId,"windturbine/getWindturbines");
}

/**
 * 初始化电场的测风塔下拉选择框，数据加载成功后加载与测风塔相关的数据
 */
function getWindMetertowers(plantId){
	$("#windMetertowerId").html("");
	$("#windMetertowerId").select2();
	$("#layer").select2();
	$.ajax({
		type: "POST",
		url: "windMetertower/getWindMetertowers",
		data:{
			plantId : plantId
		},
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				var windMetertowers = data.obj;
				var option="";
				$(windMetertowers).each(function (index,val){
					option += "<option value='"+ val.id +"'>"+ val.aliasname +"</option>";
				});
				$("#windMetertowerId").append(option);
				//加载测风塔
				initWindMetertowerData();
			}
		}
	});
}

/**
 * 显示测风塔的某一层的 风速等相关数据
 */
function initWindMetertowerData(){
	var windMetertowerId = $("#windMetertowerId").val();
	var layer = $("#layer").val();
	var startTime = $("#startTime").val();
	
	$.ajax({
		type: "POST",
		url: "wpfsIndex/getWindMetertowerData",
		data:{
			windMetertowerId : windMetertowerId,
			layer : layer,
			startTime : startTime
		},
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				var windMetertowerData = data.obj;
				if(windMetertowerData != null){//查询的气象不为空时，显示气象数据
					$("#windSpeed").html(convertNull(windMetertowerData.windSpeed));
					$("#windDirection").html(convertNull(windMetertowerData.windDirection));
					$("#temperature").html(convertNull(windMetertowerData.temperature));
					$("#humidity").html(convertNull(windMetertowerData.humidity));
					$("#pressure").html(convertNull(windMetertowerData.pressure));
				} else {//查询气象数据结果没有时，默认都是0
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