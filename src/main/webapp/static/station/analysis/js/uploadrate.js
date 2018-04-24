// 初始化开始结束时间
initDateTime("d", -10, "yyyy-MM-dd");
// 设置时间控件
setDatetimepicker("d");

var oTable;//定义数据table

$(function() {
	//切换统计类型
	$("#type").change(function() {
		var type = $("#type").val();
		$("#starttime").datetimepicker('remove');
		$("#endtime").datetimepicker('remove');
		if(0 == type) {
			// 设置时间控件 日
			initDateTime("d", -10, "yyyy-MM-dd");
			setDatetimepicker("d");
		}
		if(1 == type) {
			// 设置时间控件 月
			initDateTime("m", -1, "yyyy-MM");
			setDatetimepicker("m");
		}
		if(2 == type) {
			// 设置时间控件 年
			initDateTime("y", -1, "yyyy");
			setDatetimepicker("y");
		}
	});

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
				//加载上传率列表数据
				//setDataTable();
				//初始化上传类型
				 getSubtype();
				//若查无数据，则禁用导出按钮，禁止导出操作
				oTable.on('xhr', function(e, settings, json) {
					if(json.success != true || 0 == json.obj.length) {
						$("#export").attr("disabled", "disabled");
					} else {
						$("#export").attr("disabled", false);
					}
				});
			}
		}
	});

	/*查询*/
	$("#search").click(function() {
		var starttime = $("#starttime").val();
		var endtime = $("#endtime").val();
		var farmid = $("#farmid").val();
		var type = $("#type").val();
		var subtype = $("#subtype").val();
		oTable.clear();
		oTable.settings()[0].ajax.data = {
			"farmid": farmid,
			"starttime": starttime,
			"endtime": endtime,
			"type": type,
			"subtype": subtype
		};
		oTable.ajax.reload();
	});

	/*导出*/
	$("#export").click(function() {
		var starttime = $("#starttime").val();
		var endtime = $("#endtime").val();
		var farmid = $("#farmid").val();
		var type = $("#type").val();
		var subtype = $("#subtype").val();
		location.href = getWebRootUrl()+"/analysis/exportDayReport?farmid=" + farmid + "&starttime=" + starttime + "&endtime=" + endtime + "&type=" + type + "&subtype=" + subtype;
		});
	});

	//初始化上传类型
	function getSubtype(){
		var farmid = $("#farmid").val();
		$.ajax({
			type: "POST",
			url: "analysis/getSubtype",
			data: {
				farmid: farmid,
			},
			dataType: "json",
			async: true,
			success: function(data) {
				//console.log(data);    //0表示备调、1表示省调、2表示地调、3表示集控
				if(data.success) {
					if(data.obj.length==0){
						$("<option></option>").val(1).text("省调").appendTo($("#subtype"));
					}
					var html =""
					$.each(data.obj, function(index, item) {
						 if(item.subtype==0){
							$("<option></option>").val(item.subtype).text("备调").appendTo($("#subtype"));
						 }
						 if(item.subtype==1){
							 $("<option></option>").val(item.subtype).text("省调").appendTo($("#subtype"));
						 }
						 if(item.subtype==2){
							 $("<option></option>").val(item.subtype).text("地调").appendTo($("#subtype"));
						 }
						 if(item.subtype==3){
							 $("<option></option>").val(item.subtype).text("集控").appendTo($("#subtype"));
						 }
					});
					//加载上传率列表数据
					setDataTable();
				}
				
			}
		});
	}

//初始化查询数据
function setDataTable() {
	var farmid = $("#farmid").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var type = $("#type").val();
	var subtype = $("#subtype").val();
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
			url: "analysis/getUploadStatics",
			type: "POST",
			data: {
				farmid: farmid,
				starttime: starttime,
				endtime: endtime,
				type: type,
				subtype: subtype
			},
			"dataSrc": "obj"
		},
		// 关闭搜索框
		"bFilter": false,
		//显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项", 不展示
		"info": false,
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
		"ordering": false,
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
		scrollCollapse: true,
		"columns": [{
			"data": "datatime"
		}, {
			"data": "dquploadrate",
			render: function( data, type, row, meta ) {
				var dquploadrate;
				if(data!=null&&data!=""){
					dquploadrate=(data*100).toFixed(2);
				}else{
					dquploadrate = "";
				}
		    	return dquploadrate;
		    }
		}, {
			"data": "cdquploadrate",
			render: function( data, type, row, meta ) {
				var cdquploadrate;
				if(data!=null&&data!=""){
					cdquploadrate=(data*100).toFixed(2);
				}else{
					cdquploadrate = "";
				}
		    	return cdquploadrate;
		    }
		}, {
			"data": "coluploadrate",
			render: function( data, type, row, meta ) {
				var coluploadrate;
				if(data!=null&&data!=""){
					coluploadrate=(data*100).toFixed(2);
				}else{
					coluploadrate = "";
				}
		    	return coluploadrate;
		    }
		}, {
			"data": "coldataexprate",
			render: function( data, type, row, meta ) {
				var coldataexprate;
				if(data!=null&&data!=""){
					coldataexprate=(data*100).toFixed(2);
				}else{
					coldataexprate = "";
				}
		    	return coldataexprate;
		    }
		}, {
			"data": "yrcuploadrate",
			render: function( data, type, row, meta ) {
				var yrcuploadrate;
				if(data!=null&&data!=""){
					yrcuploadrate=(data*100).toFixed(2);
				}else{
					yrcuploadrate = "";
				}
		    	return yrcuploadrate;
		    }
		}, {
			"data": "ytpuploadrate",
			render: function( data, type, row, meta ) {
				var ytpuploadrate;
				if(data!=null&&data!=""){
					ytpuploadrate=(data*100).toFixed(2);
				}else{
					ytpuploadrate = "";
				}
		    	return ytpuploadrate;
		    }
		}, {
			"data": "rtpuploadrate",
			render: function( data, type, row, meta ) {
				var rtpuploadrate;
				if(data!=null&&data!=""){
					rtpuploadrate=(data*100).toFixed(2);
				}else{
					rtpuploadrate = "";
				}
		    	return rtpuploadrate;
		    }
		}, {
			"data": "nwpuploadrate",
			render: function( data, type, row, meta ) {
				var nwpuploadrate;
				if(data!=null&&data!=""){
					nwpuploadrate=(data*100).toFixed(2);
				}else{
					nwpuploadrate = "";
				}
		    	return nwpuploadrate;
		    }
		}, {
			"data": "nwp3uploadrate",
			render: function( data, type, row, meta ) {
				var nwp3uploadrate;
				if(data!=null&&data!=""){
					nwp3uploadrate=(data*100).toFixed(2);
				}else{
					nwp3uploadrate = "";
				}
		    	return nwp3uploadrate;
		    }
		}, {
			"data": "equploadrate",
			render: function( data, type, row, meta ) {
				var equploadrate;
				if(data!=null&&data!=""){
					equploadrate=(data*100).toFixed(2);
				}else{
					equploadrate = "";
				}
		    	return equploadrate;
		    }
		}]
	});
}