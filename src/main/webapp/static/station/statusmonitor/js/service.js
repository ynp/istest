$(function () {
	initFarmSelect();
});

function showDataTable(){
	var fid = $("#farmid").val();
	$("#service").DataTable({
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
	    "lengthMenu": [ [ 5, 10, 25, 50, 75, 100, -1 ], [ 5, 10, 25, 50, 75, 100, "所有" ] ],
	    //默认显示条数
	    "displayLength": 10,
		//禁用搜索
	    "searching" : false,
	    "ordering" : false,
	    //不排序的列的class
	    "columnDefs": [ {
	        "targets": 'nosort',
	        "orderable": false
	      } ],
	    //开启服务端处理
	    "processing": true,
	    "bServerSide": true,
	    ajax: {
			url: "service/getServicesForPage",
			type: "POST",
			data: {
				fid: fid
			}
		},
	    /*"sAjaxSource" : "service/getServicesForPage",
	    //指定当前的请求方式
	    "sServerMethod": "POST",
	  	//向后台传递请求参数
	    "fnServerParams": function (aoData) {
             aoData.push({ "name": "fid", "value": fid });
        },*/
        "columns": [
                    { "data": "farminfo" },
                    { "data": "name" },
                    { "data": "desp" },
                    { "data": "datatime" },
                    { "data": "status",
                      "render": function (data) {
                          return data == 4 ? "运行" : "不运行";
                      }
                    },
                    { "data": "type",
                      "render": function (data) {
                          return data == 16 ? "SERVICE_RUNNING":"SERVICE_STOPED";
                      }
                    },
                    { "data": "cpu" },
                    { "data": "memory"}
                ]
	});
}

//表单重新加载事件
function tableReload(){
	var fid = $("#farmid").val();
	var oTable = $("#service").DataTable();
	oTable.clear();
	oTable.settings()[0].ajax.data = {
		fid: fid
	};
	oTable.ajax.reload();
}
