$(function (){
	//初始化电场选择下拉框,其他数据在加载下框数据成功后，其他功能开始加载相应信息
	initPlantSelect();
});

/**
 * 初始化电场选择下拉框
 */
function initPlantSelect(){
	$("#plantId").select2();
	$.ajax({
		type: "POST",
		url: "plant/getPlants",
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				var options="";
				$.each(data.obj, function(index, item) {
					options += "<option value='"+ item.id +"'>"+ item.aliasname +"</option>";
				});
				$("#plantId").append(options);
				//加载首页所需的数据，在initX(变量名)pfsIndex.js文件中
				initPlants();
			}
		}
	});
}

/**
 * 显示装机容量、投运容量、坐标 等数据
 */
function initPlant(plantId){
	$.ajax({
		type: "POST",
		url: "plant/getPlant",
		dataType: "json",
		data : {
			id : plantId
		},
		async: true,
		success: function(data) {
			if(data.success) {
				var plant = data.obj;
				$("#allcapacity").html(plant.allCapacity);
				$("#runcapacity").html(plant.runCapacity);
				var gpsxy = plant.longitude + ";" + plant.latitude;
				$("#gpsxy").html(gpsxy);
			}
		}
	});
}

/**
 * 设置风机或光伏组件的运行状态
 * @param plantId	电场id
 * @param equipStautsUrl	获取测风塔或风机运行状态的URL
 */
function setEquipmentRunStatus(plantId, equipStautsUrl){
	$.ajax({
		type: "POST",
		url: equipStautsUrl,
		data:{
			plantId : plantId
		},
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				var equipments = data.obj;
				//设置电场拥有的设备总台数
				$("#equipmentnum").html(equipments.length);
				var normalNum = 0;//正常台数
				var abnormalNum = 0;//异常台数
				$(equipments).each(function (index,val){
					var status = val.status;
					//正常状态为<2,异常状态为>=2
					if(status < 2){
						normalNum +=1;
					} else {
						abnormalNum +=1;
					}
				});
				//设置设备各自运行状态的台数
				$("#normalNum").text(normalNum);
				$("#abnormalNum").text(abnormalNum);
			}
		}
	});
}

/**
 * 加载功率曲线图(风电与光伏查询该数据无区别，可使用同一方法)
 * @param plantId
 */
function initPsEcharts(plantId){
	var myChart = echarts.init(document.getElementById('ps'));
	$.ajax({
		type: "POST",
		url: "wpfsIndex/getPs",
		data:{
			plantId : plantId
		},
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				data = data.obj;
				var legendData = new Array();
				var seriesData = new Array();
				legendData.push("并网功率");
				seriesData.push({
		            name: '并网功率',
		            type: 'line',
		            data: data.realPs
		        });
				legendData.push("预测功率");
				seriesData.push({
					name: '预测功率',
					type: 'line',
					data: data.realPFcst
				});
				
				//理论功率
				if (theoryPFcst != 0){
					legendData.push("短期理论功率");
					seriesData.push({
			            name: '短期理论功率',
			            type: 'line',
			            data: data.bfcstTheoryps
			        });
					/*legendData.push("超短期理论功率");
					seriesData.push({
			        	name: '超短期理论功率',
			        	type: 'line',
			        	data: data.bsfcstTheoryps
			        });*/
            	}
				//可用功率
            	if (availablePFcst != 0) {
            		legendData.push("短期可用功率");
            		seriesData.push({
			            name: '短期可用功率',
			            type: 'line',
			            data: data.bfcstAvailableps
			        });
            		/*legendData.push("超短期可用功率");
					seriesData.push({
			        	name: '超短期可用功率',
			        	type: 'line',
			        	data: data.bsfcstAvailableps
			        });*/
            	} 
				var option = {
			        title: {
			            textStyle:{
			                fontSize: 13
			            }
			        },
			        tooltip: {
			        	trigger: 'axis',
						axisPointer: {
							animation: false
						}
			        },
			        legend: {
			            data: legendData
			        },
			        xAxis: {
			        	type: 'category',
			            boundaryGap: false,
			            data: data.times
			        },
			        yAxis: {
			        	name: 'MW'
			        },
			        series: seriesData
			    };
				
				myChart.setOption(option);
				window.onresize = myChart.resize;
			} else {
				swal("", "今日预测数据加载失败", "error");
			}
		}
	});
}

/**
 * 加载包含昨日在内七天数据的上传率与精度曲线图
 * @param plantId
 */
function initPrecisionAndUploadratesEcharts(plantId){
	var myChart = echarts.init(document.getElementById('precision'));
	var start = Date.prototype.formatdate(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
	var end = Date.prototype.formatdate(new Date(new Date().getTime()), "yyyy-MM-dd");
	$.ajax({
		type: "POST",
		url: "wpfsIndex/getPrecisionAndUploadRates",
		data:{
			plantId : plantId,
			starttime : start,
			endtime : end
		},
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				data = data.obj;
				var times = data.times;
				var dayPrecisions = data.dayPrecisions;
				var sdayPrecisions = data.sdayPrecisions;
				var fcstUploadRates = data.fcstUploadRates;
				var fscstUploadRates = data.fscstUploadRates;
				var option = {
			        title: {},
			        tooltip: {
			        	trigger: 'axis',
			            axisPointer: {
			                animation: false
			            }
			        },
			        legend: {
			            data:['短期精度','超短期精度','短期上传率','超短期上传率']
			        },
			        xAxis: {
			        	type: 'category',
			            boundaryGap: true,
			            data: times
			        },
			        yAxis: {
		                name : '百分比 %'
			        },
			        series: [{
			            name: '短期精度',
			            type: 'bar',
			            data: dayPrecisions
			        },{
			            name: '超短期精度',
			            type: 'bar',
			            data: sdayPrecisions
			        },{
			        	name: '短期上传率',
			        	type: 'bar',
			        	data: fcstUploadRates
			        },{
			        	name: '超短期上传率',
			        	type: 'bar',
			        	data: fscstUploadRates
			        }]
			    };
				
				myChart.setOption(option);
				window.onresize = myChart.resize;
			} else {
				swal("","短期与超短期数据加载失败", "error");
			}
		}
	});
}

/**
 * 加载轮播图
 */
function initImage(plantId){
    $.ajax({
        type: "POST",
        url: "plant/getImagePath",
        dataType: "json",
        data : {
            plantId : plantId
        },
        async: false,
        success: function(data) {
            if(data.success) {
                var indstr = "";
                var innerstr = "";
                $(".carousel-indicators").empty();
                $(".carousel-inner").empty();
                
                if (isEmpty(data.obj)){
                    $("<li data-target='#myCarousel' data-slide-to='1'></li>").appendTo('.carousel-indicators');
                    $("<div class='item'><img src='static/common/demo/images/dzIMG.jpg' alt='电站图片'></div>").appendTo('.carousel-inner');
                } else {
                    $.each( data.obj, function(i, n){
                        $("<li data-target='#myCarousel' data-slide-to='"+i+"'></li>").appendTo('.carousel-indicators');
                        $("<div class='item'><img src='"+n+"' alt='电站图片'></div>").appendTo('.carousel-inner');
                    });
                }
               
                $('.item').first().addClass('active');
                $('.carousel-indicators > li').first().addClass('active');
                $("#myCarousel").carousel('cycle');
            }
        }
    });
}