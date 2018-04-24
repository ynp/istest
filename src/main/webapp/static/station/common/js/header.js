// JavaScript Document
$(function() {
	initHeader();
	initPwdChg();
});

function initHeader(){
	setInterval(function() {
		$("#nowTime").html(current)
	}, 100);
	
	// 用户信息
	var i = 0;
	var ii = 100;
	$('li.mainlevel').mousemove(function() {
		$(this).find('ul').show();
		i++;
	});
	$('li.mainlevel').mouseleave(function() {
		$(this).find('ul').hide();
		ii++;
	});
	
	// 是否静音标志位,默认为否
	var audioFlag = false;
	$('#message').click(function(){ 
		$("#message").toggleClass("mute");
		//反转标志位值，控制静音与否的状态
		audioFlag=!audioFlag;
		document.getElementById("myAudio").muted=audioFlag;
	});
	
	//先执行一下告警查询
	queryAlarmCounts();
	//获取配置表的弹窗查询时间间隔
	var alarmTimeInterval= $("#alarmTimeInterval").val();
	setInterval(queryAlarmCounts, alarmTimeInterval * 1000);
	
	$("#logstart").html(1);
}

/****************  时间处理 ******************/

// 获取本机时间
function current(){
	var date = "07/17/2014"; // 此处也可以写成 17/07/2014 一样识别 也可以写成 07-17-2014
								// 但需要正则转换
	var day = new Date(Date.parse(date)); // 需要正则转换的则 此处为 ： var day = new
											// Date(Date.parse(date.replace(/-/g,
											// '/')));
	var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
	var week = today[day.getDay()];

	var d = new Date(), str = '';
	str += d.getFullYear() + '年'; // 获取当前年份
	str += d.getMonth() + 1 + '月'; // 获取当前月份（0——11）
	str += d.getDate() + '日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	// str += week+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	if (d.getHours() < 10) {
		str += "0" + d.getHours() + ':';
	} else {
		str += d.getHours() + ':';
	}
	if (d.getMinutes() < 10) {
		str += "0" + d.getMinutes() + ':';
	} else {
		str += d.getMinutes() + ':';
	}
	if (d.getSeconds() < 10) {
		str += "0" + d.getSeconds();
	} else {
		str += d.getSeconds();
	}
	return str;
}

/****************  密码重置 ******************/


//修改密码相关初始化操作
function initPwdChg(){
	$('#changePwdBtn').click(showPwdChangeModal);
	$('#pwdcommit').click(pwdcommit);
	
  $('#pwdChangeForm').bootstrapValidator({
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
      	oldpassword: {
              validators: {
                  notEmpty: {
                      message: '不能为空'
                  }
              }
          },
          password1: {
              validators: {
                  notEmpty: {
                      message: '不能为空'
                  },
              	stringLength: {
						min: 5,
						max: 30,
						message: '用户密码必须在5-30个字符之间'
					},
		            identical: {
		            	field: 'password2',
		            	message: '两次密码不一致'
		            }
              }
          },
          password2: {
              validators: {
                  notEmpty: {
                      message: '不能为空'
                  },
		            stringLength: {
		            	min: 5,
		            	max: 30,
		            	message: '用户密码必须在5-30个字符之间'
		            },
		            identical: {
		            	field: 'password1',
		            	message: '两次密码不一致'
		            }
              }
          }

      }
  });	
}

//修改密码
function showPwdChangeModal(){
	$("#pwdChange").modal({backdrop: 'static', keyboard: false});
}

//提交新密码
function pwdcommit(){
	$('#pwdChangeForm').bootstrapValidator('validate');
	if(!$('#pwdChangeForm').data('bootstrapValidator').isValid()){  
		return ;  
	}  
	
    var old=$("#oldpassword").val();  
    var pass=$("#password1").val();  
    var pass2=$("#password2").val();  
    
	$.ajax({
        type: "POST",
        url: "user/editUserPwd",
        data:{oldPwd:old,pwd:pass},
        dataType: "json", 
        success: function(result) {
        	if(!result.success){
        		swal("",result.msg, "error");
        	}else{
        		swal("","修改成功", "success");
        		$('#pwdChange').modal('hide');
        		$('#pwdChangeForm')[0].reset();
        	}
        }
	})
}

/****************  事件告警 ******************/
/**
 * 查找指定级别的告警数量
 */
//告警弹窗是否打开标志位
var alarmOpenFlag = false;
//是否初次打开标志位
var firsetOpen = true;
function queryAlarmCounts(){
	//为true时，说明告警弹窗已经打开，无需再次请求
	if(!alarmOpenFlag){
		var priorityCode= $("#priorityCode").val();
		//获取未确认的告警级别为2的告警记录
		$.post('dataAlarm/getAlarmCount',{'priorityCode':priorityCode ,'isConfirm' : 0},
		function(data){
			$("#eventNums").html(data.total);
			//当告警数量大于0时，显示告警弹出内容
			if(data.total > 0){
				var alarmPopFlag= $("#alarmPopFlag").val();
				//获取的值，0为开，1为关
				if(alarmPopFlag == "0"){
					//是否初次打开，若初次打开，则初始化加载表格；若非初次，则重新加载内容
					if(firsetOpen){
						showAlarmDataTable();
						firsetOpen = false;
					} else {
						alarmTableReload();
					}
					//显示告警弹窗
					$("#alarmModal").modal({backdrop: 'static', keyboard: false});
					alarmOpenFlag = true;
				}
				//告警提示音
				document.getElementById("myAudio").play();
			}
		},
		'json');
	}
}

//告警确认后重新查询告警个数
function resetAlarmCount(){
	var priorityCode= $("#priorityCode").val();
	//获取未确认的告警级别为2的告警记录
	$.post('dataAlarm/getAlarmCount',{'priorityCode':priorityCode ,'isConfirm' : 0},
	function(data){
		$("#eventNums").html(data.total);
	},'json');
}

//当告警框关闭时，设置弹窗标志位alarmOpenFlag为false
$('#alarmModal').on('hide.bs.modal', function () {
	alarmOpenFlag = false;
})

//确认告警操作
$("#confirmIndexAlarm").click(function() {
	//获取选中的告警列表
	var checkIds="";
	//选择所有name="'confirmAlarm'"的对象，返回数组
	var obj = document.getElementsByName('confirmAlarm'); 
	//选中个数标志位
	var checkedLength=0;
	//取到对象数组后，我们来循环检测它是不是被选中
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].checked){
			//如果选中，将value添加到变量checkIds中
			checkIds += obj[i].value + ','; 
			//累加选中的数量
			checkedLength++;
		}
	}
	if(checkIds==""){
		return false;
	}
	$("#confirmIndexAlarm").attr("disabled", "disabled");
	
	$.post('dataAlarm/getConfirmOperation',{'ids':checkIds},function(){
		alarmTableReload();
		//重置全选标志位
		var obj = document.getElementById('alarmCheck');
		if (obj.checked){
			obj.checked = false;
		}
		//设置全选标志位为否
		$("#allCheckFlag").val(true);
		//重置首页告警数量
		resetAlarmCount();
		$("#confirmIndexAlarm").attr("disabled", false);
     },'json');
});	

/**
 * 全选或反选
 */
$("#alarmCheck").click(function(){
	//是否全选标志位
	var allCheckFlag = $("#allCheckFlag").val();
	
	var ch = document.getElementsByName("confirmAlarm");
	if (allCheckFlag == "true") {
		allCheckFlag = true;
		for (var i = 0; i < ch.length; i++) {
			if(ch[i].disabled){
			}else{
				ch[i].checked = true;
			}
		}
	} else {
		for (var i = 0; i < ch.length; i++) {
			if(ch[i].disabled){
			}else{
				ch[i].checked = false;
			}
		}
		allCheckFlag = false;
	}
	$("#allCheckFlag").val(!allCheckFlag);
});

/**
 * 显示告警记录
 */
function showAlarmDataTable(){
	var queryDate = new Date().format("yyyy-MM-dd");
	//先默认显示2级未确认告警
	var priorityCode= $("#priorityCode").val();
	var alarmTable = $("#alarmTable").on('page.dt',
        //绑定翻页事件，设置全选状态为false
		function() {
			document.getElementById('alarmCheck').checked = false;
			$("#allCheckFlag").val(true);
		}
	).DataTable({
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
		ajax: {
			url: "dataAlarm/getHeaderHistoryAlarm",
			type: "POST",
			data: {
				priorityCode: priorityCode,
				isConfirm: 0,//默认查询未确认的告警
				queryDate: queryDate
			},
			"dataSrc": "obj"
		},
		// 关闭搜索框
		"bFilter": false,
		//显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项", 不展示
		"info": false,
		// 关闭排序
		"bSort": false,
		//详细分页组，可以支持直接跳转到某页
		"pagingType": "full_numbers",
		//每页显示多少条选择
		"lengthMenu": [
			[5, 10, 25, 50, 75, 100],
			[5, 10, 25, 50, 75, 100]
		],
		//默认显示条数
		"displayLength": 10,
		//默认排序行与排序方式
		"order": [
			[1, "asc"]
		],
		//不排序的列的class
		"columnDefs":[
              {
                  "render":function(data,type,row){
                      return "<input type='checkbox' name='confirmAlarm' value='"+data+"'/>"
                  },
                  "targets":0
              }
        ],  
		//开启服务端处理
		"processing": true,
		"bServerSide": true, 
		"columns": [{
            "data":"alarmId",
            "width": "2%"
		},{
			"data": "priorityName",
			"width": "10%"
		}, {
			"data": "alarmTypeName",
			"width": "20%"
		}, {
			"data": "alarmString",
			"width": "33%"
		}, {
			"data": "isConfirm",
			"width": "15%"
		}, {
			"data": "dtTimeStamp",
			"width": "20%"
		},]
	});
}

//表单重新加载事件
function alarmTableReload(){
	var alarmTable = $("#alarmTable").DataTable();
	alarmTable.clear();
	alarmTable.ajax.reload();
}