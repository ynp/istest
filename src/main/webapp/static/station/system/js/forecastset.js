$(function () {
	queryPartSet();
	
	$("#lfcstTime").datetimepicker({
		format: "hh:ii",
		startView: 1,
		autoclose: true,
		todayBtn: 'linked',
		language: 'zh-CN'
	});
	
	/*查询*/
	$("#search").click(function() {
		tableReload();
	});
	
	//启动验证
	validateForm();
});
//初始化报表数据
function showDataTable(){
	var plantId = $("#plantId").val();
	//确定datatable显示内容
	var coulmns = [
		{ "data": "fcstTime",
		  "render": function(data){
			  data = parseInt(data);
			  return parseSecondsToTime(data);
		  }
		},
		{ "data": "plantName"},
		{ "data": "number"},
		{ "data": "isMain",
		  "render": function (data) {
			var isMain="";
			data = parseInt(data);
			if(data == 1){
				isMain = "是";
			} else if(data == 0){
				isMain = "否";
			}
			return isMain;
		  }
		},
	   { "data": "id",//定义操作列的数据
		 "render": function (data,type,full) {
			var operation ="<a class='blue' href='javascript:void(0);' onclick='showforecastModal(1," + data + ")'>修改</a>"
			+ " | <a class='blue' href='javascript:void(0);' onclick='showforecastModal(2," + data + ")'>详情</a>"
			+ " | <a class='blue' href='javascript:void(0);' onclick='deleteforecast(" + data + "," + full.isMain +")'>删除</a>"
			return operation;
		 }
	   }
	]
	
	$("#forecast").DataTable({
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
		//详细分页组，可以支持直接跳转到某页
	    "pagingType": "full_numbers",
	    //每页显示多少条选择
	    "lengthMenu": [ 5, 10, 25, 50, 75, 100],
	    //默认显示条数
	    "displayLength": 10,
	  	//禁用搜索
	    "searching" : false,
	    "ordering" : false,
	    //不排序的列的class
	    "columnDefs": [ {
	        "targets": 'nosort',
	        "orderable": false
	      }
	    ],
	    //开启服务端处理
	    "processing": true,
	    "bServerSide": true,
	    ajax: {
			url: "forecast/getForecastControlsForPage",
			type: "POST",
			data: {
				plantId: plantId
			}
		},
        "columns": coulmns
	});
}

//触发新增或修改事件，设置表单操作标志位(0：新增，1：修改，2：预览)
function showforecastModal(flag,id){
	//重置验证框的显示内容
	$("#forecastForm").data('bootstrapValidator').resetForm();
	loadForms(flag,id);
}

/**
 * 加载表单数据
 * @param flag
 * @param id
 */
function loadForms(flag,id){
	$("#operation_flag").val(flag);
	//flag大于时，表单为修改或预览操作，ajax加载数据
	if(flag > 0){
		//设置表单id值
		$("#forecastForm [name='id']").val(id);
		//ajiax获取表单数据
		$.ajax({
	        type: "POST",
	        url: "forecast/getForecastControl",
	        data:{
	        	id : id
	        },
	        dataType: "json", // 返回数据形式为json
	        success: function(result) {
	        	if(result.success){
	        		var formData = result.obj;
	        		setFormValues(formData,"forecastForm");
	        		
	        		//转换预测时间
	        		$("#lfcstTime").val(parseSecondsToTime($("#fcstTime").val()));
	        		
	        		//预览时
	        		if(flag ==2 ){
	        			//提交按钮不可见
	        			$("#bSubmit").hide();
	        			//设置表单元素禁止编辑
	        			setFormValueDisabled("forecastForm");
	        		}
	        		
	        		$("#mymodal").modal();
	        	} else {
	        		swal("","数据加载失败", "error");
	        	}
	        }
	    });
	} else {
		$("#mymodal").modal();
	}
}

//验证表单数据
function validateForm(){
	$("#forecastForm").bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
		excluded: [':disabled'],
		fields: {
			lfcstTime: {
				trigger: 'change',
				validators: {
					notEmpty: {
						message: '预测时间不能为空'
					}
				}
			},
			number: {
				validators: {
					notEmpty: {
						message: '必须为整数'
					},
					regexp: {
						regexp: /^\d+$/,
						message: '必须为整数'
					}
				}
			}
		}
    });
}

//提交表单事件，并确定其操作为新增或是修改
function submitForecast(){
	//提交验证
	var formValidator = $("#forecastForm").data('bootstrapValidator');
	formValidator.validate();
	
	if(formValidator.isValid()){
		var isMain = $("#forecastForm [name='isMain']").val();
		if(isMain ==1 ){
			swal(
				{
					title : "确定将当前预测设为主预测吗?",
					text : "你将无法恢复该数据!",
					type : "warning",
					showCancelButton : true,
					cancelButtonText : "取消",
					confirmButtonColor : "#DD6B55",
					confirmButtonText : "确定!",
					closeOnConfirm : false
				},function (isConfirm){
					if(isConfirm){
						subForecastForm();
					}
				}
			);
		} else {
			subForecastForm();
		}
	}
	
}

function subForecastForm(){
	//禁用提交按钮，防止重复提交
	$("#bSubmit").prop("disabled", true);
	var flag = getOperationFlag();
	var url="";
	if(flag == 0){
		//新增限电
		url="forecast/saveForecastControl";
	} else {
		//修改限电
		url="forecast/editForecastControl";
	}
	
	$("#fcstTime").val(parseTimeToSeconds($("#lfcstTime").val()));
	
	//设置电场id的值
	$("#fplantId").val($("#plantId").val());
	$.ajax({
		type: "POST",
		url: url,
		data:$("#forecastForm").serialize(),
		dataType: "json", // 返回数据形式为json
		success: function(result) {
			if(result.success){
				swal("","操作成功", "success");
				//隐藏弹出框
				$("#mymodal").modal("hide");
				
				//重新加载表单数据
				tableReload();
				//清空表单数据
				resetForm("forecastForm");
			} else {
				swal("",result.msg, "error");
			}
			//设置提交按钮为可用状态
			$("#bSubmit").prop("disabled", false);
		}
	});
}


/**
 * 删除非主预测记录
 * @param id
 * @param isMain 当前记录是否为主预测：1，主预测，0，非主预测。
 */
function deleteforecast(id,isMain){
	console.log(isMain);
	if(isMain == 0){
		swal(
			{
				title : "确定要删除当前记录吗?",
				text : "你将无法恢复该数据!",
				type : "warning",
				showCancelButton : true,
				cancelButtonText : "取消",
				confirmButtonColor : "#DD6B55",
				confirmButtonText : "确定!",
				closeOnConfirm : false
			}, function() {
				var plantId = $("#plantId").val();
				$.ajax({
			        type: "POST",
			        url: "forecast/deleteForecastControl",
			        data:{
			        	id : id,
			        	plantId : plantId
			        },
			        dataType: "json", // 返回数据形式为json
			        success: function(result) {
			        	if(result.success){
			        		swal("","操作成功", "success");
			        	} else {
			        		swal("",result.msg , "error");
			        	}
			        	//隐藏弹出框
			        	$("#mymodal").modal("hide");
			        	//重新加载表单数据
			        	tableReload();
			        }
			    });
			}
		);
	} else {
		swal("", "若要删除当前主预测信息，请先设置其他信息为主预测", "error");
	}
}

//表单重新加载事件
function tableReload(){
	var plantId = $("#plantId").val();
	var oTable = $("#forecast").DataTable();
	oTable.clear();
	oTable.settings()[0].ajax.data = {
		plantId: plantId
	};
	oTable.ajax.reload();
}

//将小时分秒转换为秒数
function parseTimeToSeconds(time){
	var times = time.split(":");
	var seconds = times[0]*3600 + times[1]*60;
	return seconds;
}

//秒数转换为对应的小时分钟
function parseSecondsToTime(seconds){
	var hour = parseInt(seconds/3600);
	var minute = parseInt(seconds%3600/60);
	var time = withZero(hour) + ":" + withZero(minute);
	return time;
}

function withZero(time){
	if(time < 10)
		return "0"+time;
	return time;
}