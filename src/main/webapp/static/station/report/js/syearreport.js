// 初始化开始结束时间
initDateTime("y", -10, "yyyy");
// 设置时间控件
setDatetimepicker("y");

var oTable;//定义数据table

$(function() {
	//查询电场
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
				//初始化查询数据
				setDataTable();
				oTable.on('xhr', function(e, settings, json) {
					if(json.success != true || 0 == json.obj.length) {//如果没数据导出按钮不可用
						$("#export").attr("disabled", "disabled");
					} else {//否则可用
						$("#export").attr("disabled", false);
					}
				});
			}
		}
	});

	/*查询*/
	$("#search").click(function() {
		var starttime = $("#starttime").val();//起始时间
		var endtime = $("#endtime").val();//结束时间
		var farmid = $("#farmid").val();//电场ID
		var powertype = $("#powertype").val();//预测类型
		oTable.clear();
		oTable.settings()[0].ajax.data = {
			"farmid": farmid,
			"powertype": powertype,
			"starttime": starttime,
			"endtime": endtime
		};
		//重新加载数据
		oTable.ajax.reload();
	});

	/*导出*/
	$("#export").click(function() {
		var starttime = $("#starttime").val();//起始时间
		var endtime = $("#endtime").val();//结束时间
		var farmid = $("#farmid").val();//电场ID
		var powertype = $("#powertype").val();//预测类型
		location.href = getWebRootUrl()+"/syearReport/exportSyearReport?farmid=" + farmid + "&powertype=" + powertype + "&starttime=" + starttime + "&endtime=" + endtime;
	});
});
//初始化查询数据
function setDataTable() {
	var farmid = $("#farmid").val();//电场ID
	var powertype = $("#powertype").val();//预测类型
	var starttime = $("#starttime").val();//起始时间
	var endtime = $("#endtime").val();//结束时间
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
		//获取超短期预测年报数据
		ajax: {
			url: "syearReport/getsyearForm",
			type: "POST",
			data: {
				farmid: farmid,
				powertype: powertype,
				starttime: starttime,
				endtime: endtime
			},
			"dataSrc": "obj"
		},
		nowrap: false,
		// 关闭搜索框
		"bFilter": false,
		"paging": false,
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
			"data": "datatime",
		    render: function( data, type, row, meta ) {
		    	return data.substr(0,4);
		    }
		}, {
			"data": "cap"
		}, {
			"data": "p"
		}, {
			"data": "prep"
		}, {
			"data": "rmse"
		}, {
			"data": "mae"
		}, {
			"data": "colrel"
		}]
	});
}