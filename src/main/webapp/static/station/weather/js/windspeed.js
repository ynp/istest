//设置风速曲线图数据
function setCurve() {
	var plantId = $("#plantId").val();
	var floor = $("#floor").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var equipmentID = $("#equipmentID").val();
	var floorMane = $("#floor").find("option:selected").text();
	$.ajax({
		type: "POST",
		url: "weather/getWindSpeed",
		dataType: "json",
		async: true,
		data: {
			plantId: plantId,
			floor: floor,
			starttime: starttime,
			endtime: endtime,
			equipmentID: equipmentID
		},
		success: function(data) {
			//查询成功，允许导出
			if(data.success) {
				$("#export").attr("disabled", false);
				createEcharts(data,floorMane);
			} else {//查询失败，禁用导出按钮
				swal("", data.msg, "error");
				$("#export").attr("disabled", "disabled");
			}
		}
	});
}

/*导出*/
function exportExcel(){
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var plantId = $("#plantId").val();
	var floor = $("#floor").val();
	var equipmentID = $("#equipmentID").val();
	location.href = getWebRootUrl()+"/weather/exportWindSpeed?plantId=" + plantId +
		"&starttime=" + starttime + "&endtime=" + endtime +
		"&equipmentID=" + equipmentID + "&floor=" + floor;
}

function createEcharts(data,floorMane) {
	data = data.obj;
	var legendData = new Array();
	var seriesData = new Array();
	
	if(floorMane=="轮毂高度"){
		legendData.push("气象预报风速");
		seriesData.push({
	        name: '气象预报风速',
	        type: 'line',
	        data: data.fcst
	    });
		legendData.push("风机风速");
		seriesData.push({
	        name: '风机风速',
	        type: 'line',
	        data: data.farm
	    });
	}
	
	legendData.push("测风塔风速");
	seriesData.push({
        name: '测风塔风速',
        type: 'line',
        data: data.equipment
    });
	
	//data: ['气象预报风速', '风机风速', '测风塔风速']
	option = {
		title: {
			text: '风速曲线'
		},
		tooltip: {
			trigger: 'axis',

			axisPointer: {
				animation: false
			}
		},
		legend: {
			//data: ['气象预报风速', '风机风速', '测风塔风速']
		    data: legendData
		},
		grid : {
            left : '4%',
            right : '4%',
            bottom : 20
        },
		toolbox: {
		    show: true,
		      feature: {
		          dataZoom: {
		              yAxisIndex: 'none'
		          }
		    }
		},
		xAxis: {
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisLabel : {
                textStyle : {
                    align : 'left'
                }
            },
			data: data.time
		},
		yAxis : {
			name : '功率(MW)',
        	type : 'value',
            splitLine : {
                show : false
            },
            axisLabel : {
                formatter: '{value} '
            },
            splitNumber:10

        },
		/*series: [{
			name: '模拟数据',
			type: 'line',
			showSymbol: false,
			hoverAnimation: false,
			data: data
		}]*/
		/*series: [{
			name: '气象预报风速',
			type: 'line',
			data: data.obj.fcst
		}, {
			name: '风机风速',
			type: 'line',
			data: data.obj.farm
		}, {
			name: '测风塔风速',
			type: 'line',
			data: data.obj.equipment
		}]*/
        series: seriesData
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);

	// 自动调整echarts尺寸
	window.onresize = myChart.resize;
	window.onresize();
}

