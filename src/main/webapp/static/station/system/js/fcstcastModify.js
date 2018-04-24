
$(function () {
	//增加自定义验证
	jQuery.validator.addMethod("decimalNum", function(value, element) {
		var returnVal = true;
        var inputZ=value;
        var ArrMen= inputZ.split(".");    //截取字符串
        if(ArrMen[0].length>10){    //判断小数点前面的字符串长度
            returnVal = false;
            return false;
        }
        if(ArrMen.length==2){
            if(ArrMen[1].length>6){    //判断小数点后面的字符串长度
                returnVal = false;
                return false;
            }
        }
        return returnVal;
	}, "只能输入数字，总共16位，小数点后最多6位");
	//加载电场
	initPlant();
	//加载数据
	setTimeout('query()',200);
	validateForm();
});
//数据验证
function validateForm() {
	$("#fcstcastModifyForm").validate({
		rules : {
			p : {
				required : true,
				number : true,
				decimalNum : true,
			}
		},
		messages : {
			p : {
				number : "请输入合法的数字",
			}
		}
	});
}
//初始化电场选择按钮,与表单电场名称选择
function initPlant(){
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
			}
		}
	});
}
var farmid = null;
var farmName = "";//电场名称
//查询
function query(){
	farmid = $("#plantId").val();
	farmName = $("#plantId").find("option:selected").text();
	if(farmid == null || farmid ==''){
		alert("请选择电场");
		return;
	}
	$.ajax({
		url: "fcstcastmodify/get2to10BfcstPower",
		data: {farmid:farmid},
        type: 'post',
        dataType: "json",
        success: function(data){
        	var html = "";
        	if(data.success){
        		var i = 1;
        		data.obj.forEach(function(e){
        			html+="<tr>"+
        	        "<td>"+i+"</td>"+
        	        "<td>"+farmName+"</td>"+
        	        "<td>"+getStringDate(e.fcstTime,0)+"</td>"+
        	        "<td>第"+e.daytype+"天</td>"+
        	        "<td><button data-toggle='modal' data-target='#bfcstModal' type='button' " +
        	        "class='btn btn-common btn-del btn-sm' onclick=modifyFcstcast("+e.recordId+","+e.daytype+",'"+getStringDate(e.fcstTime,0)+"');>修改</button></td>"+
        	       	"</tr>";
        	       	i++;
        	 	});
        	}
        	$("#fcstcastTbody").html(html);
        }
	});
}
//修改
function modifyFcstcast(recordId,daytype,fcstTime){
	$.ajax({
		url: path+"/fcstcastmodify/getBfcstDetailDataMap",
        type: 'post',
        dataType: "json",
        data: {"farmid":farmid,'recordId':recordId,"daytype":daytype,"fcstTime":fcstTime},
        success:function(reault){
        	var html = "";
        	if(reault.length>0){
        		var i = 1;
            	reault.forEach(function(data){
            		html+="<tr id='" + i + "'>"+
                    "<td>"+i+"</td>"+
                    "<td style='display:none'><input type='hidden' id='id' value='"+data.id+"'/></>"+
                    "<td>"+data.fcstTime+"</td>"+//点序号
                    "<td><input type='text' class='form-control' id='p"+i+"' name='p' value='"+data.p+"' onchange='changeName("+i+")'/></td>"+
                    "<td style='width:63px;'>"+getismodify(data.isModify)+"</td>"+
                    "<td style='display:none'><input type='hidden' id='oldp' value='"+data.p+"'/></>"+
                    "</tr>";
            		i++;
            	});
            	$("#bfcstPointTbody").html(html);
        	}else{
        		$("#bfcstPointTbody").html("无数据");
        	}
        }
	});
}
//数据修改
function editBfcstData() {
	if (!$("#fcstcastModifyForm").valid()) {
		return false;
	}
	// 将表格数据封装成json字符串
	var dataList = new Array();
	var rows = $('tr[name="change"]');// 取得表格的变化的行
	for (var i = 0; i < rows.length; i++) {// 循环遍历所有的tr行
		//隐藏域单元格
		var id = rows[i].cells[1].childNodes[0].value;// 某行的第2个单元格:id
		var p = rows[i].cells[3].childNodes[0].value;// 某行的第4个单元格：实发预测功率修改后的值
		var oldP = rows[i].cells[5].childNodes[0].value;// 某行的第6个单元格：实发预测功率修改前的值
		dataList.push({"id" : id,"p" : p,"farmid" : farmid,"oldP" : oldP});
	}
	if(dataList.length <1){
		swal('提示', '数据无变化,不需要修改！');
		return false;
	}
	var con = confirm("您确定要提交吗？");
	if(!con){
		$('#retButton').click();
		return false;
	}
	/*swal({
		title : "请确认",
		text : "您确定要提交吗？",
		type : "warning",
		showCancelButton : true,
		confirmButtonColor : "#DD6B55",
		cancelButtonText : "取消",
		confirmButtonText : "确认",
		closeOnConfirm : true
	}, function() {*/
		// 提交
		$.ajax({
			type: "POST",
			url: path+"/fcstcastmodify/editBfcstData",
			async: false,
			dateType: "json",
			contentType : 'application/json;charset=utf-8',
			data : JSON.stringify(dataList),
			success:function(data){
				if(data == 2){
					swal('提示', '表不存在,无法修改。');
				}else if(data == 1){
					$('#retButton').click();
					swal('提示', '修改成功。');
				}else{
					swal('提示', '修改失败。');
				}
			}
		});
	//});
}
//哪行数据更改了记录一下
function changeName(val) {
	$("#" + val).attr("name", "change");
}
/**
 * 获取ismodify代表意思 
 * @param val 无修正-0， 人工修正 -1
 * @returns {String}
 */
function getismodify(val){
	var result = "";
	if(val == 0){
		result = "无修正";
	}else if(val == 1){
		result = "手动修改";
	}
	return result;
}