//初次初始化功率曲线列表
function loadPowercurveTable(equiptypeId){
	$("#powercurve").DataTable({
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
			url: "powercurve/getPowercurvesForPage",
			type: "POST",
			data: {
				equiptypeId: equiptypeId
			}
		},
        "columns": [
                    { "data": "factorValue"},
                    { "data": "p" }
                    /*{ "data": "id",//定义操作列的数据
                      "render": function (data) {
                      	  var operation ="<a class='blue' href='javascript:void(0);' onclick='showPowercurve(1," + data + ")'>修改" + "</a>"
                      	  + " | <a class='blue' href='javascript:void(0);' onclick='deletePowercurve(" + data + ")'>删除" + "</a>"
                      	  return operation;
                      }
                    }*/
                ]
	});
}

//当机组型号数据选择变化时，重新加载曲线列表数据
function reLoadPowercurveTable(equiptypeId){
	var oTable = $("#powercurve").DataTable();
	oTable.clear();
	oTable.settings()[0].ajax.data = {
		"equiptypeId": equiptypeId
	};
	oTable.ajax.reload();
}

//触发新增或修改事件，设置表单操作标志位(0：新增，1：修改，2：预览)
function showPowercurve(flag,id){
	//重置验证框的显示内容
	$("#powercurveForm").data('bootstrapValidator').resetForm();
	
	$("#operation_flag").val(flag);
	//flag大于时，表单为修改或预览操作，ajax加载数据
	if(flag > 0){
		//设置表单id值，在进行修改或删除操作时，便不用进行表单的赋值操作了
		$("#powercurveForm [name='id']").val(id);
		//ajiax获取表单数据
		$.ajax({
	        type: "POST",
	        url: "powercurve/getPowercurve",
	        data:{
	        	id : id
	        },
	        dataType: "json", // 返回数据形式为json
	        success: function(result) {
	        	if(result.success){
	        		var formData = result.obj;
	        		setFormValues(formData,"powercurveForm");
	        		//预览时
	        		if(flag ==2 ){
	        			//提交按钮不可见
	        			$("#bCSubmit").hide();
	        			//设置表单元素禁止编辑
	        			setFormValueDisabled("powercurveForm");
	        		}
	        		$("#curvemodal").modal();
	        	} else {
	        		swal("","数据加载失败", "error");
	        	}
	        }
	    });
	} else {
		$("#curvemodal").modal();
	}
}

//提交表单事件，并确定其操作为新增或是修改
function submitPowercurve(){
	//提交验证
	var formValidator = $("#powercurveForm").data('bootstrapValidator');
	formValidator.validate();
	if(formValidator.isValid()){
		//禁用提交按钮，防止重复提交
		$("#bCSubmit").prop("disabled", true);
		var flag = getOperationFlag();
		var url="";
		if(flag == 0){
			//新增功率曲线
			url="powercurve/savePowercurve";
		} else {
			//修改功率曲线
			url="powercurve/editPowercurve";
		}
		
		$.ajax({
			type: "POST",
			url: url,
			data:$("#powercurveForm").serialize(),
			dataType: "json", // 返回数据形式为json
			success: function(result) {
				if(result.success){
					swal("","操作成功", "success");
					//隐藏弹出框
					$("#curvemodal").modal("hide");
					//重新加载表单数据
					$("#powercurve").DataTable().ajax.reload();
					
					var equiptypeId=$("#powercurveForm [name='equiptypeId']").val();
					//重置表单信息
					resetCurveForm("powercurveForm");
					
					//重新设置隐藏的型号值
					$("#powercurveForm [name='equiptypeId']").val(equiptypeId);
				} else {
					swal("","操作失败", "error");
				}
				//设置提交按钮为可用状态
				$("#bCSubmit").prop("disabled", false);
			}
		});
	}
}

//删除功率曲线信息
function deletePowercurve(id){
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
		        url: "powercurve/deletePowercurve",
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
		        	$("#curvemodal").modal("hide");
		        	//重新加载表单数据
		        	$("#powercurve").DataTable().ajax.reload();
		        }
		    });
		}
	);
}

//重置form表单的数据和元素的设置
function resetCurveForm(formId){
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
	$("#bCSubmit").show();
	//恢复提交按钮的状态
	$("#bCSubmit").prop("disabled", false);
}