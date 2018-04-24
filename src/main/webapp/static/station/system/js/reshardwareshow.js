/**
 * 硬件资源监视数据展示js
 */
$(function() {
	setCurve();
	setInterval(function() {
		setCurve();
    }, 30 *  1000);   	
});

//得到echarts数据
function setCurve() {
	$.post("reshardwareshow/getResHardware",
	    function(data) {
		var data=eval("("+data+")");
			if(data.success){
				createEcharts(data.obj);
			} else {
				swal("", "硬件资源监视失败", "error");
			} 
	    }
    );
}
//创建echarts配置
function createEcharts(data){
	// 基于准备好的dom，初始化echarts实例
	var cmyChart = echarts.init(document.getElementById('cpuCurve'));
	var mmyChart = echarts.init(document.getElementById('memoryCurve'));
	var hmyChart = echarts.init(document.getElementById('hardDiskCurve'));
	// 指定图表的配置项和数据
	var cOption = {
		title : {
			text : '硬件资源监视数据展示'
		},
		tooltip : {
			trigger : 'item',
		},
		color : [ 'blue', 'orange' ],
		legend : {
			x : 'center',
			y : 'bottom',
			data : [ 'CPU使用率' ]
		},
		series : [ {
			name : [ 'CPU使用率' ],
			type : 'pie',
			radius : '33%',
			center : [ '50%', '60%' ],
			data : [ {
				value : data.cpu,
				name : 'CPU使用率'
			}, {
				value : 100 - data.cpu
				
			} ],
			label : {
				normal : {
					show : true
				}
			},
			labelLine: {
                normal: {
                    show: false
                }
            },
			itemStyle : {
				normal : {
					label : {
						show : true,
						formatter : '{b}({d}%)'
					},
					labelLine : {
						show : true
					}
				}
			}
		} ]
	};
	var mOption = {
		title : {
			text : ''
		},
		tooltip : {
			trigger : 'item',
		},
		color : [ 'green', 'orange' ],
		legend : {
			x : 'center',
			y : 'bottom',
			data : [ '内存占用率' ]
		},
		series : [ {
			name : '内存占用率',
			type : 'pie',
			radius : '33%',
			center : [ '50%', '60%' ],
			data : [ {
				value : data.memory,
				name : '内存占用率'
			}, {
				value : 100 - data.memory
			} ],
			label : {
				normal : {
					show : true
				}
			},
			labelLine: {
                normal: {
                    show: false
                }
            },
			itemStyle : {
				normal : {
					label : {
						show : true,
						formatter : '{b}({d}%)'
					},
					labelLine : {
						show : true
					}
				}
			}
		} ]
	};
	var hOption = {
		title : {
			text : ''
		},
		tooltip : {
			trigger : 'item',
		},
		color : [ 'blueviolet', 'orange' ],
		legend : {
			x : 'center',
			y : 'bottom',
			data : [ '硬盘占用率' ]
		},
		series : [ {
			name : '硬盘占用率',
			type : 'pie',
			radius : '33%',
			center : [ '50%', '60%' ],
			data : [ {
				value : data.hardDisk,
				name : '硬盘占用率'
			}, {
				value : 100 - data.hardDisk
			} ],
			labelLine: {
                normal: {
                    show: false
                }
            },
			label : {
				normal : {
					show : true
				}
			},
			itemStyle : {
				normal : {
					label : {
						show : true,
						formatter : '{b}({d}%)'
					},
					labelLine : {
						show : true
					}
				}
			}
		} ]
	};
	// 为echarts对象加载数据
	cmyChart.setOption(cOption);
	mmyChart.setOption(mOption);
	hmyChart.setOption(hOption);
	myChart.hideLoading();
}