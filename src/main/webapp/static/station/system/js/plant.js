$(function () {
	//确定datatable显示内容
	var coulmns = [
                   { "data": "aliasname" },
                   { "data": "location" },
                   { "data": "runCapacity"},
                   { "data": "id",//定义操作列的数据
                     "render": function (data) {
                   	  /*
                   	   * 2017-07-04 只保留详情功能
                   	  var operation ="<a class='blue' href='javascript:void(0);' onclick='showPlantModal(1," + data + ")'>修改</a>"
                   	  + " | <a class='blue' href='javascript:void(0);' onclick='showPlantModal(2," + data + ")'>详情</a>"
                   	  + " | <a class='blue' href='javascript:void(0);' onclick='deletePlant(" + data + ")'>删除</a>"
                   	  + " | <a class='blue' href='javascript:void(0);' onclick='showImageModal(" + data + ")'>上传图片</a>"
                   	  */
                    	 var operation = "<a class='blue' href='javascript:void(0);' onclick='showPlantModal(2," + data + ")'>详情</a>";
                    	 return operation;
                     }
                   }
               ]
	
	$("#plant").DataTable({
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
	        "targets": "nosort",
	        "orderable": false
	      }
	    ],
	    //开启服务端处理
	    "processing": true,
	    "bServerSide": true,
	    ajax: {
			url: "plant/getPlantsForPage",
			type: "POST"
		},
        "columns": coulmns
	});
	      
	//启动验证
	validateForm();
	
	$('#imagemodal').on('shown.bs.modal', function () {
		$(window).trigger("resize");
	})
});

//触发新增或修改事件，设置表单操作标志位(0：新增，1：修改，2：预览)
function showPlantModal(flag,id){
	//重置验证框的显示内容
	$("#plantForm").data('bootstrapValidator').resetForm();
	
	$("#operation_flag").val(flag);
	//flag大于时，表单为修改或预览操作，ajax加载数据
	if(flag > 0){
		//ajiax获取表单数据
		$.ajax({
	        type: "POST",
	        url: "plant/getPlant",
	        data:{
	        	id : id
	        },
	        dataType: "json", // 返回数据形式为json
	        success: function(result) {
	        	if(result.success){
	        		var formData = result.obj;
	        		setFormValues(formData,"plantForm");
	        		//预览时
	        		if(flag ==2 ){
	        			//提交按钮不可见
	        			$("#bSubmit").hide();
	        			//设置表单元素禁止编辑
	        			setFormValueDisabled("plantForm");
	        		}
	        		$("#mymodal").modal();
	        	} else {
	        		swal("",result.msg, "error");
	        	}
	        }
	    });
	} else {
		$("#mymodal").modal();
	}
}

//验证表单数据
function validateForm(){
	$("#plantForm").bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
		excluded: [':disabled'],
		fields: {
			aliasname: {
				validators: {
					notEmpty: {
						message: '电厂名称不能为空'
					}
				}
			},
			area: {
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
			allCapacity: {
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
			runCapacity: {
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
			longitude: {
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
						message: '必须为数值且不超过三位小数'
					},
					regexp: {
						regexp: /^\d+(\.\d{1,3})?$/,
						message: '必须为数值且不超过三位小数'
					}
				}
			},
			powerDensity: {
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
			telphone: {
				validators: {
					notEmpty: {
						message: '联系电话不能为空'
					},
					regexp: {
                        regexp: /^(0?(13|14|15|18)[0-9]{9})$|^(([0-9]{3,4}-)[0-9]{7,8})$/,
                        message: '请输入正确的手机或座机xxx(xxxx)-xxxxxxxx号码'
                    }
				}
			}
		}
    });
}


//提交表单事件，并确定其操作为新增或是修改
function submitPlant(){
	//提交验证
	var formValidator = $("#plantForm").data('bootstrapValidator');
	formValidator.validate();
	if(formValidator.isValid()){
		//禁用提交按钮，防止重复提交
		$("#bSubmit").prop("disabled", true);
		var flag = getOperationFlag();
		var url="";
		if(flag == 0){
			//新增风场
			url="plant/savePlant";
		} else {
			//修改风场
			url="plant/editPlant";
		}
		
		$.ajax({
			type: "POST",
			url: url,
			data:$("#plantForm").serialize(),
			dataType: "json", // 返回数据形式为json
			success: function(result) {
				if(result.success){
					swal("","操作成功", "success");
					//隐藏弹出框
					$("#mymodal").modal("hide");
					//重新加载表单数据
					$("#plant").DataTable().ajax.reload();
					//清空表单数据
					resetForm("plantForm");
				} else {
					swal("",result.msg, "error");
				}
				//设置提交按钮为可用状态
				$("#bSubmit").prop("disabled", false);
			}
		});
	}
}

//删除风场信息
function deletePlant(id){
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
		        url: "plant/deletePlant",
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
		        	$("#plant").DataTable().ajax.reload();
		        }
		    });
		}
	);
}

//显示图片模态框
function showImageModal(id){
    $("#plant_id").val(id);
	$("#imagemodal").modal();
//	$(window).trigger("resize");
	//触发文件选择框的点击事件
//	alert($("#filePicker > div:eq(1) > label").html());
//	$("#filePicker > div:eq(1) > label").trigger("click");
}
