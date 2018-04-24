// 初始化开始结束时间
initDateTime("d", -1, "yyyy-MM-dd");
// 设置时间控件
setDatetimepicker("d");

var oTable;//定义数据table

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('curve'));

// 指定图表的配置项和数据
var option;

$(function() {
	//设置高度
    var webHeight = $(window).height();
    $("#curve").css("height", webHeight - 184);
    
    //查询电场，设置下拉列表
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
	            setCurve();//获取曲线
	            setDataTable();//获取经度
            }
        }
    });

    /* 查询 */
    $("#search").click(function() {
    	if(timeCheck()){
	        setCurve();//获取曲线
	        getList();//重新获取经度
        }else{//回复时间
        	initDateTime("d", -1, "yyyy-MM-dd");
        }
    });
    //重新加载列表数据
	function getList(){
	    var type = $("input[name='type']:checked").val()
	    var url = "dayReport/getDayForm";//短期
		if(type == 2){//超短期
			url = "sdayReport/getSdayForm";
		}
		var farmid = $("#farmid").val();
		var powertype = $("#powertype").val();
		var starttime = $("#starttime").val();
		var endtime = $("#endtime").val();
		var data = {
			farmid: farmid,
			powertype: powertype,
			starttime: starttime,
			endtime: endtime
		};
		oTable.clear();
		oTable.settings()[0].ajax.url = url;
		oTable.settings()[0].ajax.data = data;
		oTable.ajax.reload();
	}
	
    /* 导出 */
    $("#export").click(function() {
    	if(timeCheck()){
            var type = $("input[name='type']:checked").val();
            var starttime = $("#starttime").val();
            var endtime = $("#endtime").val();
            var farmid = $("#farmid").val();
        	var powertype = $("#powertype").val();
            location.href = getWebRootUrl()+"/analysis/exportPowerErrorStatics?farmid=" + farmid + "&powertype=" + powertype + "&starttime=" + starttime + "&endtime=" + endtime + "&type=" + type;
        }else{//回复时间
        	initDateTime("d", -1, "yyyy-MM-dd");
        }
    });
});

//加载功率误差统计列表数据
function setDataTable() {
	var farmid = $("#farmid").val();
	var powertype = $("#powertype").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	oTable = $("#oTable").DataTable({
		//汉化
		language: {
			"sProcessing": "处理中...",
			"sLengthMenu": "显示 _MENU_ 项结果",
			"sZeroRecords": "没有匹配结果",
			"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
			"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			"sInfoPostFix": "",
			"sSearch": "搜索:",
			"sUrl": "",
			"sEmptyTable": "暂无信息",
			"sLoadingRecords": "载入中...",
			"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "上页",
				"sNext": "下页",
				"sLast": "末页"
			},
			"oAria": {
				"sSortAscending": ": 以升序排列此列",
				"sSortDescending": ": 以降序排列此列"
			}
		},
		ajax: {
			url: "dayReport/getDayForm",
			type: "POST",
			data: {
				farmid: farmid,
				powertype: powertype,
				starttime: starttime,
				endtime: endtime
			},
			"dataSrc": "obj"
		},
		// 关闭搜索框
		"bFilter": false,
		// 关闭排序
		"bSort": false,
		//详细分页组，可以支持直接跳转到某页
		"pagingType": "full_numbers",
		//每页显示多少条选择
		"lengthMenu": [
   			[5, 10, 25, 50, 75, 100],
			[5, 10, 25, 50, 75, 100]
		],
		//默认显示条数
		"displayLength": 10,
		//默认排序行与排序方式
		"order": [
			[1, "asc"]
		],
		//不排序的列的class
		"columnDefs": [{
			"targets": 'nosort',
			"orderable": false
		}],
		//开启服务端处理
		"processing": true,
		"bServerSide": true,
		"columns": [
        {
			"data": "datatime",
		    render: function( data, type, row, meta ) {
		    	return data.substr(0,10);
		    }
        }, {
			"data": "rmse"
		}, {
			"data": "mae"
		}, {
			"data": "colrel"
		}, {
			"data": "accur"
		}, {
			"data": "qualify"
		}]
	});
}

//获取功率误差统计曲线
function setCurve() {
    var farmid = $("#farmid").val();
    var powertype = $("#powertype").val();
    var starttime = $("#starttime").val();
    var endtime = $("#endtime").val();
    var type = $("input[name='type']:checked").val()

    $.ajax({
        type : "POST",
        url : "analysis/getPowerErrorStatis",
        dataType : "json",
        async : true,
        data : {
            farmid : farmid,
            powertype : powertype,
            type : type,
            starttime : starttime,
            endtime : endtime
        },
        success : function(data) {
            if (data.success) {
            	$("#export").attr("disabled", false);
                createEcharts(data);
            } else {
            	$("#export").attr("disabled", "disabled");
                swal("", "功率误差统计数据加载失败", "error");
            }
        }
    });
}

//点击曲线重新加载数据
function quxian(){
	setCurve();
}

//生成曲线
function createEcharts(data) {
    option = {
        title : {
            /*text : '功率误差统计'*/
        },
        tooltip : {
            trigger : 'axis',

            /*axisPointer : {
                animation : false
            }*/
        },
        legend : {
            data : [
                '实发功率', '置信上限', '预测功率', '置信下限'
            ]
        },
		/*grid: {
			x: 60,
			y: 40,
			x2: 20,
			y2: 30
		},*/
        grid : {
            left : '4%',
            right : '4%',
            bottom : 20
        },
        toolbox : {
			trigger: 'axis'
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
            data : data.obj.time
        },
        yAxis : {
            name : '功率(MW)',
            /*boundaryGap : [
                0, '100%'
            ],*/
            splitLine : {
                show : false
            }
        },
        series : [
            {
                name : '实发功率',
                type : 'line',
                data : data.obj.realP
            }, {
                name : '置信上限',
                type : 'line',
                data : data.obj.limitUpper
            }, {
                name : '预测功率',
                type : 'line',
                data : data.obj.p
            }, {
                name : '置信下限',
                type : 'line',
                data : data.obj.limitLower
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    // 自动调整echarts尺寸
    window.onresize = myChart.resize;
    window.onresize();
}

//时间校验
function timeCheck(){
	var startTime = $("#starttime").val();
	var endTime = $("#endtime").val();
	if(!isDifferNDay(startTime,endTime,10)){
		return false;
	}
	return true;
}