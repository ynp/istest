/*生成曲线*/
function setCurve() {
	var plantId = $("#plantId").val();
	var floor = $("#floor").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var equipmentID = $("#equipmentID").val();
	$.ajax({
		type: "POST",
		url: "weather/getWindDirectionGraph",
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
				createEcharts(data);
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
	location.href = getWebRootUrl()+"/weather/exportWindDirection?plantId=" + plantId +
		"&starttime=" + starttime + "&endtime=" + endtime +
		"&equipmentID=" + equipmentID + "&floor=" + floor;
}

/*设置echarts*/
function createEcharts(data) {
	option = {
		title: {
			text: '风向玫瑰图'
		},
		tooltip: {
			position: [180, 1],
			padding: [0,5]
		},
		legend: {
			data: ['气象预测风向', '实际风向']
		},
		toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
		radar: {
			indicator: [{
				text: 'N',
				min: 0
			},{
				text: 'NNW',
				min: 0
			}, {
				text: 'NW',
				min: 0
			}, {
				text: 'WNW',
				min: 0
			},{
				text: 'W',
				min: 0
			}, {
				text: 'WSW',
				min: 0
			}, {
				text: 'SW',
				min: 0
			}, {
				text: 'SSW',
				min: 0
			},  {
				text: 'S',
				min: 0
			}, {
				text: 'SSE',
				min: 0
			}, {
				text: 'SE',
				min: 0
			}, {
				text: 'ESE',
				min: 0
			}, {
				text: 'E',
				min: 0
			}, {
				text: 'ENE',
				min: 0
			}, {
				text: 'NE',
				min: 0
			}, {
				text: 'NNE',
				min: 0
			},
			],
			center: ['50%', '50%'],
			radius: '60%',
			startAngle: 90,
			splitNumber: 5,
			shape: 'circle',
			name: {
				formatter: '【{value}】',
				textStyle: {
					color: '#72ACD1'
				}
			},
			splitArea: {
				areaStyle: {
					color: ['#B8D3E4', '#96C5E3', '#7DB5DA', '#72ACD1']
				}
			},
			axisTick: {
				show: true,
				lineStyle: {
					color: 'rgba(255, 255, 255, 0.8)'
				}
			},
			axisLabel: {
				show: false,
				textStyle: {
					color: 'black'
				}
			},
			axisLine: {
				lineStyle: {
					color: 'rgba(255, 255, 255, 0.4)'
				}
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(255, 255, 255, 0.4)'
				}
			}
		},
		series: [{
			name: '风向',
			type: 'radar',
			// areaStyle: {normal: {}},
			data: [{
				value: data.obj.fcst,
				name: '气象预测风向'
			}, {
				value: data.obj.equipment,
				name: '实际风向'
			}]
		}]

	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);

	// 自动调整echarts尺寸
	window.onresize = myChart.resize;
	window.onresize();
}