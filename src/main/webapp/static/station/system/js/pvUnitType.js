var selectRowIndex=0;//设置设备型号选中行索引
var curveTableInitFlag = false;//功率曲线报表是否已加载的标志位
$(function () {
	
	//确定datatable显示内容
	var coulmns = [
                    { "data": "unittype" },
                    { "data": "size" },
                    { "data": "componentNum"},
                    { "data": "factory" },
                    { "data": "batteryType"},
                    { "data": "id",//定义操作列的数据
	                  "render": function (data) {
                      	  /*var operation ="<a class='blue' href='javascript:void(0);' onclick='showPvUnitType(1," + data + ")'>修改" + "</a>"
                      	  + " | <a class='blue' href='javascript:void(0);' onclick='showPvUnitType(2," + data + ")'>详情" + "</a>"
                      	  + " | <a class='blue' href='javascript:void(0);' onclick='deletePvUnitType(" + data + ")'>删除" + "</a>"*/
                      	  var operation ="<a class='blue' href='javascript:void(0);' onclick='showPvUnitType(2," + data + ")'>详情</a>";
                      	  return operation;
                      }
	                }
                ]
	
	var table=$("#pvUnitType").DataTable({
		//汉化
	    language: {
	        "sProcessing": "处理中...",
	        "sLengthMenu": "显示 _MENU_ 项",
	        "sZeroRecords": "没有匹配结果",
	        "sInfo": "显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
	        "sInfoEmpty": "显示第 0 至 0 项，共 0 项",
	        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
	        "sInfoPostFix": "",
	        "sSearch": "搜索:",
	        "sUrl": "",
	        "sEmptyTable": "暂无信息",
	        "sLoadingRecords": "载入中...",
	        "sInfoThousands": ",",
	    },
	    //禁用分页
	    "paging": false,
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
			url: "pvUnitType/getPvUnitTypesForPage",
			type: "POST"
		},
		"createdRow": function(row, data, dataIndex) {
			//为第一行设置默认选中事件，同时加载功率曲线的数据
		    if(dataIndex == selectRowIndex){
		    	//初始化加载和删除后设置加载功率曲线数据
		    	var flag= $("#operation_flag").val();
		    	if(flag <= 0){
		    		var equiptypeId = data.id;
		    		//将当前的机组型号设置到功率曲线的form表单中
		    		$("#powercurveForm [name='equiptypeId']").val(equiptypeId);
		    		if(curveTableInitFlag){//已经加载过一次，使用重新加载
		    			reLoadPowercurveTable(equiptypeId);
		    		} else {//初始化加载
		    			loadPowercurveTable(equiptypeId);
		    			curveTableInitFlag=true;
		    		}
		    	}
				$(row).addClass( 'selected' );
		    }
		},
        "columns": coulmns
	});
	
	//为选中行绑定点击事件，加载功率曲线的相关数据
	$('#pvUnitType tbody').on( 'click', 'tr', function () {
		//设置选中样式
		if ($(this).hasClass('selected') ) {
			$(this).removeClass('selected');
			$("#curveAdd").prop("disabled", true);
		} else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			$("#curveAdd").prop("disabled", false);
		}
		
		//设置当前行号为选中行
		selectRowIndex=table.row(this).index();
		//获取选定行的机组型号
		var equiptypeId=table.row(this).data().id;
		//将当前的机组型号设置到功率曲线的form表单中
		$("#powercurveForm [name='equiptypeId']").val(equiptypeId);
		
		//加载功率曲线列表
		reLoadPowercurveTable(equiptypeId);
    });
	
	//验证字段
	validateForm();
});

//触发新增或修改事件，设置表单操作标志位(0：新增，1：修改，2：预览)
function showPvUnitType(flag,id){
	//重置验证框的显示内容
	$("#pvUnitTypeForm").data('bootstrapValidator').resetForm();
	
	$("#operation_flag").val(flag);
	//flag大于时，表单为修改或预览操作，ajax加载数据
	if(flag > 0){
		//设置表单id值
		$("#pvUnitTypeForm [name='id']").val(id);
		//ajiax获取表单数据
		$.ajax({
	        type: "POST",
	        url: "pvUnitType/getPvUnitType",
	        data:{
	        	id : id
	        },
	        dataType: "json", // 返回数据形式为json
	        success: function(result) {
	        	if(result.success){
	        		var formData = result.obj;
	        		setFormValues(formData,"pvUnitTypeForm");
	        		//预览时
	        		if(flag ==2){
	        			//提交按钮不可见
	        			$("#bTSubmit").hide();
	        			//设置表单元素禁止编辑
	        			setFormValueDisabled("pvUnitTypeForm");
	        		}
	        		$("#typemodal").modal();
	        	} else {
	        		swal("","数据加载失败", "error");
	        	}
	        }
	    });
	} else {
		$("#typemodal").modal();
	}
}

//验证光伏组件或机具型号的表单数据
function validateForm(){
	$("#pvUnitTypeForm").bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
		excluded: [':disabled'],
		fields: {
			unittype: {
				validators: {
					notEmpty: {
						message: '组件型号不能为空'
					}
				}
			},
			componentNum: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			dgtransrate: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			outputPower: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			modEfficiency: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			effectiveIrradiace: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			attenuationRate: {
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
	
	//验证功率曲线的表单
	$("#powercurveForm").bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
		excluded: [':disabled'],
		fields: {
			factorval: {
				validators: {
					notEmpty: {
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			p: {
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
function submitPvUnitType(){
	//提交验证
	var formValidator = $("#pvUnitTypeForm").data('bootstrapValidator');
	formValidator.validate();
	if(formValidator.isValid()){
		//禁用提交按钮，防止重复提交
		$("#bTSubmit").prop("disabled", true);
		var flag = getOperationFlag();
		var url="";
		if(flag == 0){
			//新增后初始化选中状态为第一行
			selectRowIndex=0;
			//新增机组型号
			url="pvUnitType/savePvUnitType";
		} else {
			//修改机组型号
			url="pvUnitType/editPvUnitType";
		}
		
		$.ajax({
			type: "POST",
			url: url,
			data:$("#pvUnitTypeForm").serialize(),
			dataType: "json", // 返回数据形式为json
			success: function(result) {
				if(result.success){
					swal("","操作成功", "success");
					//隐藏弹出框
					$("#typemodal").modal("hide");
					//重新加载表单数据
					reloadTypeTable();
					
					//重置表单信息
					resetTypeForm("pvUnitTypeForm");
				} else {
					swal("",result.msg, "error");
				}
				//设置提交按钮为可用状态
				$("#bTSubmit").prop("disabled", false);
			}
		});
	}
}

//删除机组型号信息
function deletePvUnitType(id){
	//删除后重置操作标志位
	$("#operation_flag").val(0);
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
		        url: "pvUnitType/deletePvUnitType",
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
		        	$("#typemodal").modal("hide");
		        	//重置选中行为第一行
		        	selectRowIndex=0;
		        	//重新加载表单数据
		        	reloadTypeTable();
		        }
		    });
		}
	);
}

//重置form表单的数据和元素的设置
function resetTypeForm(formId){
	//清空表单的数据
	$("#"+ formId +" [name]").each(function(i){
		formElement = $(this);
		//移除表单不可编辑属性
		formElement.removeAttr("disabled");
		if(formElement[0].tagName =="SELECT"){//设置默认选中第一个值
			formElement.prop('selectedIndex', 0);
		} else {
			formElement.val("");
		}
	});
	//使提交按钮可见
	$("#bTSubmit").show();
	//恢复提交按钮的状态
	$("#bTSubmit").prop("disabled", false);
}

//重新加载报表
function reloadTypeTable(){
	var oTable = $("#pvUnitType").DataTable();
	oTable.clear();
	oTable.ajax.reload();
}

