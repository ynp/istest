$(function () {
	queryPartSet();
	//定义表单的时间选择控件
	$("#limitPowerForm [name$='time']").datetimepicker({
		format: "yyyy-mm-dd hh:ii:00",
		weekStart: 1,
		autoclose: true,
		todayBtn: 'linked',
		language: 'zh-CN'
	});
	
	/*查询*/
	$("#search").click(function() {
		if(checkQueryTime()){
			tableReload();
		}
	});
	
	/*导出*/
	$("#export").click(function() {
		if(checkQueryTime()){
			var starttime = $("#starttime").val();
			var endtime = $("#endtime").val();
			var fid = $("#plantId").val();
			var flag=0;
			var formflag=$("#fromflag").val();
			if(formflag=="spfs"){//为光伏时
				flag=1;
			}
			location.href = getWebRootUrl()+"/limitPower/exportLimitPower?fid=" + fid + "&sStarttime=" + starttime + "&sEndtime=" + endtime+"&flag="+flag;;
		}
	});
	
	//启动验证
	validateForm();
});

//检查查询的时间条件
function checkQueryTime(){
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	if(starttime != null && starttime!="" && starttime != null && starttime!=""){
		return true;
	} else {
		swal("请选择开始时间与结束时间");
	}
	return false;
}
//初始化报表数据
function showDataTable(){
	var fid = $("#plantId").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	//确定datatable显示内容
	var coulmns;
	var formflag=$("#fromflag").val();
	if(formflag=="spfs"){//为光伏时
		coulmns = [
		           { "data": "occurtime" },
                   { "data": "starttime" },
                   { "data": "endtime" },
                   { "data": "p" },
                   { "data": "mode",
                     "render": function (data) {
                   	  var mode="";
                   	  if(data==0){
                   		  mode="手动限电";
                   	  } else if(data==1){
                   		  mode="自动限电";
                   	  }
                         return mode;
                     }
                   },
                   { "data": "limittype",
                     "render": function ( data) {
                   	  var limittype="";
                   	  if(data==0){
                   		  limittype="实时限电";
                   	  } else if(data==1){
                   		  limittype="日计划";
                   	  }
                         return limittype;
                     }	
                   },
                   { "data": "id",//定义操作列的数据
                     "render": function (data) {
                     	  var operation ="<a class='blue' href='javascript:void(0);' onclick='showLimitPowerModal(1," + data + ")'>修改" + "</a>"
                     	  + " | <a class='blue' href='javascript:void(0);' onclick='showLimitPowerModal(2," + data + ")'>详情" + "</a>"
                     	  + " | <a class='blue' href='javascript:void(0);' onclick='deleteLimitPower(" + data + ")'>删除" + "</a>"
                     	  return operation;
                     }
                   }
               ]
	} else {
		coulmns = [
                   { "data": "occurtime" },
                   { "data": "starttime" },
                   { "data": "endtime" },
                   { "data": "p" },
                   { "data": "mode",
                     "render": function (data) {
                   	  var mode="";
                   	  if(data==0){
                   		  mode="手动限电";
                   	  } else if(data==1){
                   		  mode="自动限电";
                   	  }
                         return mode;
                     }
                   },
                   { "data": "limittype",
                     "render": function ( data) {
                   	  var limittype="";
                   	  if(data==0){
                   		  limittype="实时限电";
                   	  } else if(data==1){
                   		  limittype="日计划";
                   	  }
                         return limittype;
                     }	
                   },
                   { "data": "equipmentids" },
                   { "data": "id",//定义操作列的数据
                     "render": function (data) {
                     	  var operation ="<a class='blue' href='javascript:void(0);' onclick='showLimitPowerModal(1," + data + ")'>修改" + "</a>"
                     	  + " | <a class='blue' href='javascript:void(0);' onclick='showLimitPowerModal(2," + data + ")'>详情" + "</a>"
                     	  + " | <a class='blue' href='javascript:void(0);' onclick='deleteLimitPower(" + data + ")'>删除" + "</a>"
                     	  return operation;
                     }
                   }
               ]
	}
	$("#limitpower").DataTable({
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
			url: "limitPower/getLimitPowersForPage",
			type: "POST",
			data: {
				fid: fid,
				sStarttime: starttime,
				sEndtime: endtime
			}
		},
        "columns": coulmns
	});
}

//触发新增或修改事件，设置表单操作标志位(0：新增，1：修改，2：预览)
function showLimitPowerModal(flag,id){
	//重置验证框的显示内容
	$("#limitPowerForm").data('bootstrapValidator').resetForm();
	
	var formflag=$("#fromflag").val();
	if(formflag=="spfs"){//为光伏时,直接加载数据
		loadForms(flag,id);
	} else {
		//构造风机编号的下拉框，同时调用回调函数，处理弹出框事件
		appendEquipmentids(loadForms,flag,id);
	}
}

//拼凑风机编号的选项值
function appendEquipmentids(callback,flag,id){
	//清空原有的选项值
	$("#equipmentids").html("");
	$("#equipmentids").select2();
	var options="";
	var plantId = $("#plantId").val();
	$.ajax({
		type: "POST",
		url: "windturbine/getWindturbines",
		data: {
			plantId : plantId,
			flag : true
		},
		dataType: "json",
		success: function(data){
			if(data.success){
				var equipments = data.obj;
				$.each(equipments,function(index,val){
					$("#equipmentids").append("<option value='"+val.number+"'>"+val.number+"</option>");
				});
				callback(flag,id);
			}
		}
	});
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
		$("#limitPowerForm [name='id']").val(id);
		//ajiax获取表单数据
		$.ajax({
	        type: "POST",
	        url: "limitPower/getLimitPower",
	        data:{
	        	id : id
	        },
	        dataType: "json", // 返回数据形式为json
	        success: function(result) {
	        	if(result.success){
	        		var formData = result.obj;
	        		setFormValues(formData,"limitPowerForm");
	        		
	        		var formflag=$("#fromflag").val();
	        		if(formflag != "spfs"){//为光伏时,直接加载数据
	        			//回显风机编号的选中值(trigger触发change事件)
	        			var equipmentids="";
	        			if(formData.equipmentids !=null && formData.equipmentids !=""){
	        				equipmentids = formData.equipmentids;
	        			}
	        			$("#equipmentids").select2().val(equipmentids.split(":")).trigger("change");
	        		}
	        		
	        		//预览时
	        		if(flag ==2 ){
	        			//提交按钮不可见
	        			$("#bSubmit").hide();
	        			//设置表单元素禁止编辑
	        			setFormValueDisabled("limitPowerForm");
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
	$("#limitPowerForm").bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
		excluded: [':disabled'],
		fields: {
			starttime: {
				trigger: 'change',
				validators: {
					notEmpty: {
						message: '开始时间不能为空'
					},
					regexp: {
						regexp: /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/,
						message: '请输入正确格式的日期'
					},
					 callback: {
			               message: '开始时间不能小于当前时间',
			               callback: function(value, validator) {
			               var myDate=new Date().format("yyyy-MM-dd hh:mm:ss");
				               if(value>myDate){
				            	   return true;
				               }else{
				            	   return false;
				               }
			               }
			           }
				}
			},
			endtime: {
				trigger: 'change',
				validators: {
					notEmpty: {
						message: '结束时间不能为空'
					},
					regexp: {
						regexp: /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/,
						message: '请输入正确格式的日期'
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
function submitLimitPower(){
	//提交验证
	var formValidator = $("#limitPowerForm").data('bootstrapValidator');
	formValidator.validate();
	if(formValidator.isValid()){
		//禁用提交按钮，防止重复提交
		$("#bSubmit").prop("disabled", true);
		var flag = getOperationFlag();
		var url="";
		if(flag == 0){
			//新增限电
			url="limitPower/saveLimitPower";
		} else {
			//修改限电
			url="limitPower/editLimitPower";
		}
		//设置电场id的值
		$("#lplantId").val($("#plantId").val());
		$.ajax({
			type: "POST",
			url: url,
			data:$("#limitPowerForm").serialize(),
			dataType: "json", // 返回数据形式为json
			success: function(result) {
				if(result.success){
					swal("","操作成功", "success");
					//隐藏弹出框
					$("#mymodal").modal("hide");
					
					var endtime = $("#endtime").val();
					var nowTime = new Date().getTime();
					//如果是ie9则转换日期的格式进行验证，低版本IE：不支持 Date.parse('2015-02-05 12:39:30') 支持 Date.parse('2015/02/05 12:39:30')
					if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){
						endtime=endtime.replace(/-/g, "/");
					} 
					
					if(Date.parse(endtime) <= nowTime){
						//查询结束时间重置
						$("#endtime").val(Date.prototype.formatdate(new Date(nowTime + 60*1000) , "yyyy-MM-dd hh:mm:ss"));
					}
					
					//重新加载表单数据
					tableReload();
					//清空表单数据
					resetForm("limitPowerForm");
				} else {
					swal("",result.msg, "error");
				}
				//设置提交按钮为可用状态
				$("#bSubmit").prop("disabled", false);
			}
		});
	}
}


//删除限电信息
function deleteLimitPower(id){
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
		        url: "limitPower/deleteLimitPower",
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
	var fid = $("#plantId").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var oTable = $("#limitpower").DataTable();
	oTable.clear();
	oTable.settings()[0].ajax.data = {
		fid: fid,
		sStarttime: starttime,
		sEndtime: endtime
	};
	oTable.ajax.reload();
}
