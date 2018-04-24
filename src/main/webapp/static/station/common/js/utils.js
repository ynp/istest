(function($) {
	/**
	 * 对Date的扩展
	 * 
	 * 将 Date 转化为指定格式的String
	 * 
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
	 * 
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	 * 
	 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	 * 
	 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
	 * 
	 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
	 * 
	 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
	 * 
	 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	 */
	Date.prototype.pattern = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1,
			/* 月份 */
			"d+": this.getDate(),
			/* 日 */
			"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
			/* 小时 */
			"H+": this.getHours(),
			/* 小时 */
			"m+": this.getMinutes(),
			/* 分 */
			"s+": this.getSeconds(),
			/* 秒 */
			"q+": Math.floor((this.getMonth() + 3) / 3),
			/* 季度 */
			/* 毫秒 */
			"S": this.getMilliseconds()
		};
		var week = {
			"0": "\u65e5",
			"1": "\u4e00",
			"2": "\u4e8c",
			"3": "\u4e09",
			"4": "\u56db",
			"5": "\u4e94",
			"6": "\u516d"
		};
		if(/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if(/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	};

	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		}
		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}

	Date.prototype.formatdate = function(date, pattern) {
		if(date == undefined) {
			date = new Date();
		}
		if(pattern == undefined) {
			pattern = "yyyy-MM-dd hh:mm:ss";
		}
		return date.format(pattern);
	}

	Date.prototype.formatdatetime = function(datetime) {
		if(datetime == undefined) {
			return "08:00";
		}
		var hour = parseInt(datetime / 3600);
		var min = datetime % 3600 / 60;
		return(hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min);
	}
})(jQuery);

/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
function DateAdd(interval, number, date) {
	switch(interval) {
		case "y":
			{
				date.setFullYear(date.getFullYear() + number);
				return date;
				break;
			}
		case "q":
			{
				date.setMonth(date.getMonth() + number * 3);
				return date;
				break;
			}
		case "m":
			{
				date.setMonth(date.getMonth() + number);
				return date;
				break;
			}
		case "w":
			{
				date.setDate(date.getDate() + number * 7);
				return date;
				break;
			}
		case "d":
			{
				date.setDate(date.getDate() + number);
				return date;
				break;
			}
		case "h":
			{
				date.setHours(date.getHours() + number);
				return date;
				break;
			}
		case "minute":
			{
				date.setMinutes(date.getMinutes() + number);
				return date;
				break;
			}
		case "s":
			{
				date.setSeconds(date.getSeconds() + number);
				return date;
				break;
			}
		default:
			{
				date.setDate(date.getDate() + number);
				return date;
				break;
			}
	}
}

/**
 * 初始化时间
 * @param {Object} type 'd','m','y'
 * @param {Object} step	开始时间距离结束时间的间隔。
 * @param {Object} format 格式化样式
 * 例如：开始时间为当前时间前一天 
 * initDateTime('d',-1,'yyyy-MM-dd');
 */
var _utilsDateStep = 1;

function initDateTime(type, step, format) {
	_utilsDateStep = step;
	var start = Date.prototype.formatdate(DateAdd(type, step, new Date()), format);
	var end = Date.prototype.formatdate(new Date(), format);
	$("#starttime").val(start);
	$("#endtime").val(end);
}

/**
 * 设置时间控件
 * @param {Object} type 'd','m','y'（日、月、年）
 */
function setDatetimepicker(type) {
	var option = {
		autoclose: true,
		format: "yyyy-mm-dd",
		weekStart: 1,
		todayBtn: 'linked',
		language: 'zh-CN',
		minView: 'month', // 最小显示视图时间范围
		startView: 'month', // 开始显示视图时间范围
		startDate: '',
		endDate: ''
	};

	// 日期类型
	var dateType = "d";

	// datetimepicker参数设置
	var startOption = {};
	var endOption = {};
	if(type === "d") { // 日
		dateType = "d";

		option.format = "yyyy-mm-dd";
		option.endDate = DateAdd(dateType, -1, new Date());
		option.startView = 'month';
		option.minView = 'month';
		$.extend(startOption, option);

		option.endDate = '';
		option.startDate = DateAdd(dateType, _utilsDateStep + 1, new Date());
		$.extend(endOption, option);
	} else if(type === "m") { // 月
		dateType = "m";

		option.format = "yyyy-mm";
		option.endDate = DateAdd(dateType, -1, new Date());
		option.startView = 'year';
		option.minView = 'year';
		$.extend(startOption, option);

		option.endDate = '';
		option.startDate = DateAdd(dateType, _utilsDateStep + 1, new Date());
		$.extend(endOption, option);
	} else if(type === "y") { // 年
		dateType = "y";

		option.format = "yyyy";
		option.minView = "";
		option.endDate = DateAdd(dateType, -1, new Date());
		option.startView = 'decade';
		option.minView = 'decade';
		$.extend(startOption, option);

		option.endDate = '';
		option.startDate = DateAdd(dateType, _utilsDateStep + 1, new Date());
		$.extend(endOption, option);
	}

	//Date picker
	$("#starttime").datetimepicker(startOption).on('changeDate', function(ev) {
		if(ev.date) {
			$("#endtime").datetimepicker('setStartDate', DateAdd(dateType, 1, ev.date));
		} else {
			$("#endtime").datetimepicker('setStartDate', null);
		}
	});
	$("#endtime").datetimepicker(endOption).on('changeDate', function(ev) {
		if(ev.date) {
			$("#starttime").datetimepicker('setEndDate', DateAdd(dateType, -1, ev.date));
		} else {
			$("#starttime").datetimepicker('setEndDate', new Date());
		}
	});
}

/**
 * 判断变量是否为空
 * @param {Object} v
 */
function isEmpty(v) {
	switch(typeof v) {
		case 'undefined':
			return true;
		case 'string':
			if(v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			break;
		case 'boolean':
			if(!v) return true;
			break;
		case 'number':
			if(isNaN(v)) return true;
			break;
		case 'object':
			if(null === v || v.length === 0) return true;
			for(var i in v) {
				return false;
			}
			return true;
	}
	return false;
}

// var now = new Date();
// // 加五天.
// var newDate = DateAdd("d", 5, now);
// alert(newDate.toLocaleDateString())
// // 加两个月.
// newDate = DateAdd("m", 2, now);
// alert(newDate.toLocaleDateString())
// // 加一年
// newDate = DateAdd("y", 1, now);
// alert(newDate.toLocaleDateString())

//通过js获取当前项目的根路径
function getWebRootUrl(){
	//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return (localhostPaht+projectName);
}

/**
 * 在浏览器里预览本地图片
 * @param fileObj
 * @param imgPreviewId
 * @param divPreviewId
 */
function PreviewImage(fileObj,imgPreviewId,divPreviewId){  
    var allowExtention=".jpg,.bmp,.gif,.png,.ico";//允许上传文件的后缀名document.getElementById("hfAllowPicSuffix").value;  
    var extention=fileObj.value.substring(fileObj.value.lastIndexOf(".")+1).toLowerCase();              
    var browserVersion= window.navigator.userAgent.toUpperCase();  
    if(allowExtention.indexOf(extention)>-1){   
        if(fileObj.files){//HTML5实现预览，兼容chrome、火狐7+等  
            if(window.FileReader){  
                var reader = new FileReader();   
                reader.onload = function(e){  
                    document.getElementById(imgPreviewId).setAttribute("src",e.target.result);  
                }    
                reader.readAsDataURL(fileObj.files[0]);  
            }else if(browserVersion.indexOf("SAFARI")>-1){  
                alert("不支持Safari6.0以下浏览器的图片预览!");  
            }  
        }else if (browserVersion.indexOf("MSIE")>-1){  
            if(browserVersion.indexOf("MSIE 6")>-1){//ie6  
                document.getElementById(imgPreviewId).setAttribute("src",fileObj.value);  
            }else{//ie[7-9]  
                fileObj.select();  
                if(browserVersion.indexOf("MSIE 9")>-1)  
                    fileObj.blur();//不加上document.selection.createRange().text在ie9会拒绝访问  
                var newPreview =document.getElementById(divPreviewId+"New");  
                if(newPreview==null){  
                    newPreview =document.createElement("div");  
                    newPreview.setAttribute("id",divPreviewId+"New");  
                    newPreview.style.width = document.getElementById(imgPreviewId).width+"px";  
                    newPreview.style.height = document.getElementById(imgPreviewId).height+"px";  
                    newPreview.style.border="solid 1px #d2e2e2";  
                }  
                newPreview.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='" + document.selection.createRange().text + "')";                              
                var tempDivPreview=document.getElementById(divPreviewId);  
                tempDivPreview.parentNode.insertBefore(newPreview,tempDivPreview);  
                tempDivPreview.style.display="none";                      
            }  
        }else if(browserVersion.indexOf("FIREFOX")>-1){//firefox  
            var firefoxVersion= parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);  
            if(firefoxVersion<7){//firefox7以下版本  
                document.getElementById(imgPreviewId).setAttribute("src",fileObj.files[0].getAsDataURL());  
            }else{//firefox7.0+                      
                document.getElementById(imgPreviewId).setAttribute("src",window.URL.createObjectURL(fileObj.files[0]));  
            }  
        }else{  
            document.getElementById(imgPreviewId).setAttribute("src",fileObj.value);  
        }           
    }else{  
        alert("仅支持"+allowExtention+"为后缀名的文件!");  
        fileObj.value="";//清空选中文件  
        if(browserVersion.indexOf("MSIE")>-1){                          
            fileObj.select();  
            document.selection.clear();  
        }                  
        fileObj.outerHTML=fileObj.outerHTML;  
    }  
}


/**
 * 判断开始时间和结束时间不能超过n天、并判断开始时间结束时间不能为空
 * startTime、endTime格式为2017-05-27
 * n 为开始时间个结束时间间隔天数
 */
function isDifferNDay(startTime,endTime,n) {
	var data1 = Date.parse(startTime.replace(/-/g,   "/"));  
	var data2 = Date.parse(endTime.replace(/-/g,   "/"));  
	var datadiff = data2-data1;  
	var time = n*24*60*60*1000;       
	if(startTime.length>0 && endTime.length>0){  
		if(datadiff<=0||datadiff>time){  
			swal("提示","起始时间应小于结束时间并且间隔小于"+n+"天，请检查!");
			return false;  
		}
	}else{
		swal("提示","起始时间、结束时间不能为空，请检查!");
		return false;  
	}
	return true;  
}


/**
 * 为空的话返回 "",类型为number的话保留小数点后3位
 * @param {Object} v
 */
function convertNull(val){
	if(isEmpty(val)){
		return "--";
	}
	if(typeof val == 'number'){
		return val.toFixed(3);
	}
	return val;
}

/**
 * 判断变量是否为空
 * @param {Object} v
 */
function isEmpty(v) {
	switch(typeof v) {
		case 'undefined':
			return true;
		case 'string':
			if(v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			break;
		case 'boolean':
			if(!v) return true;
			break;
		case 'number':
			if(isNaN(v)) return true;
			break;
		case 'object':
			if(null === v || v.length === 0) return true;
			for(var i in v) {
				return false;
			}
			return true;
	}
	return false;
}