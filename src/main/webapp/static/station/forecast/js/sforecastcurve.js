var intX;

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('curve'));

// 指定图表的配置项和数据
var option;

$(function() {
    var webHeight = $(window).height();
    $("#curve").css("height", webHeight - 160);
    //获取电场数据
    $.ajax({
        type : "POST",
        url : "plant/getPlants",
        dataType : "json",
        async : true,
        success : function(data) {
            if (data.success) {
                $.each(data.obj, function(index, item) {
                    $("<option></option>").val(item.id).text(item.aliasname).appendTo($("#farmid"));
                });
                // 设置曲线图
                setCurve();
                // 关闭定时
                clearInterval(intX);
                // 启动定时
                intX = setInterval(function() {
                    setCurve();
                }, 5 * 60 * 1000);
            } else {
                swal("", "电厂数据加载失败", "error");
            }
        }
    });

    /* 查询 */
    $("#search").click(function() {
        setCurve();
        clearInterval(intX);
        intX = setInterval(function() {
            setCurve();
        }, 5 * 60 * 1000);
    });

    /* 导出 */
    $("#export").click(function() {
        var starttime = $("#starttime").val();//起始时间
        var endtime = $("#endtime").val();//结束时间
        var farmid = $("#farmid").val();//电场ID
        var availableFlag = availablePFcst == 0 ? false : true;//是否是可用功率
        var theoryFlag = theoryPFcst == 0 ? false : true;//是否是理论功率
        location.href = getWebRootUrl()+"/sforecast/exportSfcstReport?farmid=" + farmid + "&availablePFcst=" + availableFlag + "&theoryPFcst=" + theoryFlag;
    });
});

// 设置曲线图
function setCurve() {
    var farmid = $("#farmid").val();//电场ID
    var day = $("#day").val();//天数

    $.ajax({
        type : "POST",
        url : "sforecast/getSfcstdata",
        dataType : "json",
        async : true,
        data : {
            farmid : farmid
        },
        success : function(data) {
            if (data.success) {//有数据导出按钮可用
            	$("#export").attr("disabled", false);
                createEcharts(data.obj);
            } else {//否则不可用
            	$("#export").attr("disabled", "disabled");
                swal("", "超短期预测数据加载失败", "error");
            }
        }
    });
}

// 创建Echarts配置
function createEcharts(data) {
    option = {
        title : {
            text : '超短期预测'
        },
        grid : {
            left : '4%',
            right : '4%',
            bottom : 20
        },
        legend : {
            data : (function(){
            	var legendCopy = data.legend.concat();
            	if (theoryPFcst == 0){// 理论功率预测如果关闭状态，则过滤掉
            		legendCopy = legendCopy.filter(function(item){
            			return item != "理论功率预测";
            		});
            	}
            	if (availablePFcst == 0) {// 可用功率预测如果关闭状态，则过滤掉
            		legendCopy = legendCopy.filter(function(item){
            			return item != "可用功率预测";
            		});
            	} 
            	return legendCopy;
            })()
        },
        tooltip : {
            trigger : 'axis'
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
            data : data.category
        },
        yAxis : {
        	name : '功率(MW)',
            splitLine : {
                show : false
            }
        },
        series : (function(){
        	var seriesCopy = data.series.concat();
        	if (theoryPFcst == 0){// 理论功率预测如果关闭状态，则过滤掉
        		seriesCopy = seriesCopy.filter(function(item){
        			return item.name != "理论功率预测";
        		});
        	}
        	if (availablePFcst == 0) {// 可用功率预测如果关闭状态，则过滤掉
        		seriesCopy = seriesCopy.filter(function(item){
        			return item.name != "可用功率预测";
        		});
        	} 
        	return seriesCopy;
        })()
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    // 自动调整echarts尺寸
    window.onresize = myChart.resize;
    window.onresize();
}