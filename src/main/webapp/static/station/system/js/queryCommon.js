function queryPartSet(){
	var start = Date.prototype.formatdate(new Date(new Date().getTime() - 11 * 24 * 60 * 60 * 1000), "yyyy-MM-dd hh:mm:ss");
	var end = Date.prototype.formatdate(new Date(), "yyyy-MM-dd hh:mm:ss");
	$("#starttime").val(start);
	$("#endtime").val(end);
	
	var dateOptions={
		format: "yyyy-mm-dd hh:ii:ss",
		weekStart: 1,
		autoclose: true,
		todayBtn: 'linked',
		language: 'zh-CN'
	};
	//设置起始时间可设置的最大值
	dateOptions.endDate=end;
	$("#starttime").datetimepicker(dateOptions).on('changeDate', function(ev) {
		if(ev.date) {
			$("#endtime").datetimepicker('setStartDate', DateAdd("d", 1, ev.date));
		} else {
			$("#endtime").datetimepicker('setStartDate', null);
		}
	});
	//设置结束时间可设置的最大值，并清空起始日期的最大日期值配置项
	dateOptions.startDate=start;
	dateOptions.endDate="";
	$("#endtime").datetimepicker(dateOptions).on('changeDate', function(ev) {
		if(ev.date) {
			$("#starttime").datetimepicker('setEndDate', DateAdd("d", -1, ev.date));
		} else {
			$("#starttime").datetimepicker('setEndDate', new Date());
		}
	});
	
	//日期控件失去焦点事件
	$("input[id$='time']").change(function(){
		var time=/^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/;
		if(!time.test($(this).val())){
			swal("请输入正确格式的日期");
			$(this).val("");
		}
	});
	
	initPlantSelect();
}


/**
 * 初始化电场选择按钮
 */
function initPlantSelect(){
	$.ajax({
		type: "POST",
		url: "plant/getPlants",
		dataType: "json",
		async: true,
		success: function(data) {
			if(data.success) {
				$.each(data.obj, function(index, item) {
					$("<option></option>").val(item.id).text(item.aliasname).appendTo($("#plantId"));
				});
				//在设置完电场的下拉列表后，调用对应其dataTable的加载方法
				showDataTable();
			}
		}
	});
}
