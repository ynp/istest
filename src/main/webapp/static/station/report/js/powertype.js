/* 短期、超短期 报表 功率类型下拉 根据spppConfig.js中的配置显示 */
$(function() {
	var html = "<option value='0' >实发功率</option>";
	if (availablePFcst == 1){/*显示可用功率预测开关：0关闭，1开启*/
		html += "<option value='2' >可用功率</option>";
	}
	if (theoryPFcst == 1){/*显示理论功率预测开关：0关闭，1开启*/
		html += "<option value='1' >理论功率</option>";
	}
	$("#powertype").html(html);
});