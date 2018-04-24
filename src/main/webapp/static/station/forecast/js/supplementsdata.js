$(function () {
	/*var start = Date.prototype.formatdate(new Date(new Date().getTime() - 11 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
	var end = Date.prototype.formatdate(new Date(new Date().getTime()), "yyyy-MM-dd");
	$("#starttime").val(start);
	$("#endtime").val(end);
	var dateOptions={
		autoclose: true,
		format: "yyyy-mm-dd",
		minView: 2,
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
	});*/
	
	//获取电场数据
    $.ajax({
        type : "POST",
        url : "plant/getPlants",
        dataType : "json",
        async : true,
        success : function(data) {
            if (data.success) {
                $.each(data.obj, function(index, item) {
                    $("<option></option>").val(item.id).text(item.aliasname).appendTo($("#plantId"));
                });
            } else {
                swal("", "电场数据加载失败", "error");
            }
        }
    });
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

/**
 * 数据补传按钮点击事件
 */
function supplementData(){
	//获取电场数据
    $.ajax({
        type : "POST",
        url : "supplements/supplementData",
        data : {
        	plantId : $("#plantId").val(),
        	type : $("#type").val()
        },
        dataType : "json",
        async : true,
        success : function(data) {
            if (data.success) {
                swal("提示", data.msg);
            }
        }
    });
}


