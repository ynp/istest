$(function () {
	/**
	 * 初始化电场选择按钮,与表单电场名称选择
	 */
	$.ajax({
		type: "POST",
		url: "plant/getPlants",
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				$.each(data.obj, function(index, item) {
					$("<option></option>").val(item.id).text(item.aliasname).appendTo($("#plantId"));
					$("<option></option>").val(item.id).text(item.aliasname).appendTo($("#windturbineForm [name='plantId']"));
				});
				//在设置完电场的下拉列表后，调用对应其dataTable的加载方法
				showDataTable();
			}
		}
	});
	
	//设置form表单的日期控件
	$("#windturbineForm [name='runtime']").datetimepicker({
		format: "yyyy-mm-dd hh:ii:ss",
		weekStart: 1,
		autoclose: true,
		todayBtn: 'linked',
		language: 'zh-CN'
	});
	
	//启动表单验证
	validateForm();
});

//回调函数加载报表数据
function showDataTable(){
	var plantId = $("#plantId").val();
	//确定datatable显示内容
	var coulmns = [
            { "data": "number" },
            { "data": "aliasname" },
            { "data": "equiptypeName" },
            { "data": "farmName" },
            { "data": "longitude"},
            { "data": "latitude"},
            { "data": "altitude" },
            { "data": "isTypical",
        	  "render": function ( data) {
            	  var isTypical="";
            	  if(data==0){
            		  isTypical="否";
            	  } else if(data==1){
            		  isTypical="是";
            	  }
                  return isTypical;
              }	
            },
            { "data": "isForecast",
        	  "render": function (data) {
            	  var isForecast="";
            	  if(data==0){
            		  isForecast="参与";
            	  } else if(data==1){
            		  isForecast="不参与";
            	  }
                  return isForecast;
              }	
            },
            { "data": "runtime"},
            { "data": "id",//定义操作列的数据
                "render": function (data) {
              	  /*var operation ="<a class='blue' href='javascript:void(0);' onclick='initWindturbine(1," + data + ")'>修改" + "</a>"
              	  + " | <a class='blue' href='javascript:void(0);' onclick='initWindturbine(2," + data + ")'>详情" + "</a>"
              	  + " | <a class='blue' href='javascript:void(0);' onclick='deleteWindturbine(" + data + ")'>删除" + "</a>"*/
                	var operation = "<a class='blue' href='javascript:void(0);' onclick='initWindturbine(2," + data + ")'>详情</a>"
                	return operation;
                }
            }
        ]
	
	$("#windturbine").DataTable({
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
			url: "windturbine/getWindturbinesForPage",
			type: "POST",
			data: {
				plantId: plantId
			}
		},
        "columns": coulmns
	});
}

//增改查时，加载型号配置数据
function initWindturbine(flag,id){
	$.ajax({
        type: "POST",
        url: "windturbineType/getWindturbineTypes",
        data:{},
        dataType: "json", // 返回数据形式为json
        success: function(result) {
        	var options = "";
        	if(result.success){
        		$("#equiptypeId").html("");
        		$.each(result.obj, function(index, item) {
					options += "<option value='"+ item.id +"'>"+ item.typeCode +"</option>";
				});
        		$("#equiptypeId").append(options);
        		showWindturbineModal(flag,id);
        	} else {
        		swal("","数据加载失败", "error");
        	}
        }
    });
}

//触发新增或修改事件，设置表单操作标志位(0：新增，1：修改，2：预览)
function showWindturbineModal(flag,id){
	//重置验证框的显示内容
	$("#windturbineForm").data('bootstrapValidator').resetForm();
	
	$("#operation_flag").val(flag);
	//flag大于时，表单为修改或预览操作，ajax加载数据
	if(flag > 0){
		//设置表单id值
		$("#windturbineForm [name='id']").val(id);
		//ajiax获取表单数据
		$.ajax({
	        type: "POST",
	        url: "windturbine/getWindturbine",
	        data:{
	        	id : id
	        },
	        dataType: "json", // 返回数据形式为json
	        success: function(result) {
	        	if(result.success){
	        		var formData = result.obj;
	        		setFormValues(formData,"windturbineForm");
	        		//预览时
	        		if(flag ==2 ){
	        			//提交按钮不可见
	        			$("#bSubmit").hide();
	        			//设置表单元素禁止编辑
	        			setFormValueDisabled("windturbineForm");
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
	$("#windturbineForm").bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
		excluded: [':disabled'],
		fields: {
			number: {
				validators: {
					notEmpty: {
						message: '风机编号为整数且不能为空'
					},
					integer: {
                        message: '必须为整数'
                    }
				}
			},
			aliasname: {
				validators: {
					notEmpty: {
						message: '风机名称不能为空'
					}
				}
			},
			latitude: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,4})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			altitude: {
				validators: {
					notEmpty: {
						message: '必须为整数'
					},
					integer: {
						message: '必须为整数'
					}
				}
			},
			runtime: {
				trigger: 'change',
				validators: {
					notEmpty: {
						message: '并网时间不能为空'
					},
					regexp: {
						regexp: /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/,
						message: '请输入正确格式的日期'
					}
				}
			},
		}
    });
}

//提交表单事件，并确定其操作为新增或是修改
function submitWindturbine(){
	//提交验证
	var formValidator = $("#windturbineForm").data('bootstrapValidator');
	formValidator.validate();
	if(formValidator.isValid()){
		//禁用提交按钮，防止重复提交
		$("#bSubmit").prop("disabled", true);
		var flag = getOperationFlag();
		var url="";
		if(flag == 0){
			//新增风机
			url="windturbine/saveWindturbine";
		} else {
			//修改风机
			url="windturbine/editWindturbine";
		}
		
		$.ajax({
			type: "POST",
			url: url,
			data:$("#windturbineForm").serialize(),
			dataType: "json", // 返回数据形式为json
			success: function(result) {
				if(result.success){
					swal("","操作成功", "success");
					//隐藏弹出框
					$("#mymodal").modal("hide");
					//重新加载表单数据
					tableReload();
					//清空表单数据
					resetForm("windturbineForm");
				} else {
					swal("",result.msg, "error");
				}
				//设置提交按钮为可用状态
				$("#bSubmit").prop("disabled", false);
			}
		});
	}
}

//删除风机信息
function deleteWindturbine(id){
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
			$.ajax({
		        type: "POST",
		        url: "windturbine/deleteWindturbine",
		        data:{
		        	id : id
		        },
		        dataType: "json", // 返回数据形式为json
		        success: function(result) {
		        	if(result.success){
		        		swal("","操作成功", "success");
		        	} else {
		        		swal("","操作失败", "error");
		        	}
		        	//隐藏弹出框
		        	$("#mymodal").modal("hide");
		        	//重新加载表单数据
		        	tableReload();
		        }
		    });
		}
	);
}

//表单重新加载事件
function tableReload(){
	var plantId = $("#plantId").val();
	var oTable = $("#windturbine").DataTable();
	oTable.clear();
	oTable.settings()[0].ajax.data = {
		plantId: plantId
	};
	oTable.ajax.reload();
}
