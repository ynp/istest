//修改时设置对应form表单的显示值页面，参数分别为： 后台获取的表单数据、表单id
function setFormValues(formData,formId){
	var formElement;//对象属性
  	var value;//属性值
  	//遍历json的属性名称
	for(var nameKey in formData){
		//获取属性值
		value=formData[nameKey];
		//获取对应的jquery对象
		formElement = $("#"+formId+" [name="+nameKey+"]");
		//设置对象的值
		formElement.val(value);
 	}
}

//获取表单提交的操作标志位值
function getOperationFlag(){
	return parseInt($("#operation_flag").val());
}

//设置表单的值是不可编辑
function setFormValueDisabled(formId){
	//设置表单属性不可编辑
	$("#"+ formId +" [name]").attr("disabled","disabled");
}

//重置form表单的数据和元素的设置
function resetForm(formId){
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
	$("#bSubmit").show();
	//恢复提交按钮的状态
	$("#bSubmit").prop("disabled", false);
}
