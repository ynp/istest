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
					$("<option></option>").val(item.id).text(item.aliasname).appendTo($("#pvUnitForm [name='plantId']"));
				});
				//在设置完电场的下拉列表后，调用对应其dataTable的加载方法
				showDataTable();
			}
		}
	});
	
	//设置form表单的日期控件
	$("#pvUnitForm [name='runtime']").datetimepicker({
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
            { "data": "unitId" },
            { "data": "aliasname" },
            { "data": "equiptypeName" },
            { "data": "capacity" },
            { "data": "runtime" },
            { "data": "isForecast",
            	"render": function (data) {
            		var isfcst="";
            		if(data==0){
            			isfcst="参与";
            		} else if(data==1){
            			isfcst="不参与";
            		}
            		return isfcst;
            	}	
            },
            { "data": "statusName" },
            { "data": "id",//定义操作列的数据
                "render": function (data) {
              	  /*var operation ="<a class='blue' href='javascript:void(0);' onclick='initEquipmentinfo(1," + data + ")'>修改" + "</a>"
              	  + " | <a class='blue' href='javascript:void(0);' onclick='initEquipmentinfo(2," + data + ")'>详情" + "</a>"
              	  + " | <a class='blue' href='javascript:void(0);' onclick='deletePvUnit(" + data + ")'>删除" + "</a>"*/
                	var operation = "<a class='blue' href='javascript:void(0);' onclick='initEquipmentinfo(2," + data + ")'>详情</a>";
                	return operation;
                }
            }
        ]
	
	$("#pvUnit").DataTable({
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
	    "lengthMenu":  [ 5, 10, 25, 50, 75, 100],
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
			url: "pvUnit/getPvUnitsForPage",
			type: "POST",
			data: {
				plantId: plantId
			}
		},
        "columns": coulmns
	});
}

//增改查时，加载型号配置数据
function initEquipmentinfo(flag,id){
	$.ajax({
        type: "POST",
        url: "pvUnitType/getPvUnitTypes",
        data:{},
        dataType: "json", // 返回数据形式为json
        success: function(result) {
        	var options = "";
        	if(result.success){
        		$("#equiptypeId").html("");
        		$.each(result.obj, function(index, item) {
					options += "<option value='"+ item.id +"'>"+ item.unittype +"</option>";
				});
        		$("#equiptypeId").append(options);
        		showEquipmentinfoModal(flag,id);
        	} else {
        		swal("","数据加载失败", "error");
        	}
        }
    });
}

//触发新增或修改事件，设置表单操作标志位(0：新增，1：修改，2：预览)
function showEquipmentinfoModal(flag,id){
	//重置验证框的显示内容
	$("#pvUnitForm").data('bootstrapValidator').resetForm();
	
	$("#operation_flag").val(flag);
	//flag大于时，表单为修改或预览操作，ajax加载数据
	if(flag > 0){
		//设置表单id值
		$("#pvUnitForm [name='id']").val(id);
		//ajiax获取表单数据
		$.ajax({
	        type: "POST",
	        url: "pvUnit/getPvUnit",
	        data:{
	        	id : id
	        },
	        dataType: "json", // 返回数据形式为json
	        success: function(result) {
	        	if(result.success){
	        		var formData = result.obj;
	        		setFormValues(formData,"pvUnitForm");
	        		//预览时
	        		if(flag ==2 ){
	        			//提交按钮不可见
	        			$("#bSubmit").hide();
	        			//设置表单元素禁止编辑
	        			setFormValueDisabled("pvUnitForm");
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
	$("#pvUnitForm").bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
		excluded: [':disabled'],
		fields: {
			unitId: {
				validators: {
					notEmpty: {
						message: '逆变器编号必须为整数'
					},
					integer: {
                        message: '必须为整数'
                    }
				}
			},
			aliasname: {
				validators: {
					notEmpty: {
						message: '逆变器名称不能为空'
					}
				}
			},
			capacity: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			}
		}
    });
}

//提交表单事件，并确定其操作为新增或是修改
function submitPvUnit(){
	//提交验证
	var formValidator = $("#pvUnitForm").data('bootstrapValidator');
	formValidator.validate();
	if(formValidator.isValid()){
		//禁用提交按钮，防止重复提交
		$("#bSubmit").prop("disabled", true);
		var flag = getOperationFlag();
		var url="";
		if(flag == 0){
			//新增机组或逆变器
			url="pvUnit/savePvUnit";
		} else {
			//修改机组或逆变器
			url="pvUnit/editPvUnit";
		}
		
		$("#lplantId").val($("#plantId").val());
		
		$.ajax({
			type: "POST",
			url: url,
			data:$("#pvUnitForm").serialize(),
			dataType: "json", // 返回数据形式为json
			success: function(result) {
				if(result.success){
					swal("","操作成功", "success");
					//隐藏弹出框
					$("#mymodal").modal("hide");
					//重新加载表单数据
					tableReload();
					//清空表单数据
					resetForm("pvUnitForm");
				} else {
					swal("",result.msg, "error");
				}
				//设置提交按钮为可用状态
				$("#bSubmit").prop("disabled", false);
			}
		});
	}
}

//删除机组或逆变器信息
function deletePvUnit(id){
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
		        url: "pvUnit/deletePvUnit",
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
	var oTable = $("#pvUnit").DataTable();
	oTable.clear();
	oTable.settings()[0].ajax.data = {
		plantId: plantId
	};
	oTable.ajax.reload();
}
