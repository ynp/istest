//加载图表所需数据，设置图表显示
function setCurve() {
	var plantId = $("#plantId").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var equipmentID = $("#equipmentID").val();
	$.ajax({
		type: "POST",
		url: "spfsWeather/getIrradianceCurve",
		dataType: "json",
		async: true,
		data: {
			plantId: plantId,
			starttime: starttime,
			endtime: endtime,
			equipmentID: equipmentID
		},
		success: function(data) {
			//查询成功，允许导出
			if(data.success) {
				$("#export").attr("disabled", false);
				createEcharts(data);
			} else {//查询失败，禁用导出按钮
				$("#export").attr("disabled", "disabled");
				swal("", data.msg, "error");
			}
		}
	});
}

/*导出*/
function exportExcel(){
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var plantId = $("#plantId").val();
	var equipmentID = $("#equipmentID").val();
	location.href = getWebRootUrl()+"/spfsWeather/exportIrradiance?plantId=" + plantId +
		"&starttime=" + starttime + "&endtime=" + endtime +
		"&equipmentID=" + equipmentID;
}

//设置图表所需参数
function createEcharts(data) {
	option = {
		title: {
			text: '辐照度曲线'
		},
		tooltip: {
			trigger: 'axis',

			axisPointer: {
				animation: false
			}
		},
		legend: {
			data: ['气象预报辐照度', '气象站辐照度', '气象站直辐射', '气象站散辐射']
		},
		grid : {
            left : '4%',
            right : '4%',
            bottom : 20
        },
		toolbox: {
		    show: true,
		      feature: {
		    	saveAsImage: {},
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
			data: data.obj.time
		},
		yAxis : {
			name : '辐照度(W/㎡)',
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
		series: [{
			name: '气象预报辐照度',
			type: 'line',
			data: data.obj.fcst
		}, {
			name: '气象站辐照度',
			type: 'line',
			data: data.obj.irradance
		}, {
			name: '气象站直辐射',
			type: 'line',
			data: data.obj.directRadiation
		}, {
			name: '气象站散辐射',
			type: 'line',
			data: data.obj.scateredRadiation
		}]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	
	// 自动调整echarts尺寸
	window.onresize = myChart.resize;
	window.onresize();
}