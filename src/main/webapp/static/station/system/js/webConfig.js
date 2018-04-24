//表单验证-标题
function validProjectForm(){
	 $("#projectForm").validate({
	    rules: {
	    	projectName: {
	    		 required: true,
		    	rangelength: [1,255]
		    },
		    copyright: {
	    		 required: true,
		    	rangelength: [1,255]
		    },
		    footer: {
	    		 required: true,
		    	rangelength: [1,255]
		    },
	    },
	    messages: {
	    	projectName: {
	    		required: "请输入操作页面头部标题",
		    	rangelength: "1-255个字符",
		    },
		    copyright: {
	    		required: "请输入版权信息",
		    	rangelength: "1-255个字符",
		    },
		    footer: {
	    		required: "请输入页脚",
		    	rangelength: "1-255个字符",
		    }
	    }
	});
}

//验证告警级别
function validOtherForm(){
	 $("#otherForm").validate({
	    rules: {
	    	priorityCode: {
	    		 required: true,
		    	rangelength: [1,255]
		    },
		    alarmTimeInterval: {
		    	 required: true,
	    		   digits:true
		    },
		    alarmPopFlag: {
	    		 required: true,
		    },
		    fcstDayType: {
		    	 required: true,
	    		   digits:true,
	    		   	range:[1,10],
		    },
		    sfcstTagType: {
		    	required: true,
	    		   digits:true,
	    		   range:[1,40],
		    },
		    nwpDayType: {
		    	required: true,
	    		   digits:true,
	    		   range:[1,3],
		    },
	    },
	    messages: {
	    	priorityCode: {
	    		required: "请选择告警级别",
		    	rangelength: "1-255个字符",
		    },
		    alarmTimeInterval: {
		    	required: "请填写告警弹框时间间隔(秒)",
	    		  digits: "请输入整数"
		    },
		    alarmPopFlag: {
	    		required: "请选择告警弹窗开关",
		    },
		    fcstDayType: {
		    	required: "请填写短期预测点标识",
	    		  digits: "请输入整数",
	    		   range: "请输入1-10之间的数字"
		    },
		    sfcstTagType: {
		    	required: "请填写超短期预测点标识",
	    		  digits: "请输入整数",
	    		   range: "请输入1-40之间的数字"
		    },
		    nwpDayType: {
		    	required: "请填写气象预测日标识",
	    		  digits: "请输入整数",
	    		   range: "请输入1-3之间的数字"
		    },
	    }
	});
} 
//验证大图标
function validateBigLogo(){
	 $("#bigLogoForm").validate({
	    rules: {
	    	bigLogoValue: {
	    		 required: true,
		    	rangelength: [1,255]
		    }
	    },
	    messages: {
	    	bigLogoValue: {
	    		required: "请选择公司LOGO图片",
		    	rangelength: "1-255个字符",
		    }
	    }
	});
}
//验证小图标
function validateSmallLogo(){
	 $("#smallLogoForm").validate({
	    rules: {
	    	smallLogoValue: {
	    		 required: true,
		    	rangelength: [1,255]
		    }
	    },
	    messages: {
	    	smallLogoValue: {
	    		required: "请选择公司LOGO小图片",
		    	rangelength: "1-255个字符",
		    }
	    }
	});
}

//验证图片
function checkLogo(fileName) {
	var allowExtention=".jpg,.bmp,.gif,.png,.ico";//允许上传文件的后缀名document.getElementById("hfAllowPicSuffix").value;  
    var extention=fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();   
    var browserVersion= window.navigator.userAgent.toUpperCase();  
    if(allowExtention.indexOf(extention)>-1){   
    	return true;
    }
}

//上传LOGO大图标
function uploadBigLogo(){
	var fileName = $("#bigLogoFile").val();
	if(!checkLogo(fileName)){
		swal('提示',"仅支持.jpg,.bmp,.gif,.png,.ico为后缀名的图片!");
		return;
	}
	var arryName = fileName.split("\\");
	$("#bigLogo").val("/"+arryName[arryName.length-1]);
	if($("#bigLogoForm").valid()){
		swal({
	        title: "请确认",
	        text: "您确定要提交吗？",
	        type: "warning", 
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        cancelButtonText: "取消",
	        confirmButtonText: "确认",
	        closeOnConfirm: true
	    }, function () {
	    	$("#bigLogoForm").submit();
	    	//修改图片地址
	    	 $.ajax({
	    		type: "POST",
	    		url: "webConfig/updateWebConfigByOne",
	    		async: false,
	    		dateType: "json",
	    		data : $("#bigLogoForm").serialize(), 
	    		success: function(data) {
	    			
	    		}
	    	});
	    });
	}
}
//上传LOGO小图标
function uploadSmallLogo(){
	var fileName1 = $("#smallLogoFile").val();
	if(!checkLogo(fileName1)){
		swal('提示',"仅支持.jpg,.bmp,.gif,.png,.ico为后缀名的图片!");
		return;
	}
	var arryName = fileName1.split("\\");
	$("#smallLogo").val("/"+arryName[arryName.length-1]);
	if($("#smallLogoForm").valid()){
		swal({
	        title: "请确认",
	        text: "您确定要提交吗？",
	        type: "warning", 
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        cancelButtonText: "取消",
	        confirmButtonText: "确认",
	        closeOnConfirm: true
	    }, function () {
	    	$("#smallLogoForm").submit();
	    	//修改图片地址
	    	$.ajax({
	    		type: "POST",
	    		url: "webConfig/updateWebConfigByOne",
	    		async: false,
	    		dateType: "json",
	    		data : $("#smallLogoForm").serialize(), 
	    		success: function(data) {
	    			
	    		}
	    	});
	    });
	}
}
//初始化下拉告警级别列表
function getAlarmPrioList(){
	//初始化多选
	//$("#priorityCodeCombox").select2();
	$.ajax({
		type: "POST",
		url: "dataAlarm/getAlarmPrioList",
		dataType: "json",
		async: false,
		success: function(data) {
			$.each(data, function(index, item) {
				$("<option></option>").val(item.id).text(item.name).appendTo($("#priorityCodeCombox"));
			});
		}
	});
}