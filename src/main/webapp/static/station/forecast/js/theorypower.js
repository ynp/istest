$(function () {
	var start = Date.prototype.formatdate(new Date(new Date().getTime()), "yyyy-MM-dd");
	var end = Date.prototype.formatdate(new Date(new Date().getTime()+ 1 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
	$("#starttime").val(start);//起始时间
	$("#endtime").val(end);//结束时间
	var dateOptions={
		autoclose: true,
		format: "yyyy-mm-dd",
		minView: 2,
		todayBtn: 'linked',
		language: 'zh-CN'
	};
	//设置起始时间可设置的最大值
	dateOptions.endDate=end;
	$("#starttime").datetimepicker(dateOptions).on('changeDate', function(ev) {
		if(ev.date) {
			$("#endtime").datetimepicker('setStartDate', DateAdd("d", 1, ev.date));
		} else {
			$("#endtime").datetimepicker('setStartDate', null);
		}
	});
	//设置结束时间可设置的最大值，并清空起始日期的最大日期值配置项
	dateOptions.startDate=start;
	dateOptions.endDate="";
	$("#endtime").datetimepicker(dateOptions).on('changeDate', function(ev) {
		if(ev.date) {
			$("#starttime").datetimepicker('setEndDate', DateAdd("d", -1, ev.date));
		} else {
			$("#starttime").datetimepicker('setEndDate', new Date());
		}
	});
	
	//设置form表单的日期控件
	$("#farmcapForm [name$='time']").datetimepicker({
		format: "yyyy-mm-dd",
		minView: 2,
		todayBtn: 'linked',
		language: 'zh-CN'
	});
});

//默认选中一分钟，隐藏结束时间
$(function() {
	$("#divSelector").hide();
	$("input[name='minuteType']").click(function() {
		var minuteType = $("input[name='minuteType']:checked").val();
		//当minuteType=1时，隐藏结束时间，否则，显示结束时间
		if (minuteType == 1) {
			$("#divSelector").hide();
		} else {
			$("#divSelector").show();
		}
	});
})

$(function() {
    var webHeight = $(window).height();
    $("#curve").css("height", webHeight - 160);
    //获得电场的数据
    $.ajax({
        type : "POST",
        url : "plant/getPlants",
        dataType : "json",
        async : true,
        success : function(data) {
            if (data.success) {
                $.each(data.obj, function(index, item) {
                    $("<option></option>").val(item.id).text(item.aliasname).appendTo($("#plantId"));
                });
                setCurve();
            } else {
                swal("", "电厂数据加载失败", "error");
            }
        }
    });

    // 查询 
    $("#search").click(function() {
        setCurve();
    });

     //导出 
    $("#export").click(function() {
    	var minuteType=$("input[name='minuteType']:checked").val();//一分钟/五分钟
    	var wind=$("input[name='wind']:checked").val();//风电/光伏
        var starttime = $("#starttime").val();//起始时间
        var endtime = $("#endtime").val();//结束时间
        var plantId = $("#plantId").val();//电场ID
        location.href = getWebRootUrl()+"/theory/exportTheoryReport?plantId=" + plantId + "&starttime=" + starttime + "&endtime=" + endtime +"&minuteType="+minuteType + "&wind="+wind;
       
    });
});
//得到echarts数据
function setCurve() {
    var plantId = $("#plantId").val();//电场ID
    var minuteType=$("input[name='minuteType']:checked").val();//一分钟/五分钟
    var wind = $("input[name='wind']:checked").val();//风电/光伏
    var starttime = $("#starttime").val();//起始时间
    var endtime = $("#endtime").val();//结束时间

    $.ajax({
        type : "POST",
        url : "theory/getTheoryDataCurve",
        dataType : "json",
        async : true,
        data : {
            plantId : plantId,
            minuteType:minuteType,
            wind : wind,
            starttime : starttime,
            endtime : endtime
        },
        success : function(data) {
        	if(data.success){
        		createEcharts(data);
        	} else {
        		swal("", "理论功率加载失败", "error");
        	} 

        }
    });
}
//创建echarts配置
function createEcharts(data){
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('curve'));
	data = data.obj;
	// 指定图表的配置项和数据
	var option = {
        title : {
            text : '理论功率'
        },
        tooltip : {
            trigger : 'axis',

            axisPointer : {
                animation : false
            }
        },
        legend : {
            data : data.legend
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
        xAxis : {
            boundaryGap : false,
            splitLine : {
                show : false
            },
            axisLabel : {
                textStyle : {
                    align : 'left'
                }
            },
            data: data.category
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
        series : data.series
    };
	
	myChart.setOption(option);
	myChart.hideLoading();

    // 自动调整echarts尺寸
    window.onresize = myChart.resize;
    window.onresize();
}
