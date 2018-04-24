// 初始化开始结束时间
initDateTime("d", -1, "yyyy-MM-dd");
// 设置时间控件
setDatetimepicker("d");

var oTable1;//1:并网功率 、 2:实发功率
var oTable2;//3:测风塔风向
var oTable3;//4:测风塔风速、5:风机风速、6:气象预报、7:辐照度

$(function() {
	$("#dataSource").change(function() {
		var vdataSource = $("#dataSource").val();
		//1:并网功率
		//2:实发功率
		//3:测风塔风向
		//4:测风塔风速
		//5:风机风速
		//6:气象预报
		//7:辐照度
		if(1 == vdataSource) {
			$("#table1").show();
			$("#table2").hide();
			$("#table3").hide();
			$("#equipmentID").attr("disabled", "disabled");
			$("#floor").attr("disabled", "disabled");
		} else if(2 == vdataSource) {
			$("#table1").show();
			$("#table2").hide();
			$("#table3").hide();
			$("#equipmentID").attr("disabled", "disabled");
			$("#floor").attr("disabled", "disabled");
		} else if(3 == vdataSource) {
			$("#table2").show();
			$("#table1").hide();
			$("#table3").hide();
			$("#equipmentID").removeAttr("disabled");
			$("#floor").removeAttr("disabled");
		} else if(4 == vdataSource) {
			$("#table3").show();
			$("#table2").hide();
			$("#table1").hide();
			$("#equipmentID").removeAttr("disabled");
			$("#floor").removeAttr("disabled");
		} else if(5 == vdataSource) {
			$("#table3").show();
			$("#table2").hide();
			$("#table1").hide();
			$("#equipmentID").attr("disabled", "disabled");
			$("#floor").attr("disabled", "disabled");
		} else if(6 == vdataSource) {
			$("#table3").show();
			$("#table2").hide();
			$("#table1").hide();
			$("#equipmentID").attr("disabled", "disabled");
			$("#floor").attr("disabled", "disabled");
		} else if(7 == vdataSource) {
			$("#table3").show();
			$("#table2").hide();
			$("#table1").hide();
			$("#equipmentID").attr("disabled", "disabled");
			$("#floor").attr("disabled", "disabled");
		}
		//查询数据
		doSearch();
	});

	//切换电场，重新加载设备
	$("#farmid").change(function() {
		getEquipment();
	});
	
	//获取所有电场，设置电场下拉列表
	$.ajax({
		type: "POST",
		url: "plant/getPlants",
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				$.each(data.obj, function(index, item) {
					$("<option></option>")
						.val(item.id)
						.text(item.aliasname)
						.appendTo($("#farmid"));
				});
				//加载电场下的设备
				getEquipment();
				//加载报表事件
				setDataTable();
			}
		}
	});

	/*查询*/
	$("#search").click(function() {
		doSearch();
	});
	
	//查询操作
	function doSearch(){
		//验证参数是否合法
		if(!validateParams()) {
			return false;
		}
		//验证时间是否合法
    	if(!timeCheck()){
			return false;
    	}
    	//查询数据
		setTable();
	}

	/*导出*/
	$("#export").click(function() {
		//验证参数是否合法
		if(!validateParams()) {
			return false;
		}
		//验证时间是否合法
    	if(!timeCheck()){
			return false;
    	}
		var starttime = $("#starttime").val();
		var endtime = $("#endtime").val();
		var farmid = $("#farmid").val();
		var floor = $("#floor").val();
		var equipmentID = $("#equipmentID").val();
		var dataSource = $("#dataSource").val();
		if(!(dataSource == 3 || dataSource==4)){
			equipmentID=-1;
		}
		var urlhref = getWebRootUrl()+"/analysis/exportFrequencyDistributionReport?farmid=" + farmid +
		"&starttime=" + starttime + "&endtime=" + endtime +
		"&equipmentID=" + equipmentID + "&dataSource=" + dataSource
		if(floor!=undefined && floor!=null && floor!=""){
			urlhref = urlhref + "&floor=" + floor
		}
		location.href = urlhref;
	});
});

/*获取测风塔*/
function getEquipment() {
	var farmid = $("#farmid").val();
	$("#equipmentID").html("");
	$.ajax({
		type: "POST",
		url: "windMetertower/getWindMetertowerByPlantId",
		dataType: "json",
		async: true,
		data: {
			plantId: farmid,
		},
		success: function(data) {
			if(data.success) {
				$.each(data.obj, function(index, item) {
					$("<option></option>")
					.val(item.id)
					.text(item.aliasname)
					.appendTo($("#equipmentID"));
				});
			}
		}
	});
}

//重新查询数据
function setTable() {
	var farmid = $("#farmid").val();
	var floor = $("#floor").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var equipmentID = $("#equipmentID").val();
	var dataSource = $("#dataSource").val();
	var data = {
		"farmid": farmid,
		"floor": floor,
		"starttime": starttime,
		"endtime": endtime,
		"dataSource": dataSource,
		"equipmentID": equipmentID
	};
	//根据不同的数据源确定不同的导出操作
	if(1 == dataSource || 2 == dataSource) {
		oTable1.clear();
		oTable1.settings()[0].ajax.data = data;
		oTable1.ajax.reload();
		oTable1.on('xhr', function(e, settings, json) {
			if(json.success != true || 0 == json.obj.length) {
				$("#export").attr("disabled", "disabled");
			} else {
				$("#export").attr("disabled", false);
			}
		});
	} else if(3 == dataSource) {
		oTable2.clear();
		oTable2.settings()[0].ajax.data = data;
		oTable2.ajax.reload();
		oTable2.on('xhr', function(e, settings, json) {
			if(json.success != true || 0 == json.obj.length) {
				$("#export").attr("disabled", "disabled");
			} else {
				$("#export").attr("disabled", false);
			}
		});
	} else if(4 == dataSource || 5 == dataSource || 6 == dataSource || 7 == dataSource) {
		oTable3.clear();
		oTable3.settings()[0].ajax.data = data;
		oTable3.ajax.reload();
		oTable3.on('xhr', function(e, settings, json) {
			if(json.success != true || 0 == json.obj.length) {
				$("#export").attr("disabled", "disabled");
			} else {
				$("#export").attr("disabled", false);
			}
		});
	}
}

/*校验测风塔是否为空*/
function validateParams() {
	var vdataSource = $("#dataSource").val();
	var equipmentID = $("#equipmentID").val();
	if((vdataSource == 3 || vdataSource==4) && isEmpty(equipmentID)) {
		swal("", "测风塔不能为空！", "error");
		return false;
	}
	return true;
}

//加载列表数据
function setDataTable() {
	var farmid = $("#farmid").val();
	var floor = $("#floor").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var equipmentID = $("#equipmentID").val();
	var dataSource = $("#dataSource").val();
	oTable1 = $("#oTable1").DataTable({
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
			url: "analysis/getFrequencyDistribution",
			type: "POST",
			data: {
				farmid: farmid,
				floor: floor,
				starttime: starttime,
				endtime: endtime,
				dataSource: dataSource,
				equipmentID: equipmentID
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
		"columns": [{
			"data": "dataSource"
		}, {
			"data": "datetime",
			"sWidth": "45px"
		}, {
			"data": "total"
		}, {
			"data": "a"
		}, {
			"data": "b"
		}, {
			"data": "c"
		}, {
			"data": "d"
		}, {
			"data": "e"
		}, {
			"data": "f"
		}, {
			"data": "g"
		}, {
			"data": "h"
		}, {
			"data": "i"
		}, {
			"data": "j"
		}]
	});
	oTable2 = $("#oTable2").DataTable({
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
			url: "analysis/getFrequencyDistribution",
			type: "POST",
			data: {
				farmid: farmid,
				floor: floor,
				starttime: starttime,
				endtime: endtime,
				dataSource: dataSource,
				equipmentID: equipmentID
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
		"columns": [{
			"data": "dataSource"
		}, {
			"data": "datetime"
		}, {
			"data": "total"
		}, {
			"data": "a"
		}, {
			"data": "b"
		}, {
			"data": "c"
		}, {
			"data": "d"
		}, {
			"data": "e"
		}, {
			"data": "f"
		}, {
			"data": "g"
		}, {
			"data": "h"
		}]
	});
	oTable3 = $("#oTable3").DataTable({
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
			url: "analysis/getFrequencyDistribution",
			type: "POST",
			data: {
				farmid: farmid,
				floor: floor,
				starttime: starttime,
				endtime: endtime,
				dataSource: dataSource,
				equipmentID: equipmentID
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
		"columns": [{
			"data": "dataSource"
		}, {
			"data": "datetime"
		}, {
			"data": "total"
		}, {
			"data": "a"
		}, {
			"data": "b"
		}, {
			"data": "c"
		}, {
			"data": "d"
		}, {
			"data": "e"
		}, {
			"data": "f"
		}]
	});

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