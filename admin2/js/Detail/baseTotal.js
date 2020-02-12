
var pieChart = echarts.init(document.getElementById("chart"));//饼图总体
var ztjetjChart = echarts.init(document.getElementById("charts"));//饼图清算金额总体
var baseTotalChart = echarts.init(document.getElementById("baseTotalChart"))//基础总体笔数详情
var baseTotalsChart = echarts.init(document.getElementById("baseTotalCharts"))//基础总体笔数详情
var app = {};
var data = [];
//var urlHost = "http://172.16.35.168:10002/";
var urlHost = "http://192.168.1.51:9101/"
// var urlHost = "http://192.168.1.51:9101/";
option = null;
pieOption = null;
ztjetjOption = null;
ztbsDetailedOption = null;var posBarChart = echarts.init(document.getElementById("posBarChart")); //总体
//var pieChart = echarts.init(document.getElementById("pieChart"));//总体饼图
var posjyjeBarChart = null;


var app = {};
//var jkldValue = "0";
//var jkType = "0";
var storage = "";
var storage1 = "";
//var urlHost = "http://172.16.35.166:10002/";
var urlHost = "http://192.168.1.51:9101/";
var regionData = [];
var posjyjeBarOption = null;
var posBarOption = null;
var pieOption = null;
app.title = '堆叠条形图';
sessionStorage.setItem("cut", 1);
$(function () {
	// DrowProcess(60,'cav');
	window.userid = sessionStorage.getItem('userId');
	pocChart(25, "http://192.168.1.51:9010/bmws/authorize/getRole", "post", '{"id":"' + userid + '"}'); //获取权限
	pocChart(21, "http://192.168.1.51:9010/bmws/authorize/getDataArea", "post", '{"id":"' + userid + '"}'); //获取当前登录用户地区数
	tabSwitchoverInterior();
	monitor(posBarChart);


	//缩放事件
	//posBarChart.on('datazoom', function (params) {
	//		var batchList = params['batch'];
	//		var batch = batchList[0];
	//		alert("测试："+batch['start']);
	//		console.log(params);
	//	});
})

function monitor(paramChart) {
	paramChart.on('legendselectchanged', function (obj) {

		//alert(obj['name']+obj['selected']);
		var name = obj['name'];
		console.log(name, 111111)
		var selected = obj['selected'];

		var isHeji = false; //是否为合计(显示) 默认不显示
		var isSelected = true; //true说明成功（可以进行修改）
		if (name == '合计') {
			for (var i in selected) {
				var data = selected[i];
				if (i == '合计' && data == true) { //说明用户在点击图例，想显示合计！
					isHeji = true;
				}
				if (i != '合计' && data == true) {
					isSelected = false;
					break;
				}
			}

			if (isHeji && !isSelected) {
				//selected['合计'] = false;
				for (var i in selected) {
					//var data = selected[i];
					if (i == '合计') { //说明用户在点击图例，想显示合计！
						selected[i] = true;
					}
					if (i != '合计') {
						selected[i] = false;
					}
				}
				paramChart.setOption({
					legend: {
						selected: selected
					}
				});
			}
		} else {
			for (var i in selected) {
				var data = selected[i];
				if (i != '合计' && data == true) {
					isSelected = false;
					break;
				}
			}
			if (!isSelected) {
				selected['合计'] = false;
				paramChart.setOption({
					legend: {
						selected: selected
					}
				});
			}

		}

	});

}

function pocChart(type, url, requestType, requestData) {
	$.ajax({
		url: url,
		type: requestType,
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: requestData, //json字符串
		success: function (data) {
			if (type == 0) { //总体（饼图）
				ywyxTotal(data, pieChart);
			}
			if (type == 1) { //pos消费
				qsjePos(data, posBarChart, "line");
			}
			if (type == 2) { //概况详情
				detailCount(data, 1);
			}
			if (type == 3) { //百分比
				percent(data);
			}
			if (type == 4) { //机构
				organization(data);
			}
			if (type == 5) { //异动说明
				ydsmTitle(data);
			}
			if (type == 6) { //地区
				regionSelect(data);
			}
			if (type == 7) { //pos消费交易笔数
				qsjePos(data, posjyjeBarChart, "line");
			}
			if (type == 8) { //概况详情
				detailCount(data, 2);
			}
			if (type == 21) { //地区初始化加载
				areaResult(data);
			}
			if (type == 22) { //口径
				caliber(data);
			}
			if (type == 25) { //获取用户权限
				authorityManagement(data);
			}
		}
	});
}

function ToTop() {
	$("html,body").animate({
		scrollTop: $("body").offset().top - 130
	}, 130); //跳转到最上层
}




function authorityManagement(data) {
	
}

function caliber(data) {
	//alert("sdf");
	document.getElementById("showDivcon").innerHTML = data[0]['calDesc']; //今日交易笔数
}



function areaResult(data) {

	//perc(data[0]); //地区初始化加载
	organizationInit(); //机构初始化加载
	pocChart(1, urlHost + "business-run/newTotal/graphics", "post", '{"displaySummary":"1","meaType":"清算金额","area":"全国","org":"' + ($('#orgId').val() == "全部" ? "" : $('#orgId').val()) + '","granularity":"0","dayType":"0"}'); //pos消费(柱状图)
	pocChart(2, urlHost + "business-run/newTotalTopTextData/text", "post", '{"area":"全国"}'); //概况详情http://172.16.35.166:8011/pos/text
	pocChart(3, urlHost + "business-run/newTotal/tradechange", "post", '{"meaType":"清算金额","area":"全国"}'); //交易变化原因分解
	//初始化加载机构（根据地区传参）
	pocChart(4, urlHost + "business-run/newTotal/org", "post", '{"area":"全国"}');
	pocChart(5, urlHost + "business-run/newTotal/changedesc", "post", '{"meaType":"清算金额","area":"全国"}'); //异动说明
	pocChart(22, urlHost + "business-run/bscal", "post", '{"category": "总体", "prodType": "总体","calNm": "总体"}'); //异动说明
	monitor(posBarChart);
}



//监控粒度
function jkldValue() {
	var val1 = $('input[name="date"]:checked').val();
	if (val1 == '日') {
		return "0";
	} else if (val1 == '周') {
		return "1";
	} else if (val1 == '月') {
		return "2";
	} else if (val1 == '年') {
		return "3";
	}
}

//监控类型
function jkType() {
	var val2 = $('input[name="dateType"]:checked').val();
	if (val2 == '全部') {
		return "0";
	} else if (val2 == '非节假日') {
		return "1";
	} else if (val2 == '节假日') {
		return "2";
	}
}




function tabSwitchoverInterior() {
	//TAB切换
	var tab_btn_interior = document.getElementById('tab_btn_interior');
	var tab_son = tab_btn_interior.getElementsByTagName('li');
	var tab_content_interior = document.getElementById('tab_content_interior');
	var tab_content_interior_li = tab_content_interior.getElementsByTagName('li');
	var chart2div = document.getElementById('posjyjeBarChart');
	var tab_content_interior = document.getElementById('tab_content_interior');

	for (var i = 0; i < tab_son.length; i++) {
		tab_son[i].index = i;
		tab_son[i].onclick = function () {
			for (var i = 0; i < tab_son.length; i++) {
				if (i !== this.index) {
					tab_son[i].classList.remove('pick')
				}
			}
			tab_son[this.index].className = "pick";

			for (var j = 0; j < tab_content_interior_li.length; j++) {
				if (j !== this.index) {
					tab_content_interior_li[j].style.display = "none";
				} else {
					tab_content_interior_li[j].style.display = "block";
					if (j == 0) {
						sessionStorage.setItem("cut", 1);
		
						pocChart(1, urlHost + "business-run/newTotal/graphics", "post", '{"displaySummary":"1","meaType":"清算金额","area":"全国","org":"' + ($('#orgId').val() == "全部" ? "" : $('#orgId').val()) + '","granularity":"0","dayType":"0"}'); //pos消费(柱状图)
						pocChart(3, urlHost + "business-run/newTotal/tradechange", "post", '{"meaType":"清算金额","area":"全国"}'); //交易变化原因分解
						pocChart(5, urlHost + "business-run/newTotal/changedesc", "post", '{"meaType":"清算金额","area":"全国"}'); //异动说明
					} else if (j == 1) {
						posjyjeBarChart = echarts.init(document.getElementById("posjyjeBarChart")); //清算金额

						sessionStorage.setItem("cut", 2);
						posjyjeBarChart.setOption(posjyjeBarOption, true);
						monitor(posjyjeBarChart); //调用图例监控
						pocChart(7, urlHost + "business-run/newTotal/graphics", "post", '{"displaySummary":"1","meaType":"成功笔数","area":"全国","org":"' + ($('#orgId').val() == "全部" ? "" : $('#orgId').val()) + '","granularity":"0","dayType":"0"}'); //pos消费(柱状图)
						pocChart(3, urlHost + "business-run/newTotal/tradechange", "post", '{"meaType":"成功笔数","area":"全国"}'); //交易变化原因分解
						pocChart(5, urlHost + "business-run/newTotal/changedesc", "post", '{"meaType":"成功笔数","area":"全国"}'); //异动说明
					}
				}
			}

			//window.onresize();
			// if (posjyjeBarOption && typeof posjyjeBarOption === "object") {
			// 	posjyjeBarChart.setOption(posjyjeBarOption, true);
			// }
		}

	}
}

function organizationInit() {
	new Vue({
		el: '.adminBox',
		data: {
			cityInputVal: '全部',
		},
		methods: {
			cityPatFun: function () {
				this.$refs.city.cityFun();
			},
			cityjs: function (data) {
				this.cityInputVal = data;
			}
		}
	})
}

function organizationInit_1() {
	new Vue({
		el: '.adminBox_1',
		data: {
			cityInputVal_1: '全部',
		},
		methods: {
			cityPatFun_1: function () {
				this.$refs.city_1.cityFun();
			},
			cityjs_1: function (data) {
				this.cityInputVal_1 = data;
			}
		}
	})
}

function region_1() {
	new Vue({
		el: '.regionBox_1',
		data: {
			regionCityInputVal_1: '全国',
		},
		methods: {
			regionCityPatFun_1: function () {
				this.$refs.regionCity_1.cityFun();
			},
			regionCityjs_1: function (data) {
				this.regionCityInputVal_1 = data;
			}
		}
	})
}

function perc(percName) {


	new Vue({
		el: '.regionBox',
		data: {
			regionCityInputVal: percName,
		},
		methods: {
			regionCityPatFun: function () {
				this.$refs.regionCity.cityFun();
			},
			regionCityjs: function (data) {
				this.regionCityInputVal = data;
			}
		}
	})
}

// function percent(result){
// 	var ide = 1;
// 	document.getElementById("bor").innerHTML = "";
// 	$.each(result,function(index,obj){
// 		//document.getElementById("bor").innerHTML = "";
// 		var id = 1;
// 		var x = 1;
//         var html = "";
// 		var title = "";
// 		$("#bor").append("<div id = 'dataDiv"+ide+"' style='background-color:#FFFFFF;'></div");
// 		$("#dataDiv"+ide).append("<div style='text-align:center;width:20%;'><img src='"+obj["dimPicPath"]+"' style='float:none;height:24px;width:24px;' align='right' /><div style='width:100%;word-wrap:break-word;font-size:16px;color:#A5A5A5;'>"+obj["dimType"]+"</div></div>");
// 		//document.getElementById("bor").innerHTML = start +end;
// 		var data = obj["meaData"];
// 		//console.log(data);
// 		for(var index in data){
// 			//bor = document.getElementById("dataDiv").innerHTML;
// 			var item1 = data[index];//item1["key"]
// 			var meaValRateDec = item1["meaValRateDec"];
// 			html = "<div style='width:20%;'><div id='table"+ide+id+"' style='width:100%;height:100%'><div align='center'><p id='myCanvas"+ide+id+"' width='50' height='50' style='margin-top:10px;' ></div></div><div align='center'><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'>"+item1["dimVal"]+"</span></div></div></div>";
// 			//document.getElementById("dataDiv").innerHTML = bor + html;
// 			//<span style='float:left; height:40px; width:45px; color:#A5A5A5;font-size:12px;margin-left:10px;'>"+item1["dimVal"]+"</span>
// 			if(id > 3){
// 				var htmlAppend = "<div align='center'><div id='myCanvas"+ide+id+"' width='50' height='50' style='margin-top:10px;' ></div></div><div align='center'><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'>"+item1["dimVal"]+"</span></div>";
// 				var ideVal = id-3;
// 				//var htmlAppendVal = document.getElementById("table"+ide+ideVal).innerHTML+htmlAppend;
// 				$("#table"+ide+ideVal ).append(htmlAppend);
// 				//document.getElementById("table"+ide+ideVal).innerHTML = htmlAppendVal;
// 				if(meaValRateDec<0){
// 					meaValRateDec = meaValRateDec.replace("-","");
// 					DrowProcess(mul(meaValRateDec,100),'myCanvas'+ide+id);
// 				}else{
// 					DrowProcess(mul(meaValRateDec,100), 'myCanvas'+ide+id);
// 				}
// 			}else{
// 				$("#dataDiv"+ide).append(html);
// 				if(meaValRateDec<0){
// 					meaValRateDec = meaValRateDec.replace("-","");
// 					DrowProcess(mul(meaValRateDec,100), 'myCanvas'+ide+id);
// 				}else{
// 					DrowProcess(mul(meaValRateDec,100), 'myCanvas'+ide+id);
// 				}
// 			}

// 			id++;
// 			x = x+3.4;
// 		}

// 		var copyId = id;
// 		for(var i = id; i <=6; i++){
// 			if(id > 3){
// 				if(copyId >4){
// 					html = "<div><div id='myCanvas"+ide+id+"' width='50' height='50' style='margin-top:10px;' ></div></div><div><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'></span></div>";
// 					var ideVal = id-3;
// 					$("#table"+ide+ideVal).append(html);
// 				}
// 			}else{
// 				html = "<div style='width:20%;'><div id='table"+ide+id+"' style='width:100%;height:100%'><div><div id='myCanvas"+ide+id+"' width='50' height='50' style='margin-top:10px;' ></div></div><div><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'></span></div></div></div>";
// 				$("#dataDiv"+ide).append(html);
// 			}
// 			id++;
// 		}
// 		ide++;
// 	});
// }

function percent(result) {
	var contents = result.length;
	if (contents > 0) {
		var ide = 1;
		document.getElementById("bor").innerHTML = "";
		$.each(result, function (index, obj) {
			//document.getElementById("bor").innerHTML = "";
			var id = 1;
			var x = 1;
			var ideVal = 1;
			var start = "<tr id = 'dataDiv" + ide + "' style='background-color:#FFFFFF;'>";
			var html = "";
			var end = "</tr>";
			var title = "";
			$("#bor").append(start + end);
			$("#dataDiv" + ide).append("<td style='text-align:center;width:20%;'><img src='" + obj["dimPicPath"] + "' style='float:none;height:24px;width:24px;' align='right' /><div style='width:100%;word-wrap:break-word;font-size:16px;color:#A5A5A5;'>" + obj["dimType"] + "</div></td>");
			//document.getElementById("bor").innerHTML = start +end;
			var data = obj["meaData"];
			var isMinus = false; //是否存在正数：true：存在正数  false：不存在正数
			for (var returnVal in data) {
				var item1Val = data[returnVal];
				var meaValRateDecVal = item1Val["meaValRateDec"];
				html = "<td style='width:20%;'><table id='table" + ide + id + "' style='width:100%;'><tr><td align='center'><div id='myCanvas" + ide + id + "' width='50' height='50' style='margin-top:10px;width:50px;height:50px' ></div></td></tr><tr><td align='center'><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'>" + item1Val["dimVal"] + "</span></td></tr></table></td>";
				if (id <= 3 && meaValRateDecVal > 0) {
					$("#dataDiv" + ide).append(html);
					DrowProcess(mul(meaValRateDecVal, 100), 'myCanvas' + ide + id);
					id++;
				}
				//用于判断是否没有正数
				if (meaValRateDecVal > 0) {
					isMinus = true;
				}
			}
			for (var i = id; i <= 3; i++) {
				if (isMinus) {
					html = "<td style='width:20%;'><table id='table" + ide + id + "' style='width:100%;'><tr><td><div id='myCanvas" + ide + id + "' width='50' height='50' style='margin-top:10px;width:50px;height:50px' ></div></td></tr><tr><td><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'></span></td></tr></table></td>";
					$("#dataDiv" + ide).append(html);
					id++;
				}
			}

			for (var index in data) {
				//bor = document.getElementById("dataDiv").innerHTML;

				var item1 = data[index]; //item1["key"]
				var meaValRateDec = item1["meaValRateDec"];


				html = "<td style='width:20%;'><table id='table" + ide + id + "' style='width:100%;'><tr><td align='center'><div id='myCanvas" + ide + id + "' width='50' height='50' style='margin-top:10px;width:50px;height:50px' ></div></td></tr><tr><td align='center'><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'>" + item1["dimVal"] + "</span></td></tr></table></td>";
				if (!isMinus && id <= 3 && meaValRateDec < 0) {
					$("#dataDiv" + ide).append(html);
					DrowProcess(mul(meaValRateDec, 100), 'myCanvas' + ide + id);
					id++;
				}
				if (isMinus && id > 3 && meaValRateDec < 0) {
					var htmlAppend = "<tr><td align='center'><div id='myCanvas" + ide + id + "' width='50' height='50' style='margin-top:10px;width:50px;height:50px' ></div></td></tr><tr><td align='center'><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'>" + item1["dimVal"] + "</span></td></tr>";
					var ideVal = id - 3;
					$("#table" + ide + ideVal + " tbody").append(htmlAppend);
					DrowProcess(mul(meaValRateDec, 100), 'myCanvas' + ide + id);
					id++;
				}
			}
			var copyId = id;
			for (var i = id; i <= 6; i++) {
				if (id > 3) {
					if (copyId > 4) {
						html = "<tr><td><div id='myCanvas" + ide + id + "' width='50' height='50' style='margin-top:10px;width:50px;height:50px' ></div></td></tr><tr><td><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'></span></td></tr>";
						var ideVal = id - 3;
						$("#table" + ide + ideVal + " tbody").append(html);
					}

				} else {
					if (!isMinus) {
						html = "<td style='width:20%;'><table id='table" + ide + id + "' style='width:100%;'><tr><td><div id='myCanvas" + ide + id + "' width='50' height='50' style='margin-top:10px;width:50px;height:50px' ></div></td></tr><tr><td><span style='color:#A5A5A5;font-size:12px;margin-left:10px;'></span></td></tr></table></td>";
						$("#dataDiv" + ide).append(html);
					}
				}
				id++;
			}
			ide++;
		});
	} else {
		document.getElementById('box').style.display = 'none'
	}
}



//x,y 坐标,radius 半径,process 百分比,backColor 中心颜色, proColor 进度颜色, fontColor 中心文字颜色, idName空间id名称
function DrowProcess(process, idName) {
	var chart = document.getElementById(idName);
	var yhChart = echarts.init(chart);
	var yhOption = null;
	var num = process;
	var numed = "";
	if (num < 0) {
		numed = Math.abs(num);
		console.log(num, 333333333)
		if (numed > 100) {
			nums = 100;
		} else {
			nums = numed
		}
		yhOption = {
			title: {
				text: numed + "%",
				x: 'center',

				y: 'center',

				textStyle: {

					fontSize: 12,

					fontWeight: 'normal',

					color: '#6BD0D2',

				},



			},
			grid: {
				top: "0px",
				left: "0px",
				right: "0px",
				bottom: "0px"
			},
			series: [{

				type: 'pie',

				radius: ['80%', '100%'],

				silent: true,

				labelLine: {

					show: false

				},

				data: [{

						hoverOffset: 1,

						value: nums,

						itemStyle: {

							color: '#6BD0D2'

						},

						label: {

							show: false

						}

					},

					{

						markArea: {

							silent: true,

						},

						value: 100 - nums,

						itemStyle: {

							color: '#DDDDDD'

						},

						label: {

							show: false

						}

					}

				]

			}]

		};
	} else {
		numed = Math.abs(num);
		if (numed > 100) {
			nums = 100;
		} else {
			nums = numed
		}
		yhOption = {
			title: {
				text: numed + "%",
				x: 'center',

				y: 'center',

				textStyle: {

					fontSize: 12,

					fontWeight: 'normal',

					color: '#FC706F',

				},



			},
			grid: {
				top: "0px",
				left: "0px",
				right: "0px",
				bottom: "0px"
			},
			series: [{

				type: 'pie',

				radius: ['80%', '100%'],

				silent: true,

				labelLine: {

					show: false

				},

				data: [{

						hoverOffset: 1,

						value: nums,

						itemStyle: {

							color: '#FC706F'

						},

						label: {

							show: false

						}

					},

					{

						markArea: {

							silent: true,

						},

						value: 100 - nums,

						itemStyle: {

							color: '#DDDDDD'

						},

						label: {

							show: false

						}

					}

				]

			}]

		};
	}


	if (yhOption && typeof yhOption === "object") {
		yhChart.setOption(yhOption, true);
	}
}

function detailCount(result, type) {
	if (type == 1) { //1标识pos消费
		document.getElementById("jrjybs").innerHTML = result['numDay']; //今日交易笔数
		document.getElementById("jrjyje").innerHTML = result['amDay']; //今日交易金额
		document.getElementById("ydljbs").innerHTML = result['numMonth']; //月度累计笔数
		document.getElementById("ydljje").innerHTML = result['amMonth']; //月度累计金额
		document.getElementById("ydtbbszs").innerHTML = result['numMonthAdd'] + "%"; //月度同比增速
		document.getElementById("ydtbjezs").innerHTML = result['amMonthAdd'] + "%"; //月度同比增速
		document.getElementById("ndljbs").innerHTML = result['numYear']; //年度累计笔数
		document.getElementById("ndljje").innerHTML = result['amYear']; //年度累计笔数
		document.getElementById("ndtbbszs").innerHTML = result['numYearAdd'] + "%"; //年度同比增速
		document.getElementById("ndtbjezs").innerHTML = result['amYearAdd'] + "%"; //年度同比增速
		// document.getElementById("hkstxt").innerHTML = result['actCardNum']; //活卡数
		// document.getElementById("hdshtxt").innerHTML = result['actMccNum']; //活动商户数
		//document.getElementById("time").innerHTML= result['settleDt'];//时间

	}
}


window.measureNm = "";
function ydsmTitle(result) {

	var prodTp = result['prodTp']; //产品类型
	 measureNm = result['measureNm']; //度量名称
	var measureVal = result['measureVal']; //度量值
	var settleDt = result['settleDt']; //清算日期
	var measureValRateAll = result['measureValRateAll']; //今日较前三周同日均值变化
	var isAbnormal = result['isAbnormal']; //异动标识
	var measureValRateAll_val = "";
	var measureValRateAllcloes = document.getElementById("measureValRateAll");
	var isAbnormalcolor = document.getElementById("isAbnormal");
	var unit = "";
	if (measureValRateAll < 0) {
		measureValRateAll_val = "减少";
		measureValRateAll_val += measureValRateAll.replace("-", "");
		measureValRateAll_val += "%↓";
		measureValRateAllcloes.style.color = "#6BD0D2";
	} else if (measureValRateAll == "0.0" || measureValRateAll == "-0.0") {
		measureValRateAll_val += "0.0%";
		measureValRateAllcloes.style.color = "#AEAEAE";
	} else {
		measureValRateAll_val = "增长";
		measureValRateAll_val += measureValRateAll;
		measureValRateAll_val += "%↑";
		measureValRateAllcloes.style.color = "#FC706F";
	}

	if (isAbnormal == "1") {
		isAbnormal = "(今日有异动)";
	} else {
		isAbnormal = "(今日无异动)";
	}
	isAbnormalcolor.style.color = "#ABABAB";
	if (measureNm == "成功笔数") {
		unit = "万笔"
	} else {
		unit = "亿元"
	}
	// measureVal += "亿元";
	document.getElementById("unit").innerHTML = unit;
	document.getElementById("prodTp").innerHTML = prodTp;
	document.getElementById("measureNm").innerHTML = measureNm + ":";
	document.getElementById("measureVal").innerHTML = measureVal;
	document.getElementById("settleDt").innerHTML = settleDt;
	document.getElementById("measureValRateAll").innerHTML = measureValRateAll_val;
	document.getElementById("isAbnormal").innerHTML = isAbnormal;
}

function mul(num1, num2) {
	var m = 0;
	try {
		m += num1.toString().split(".")[1].length
	} catch (e) {}
	try {
		m += num2.toString().split(".")[1].length
	} catch (e) {}
	return (Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", ""))) / Math.pow(10, m)
}

function organization(result) {
	var dataValue = result; //JSON.parse();//测试数据result['data'].trim
	papupData.splice(0, papupData.length);
	//papupData = [];
	var pushValue = {
		city: "全部",
		py: "全部"
	};
	papupData.push(pushValue);
	for (var key in dataValue) {
		var papupValue = {
			city: dataValue[key],
			py: dataValue[key]
		};
		//papupData.push(regionValue);
		papupData.push(papupValue);
	}
	//.push(key)
	//console.log(this.papupData);
}

function regionSelect(result) {
	//regionData = [];
	regionData.splice(0, regionData.length);
	var dataValue = result; //JSON.parse();//测试数据result['data'].trim
	//var pushValue = {city:"全国",py:"全国"};
	//		regionData.push(pushValue);
	for (var key in dataValue) {
		var regionValue = {
			city: dataValue[key],
			py: dataValue[key]
		};
		regionData.push(regionValue);
	}
	//this.regionData = JSON.parse(this.regionData);
	//.push(key)
	console.log(regionData);
}

// function qsjePos(result,ztbsDetailedChartParam,optionParam){
// 	//console.log(result,123444)
// 	var checkboxLove1 = document.getElementsByName("checkboxLove1");
// 	var color = ['#F5846C','#5698D2','#60C3AD','#F5D25A','#6FD8DC','#00FF00','#F56F70','#2785B8'];
// 	var color_content = ['245,132,108','86,152,210','96,195,173','245,210,90','111,216,220','0,255,0','245,111,112','39,133,184'];
// 	var imageValue = [];
// 	var dataValue = [];
// 	var seriesDataValueList = [];
// 	var iValue = 0;
// 	var series = [];
// 	var bsTpNameList = [];
// 	var detail = result['detail'];
// 	for(var key in detail){
// 		var data_1 = detail[key];//获取第一层数据集合
// 		//console.log(data_1,7777777777)
// 		var bsTp = data_1['bsTp'];
// 		var data_2 = data_1['data'];//第二层数据集合
// 		//console.log(data_2,8888888888)
// 		var seriesDataValueList = [];//曲线图结果值集合
// 		var weekList = [];
// 		var monthList = [];
// 		var bubble = [];
// 		var bsTpName = [];
// 		if(detail.length > 1){
// 			bsTpNameList.push(bsTp);
// 		}
// 		for(var key_1 in data_2){//获取时间key
// 			var data3 = data_2[key_1];

// 			for(var key_3 in data3){
// 				bsTpName.push(key_3.substring(5, key_3.length));
// 				var time_data = data3[key_3]

// 				var seriesDataValue = time_data[0];

// 				var week = time_data[3];

// 				var month = time_data[4];
// 				if(time_data[1] == 1 && time_data[2] == 1){//如果为异动值并且为预测值
// 					seriesDataValue = {
// 						value : time_data[0],
// 						//自定义特殊 itemStyle，仅对该数据项有效
// 						itemStyle:{
// 							color: 'rgba('+ color_content[key] +',0.3)',
// 							borderType:'solid',
// 							borderColor:'#FF0000',
// 							borderWidth:3
// 						}
// 					}

// 				}else if(time_data[1] == 1){//如果为异动值
// 					seriesDataValue = {
// 						value : time_data[0],
// 						//自定义特殊 itemStyle，仅对该数据项有效
// 						itemStyle:{
// 							borderType:'solid',
// 							borderColor:'#FF0000',
// 							borderWidth:3
// 						}
// 					}

// 				}else if(time_data[1] == 2){//如果为异动值
// 					seriesDataValue = {
// 						value : time_data[0],
// 						//自定义特殊 itemStyle，仅对该数据项有效
// 						itemStyle:{
// 							borderType:'solid',
// 							borderColor:'#FF0000',
// 							borderWidth:3
// 						}
// 					}

// 				}else if(time_data[2] == 1){//如果为预测值
// 					seriesDataValue = {
// 						value : time_data[0],
// 						//自定义特殊 itemStyle，仅对该数据项有效
// 						itemStyle:{
// 							color: 'rgba('+ color_content[key] +',0.3)',
// 							borderType:'dashed',
// 							borderColor:'#FF0000',
// 							borderWidth:1
// 						}
// 					}
// 				}
// 				if(checkboxLove1[1].checked){//周均
// 					weekList.push(week);
// 					console.log()

// 				}else if(checkboxLove1[2].checked){//月均
// 					monthList.push(month);

// 				}else if(checkboxLove1[0].checked){
//                     seriesDataValueList.push(seriesDataValue);
// 				}

// 			}
// 		}

// 		if(checkboxLove1[1].checked == true){//周均
// 			//echarts 周均月均series参数渲染
// 			var seriesWeekValueList = {name: bsTp+'周均',type: 'line',symbol: 'none',
//             sampling: 'average',stack: '总量'+iValue,smooth: true,label: {normal: {show: false,position: 'insideRight'}},itemStyle:{color: color[key]},data: weekList,xAxisIndex:0}
// 			series.push(seriesWeekValueList);
// 			iValue++;
// 			monitor(posBarChart);

// 		}else if(checkboxLove1[2].checked == true){//月均
// 			//echarts 周均月均series参数渲染
// 			var seriesMonthValueList = {name: bsTp+'月均',type: 'line',symbol: 'none',
//             sampling: 'average',stack: '总量'+iValue,smooth: true,label: {normal: {show: false,position: 'insideRight'}},itemStyle:{color: color[key]},data: monthList,xAxisIndex:0}
// 			series.push(seriesMonthValueList);
// 			iValue++;
// 			monitor(posBarChart);
// 		}else if(checkboxLove1[0].checked == true){
//             //echarts series参数渲染
// 			var seriesValueList = {name: bsTp,type: 'line',smooth: true,symbol: 'none',
// 			sampling: 'average',stack: '总量'+iValue,label: {normal: {show: false,position: 'insideRight'}},itemStyle:{color: color[key]},data: seriesDataValueList,xAxisIndex:0}
// 			series.push(seriesValueList);
// 			iValue++;
// 			monitor(posBarChart);
// 		}


// }
// 	//ztbsDetailedChartParam.canaloption.series = [];
// 	var dataZoomValue = {type: 'inside',start : 84,end : 100,xAxisIndex:2};
// 	var dataZoomValueList = [];
// 	dataZoomValueList.push(dataZoomValue);
// 	console.log(dataZoomValueList,2222)

// 	//var xAxis1 = {type: 'category',axisLabel:{formatter:function(value1,value2){var date=new Date(value1);return (date.getMonth()+1)+"-"+date.getDate();}}};
// //	var xAxis2 = {type: 'category',position:"bottom",offset:30,boundaryGap: true,axisLine:{show:false},axisLabel:{interval: 0}};
// //	var xAxis3 = {position:"bottom",offset:70,type: 'category',show : false,boundaryGap: true,data: bsTpName,axisLabel:{formatter:function(value1,value2){return formatDate(value1);}}};
// //	var xAxisValueList = [];
// //	xAxisValueList.push(xAxis1);
// //	xAxisValueList.push(xAxis2);
// //	xAxisValueList.push(xAxis3);
// var test = ['2018-11-20'];



// 	optionParam.xAxis[2].data = bsTpName;

// 	var arr = [];
// 		series.forEach(function(item){
// 		arr.push({name: item.name,})
// 		})

// var selected_item = {};
// 	for(i =0; i < arr.length; i++){
// 		var key_name = arr[i].name;

// 		if(i >0){
// 		selected_item[key_name] = false;
// 		}else{
// 		   selected_item[key_name] = true;
// 		}
// 	};

//  	optionParam.legend.selected = selected_item;


// 	optionParam.legend.data = arr;
// 	optionParam.dataZoom = dataZoomValueList;
// 	optionParam.series = series;
// 	ztbsDetailedChartParam.setOption(optionParam);
// 	console.log(ztbsDetailedChartParam)

// 	dataZoomParams(ztbsDetailedChartParam,bsTpName,bsTpName.length,optionParam);

// }

// function dataZoomParams(myChartParams,dateValue,dayLength,optionParam){
// 	console.log(optionParam,11111)
// 	//TODO:回调函数
// 	myChartParams.on('dataZoom',function(params) {
// 		var opt = myChartParams.getOption();
// 		console.log(opt,33333)
// 		var dz = opt.dataZoom[0];
// 		console.log(dz,22222)
// 		var start = opt.xAxis[2].data[dz.startValue];
// 		//console.log(start,44444)
// 		var end = opt.xAxis[2].data[dz.endValue];

// 		var startDateIndex=0;
// 		var endDateIndex=0;

// 		var xAxisIndex0Data=[];
// 		var xAxisIndex1Data=[];

// 		//找到start,end日期在date数组中的索引
// 		for(var i=0;i<dateValue.length;i++){
// 			if(formatDate(dateValue[i])==formatDate(start)){
// 				startDateIndex=i;
// 			}
// 			if(formatDate(dateValue[i])==formatDate(end)){
// 				endDateIndex=i;
// 			}		
// 		}

// 		if((endDateIndex-startDateIndex)<60){
// 			for(var i=startDateIndex;i<endDateIndex;i++){
// 				xAxisIndex0Data.push(formatDate(new Date(dateValue[i])));				
// 				// xAxisIndex1Data.push(new Date(dateValue[i]).getFullYear());
// 			}			
// 			optionParam.xAxis[0].data=xAxisIndex0Data;
// 			// optionParam.xAxis[1].data=filterArrayRepeat(xAxisIndex1Data);
// 		}else{
// 			for(var i=startDateIndex;i<endDateIndex;i++){
// 				xAxisIndex0Data.push(new Date(dateValue[i]).getFullYear());								
// 				// xAxisIndex1Data.push(new Date(dateValue[i]).getFullYear());			
// 			}
// 			optionParam.xAxis[0].data=filterArrayRepeat(xAxisIndex0Data);
// 			// optionParam.xAxis[1].data=filterArrayRepeat(xAxisIndex1Data);
// 		}
// 		optionParam.dataZoom[0].start=startDateIndex*100/dayLength;
// 		// optionParam.dataZoom[0].end=endDateIndex*100/dayLength;

// 		myChartParams.setOption(optionParam);
// 	});

// 	//TODO:触发器
// 	myChartParams.dispatchAction({
// 	    type: 'dataZoom',
// 	    batch: [{                   // 第一个 dataZoom 组件
// 	        start: 46,
// 	        end: 100
// 	    }]
// 	});
// }


function qsjePos(result, ztbsDetailedChartParam, drawingType) {
	var color = ['#F5846C', '#5698D2', '#60C3AD', '#F5D25A', '#6FD8DC', '#F6846C', '#F56F70', '#2785B8'];
	var color_content = ['245,132,108', '86,152,210', '96,195,173', '245,210,90', '111,216,220', '246,132,108', '245,111,112', '39,133,184'];
	var error_color = '#FF0000'; //异常值颜色
	var imageValue = [];
	var dataValue = [];
	//var seriesDataValueList = [];
	var series = [];
	var iValue = 0;
	var bsTpNameList = [];
	var summary = result['summary']; //返回总体消费金额
	var detail = result['detail'];
	var countList = [];
	for (var key in detail) {
		var data_1 = detail[key]; //获取第一层数据集合
		var bsTp = data_1['bsTp'];
		var data_2 = data_1['data']; //第二层数据集合
		var seriesDataValueList = []; //曲线图结果值集合
		var seriesDataValueList_forecast = [];
		var seriesDataValueList_not_forecast = [];
		var seriesDataValueList_1 = []; //曲线图结果值集合(不带异常边框及气泡图)
		var bubble = [];
		var bsTpName = [];
		if (detail.length > 1) {
			bsTpNameList.push(bsTp);
		}
		for (var key_1 in data_2) { //获取时间key
			var data3 = data_2[key_1];
			for (var key_3 in data3) {
				bsTpName.push(key_3.substring(5, key_3.length));
				var time_data = data3[key_3]
				var seriesDataValue = time_data[0];
				var seriesDataValue_forecast = time_data[0];
				var seriesDataValue_not_forecast = time_data[0];
				if (time_data[1] == 1 && time_data[2] == 1) { //如果为异动值并且为预测值
					seriesDataValue = {
						value: time_data[0],
						//自定义特殊 itemStyle，仅对该数据项有效
						itemStyle: {
							color: 'rgba(' + color_content[key] + ',0.3)',
							borderType: 'solid',
							borderColor: '#FF0000',
							borderWidth: 3
						}
					}
				} else if (time_data[1] == 1) { //如果为历史异动值
					error_color = '#FDD0D0';
					var bubbleValue = {};
					if (drawingType == "bar") {
						var yAxisValue = parseFloat(time_data[0]);
						var cot = detail.length;
						for (var i = 0; i < countList.length; i++) {
							var iValue = countList[i];
							yAxisValue += parseFloat(iValue[key_1]);
						}
						yAxisValue += "";
						bubbleValue = {
							name: '异动值',
							xAxis: Number(key_1),
							yAxis: yAxisValue,
							itemStyle: {
								color: error_color,
								borderColor: error_color,
								borderWidth: 0,
								borderType: 'solid'
							}
						};
					} else {
						bubbleValue = {
							name: '异动值',
							xAxis: Number(key_1),
							yAxis: time_data[0],
							itemStyle: {
								color: error_color,
								borderColor: error_color,
								borderWidth: 0,
								borderType: 'solid'
							}
						};
					}



					bubble.push(bubbleValue);

					/*seriesDataValue = {
						value : time_data[0],
						//自定义特殊 itemStyle，仅对该数据项有效
						itemStyle:{
							borderType:'solid',
							borderColor:'#FF0000',
							borderWidth:3
						}
					}*/
				} else if (time_data[1] == 2) { //如果为当前日期T-1异动值
					error_color = '#FF0000';
					var bubbleValue = {};
					if (drawingType == "bar") {
						var yAxisValue = parseFloat(time_data[0]);
						var cot = detail.length;
						for (var i = 0; i < countList.length; i++) {
							var iValue = countList[i];
							yAxisValue += parseFloat(iValue[key_1]);
						}
						yAxisValue += "";
						bubbleValue = {
							name: '异动值',
							xAxis: Number(key_1),
							yAxis: yAxisValue,
							itemStyle: {
								color: error_color,
								borderColor: error_color,
								borderWidth: 0,
								borderType: 'solid'
							}
						};
					} else {
						bubbleValue = {
							name: '异动值',
							xAxis: Number(key_1),
							yAxis: time_data[0],
							itemStyle: {
								color: error_color,
								borderColor: error_color,
								borderWidth: 0,
								borderType: 'solid'
							}
						};
					}



					bubble.push(bubbleValue);

					/*seriesDataValue = {
						value : time_data[0],
						//自定义特殊 itemStyle，仅对该数据项有效
						itemStyle:{
							borderType:'solid',
							borderColor:'#FF0000',
							borderWidth:3
						}
					}*/
				} else if (time_data[2] == 1) { //如果为预测值
					seriesDataValue = {
						symbol: 'circle',
						value: time_data[0],
						//自定义特殊 itemStyle，仅对该数据项有效
						itemStyle: {
							color: 'rgba(' + color_content[key] + ',0.3)',
							borderType: 'solid',
							borderColor: '#9FA0A2',
							borderWidth: 1
						}
					}
				}


				//取预测值的集合
				if (drawingType == "line") {
					if (time_data[2] == 1) {
						seriesDataValue_forecast = time_data[0]; //获取趋势图的预测值
					} else if (time_data[2] == 0 && time_data[1] != 2) {
						seriesDataValue_forecast = null; //如果为非预测值则默认为空
					} else if (time_data[2] == 0 && time_data[1] == 2) {
						seriesDataValue_forecast = time_data[0]; //获取趋势T-1的数据
					}
					if (data_2[data_2.length - 4] == data3) {
						seriesDataValue_forecast = time_data[0];
					}
					//取非预测值的集合
					if (time_data[2] == 1) {
						seriesDataValue_not_forecast = null; //获取趋势图的预测值默认为空
					} else if (time_data[2] == 0 && time_data[1] != 2) {
						seriesDataValue_not_forecast = time_data[0]; //如果为非预测值空
					} else if (time_data[2] == 0 && time_data[1] == 2) {
						seriesDataValue_not_forecast = time_data[0]; //获取趋势T-1的数据
					}
				}
			}
			seriesDataValueList_forecast.push(seriesDataValue_forecast); //预测值中的趋势图信息
			seriesDataValueList_not_forecast.push(seriesDataValue_not_forecast); //非预测值中的趋势图信息
			seriesDataValueList.push(seriesDataValue);
			seriesDataValueList_1.push(time_data[0]);
		}
		countList.push(seriesDataValueList_1);
		var stackValue = "";
		if (drawingType == "bar") {
			stackValue = "总量";
		}
		//echarts series参数渲染
		var seriesValueList = {
			name: bsTp,
			type: drawingType,
			smooth: true,
			symbol: 'none',
			sampling: 'average',
			stack: '总量',
			label: {
				normal: {
					show: false,
					position: 'insideRight'
				}
			},
			itemStyle: {
				color: color[key]
			},
			lineStyle: {
				normal: {
					width: 4
				}
			},
			markPoint: {
				data: bubble,
				symbolSize: [12, 12]
			},
			data: seriesDataValueList
		}
		//线型图虚线
		var seriesValueList_forecast = {
			name: bsTp,
			type: drawingType,
			smooth: true,
			symbol: 'none',
			sampling: 'average',
			itemStyle: {
				normal: {
					lineStyle: {
						width: 4,
						type: 'dotted'
					}
				}
			},
			data: seriesDataValueList_forecast
		}
		//线形图实线
		var seriesDataValueList_not_forecast = {
			name: bsTp,
			type: drawingType,
			smooth: true,
			symbol: 'none',
			sampling: 'average',
			stack: stackValue,
			label: {
				normal: {
					show: false,
					position: 'insideRight',
				}
			},
			itemStyle: {
				color: color[key]
			},
			lineStyle: {
				normal: {
					width: 4
				}
			},
			markPoint: {
				data: bubble,
				symbolSize: [12, 12]
			},
			data: seriesDataValueList_not_forecast
		}
		if (drawingType == "line") {
			series.push(seriesDataValueList_not_forecast);
			series.push(seriesValueList_forecast);


		} else {
			series.push(seriesValueList);
			// iValue++;
			//monitor(posBarChart);
		}
	}
	ztbsDetailedChartParam.setOption({ //加载数据图表

		xAxis: {
			data: bsTpName
		},
		legend: {
			data: bsTpNameList,

		},
		series: series
	})
}


posBarOption = {
	//backgroundColor: '#FFFFFF',//设置背景色
	title: {
		//text: 'POS消费',
		subtext: '亿元',
		/*right :'3%',*/
		subtextStyle: {
			color: '#CACACA', //灰色
		},

	},
	tooltip: {
		trigger: 'axis',
		confine: true,
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		},

		formatter: function (params) {
			var str = "";
			var n = []; //一个新的临时数组
			var m = [];
			for (var i = 0; i < params.length; i++) {
				
				if (params[i].data == "" || undefined == params[i].data) {

				} else if (params[0].data == params[1].data) {
					n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(亿元)");
				} else {
					n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(亿元)");
				}
			};

			for (var i = 0; i < n.length; i++) //遍历当前数组
			{
				//如果当前数组的第i已经保存进了临时数组，那么跳过，
				//否则把当前项push到临时数组里面
				if (m.indexOf(n[i]) == -1) m.push(n[i]);
			}
			for (var i = 0; i < m.length; i++) {
				str += m[i];
			}
			//console.info(params);
			return str;
		}
	},
	legend: {
		data: ['借记卡', '信用卡'],
		bottom: '14px',
		selected: {
			"合计": true, //图例为‘全部’的一项默认置灰
			"付款": false,
			"断直连->发卡侧": false,
			"基础": false,
			"断直连->受理侧": false
		}

	},
	grid: {
		top: '14%',
		left: '2%',
		right: '2%',
		bottom: '20%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',
		axisTick: { //去除x横坐标刻度线
			alignWithLabel: true
		},
		axisLabel: {
			//interval: 6//0：全部显示，1：间隔为1显示对应类目，2：依次类推，（简单试一下就明白了，这样说是不是有点抽象） 
			//rotate:-50,//倾斜显示，-：顺时针旋转，+或不写：逆时针旋转 
			// formatter:function(value1,value2){
			// 	//console.log(value1,333333333333)

			// 	var date=new Date(value1);
			// 	//console.log(date,33333333333)
			// 	return (date.getMonth()+1)+"-"+date.getDate();
			// }
		},
		axisLine: { //X轴隐藏（横线）
			lineStyle: {
				type: 'solid',
				color: '#CACACA', //左边线的颜色
				width: '1', //坐标线的宽度,
			},
		},
		boundaryGap: true,
		data: []
	}],
	yAxis: {
		type: 'value',
		/*show: false,*/
		splitLine: {
			show: false
		}, //去除网格线
		axisLine: { //X轴隐藏（横线）
			lineStyle: {
				type: 'solid',
				color: '#CACACA', //左边线的颜色
				width: '1', //坐标线的宽度,
			},
		},
		boundaryGap: true,

		scale: true,
		min: function (value) {
			if (value.min <= 0) {
				return 0;
			} else {
				return parseInt(value.min - (value.min * 0.2));
			}
		}

	},
	dataZoom: [{
		type: 'inside',
		start: 84, //伸缩条开始位置（1-100），可以随时更改
		end: 100, //伸缩条结束位置（1-100），可以随时更改

	}],
	series: []
};
if (posBarOption && typeof posBarOption === "object") {
	posBarChart.setOption(posBarOption, true);
}

//TODO:获取一年又多少天
// function getDay(year){ 
//     if(((year%4==0)&&(year%100!=0))||(year%400==0))  
//     	return 366;
// 	else 
// 		return 365; 
// }

// //TODO:日期的格式化，可以直接扩展到Date类上。
// function formatDate(da){
// 	var date=new Date(da);
// 	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
// }

// //TODO:数组去重
// function filterArrayRepeat(arr){
// 	var hash=[];
// 	for (var i = 0; i < arr.length; i++) {
// 	    if(arr.indexOf(arr[i])==i){
// 	    	hash.push(arr[i]);
// 		}
// 	}
// 	return hash;
// }

posjyjeBarOption = {
	//backgroundColor: '#FFFFFF',//设置背景色
	title: {
		//text: 'POS消费',
		/*right:'3%',*/
		subtext: '万笔',
		subtextStyle: {
			color: '#CACACA', //灰色
		},

	},
	tooltip: {
		trigger: 'axis',
		confine: true,
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		},
		formatter: function (params) {
			var str = "";
			var n = []; //一个新的临时数组
			var m = [];
			for (var i = 0; i < params.length; i++) {
				if (params[i].data == "" || undefined == params[i].data) {

				} else if (params[0].data == params[1].data) {
					n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万笔)");
				} else {
					n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万笔)");
				}
			};

			for (var i = 0; i < n.length; i++) //遍历当前数组
			{
				//如果当前数组的第i已经保存进了临时数组，那么跳过，
				//否则把当前项push到临时数组里面
				if (m.indexOf(n[i]) == -1) m.push(n[i]);
			}
			for (var i = 0; i < m.length; i++) {
				str += m[i];
			}
			//console.info(params);
			return str;
		}
	},
	legend: {
		data: ['借记卡', '信用卡'],
		bottom: '14px',
		width: document.getElementById('tab_content_interior').style.width,
		selected: {
			"合计": true, //图例为‘全部’的一项默认置灰
			"付款": false,
			"断直连->发卡侧": false,
			"基础": false,
			"断直连->受理侧": false
		}
	},
	grid: {
		top: '14%',
		left: '2%',
		right: '4%',
		bottom: '20%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',
		axisTick: { //去除x横坐标刻度线
			alignWithLabel: true

		},
		axisLabel: {
			//rotate:-50,
			// formatter:function(value1,value2){	        			        		
			// 	var date=new Date(value1);
			// 	return (date.getMonth()+1)+"-"+date.getDate();
			// }
		},
		axisLine: { //X轴隐藏（横线）
			lineStyle: {
				type: 'solid',
				color: '#CACACA', //左边线的颜色
				width: '1', //坐标线的宽度,
			},
		},
		boundaryGap: true
	}, {
		type: 'category',
		position: "bottom",
		offset: 70,
		boundaryGap: true,
		axisTick: { //去除x横坐标刻度线
			show: false
		},
		axisLine: { //X轴隐藏（横线）
			show: false
		},
		axisLabel: {
			interval: 0
		},
		boundaryGap: true
	}, {
		position: "bottom",
		offset: 70,
		type: 'category',
		show: false,
		boundaryGap: true, //由于数据太多，这个值看不到效果
		data: [],
		axisTick: { //去除x横坐标刻度线
			show: false
		},
		axisLabel: {
			formatter: function (value1, value2) {
				return formatDate(value1);
			}
		},
		axisLine: { //X轴隐藏（横线）
			lineStyle: {
				type: 'solid',
				color: '#CACACA', //左边线的颜色
				width: '1', //坐标线的宽度,
			},
		},
		boundaryGap: true
	}],
	yAxis: {
		type: 'value',
		/*show: false,*/
		splitLine: {
			show: false
		}, //去除网格线
		axisLine: { //X轴隐藏（横线）
			lineStyle: {
				type: 'solid',
				color: '#CACACA', //左边线的颜色
				width: '1', //坐标线的宽度,
			},
		},
		boundaryGap: true,

		scale: true,
		min: function (value) {
			if (value.min <= 0) {
				return 0;
			} else {
				return parseInt(value.min - (value.min * 0.2));
			}
		}
	},
	dataZoom: [{
		type: 'inside',
		start: 84, //伸缩条开始位置（1-100），可以随时更改
		end: 100, //伸缩条结束位置（1-100），可以随时更改
	}],
	series: [
		// {
		//     name: '信用卡',
		//     type: 'bar',
		//     stack: '总量',
		//     label: {
		//         normal: {
		//             show: false,
		//             position: 'insideRight'
		//         }
		//     },
		// 	itemStyle:{
		// 		color: '#7CB5EC'
		// 	},
		//     data: []
		// },
		// {
		//     name: '借记卡',
		//     type: 'bar',
		//     stack: '总量',
		//     label: {
		//         normal: {
		//             show: false,
		//             position: 'insideRight'
		//         }
		//     },
		// 	itemStyle:{
		// 		color: '#EC6C70'
		// 	},
		//     data: []
		// }
	]
};
var papupData = [];
/*var papupData = [
				{city:'中国银行',py:'zhongguoyinhang'},{city:'工商银行',py:'gongshangyh'},{city:'农业银行',py:'nongyeyinhang'},
				{city:'招商银行',py:'zhaoshangyinhang'},{city:'浦发银行',py:'pufayinhang'},{city:'平安银行',py:'pinganyinhang'},
				{city:'建设银行',py:'jiansheyinhang'},{city:'拉卡拉',py:'lakala'},{city:'交通银行',py:'jiaotongyinhang'},
				{city:'农村信用社',py:'nongcunxinyongshe'},{city:'上海银行',py:'shanghaiyinhang'},{city:'长沙银行',py:'changshayinhang'},
				{city:'武汉银行',py:'wuhanyinhang'},{city:'北京银行',py:'beijingyinhang'},{city:'深圳银行',py:'shenzhenyinhang'}
			];*/
//弹出机构筛选条件  ----------start
Vue.component('com-citychoice', {
	data: function () {
		return {
			isCancel: false,
			zimShow: false,
			ssval: '',
			zimText: '',
			/*sidabers:[
				'热门','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z'
			],*/
			sidabers: [],
			citys: papupData,
			hostCitys: []

		}
	},
	template: `
		<section class="cityChoiceBox" id="cityChoiceBox">
		<div class="SuspendedBall">
			<div onClick="ToTop()">
			</div>
		</div>
			<article class="cityChoice-top transit" v-bind:class='{focus:isCancel}'>
				<transition enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
					
					<span   v-if='!isCancel' v-on:click='cityClose'><h3 style="font-size:14px;color:#ccc;font-weight:400">返回上级</h3></span>
				</transition>
				<input type="text" class="search-input" placeholder="中文/拼音/首写字母" v-model.trim='ssval' v-on:focus='search' />
				<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
					<i v-if='isCancel' v-on:click='isCancel=false' class="cancel">取消</i>
				</transition>
				<div style="font-size:8px;width:100%;height:15px;">默认显示总交易量前50名，查看全部请点击页面下方的“更多机构”</div>
			</article>
			<article class="city-Box" v-show='!isCancel'>
				<div class="city-sidaber" id="city-sidaber" v-show='!isCancel'>
					<p v-for="(sidaber,index) in sidabers" v-on:touchstart='mousedownFun(index)' v-on:touchend='mouseupFun(index)' v-text='sidaber'></p>
				</div>
				<div class="city-content">
						<div style="border-radius:5px" v-for='(item,index) in cityA' v-if='index<50' v-on:click='cityactive(index,cityA)'><img src="images/1.png" style="width: 44px;float: left;/* padding: 10px 15px; */margin: -1% 10% 0px;background-color: rgb(241, 241, 241,0);margin: -4px 10% 0px 10%;"><p style='border-radius:50px;text-align:left;font-size:14px;'>{{item.city}}</p></div>
						<div style="width:100%;display: flex;justify-content: center;"><button style="width:120px;height: 32px;margin-top: 20px;background:#0bbef6;color:#fff; border-radius:5px;" v-on:click='search()'>+&nbsp查看更多机构</button></div>
				</div>
				<div v-show='zimShow' class="zimShow" v-text='zimText'></div>
			</article>
			<article class="search-box" id="search-box" v-show='isCancel'>
					<div class="sousuo" v-for='(item,index) in sousuos' v-on:click='cityactive(index,sousuos)'><img src="images/1.png" style="width: 44px;float: left;/* padding: 10px 15px; */margin: -1% 10% 0px;background-color: rgb(241, 241, 241,0);margin: -4px 10% 0px 10%;"><p style='border-top-left-radius:14px;border-bottom-left-radius:18px;text-align:left;font-size:14px;'>{{item.city}}</p></div>
			</article>
		</section>
	`,
	methods: {
		//调用城市选择组件
		cityFun: function () {
			var cityChoiceBox = document.getElementById('cityChoiceBox');
			var citySidaber = document.getElementById('city-sidaber');
			var clientW = document.documentElement.clientWidth || document.body.clientWidth;
			cityChoiceBox.style.left = clientW + 'px';
			cityChoiceBox.style.display = "block"
			cityChoiceBox.style.top = '-33px';
			this.starMove(cityChoiceBox, {
				left: 0
			}, function () {
				citySidaber.style.display = "block"
			});
		},
		//关闭城市选择组件
		cityClose: function () {
			this.isCancel = false;
			var cityChoiceBox = document.getElementById('cityChoiceBox');
			var citySidaber = document.getElementById('city-sidaber');
			var clientW = document.documentElement.clientWidth || document.body.clientWidth;
			citySidaber.style.display = "none"
			this.starMove(cityChoiceBox, {
				left: clientW
			}, function () {
				cityChoiceBox.style.display = "none"
			});
		},
		//变速运动
		starMove: function (obj, json, fn) { //添加一个回调函数fn
			function getStyle(obj, attr) {
				if (obj.currentStyle) {
					return obj.currentStyle[attr];
				} else {
					return getComputedStyle(obj, false)[attr];
				}
			}
			clearInterval(obj.timer);
			obj.timer = setInterval(function () {
				var flag = true; //假设都到达了目标值
				for (var attr in json) {
					//1.取当前值
					var icur = 0;
					icur = parseInt(getStyle(obj, attr));
					//2.算速度
					var speed = (json[attr] - icur) / 8;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					//3.检查停止
					if (icur != json[attr]) {
						flag = false;
					}
					obj.style[attr] = icur + speed + "px";
					if (flag) {
						clearInterval(obj.timer);
						if (fn) { //判断是否存在回调函数,并调用
							fn();
						}
					}
				}
			}, 20);
		},
		//搜索框获取焦点进入搜索层
		search: function () {
			this.isCancel = true;
		},
		cityactive: function (index, cityss) {
			this.cityClose();
			this.zimShow = false;
			this.$emit("tochildevent", cityss[index].city)

			window.cut = sessionStorage.getItem('cut');
			if (cut == 2) {
				posjyjeBarChart = echarts.init(document.getElementById("posjyjeBarChart")); //清算金额
				posjyjeBarChart.setOption(posjyjeBarOption, true);
				monitor(posjyjeBarChart);
				pocChart(7, urlHost + "business-run/newTotal/graphics", "post", '{"displaySummary":"1","meaType":"成功笔数","area":"全国","org":"' + (cityss[index].city == "全部" ? "" : cityss[index].city) + '","granularity":"0","dayType":"0"}'); //pos消费(柱状图)
			} else {
				pocChart(1, urlHost + "business-run/newTotal/graphics", "post", '{"displaySummary":"1","meaType":"清算金额","area":"全国","org":"' + (cityss[index].city == "全部" ? "" : cityss[index].city) + '","granularity":"0","dayType":"0"}'); //pos消费(柱状图)
				posBarChart.setOption(posBarOption, true);
			}

			
		}
	},
	//首字母过滤
	computed: {
		cityA: function () {
			return this.citys.filter(function (item) {
				return item.py;
			});
		},
		//搜索过滤
		sousuos: function () {
			var ssval = this.ssval;
			return this.citys.filter(function (item) {
				return item.py.indexOf(ssval) != -1 || item.city.indexOf(ssval) != -1;
			});
		}
	}

})
//弹出机构筛选条件  ----------end




//弹出地级市筛选条件  ----------start
Vue.component('com-region-citychoice', {
	data: function () {
		return {
			isCancel: false,
			zimShow: false,
			ssval: '',
			zimText: '',
			sidabers: [],
			citys: regionData,
			hostCitys: regionData
		}
	},
	template: `
		<section class="region-cityChoiceBox" id="region-cityChoiceBox">
			<article class="cityChoice-top transit" v-bind:class='{focus:isCancel}'>
				<transition enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
					<span   v-if='!isCancel' v-on:click='cityClose'><h3 style="font-size:16px;color:#999;font-weight:400">返回上级</h3></span>
				</transition>
			</article>
			<article class="city-Box" v-show='!isCancel'>
			
				<div class="host-city">
				   
					<h3>选择城市</h3>
					<span v-for='(item,index) in hostCitys'  v-if="index==0"  v-bind:item="item" v-bind:index="index" v-text='item.city' v-on:click='cityactive(index,hostCitys)' style="width:87%;"></span>
					<span v-for='(item,index) in hostCitys' v-if="index >= 1" v-text='item.city' v-on:click='cityactive(index,hostCitys)'></span>
				</div>
			</article>
		</section>
	`,
	methods: {
		//调用城市选择组件
		cityFun: function () {
			pocChart(6, "http://192.168.1.51:9010/bmws/authorize/getDataArea", "post", '{"id":"' + userid + '"}'); //地区查询
			var cityChoiceBox = document.getElementById('region-cityChoiceBox');
			//var citySidaber=document.getElementById('city-sidaber');
			var clientW = document.documentElement.clientWidth || document.body.clientWidth;
			cityChoiceBox.style.left = clientW + 'px';
			cityChoiceBox.style.display = "block";
			cityChoiceBox.style.top = '-33px';

			this.starMove(cityChoiceBox, {
				left: 0
			}, function () {
				//citySidaber.style.display="block"
			});
		},
		//关闭城市选择组件
		cityClose: function () {
			this.isCancel = false;
			var cityChoiceBox = document.getElementById('region-cityChoiceBox');
			//var citySidaber=document.getElementById('city-sidaber');
			var clientW = document.documentElement.clientWidth || document.body.clientWidth;
			//citySidaber.style.display="none"
			cityChoiceBox.style.display = "none";
			this.starMove(cityChoiceBox, {
				left: clientW
			}, function () {
				//cityChoiceBox.style.display="none"
			});
		},
		//变速运动
		starMove: function (obj, json, fn) { //添加一个回调函数fn
			function getStyle(obj, attr) {
				if (obj.currentStyle) {
					return obj.currentStyle[attr];
				} else {
					return getComputedStyle(obj, false)[attr];
				}
			}
			clearInterval(obj.timer);
			obj.timer = setInterval(function () {
				var flag = true; //假设都到达了目标值
				for (var attr in json) {
					//1.取当前值
					var icur = 0;
					icur = parseInt(getStyle(obj, attr));
					//2.算速度
					var speed = (json[attr] - icur) / 8;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					//3.检查停止
					if (icur != json[attr]) {
						flag = false;
					}
					obj.style[attr] = icur + speed + "px";
					if (flag) {
						clearInterval(obj.timer);
						if (fn) { //判断是否存在回调函数,并调用
							fn();
						}
					}
				}
			}, 20);
		},
		//搜索框获取焦点进入搜索层
		search: function () {
			this.isCancel = true;
		},
		cityactive: function (index, cityss) {
			this.cityClose();
			this.zimShow = false;
			this.$emit("tochildevent", cityss[index].city);
				pocChart(4, urlHost + "business-run/newTotal/org", "post", '{"area":"全国"}'); //机构查询$('#regionId').val()
				//pocChart(9,urlHost+"overview/pie","post",'{"area":"'+cityss[index].city+'","meaType":"清算金额","displaySummary":"0"}');//总体（饼图）
				pocChart(1, urlHost + "business-run/newTotal/graphics", "post", '{"displaySummary":"1","meaType":"清算金额","area":"全国","org":"' + ($('#orgId').val() == "全部" ? "" : $('#orgId').val()) + '","granularity":"0","dayType":"0"}'); //pos消费(柱状图)
				pocChart(2, urlHost + "business-run/newTotalTopTextData/text", "post", '{"area":"全国"}'); //概况详情$('#regionId').val()
				pocChart(3, urlHost + "business-run/newTotal/tradechange", "post", '{"meaType":"清算金额","area":"全国"}'); //交易变化原因分解$('#regionId').val()
				pocChart(5, urlHost + "business-run/newTotal/changedesc", "post", '{"meaType":"清算金额","area":"全国"}'); //异动说明$('#regionId').val()
			//document.getElementById('organization').disabled=false;
		}
	}

})
//弹出地级市筛选条件  ----------end
window.onresize = function () {
	posBarChart.resize();
	posjyjeBarChart.resize();
	posBarsChart.resize();
	posjyjeBarsChart.resize();

}
ztjeDetailedOption = null;
barOption = null;
posBarOption = null;
yhyzOption = null;
djywOption = null;
ewmBarOption = null;
sjsfBarOption = null;
yhfzZtOption = null;
ewmSjsfOption = null;
ysfAppOption = null;
shfzZtOption = null;
ShfzEwmSjsfOption = null;
fkdzlOption = null;
sddzlOption = null;
fundOption = null;
baseTotalOption = null;
baseTotalsOption = null;
app.title = '堆叠条形图';

var PublicJs = {};
PublicJs.IsPhone = function () {//判断是否是手机浏览器
    try {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            return true;
        } else {
            return true;
        }
    } catch (e) {
        return true;
    }
}
//鼠标事件
PublicJs.Mouse = {
    Down: (PublicJs.IsPhone() ? "touchstart" : "mousedown"),
    Move: (PublicJs.IsPhone() ? "touchmove" : "mousemove"),
    Up: (PublicJs.IsPhone() ? "touchend" : "mouseup"),
};
//鼠标移动
PublicJs.Move = function (e) {
    var move = {x: 0, y: 0};
    var _e = e.touches ? e : window.event;
    if (PublicJs.IsPhone()) {
        try {
            // evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
            var touch = _e.touches[0]; //获取第一个触点
            move.x = Number(touch.pageX); //页面触点X坐标
            move.y = Number(touch.pageY); //页面触点Y坐标
        } catch (e) {
            move.x = _e.screenX;
            move.y = _e.screenY;
        }
    } else {
        move.x = e.screenX;
        move.y = e.screenY;
    }
    return move;
};

/*PublicJs.js*/


//frame页面点击隐藏顶级父页面悬浮球菜单的方法
function FrameBodyClick() {
    var topWin = (function (p, c) {
        while (p != c) {
            c = p
            p = p.parent
        }
        return c
    })(window.parent, window);
    $("body").bind(PublicJs.Mouse.Down, function (e) {
        if (topWin.SuspendedBall) {
            if ($(window).width() < topWin.SuspendedBall.ShowWidth) {
                topWin.SuspendedBall.ShowBall();
            }
        }
    });
}

$(function () {
    pocChart(21, "http://192.168.1.51:9010/bmws/authorize/getDataArea", "post", '{"id":"13"}');//获取当前登录用户地区数据
    pocChart(22, "http://192.168.1.51:9010/bmws/authorize/getRole", "post", '{"id":"13"}');//获取权限
    //pocChart(35,"http://192.168.1.51:9010/bmws/authorize/getCompanyMessage","post",'{"id":"13"}');//获取分公司权限
    sessionStorage.setItem("userId", 13);
    FrameBodyClick();
    pocChart(2, urlHost + "overview/text", "get", null);//概况详情1
    pocChart(5, urlHost + "overview/abnormalchange/org", "get", null);//机构监控
    pocChart(7, urlHost + "overview/abnormalchange/area", "get", null);//地区交易异动监控
    pocChart(23, urlHost + "common/schedule", "get", '');//顶部时间
})

function pocChart(type, url, requestType, requestData) {
    $.ajax({
        url: url,
        type: requestType,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: requestData,//json字符串
        success: function (data) {
            if (type == 0) {//总体
                ywyxTotal(data, pieChart, "00成功笔数:-value万笔");
            }
            if (type == 1) {//线上消费
                //ywyxPos(data);
                ztcgbsqst(data, posBarChart, "清算金额:-value亿元", "bar");
                offline(data);
            }
            if (type == 2) {//概况详情1
                detailCount1(data);
            }
            if (type == 3) {//概况详情2
                detailCount2(data);
            }
            if (type == 4) {//概况详情3
                detailCount3(data);
            }
            if (type == 5) {//机构监控
                jgjkTitle(data);
            }
            if (type == 6) {//总体清算金额
                ywyxTotal(data, ztjetjChart, "清算金额:-value亿元");
            }
            if (type == 7) {//地区监控
                dqjkTitle(data);
            }
            if (type == 8) {//总体成功笔数（趋势图）
                ztcgbsqst(data, ztbsDetailedChart, "00成功笔数:-value万笔", "line");
                stroke(data);
            }
            if (type == 9) {//总体清算金额（趋势图）
                ztcgbsqst(data, ztjeDetailedChart, "清算金额:-value亿元", "line");
                money(data);
            }
            if (type == 10) {//ATM（趋势图）
                ztcgbsqst(data, barChart, "清算金额:-value亿元", "bar");
                atm(data)
            }
            if (type == 11) {//贷记业务（趋势图）
                ztcgbsqst(data, djywChart, "清算金额:-value亿元", "line");
                credit(data);
            }
            if (type == 12) {//账户验证（趋势图）
                ztcgbsqst(data, yhyzChart, "00成功笔数:-value万笔", "line");
                account(data)
            }
            if (type == 13) {//二维码（趋势图）
                ztcgbsqst(data, ewmBarChart, "00成功笔数:-value万笔", "bar");
                ewm(data)
            }
            if (type == 14) {//手机闪付（趋势图）
                ztcgbsqst(data, sjsfBarChart, "00成功笔数:-value万笔", "bar");
                sjsf(data)
            }
            if (type == 15) {//用户发展总体趋势（趋势图）
                ztcgbsqst(data, yhfzZtChart, "活卡量:-value亿张", "line");
                yhzt(data)
            }
            if (type == 16) {//用户发展二维码+手机闪付（趋势图）
                ztcgbsqst(data, ewmSjsfChart, "移动支付活卡量:-value万张", "line");
                yhydzf(data)
            }
            if (type == 17) {//用户发展云闪付APP（趋势图）
                ztcgbsqst(data, ysfAppChart, "新增注册用户数:-value万户", "line");
                yhapp(data)
            }
            if (type == 18) {//线上消费（趋势图）
                ztcgbsqst(data, myChart, "清算金额:-value亿元", "line");
                online(data)
            }
            if (type == 19) {//商户发展[总体]趋势图/堆叠柱状图（趋势图）
                ztcgbsqst(data, shfzZtChart, "活动商户数:-value万户", "bar");
                shzt(data)
            }
            if (type == 20) {//商户发展[二维码+手机闪付]趋势图（趋势图）
                ztcgbsqst(data, ShfzEwmSjsfChart, "活动商户数:-value万户", "line");
                shydzf(data)
            }
            if (type == 21) {//获取当前登录用户地区数据
                areaResult(data);
            }
            if (type == 22) {//获取管理员权限
                authorityManagement(data);
            }
            if (type == 23) {//顶部炫富时间
                timeSchedule(data);
            }
            if (type == 24) {//用户
                checksecurity(data);
            }
            if (type == 25) {
                boreTitle(data)
            }
            if (type == 26) {
                ztcgbsqst(data, fkdzlChart, "00成功笔数:-value万笔", "bar");//发卡
                tuck(data);
            }
            if (type == 27) {
                ztcgbsqst(data, sddzlChart, "成功笔数:-value万笔", "bar");//收单
                acquirer(data);
            }
            if (type == 28) {
                ztcgbsqst(data, fundChart, "结算金额:-value亿元", "bar");//客结
                kjyw(data)
            }
            // if(type == 32){
            // 	roleData(data)
            // }if(type == 33){
            // 	roleDatas(data)
            // }
            // if(type == 38){
            // 	checked(data)
            // }if(type == 37){
            // 	checkeds(data)
            // }
            // if(type == 31){
            // 	roleDataed(data)
            // }if(type == 34){
            // 	roleDataeds(data)
            // }
            if (type == 29) {//基础总体成功笔数（趋势图）
                ztcgbsqst(data, baseTotalChart, "00成功笔数:-value万笔", "line");
                strokes(data);
            }
            if (type == 30) {//基础总体清算金额（趋势图）
                ztcgbsqst(data, baseTotalsChart, "清算金额:-value亿元", "line");
                moneys(data);
            }
        }
    });
}

function timeSchedule(data) {
    //document.getElementById("dataed").innerHTML = "监控日期："+data['date']+"&nbsp;&nbsp;&nbsp;&nbsp;"+data['weekDesc']+"&nbsp;&nbsp;"+data['holidayDesc']+"";//顶部悬浮时间
}

/**
 * getUserInfo 根据校验码获取用户信息
 * 声明：以下示例代码仅供联调使用，上生产时请根据不同的异常情况自行处理
 */
var getUserInfo = function () {
    var url = 'upchat.95516.net:443/upchat-public-gateway/api/app/checksecurity';
    //成功后回调函数 代表流程是正常的，但是还需要判断result.status
    //这里成功后调用了后台checkcode的servlet校验安全码
    var _success = function (result) {
        // 验证校验码
        // AJAX验证校验码，此处接口和参数自行设计和约定
        UPCHAT.M.NAPI.dismiss();
        //alert('验证校验码' + result.security);
        /**
         * status 为0 代表服务器返回的值是正确的
         * 其他情况 可以提示为服务器内部错误
         */
        if (result.status == '0') {
            var data = {
                security: result.security, apikey: "0a249c697330e21ed7efe936d9572029"
            };
            /**
             *
             * 拿到验证码后，分为以下几步：
             * 1、去对接系统后台checkSecurity，
             * 2、对接系统的后台会去U聊后台checkSecurity,
             *      根据返回的值判断是否拿到用户信息，U聊后台返回码：
             *      "0", "成功"
             *      "99", "非法请求" 代表用户没权限，或者公众号配置有问题
             *      "100", "登录已失效，请重新登录"
             *   对接系统自行处理，为0代表拿到用户信息，其他代表未拿到，例如用户没有权限，后台就会返回99
             * 3、前端根据对接系统的返回值，展示给用户
             *   例如："0" 代表成功 "99"代表用户无权限
             */
            pocChart(24, "http://192.168.1.51:9010/bmws/auth/checksecurity", "post", '{"security":"' + result.security + '"}');//获取权限
        } else {
            //alert(JSON.stringify(result));
            alert('服务器内部错误');
        }
    };

    //失败后回调函数 代表客户端失败，或者服务器给客户端返回500之类的错误
    var _fail = function (fal) {
        UPCHAT.M.NAPI.dismiss();
        /**
         * ios:
         * fal '版本不支持', 则提示用户去下载最新版U聊
         * android
         * fal 'Class not found'或者'Invalid action' ,则提示用户去下载最新版U聊
         * toNewApp()
         * 其他情况，提示用户错误信息
         */
        if (fal == '版本不支持' || fal == 'Class not found' || fal == 'Invalid action') {
            toNewApp();
        } else {
            alert(fal);
        }
    };
    UPCHAT.M.NAPI.showLoadingView();
    UPCHAT.M.NAPI.getSecurity(_success, _fail);
}

// 非U聊客户端打开
// 声明：以下示例代码仅供联调使用，上生产时请根据不同的异常情况自行处理
var toApp = function () {
    //$(".upapi-container").css("display", "block");
    var html = '<label>请用爽爽办公客户端打开该界面</label><br />' +
        '<a href="http://upchat.95516.net/app/">爽爽办公客户端下载</a>';
    document.getElementsByTagName("body")[0].innerHTML = "";
};

// U聊老客户端打开
// 声明：以下示例代码仅供联调使用，上生产时请根据不同的异常情况自行处理
var toNewApp = function () {
    $(".upapi-container").css("display", "block");
    var html = '<label>请用最新版爽爽办公客户端打开该界面</label><br />' +
        '<a href="http://upchat.95516.net/app/">爽爽办公客户端下载</a>';
    $(".upapi-container").html(html);
};

function checksecurity(ret) {
    if (ret.status == '0') {
        // alert('用户信息：' + JSON.stringify(ret.id));
        var content = JSON.stringify(ret.id);
        sessionStorage.setItem("userId", content);
        // localStorage.setItem("id",JSON.stringify(ret.id))
        if (content == "0") {
            toApp();
        } else {
            //ToTop();
            FrameBodyClick();
            //pocChart(21,"http://192.168.1.51:9010/bmws/authorize/getDataArea","post",'{"id":"'+ JSON.stringify(ret.id) +'"}');//获取当前登录用户地区数据
            pocChart(21, "http://192.168.1.51:9010/bmws/authorize/getDataArea", "post", '{"id":"' + JSON.stringify(ret.id) + '"}');//获取当前登录用户地区数据
            pocChart(2, urlHost + "overview/text", "get", null);//概况详情1
            pocChart(5, urlHost + "overview/abnormalchange/org", "get", null);//机构监控
            pocChart(7, urlHost + "overview/abnormalchange/area", "get", null);//地区交易异动监控
            pocChart(22, "http://192.168.1.51:9010/bmws/authorize/getRole", "post", '{"id":"' + JSON.stringify(ret.id) + '"}');//获取权限
            pocChart(23, urlHost + "common/schedule", "get", '');//顶部时间
            pocChart(25, urlHost + "business-run/total/bscal", "get", null);//首页口径
        }
    } else if (ret.status == '99') {
        alert('用户无权限')
    } else {
        alert('服务器内部错误');
    }
}

//分公司、总公司的判断
// function getCompanyMessage(data){
// 	console.log(data,3333)
// 	if(data.ORGNAME !== "总公司"){
// 		document.getElementById("ensemble").style.display="none";
// 		document.getElementById("tuck").style.display="none";
// 		document.getElementById("Conumse").style.display="none"
// 	}
// }


function authorityManagement(data) {
    var manager = data[0];//0非管理员 1管理员
    var area = data['area'];//全部权限则判断"总公司"

    window.a = false;
    window.b = false;
    window.c = false;
    window.d = false;

    for (var key in data) {
        var authorityValue = data[key];
        switch (authorityValue) {
            case "0":
                a = true;
                break;

            case "7":
                c = true;

                break;
            case "8":
                d = true;
                break;
            case "2":
                b = true;
                break;
            default:
                break;
        }
    }
    if (a == true) {
        document.getElementById("data").style.display = "block";
        document.getElementById("dqjkdata").style.display = "block";
    } else {
        document.getElementById("data").style.display = "block";
        document.getElementById("dqjkdata").style.display = "block";
    }

    // if(b == true){
    // 	document.getElementById("buttoneds").style.display="block";
    // 	document.getElementById("buttoned").style.display="block";
    // 	pocChart(38,"http://192.168.1.51:9010/bmws/authorize/commList","post",'{"name":"IsShowOrgan"}');//机构异动
    // 	pocChart(37,"http://192.168.1.51:9010/bmws/authorize/commList","post",'{"name":"IsShowArea"}');//地区异动

    // }else{
    // 	pocChart(32,"http://192.168.1.51:9010/bmws/authorize/commList","post",'{"name":"IsShowOrgan"}');//机构异动
    // 	pocChart(33,"http://192.168.1.51:9010/bmws/authorize/commList","post",'{"name":"IsShowArea"}');//地区异动

    // }
    // if(c == true){
    // 	pocChart(32,"http://192.168.1.51:9010/bmws/authorize/commList","post",'{"name":"IsShowOrgan"}');//机构异动
    // }
    // if(d == true){
    // 	pocChart(33,"http://192.168.1.51:9010/bmws/authorize/commList","post",'{"name":"IsShowArea"}');//地区异动
    // }

}

// 机构
// function roleData(data){
// 	if(data[0].value =="0"){
// 		if(c == true){
// 		  document.getElementById("data").style.display="block";
// 	 	  document.getElementById("roleds").style.display="none";
// 		}
// 	}else{
// 		if(b==true && c == true){
// 		  document.getElementById("data").style.display="block";
// 	 	  document.getElementById("roleds").style.display="none";
// 		}else if(b==false && c == true){
//       document.getElementById("data").style.display="none";
// 	 	  document.getElementById("roleds").style.display="block";
// 		}

// 	}

// }

//地区
// function roleDatas(data){
// 	if(data[0].value =="0"){
// 		if(d==true){
// 			document.getElementById("dqjkdata").style.display="block";
// 			document.getElementById("roled").style.display="none";
// 		}
// 	}else{
// 		if(b==true && d == true){
// 		  document.getElementById("dqjkdata").style.display="block";
// 	 	  document.getElementById("roled").style.display="none";
// 		}else if(b==false && d == true){
//       document.getElementById("dqjkdata").style.display="none";
// 	 	  document.getElementById("roled").style.display="block";
// 		}
// 	}
// }


// // 机构
// function checked(data){
// 	if(data[0].value =="0"){
// 		$("#males").attr('checked', 'checked')
// 	}else{
// 		$("#females").attr('checked', 'checked')
// 	}
// }
// // 地区
// function checkeds(data){
// 	if(data[0].value =="0"){
// 		$("#male").attr('checked', 'checked')
// 	}else{
// 		$("#female").attr('checked', 'checked')
// 	}
// }


// // //机构
// function roleDataed(data){
// 	if(data.isSuccess = true){
// 		alert("修改成功")
// 	}else{
// 		alert("修改失败")
// 	}
// }
// // 地区
// function roleDataes(data){
// 	if(data.isSuccess = true){
// 		alert("修改成功")
// 	}else{
// 		alert("修改失败")
// 	}
// }


function areaResult(data) {

    //displaySummary:是否需要合计的图例
    pocChart(0, urlHost + "overview/totalPie", "post", '{"area":"' + data[0] + '","meaType":"成功笔数","displaySummary":"0"}'); //总体(饼图)
    pocChart(1, urlHost + "business-run/pos/graphics", "post", '{"area":"' + data[0] + '"}'); //pos消费"displaySummary":"1",  默认清算金额
    pocChart(6, urlHost + "overview/totalPie", "post", '{"area":"' + data[0] + '","meaType":"清算金额","displaySummary":"0"}'); //总体清算金额（饼图）
    pocChart(8, urlHost + "overview/newTotal-trend", "post", '{"displaySummary":"1","area":"' + data[0] + '","meaType":"成功笔数","bsTp":"合计"}'); //总体成功笔数（趋势图）
    pocChart(9, urlHost + "overview/newTotal-trend", "post", '{"displaySummary":"1","area":"' + data[0] + '","meaType":"清算金额","bsTp":"合计"}'); //总体清算金额（趋势图）
    pocChart(10, urlHost + "business-run/atm/graphics", "post", '{"area":"' + data[0] + '","meaType":"清算金额"}'); //ATM（趋势图）清算金额，成功笔数
    pocChart(11, urlHost + "business-run/credit/graphics", "post", '{"displaySummary":"1","area":"' + data[0] + '","meaType":"清算金额"}'); //贷记业务（趋势图）
    pocChart(12, urlHost + "business-run/account/graphics", "post", '{"displaySummary":"1","area":"' + data[0] + '","meaType":"00成功笔数"}'); //账户验证（趋势图）
    pocChart(13, urlHost + "mobile-pro/qrc/graphics", "post", '{"area":"' + data[0] + '","meaType":"00成功笔数"}'); //二维码（趋势图）
    pocChart(14, urlHost + "mobile-pro/nfc/graphics", "post", '{"area":"' + data[0] + '","meaType":"00成功笔数"}'); //手机闪付（趋势图）
    pocChart(15, urlHost + "user-dev/overall/graphics", "post", '{"displaySummary":"1","bsTp":"合计","area":"' + data[0] + '","meaType":"活卡量"}'); //用户发展总体趋势（趋势图）
    pocChart(16, urlHost + "user-dev/qrcnfc/graphics", "post", '{"displaySummary":"1","bsTp":"合计","area":"' + data[0] + '","meaType":"活卡量","prodTp":"二维码+手机闪付"}'); //用户发展二维码+手机闪付（趋势图）
    pocChart(17, urlHost + "user-dev/cnfc/graphics", "post", '{"displaySummary":"1","area":"全国","meaType":"新增注册用户数"}'); //用户发展云闪付APP（趋势图）
    pocChart(18, urlHost + "business-run/online/graphics", "post", '{"displaySummary":"2","area":"' + data[0] + '","meaType":"清算金额"}'); //线上消费（趋势图）
    pocChart(19, urlHost + "merchant-dev/overall/graphics", "post", '{"displaySummary":"1","bsTp":"合计","area":"' + data[0] + '"}'); //商户发展[总体]趋势图/堆叠柱状图（趋势图）
    pocChart(20, urlHost + "merchant-dev/qrcnfc/graphics", "post", '{"displaySummary":"1","area":"' + data[0] + '","meaType":"活动商户数量"}'); //商户发展[二维码+手机闪付]趋势图（趋势图）
    pocChart(26, urlHost + "business-run/issuer/graphics", "post", '{"displaySummary":"1","bsTp":"合计","area":"' + data[0] + '","meaType":"00成功笔数"}'); //发卡趋势图/堆叠柱状图（趋势图）
    pocChart(27, urlHost + "business-run/receive/graphics", "post", '{"displaySummary":"1","bsTp":"合计","area":"' + data[0] + '","meaType":"成功笔数"}'); //收单趋势图/堆叠柱状图（趋势图）
    pocChart(28, urlHost + "business-run/moneySettlement/graphics", "post", '{"displaySummary":"1","bsTp":"合计","area":"' + data[0] + '","meaType":"结算金额"}'); //客户趋势图/堆叠柱状图（趋势图）
    pocChart(29, urlHost + "overview/total-trend", "post", '{"displaySummary":"1","area":"' + data[0] + '","meaType":"00成功笔数"}'); //基础总体成功笔数（趋势图）
    pocChart(30, urlHost + "overview/total-trend", "post", '{"displaySummary":"1","area":"' + data[0] + '","meaType":"清算金额"}'); //基础总体清算金额（趋势图）

}

//总体成功笔数图形渲染
//result:请求后的返回值
//ztbsDetailedChartParam：图的数据结构
//subtextName：副标题名称
//drawingType趋势图类型（如柱状图，折线图）
function ztcgbsqst(result, ztbsDetailedChartParam, subtextName, drawingType) {

    var color = ['#F5846C', '#5698D2', '#60C3AD', '#F5D25A', '#6FD8DC', '#F6846C', '#F56F70', '#2785B8'];
    var color_content = ['245,132,108', '86,152,210', '96,195,173', '245,210,90', '111,216,220', '246,132,108', '245,111,112', '39,133,184'];
    var error_color = '#FF0000';//异常值颜色
    var imageValue = [];
    var dataValue = [];
    //var seriesDataValueList = [];
    var series = [];
    var bsTpNameList = [];
    var summary = result['summary'];//返回总体消费金额
    var detail = result['detail'];
    var countList = [];
    var bottomValue = '20%';
    var colorValue = '#808080'
    for (var key in detail) {
        var data_1 = detail[key];//获取第一层数据集合
        var bsTp = data_1['bsTp'];
        var data_2 = data_1['data'];//第二层数据集合
        var seriesDataValueList = [];//曲线图结果值集合
        var seriesDataValueList_forecast = [];
        var seriesDataValueList_not_forecast = [];
        var seriesDataValueList_1 = [];//曲线图结果值集合(不带异常边框及气泡图)
        var bubble = [];
        var bsTpName = [];
        var bsTpNames = [];
        if (detail.length > 1) {
            bsTpNameList.push(bsTp);
        }
        for (var key_1 in data_2) {//获取时间key
            var data3 = data_2[key_1];

            for (var key_3 in data3) {

                bsTpName.push(key_3.substring(0, key_3.length));
                var riqi = key_3.substring(5, 7)
                if (riqi >= 10) {
                    bsTpNames.push(key_3.substring(5, key_3.length));
                } else {
                    bsTpNames.push(key_3.substring(6, key_3.length));
                }
                var time_data = data3[key_3]

                var seriesDataValue = time_data[0];

                var seriesDataValue_forecast = time_data[0];
                var seriesDataValue_not_forecast = time_data[0];
                if (time_data[1] == 1 && time_data[2] == 1) {//如果为异动值并且为预测值
                    seriesDataValue = {
                        value: time_data[0],
                        //自定义特殊 itemStyle，仅对该数据项有效
                        itemStyle: {
                            color: 'rgba(' + color_content[key] + ',0.4)',
                            // borderType:'dashed',
                            // borderColor:'#FF0000',
                            // borderWidth:3
                        }
                    }

                } else if (time_data[1] == 1) {//如果为历史异动值
                    error_color = '#FDD0D0';

                    var bubbleValue = {};
                    if (drawingType == "bar") {
                        var yAxisValue = parseFloat(time_data[0]);
                        var cot = detail.length;
                        for (var i = 0; i < countList.length; i++) {
                            var iValue = countList[i];
                            yAxisValue += parseFloat(iValue[key_1]);
                        }
                        yAxisValue += "";
                        bubbleValue = {
                            name: '异动值',
                            xAxis: Number(key_1),
                            yAxis: yAxisValue,
                            itemStyle: {
                                color: error_color,
                                borderColor: error_color,
                                borderWidth: 0,
                                borderType: 'dashed'
                            }
                        };
                    } else {
                        bubbleValue = {
                            name: '异动值',
                            xAxis: Number(key_1),
                            yAxis: time_data[0],
                            itemStyle: {
                                color: error_color,
                                borderColor: error_color,
                                borderWidth: 0,
                                borderType: 'dashed'
                            }
                        };
                    }


                    bubble.push(bubbleValue);

                    /*seriesDataValue = {
						value : time_data[0],
						//自定义特殊 itemStyle，仅对该数据项有效
						itemStyle:{
							borderType:'solid',
							borderColor:'#FF0000',
							borderWidth:3
						}
					}*/
                } else if (time_data[1] == 2) {//如果为当前日期T-1异动值

                    error_color = '#FF0000';
                    colorValue = '#FF0000';
                    var bubbleValue = {};
                    if (drawingType == "bar") {
                        var yAxisValue = parseFloat(time_data[0]);
                        var cot = detail.length;
                        for (var i = 0; i < countList.length; i++) {
                            var iValue = countList[i];
                            yAxisValue += parseFloat(iValue[key_1]);
                        }
                        yAxisValue += "";
                        bubbleValue = {
                            name: '异动值',
                            xAxis: Number(key_1),
                            yAxis: yAxisValue,
                            itemStyle: {
                                color: error_color,
                                borderColor: error_color,
                                borderWidth: 0,
                                borderType: 'dashed'
                            }
                        };
                    } else {
                        bubbleValue = {
                            name: '异动值',
                            xAxis: Number(key_1),
                            yAxis: time_data[0],
                            itemStyle: {
                                color: error_color,
                                borderColor: error_color,
                                borderWidth: 0,
                                borderType: 'dashed'
                            }
                        };
                    }


                    bubble.push(bubbleValue);

                    /*seriesDataValue = {
						value : time_data[0],
						//自定义特殊 itemStyle，仅对该数据项有效
						itemStyle:{
							borderType:'solid',
							borderColor:'#FF0000',
							borderWidth:3
						}
					}*/
                } else if (time_data[2] == 1) {//如果为预测值
                    seriesDataValue = {
                        symbol: 'circle',

                        value: time_data[0],
                        //自定义特殊 itemStyle，仅对该数据项有效
                        itemStyle: {
                            color: 'rgba(' + color_content[key] + ',0.4)',
                            // borderType:'dashed',
                            // borderColor:'#9FA0A2',
                            borderWidth: 1
                        }
                    }

                }


                //取预测值的集合
                if (drawingType == "line") {
                    if (time_data[2] == 1) {
                        seriesDataValue_forecast = time_data[0];//获取趋势图的预测值
                    } else if (time_data[2] == 0 && time_data[1] != 2) {
                        seriesDataValue_forecast = null;//如果为非预测值则默认为空
                    } else if (time_data[2] == 0 && time_data[1] == 2) {
                        seriesDataValue_forecast = time_data[0];//获取趋势T-1的数据
                    }
                    if (data_2[data_2.length - 4] == data3) {
                        seriesDataValue_forecast = time_data[0];
                    }
                    //取非预测值的集合
                    if (time_data[2] == 1) {
                        seriesDataValue_not_forecast = null;//获取趋势图的预测值默认为空
                    } else if (time_data[2] == 0 && time_data[1] != 2) {
                        seriesDataValue_not_forecast = time_data[0];//如果为非预测值空
                    } else if (time_data[2] == 0 && time_data[1] == 2) {
                        seriesDataValue_not_forecast = time_data[0];//获取趋势T-1的数据
                    }
                }
            }
            seriesDataValueList_forecast.push(seriesDataValue_forecast);//预测值中的趋势图信息
            seriesDataValueList_not_forecast.push(seriesDataValue_not_forecast);//非预测值中的趋势图信息
            seriesDataValueList.push(seriesDataValue);
            seriesDataValueList_1.push(time_data[0]);
        }
        countList.push(seriesDataValueList_1);
        var stackValue = "";
        if (drawingType == "bar") {
            stackValue = "总量";
        }
        //echarts series参数渲染
        var seriesValueList = {
            name: bsTp,
            type: drawingType,
            smooth: false,
            symbol: 'none',
            sampling: 'average',
            stack: stackValue,
            label: {normal: {show: false, position: 'insideRight'}},
            itemStyle: {color: color[key]},
            markPoint: {data: bubble, symbolSize: [12, 12]},
            data: seriesDataValueList
        }
        //线型图虚线
        var seriesValueList_forecast = {
            name: bsTp,
            type: drawingType,
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {normal: {lineStyle: {width: 3, type: 'dotted'}}},
            data: seriesDataValueList_forecast
        }
        //线形图实线
        var seriesDataValueList_not_forecast = {
            name: bsTp,
            type: drawingType,
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            stack: stackValue,
            label: {normal: {show: false, position: 'insideRight'}},
            itemStyle: {color: color[key]},
            markPoint: {data: bubble, symbolSize: [12, 12]},
            lineStyle: {width: 3},
            data: seriesDataValueList_not_forecast
        }
        if (drawingType == "line") {
            series.push(seriesDataValueList_not_forecast);
            series.push(seriesValueList_forecast);
        } else {
            series.push(seriesValueList);
        }
    }
    if (bsTpNameList.length <= 0) {
        bottomValue = '4%';
    }
    ztbsDetailedChartParam.setOption({ //加载数据图表
        title: {
            // subtext:subtextName.replace("-value",summary),
            subtextStyle: {
                color: colorValue,//灰色
            }
        },
        xAxis: {
            data: bsTpNames,
            axisLabel: {
                interval: 10,//0：全部显示，1：间隔为1显示对应类目，2：依次类推，（简单试一下就明白了，这样说是不是有点抽象）
                //rotate:-90,//倾斜显示，-：顺时针旋转，+或不写：逆时针旋转
                fontSize: 8,

            },
            axisLine: {       //X轴隐藏（横线）
                lineStyle: {
                    type: 'solid',
                    color: '#CACACA',//左边线的颜色
                    width: '1',//坐标线的宽度

                }
            },


        },
        grid: {
            bottom: bottomValue,


        },
        legend: {
            data: bsTpNameList,
            bottom: '14px',
            textStyle: {
                fontSize: 10
            }
        },
        series: series
    })
}

function jgjkTitle(result) {
    var data = "";
    //result是一个集合,所以需要先遍历
    $.each(result, function (index, obj) {
        var numRateName = "增加";
        var monRateName = "增加";
        var numRate = obj['numRate'];
        var monRate = obj['monRate'];
        var numRateColor = "#FC706F";
        var monRateColor = "#FC706F";
        if (obj['numRate'] < 0) {
            numRateName = "减少";
            numRate = numRate.replace("-", "");
            numRateColor = "#6BD0D2";
        }
        if (obj['monRate'] < 0) {
            monRateName = "减少";
            monRate = monRate.replace("-", "");
            monRateColor = "#6BD0D2";
        }
        data += "<div class='drawing' style='margin:2% 2% 2% 2%; padding:2% 2% 2% 2%;letter-spacing:1px;'><strong style=' color:#0BBEF6'>" + obj['dimVal'] + "</strong>：交易笔数为" + obj['transNum'] + "万笔,交易金额为" + obj['transAt'] + "亿元,与前三周周均值相比较，交易笔数" + numRateName + "<span style=' color:" + numRateColor + "'>" + mul(numRate, 100) + "%</span>,交易金额" + monRateName + "<span style=' color:" + monRateColor + "'>" + mul(monRate, 100) + "%</span>。</div>"
    });
    document.getElementById("data").innerHTML = data;
}

function dqjkTitle(result) {
    var dqjkdata = "";
    var timeValue = "";
    //result是一个集合,所以需要先遍历
    $.each(result, function (index, obj) {
        var numRateName = "增加";
        var monRateName = "增加";

        var numRate = obj['numRate'];
        var monRate = obj['monRate'];
        var numRateColor = "#FC706F";
        var monRateColor = "#FC706F";
        if (obj['numRate'] < 0) {
            numRateName = "减少";
            numRate = numRate.replace("-", "");
            numRateColor = "#6BD0D2";
        }
        if (obj['monRate'] < 0) {
            monRateName = "减少";
            monRate = monRate.replace("-", "");
            monRateColor = "#6BD0D2";
        }

        '+source+'
        dqjkdata += "<div class='drawing' style='margin:2% 2% 2% 2%; padding:2% 2% 2% 2%;letter-spacing:1px;'><strong style=' color:#0BBEF6'>" + obj['dimVal'] + "</strong>：交易笔数为" + obj['transNum'] + "万笔,交易金额为" + obj['transAt'] + "亿元,与前三周周均值相比较，交易笔数" + numRateName + "<span style=' color:" + numRateColor + "'>" + mul(numRate, 100) + "%</span>,交易金额" + monRateName + "<span style=' color:" + monRateColor + "'>" + mul(monRate, 100) + "%</span>。</div>"
    });
    document.getElementById("dqjkdata").innerHTML = dqjkdata;

}

function boreTitle(result) {

    var boredata = "";
    $.each(result, function (index, obj) {
        boredata += "<div class='drawing' style='margin:2% 2% 2% 2%; padding:2% 2% 2% 2%;letter-spacing:1px;font-size: 12px;'><span style=' color:#666,'>" + obj['calDesc'] + "</span></div>"
    });
    document.getElementById("boredata").innerHTML = boredata;
}

function mul(num1, num2) {
    var m = 0;
    try {
        m += num1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        m += num2.toString().split(".")[1].length
    } catch (e) {
    }
    return (Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", ""))) / Math.pow(10, m)
}

//总览页标题的显示
function stroke(result) {
    document.getElementById('stroke').innerHTML = result['summary'];
}

function money(result) {
    document.getElementById('money').innerHTML = result['summary'];
}

function offline(result) {
    document.getElementById('offline').innerHTML = result['summary']
}

function online(result) {
    document.getElementById('online').innerHTML = result['summary']
}

function credit(result) {
    document.getElementById('credit').innerHTML = result['summary']
}

function account(result) {
    document.getElementById('account').innerHTML = result['summary']
}

function atm(result) {
    document.getElementById('atm').innerHTML = result['summary']
}

function tuck(result) {
    document.getElementById('tuck').innerHTML = result['summary']
}

function acquirer(result) {
    document.getElementById('acquirer').innerHTML = result['summary']
}

function kjyw(result) {
    document.getElementById('kjyw').innerHTML = result['summary']
}

function ewm(result) {
    document.getElementById('ewm').innerHTML = result['summary']
}

function sjsf(result) {
    document.getElementById('sjsf').innerHTML = result['summary']
}

function yhzt(result) {
    document.getElementById('yhzt').innerHTML = result['summary']
}

function yhydzf(result) {
    document.getElementById('yhydzf').innerHTML = result['summary']
}

function yhapp(result) {
    document.getElementById('yhapp').innerHTML = result['summary']
}

function shzt(result) {
    document.getElementById('shzt').innerHTML = result['summary']
}

function shydzf(result) {
    document.getElementById('shydzf').innerHTML = result['summary']
}


//基础总体
//总览页标题的显示
function strokes(result) {
    document.getElementById('strokes').innerHTML = result['summary'];
}

function moneys(result) {
    document.getElementById('moneys').innerHTML = result['summary'];
}

function detailCount1(result) {
    document.getElementById("jrjybs").innerHTML = result['numDay'];//今日交易笔数
    document.getElementById("jrjyje").innerHTML = result['amDay'];//今日交易金额
    document.getElementById("ydljbs").innerHTML = result['numMonth'];//月度累计笔数
    document.getElementById("ydljje").innerHTML = result['amMonth'];//月度累计金额
    document.getElementById("ydtbbszs").innerHTML = result['numMonthAdd'] + "%";//月度同比增速
    document.getElementById("ydtbjezs").innerHTML = result['amMonthAdd'] + "%";//月度同比增速
    document.getElementById("ndljbs").innerHTML = result['numYear'];//年度累计笔数
    document.getElementById("ndljje").innerHTML = result['amYear'];//年度累计笔数
    document.getElementById("ndtbbszs").innerHTML = result['numYearAdd'] + "%";//年度同比增速
    document.getElementById("ndtbjezs").innerHTML = result['amYearAdd'] + "%";//年度同比增速
    document.getElementById("hkstxt").innerHTML = result['actCardNum'];//活卡数
    document.getElementById("hdshtxt").innerHTML = result['actMccNum'];//活动商户数
}

function ywyxTotal(result, ztbsDetailedChartParam, subtextName) {
    //var seriesDataValueList = [];
    var series = [];
    var bsTpNameList = [];
    var seriesDataValueList = [];//曲线图结果值集合
    var summary = result['summary'];//返回总体消费金额

    var detail = result['detail'];
    for (var key in detail) {
        var value = {};
        var data_1 = detail[key];//获取第一层数据集合
        var bsTp = data_1['bsTp'];
        var data_2 = data_1['data'];//第二层数据集合
        var bubble = [];
        bsTpNameList.push(bsTp);//业务名称 如："贷记业务","ATM"
        for (var key_1 in data_2) {//获取时间key
            var data3 = data_2[key_1];
            for (var key_3 in data3) {
                var time_data = data3[key_3];

                //var seriesDataValue = time_data[0];

                if (bsTp == '其他') {
                    value = {value: time_data[0], name: bsTp, itemStyle: {color: '#666'}};
                } else {
                    value = {value: time_data[0], name: bsTp};
                }

            }
        }
        seriesDataValueList.push(value);//返回饼图结果集
    }
    ztbsDetailedChartParam.setOption({ //加载数据图表
        // title: {
        // 	subtext:subtextName.replace("-value",summary)
        // },
        series: {
            data: seriesDataValueList
        },
        legend: {
            data: bsTpNameList
        }
    });
}

/*SuspendedBall.js*/
//  总体
// $("#baselink a").on("click", function () {
//     //  window.location.href='baseTotalDetails.html'
//     // // var data = {
//     // // 	href: "baseTotalDetails.html",
//     // // 	icon: "",
//     // // 	title: "13"
//     // // };

//     // // window.parent.addTab(data)
// // console.log($(this))
// // 	window.parent.addTab($(this));
//     window.parent.layui.index.addTab('发布职位', '/baseTotalDetails.html', 9)
// })


// $("#baselink ").on("click", function () {


// 	parent.layui.element.tabAdd('tab', {
// 		title: 'china',
// 		content: "<iframe  FRAMEBORDER='0' SCROLLING='auto' src='baseTotalDetails.html' height='100%' width='100%' ></iframe>",
// 		id: '5'
// 	});
// 	parent.layui.element.tabChange('tab', '5');
// });
$("#baselinks").on("click", function () {
    window.location.href = 'baseTotalDetails_1.html'
})
$("#baselinked").on("click", function () {
    window.location.href = 'baseTotalDetails.html'
})
$("#baselinkeds").on("click", function () {
    window.location.href = 'baseTotalDetails_1.html'
})
// 业务运行跳转
//基础总体
$("#linked").on("click", function () {
    window.location.href = 'totalDetails.html'
})
$("#linkeds").on("click", function () {
    window.location.href = 'totalDetails_1.html'
})
$("#Atmlink").on("click", function () {
    window.location.href = 'Atm.html'
})
$("#Poslink").on("click", function () {
    window.location.href = 'Pos.html?type=1'
})
$("#Conumselink").on("click", function () {
    window.location.href = 'Pos.html?type=2'
})
$("#Creditlink").on("click", function () {
    window.location.href = 'creditDetails.html'
})
$("#Accountlink").on("click", function () {
    window.location.href = 'accountDetails.html'
})

$("#Cardlink").on("click", function () {
    window.location.href = 'cardDetails.html'
})

//收单
$("#Receivelink").on("click", function () {
    window.location.href = 'receiveDetails.html'
})

//客户
$("#Fundlink").on("click", function () {
    window.location.href = 'fundDetails.html'
})
// 移动
$("#Codelink").on("click", function () {
    window.location.href = 'qrc.html'
})
$("#Hcelink").on("click", function () {
    window.location.href = 'pay.html'
})
//用户发展
$("#Totallink").on("click", function () {
    window.location.href = 'userDetail.html?type=1'
})
$("#Codehcelink").on("click", function () {
    window.location.href = 'userDetail.html?type=2'
})
$("#Applink").on("click", function () {
    window.location.href = 'appPayDetails.html'
})
//商户发展
$("#Masslink").on("click", function () {
    window.location.href = 'businessDetail.html?type=1'
})
$("#Hcecodelink").on("click", function () {
    window.location.href = 'businessDetail.html?type=2'
})


pieOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    color: ['#F5D25A', '#6FD8DC', '#F6846C', '#60C3AE', '#5698D2', '#F56F70', '#2785B8'],//'#F6846C', '#F56F70','#5698D2','#2785B8','#60C3AE','#D8D6D7'
    title: {
        target: "self",

        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif",//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
            fontSize: "18",
            margin: [5, 0, 0,],
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    //*按（当时/总）交易量排序默认前50名，查看全部清点击页面下方的“更多机构”
    tooltip: {
        trigger: 'item',
        // extraCssText:'border-radius: 8px 8px 10px 10px',
        confine: true,
        show: true,
        formatter: "{a} <br/>{b}: {c}(万笔) <br />({d}%)"
    },
    // legend:[
    // 	{

    // 		itemWidth:16,
    // 		itemHeight:8,
    // 		bottom:'1%',
    // 		x:'center',
    // 		data:['ATM', 'POS消费','账户验证','线上消费','贷记业务','其他'],
    //   },

    // ],
    legend: {
        orient: 'vertical',
        left: 10,
    },

    // series: [
    //     {
    //         name:'总体',
    //         type:'pie',
    //         radius: ['35%', '70%'],
    // 	     center: ['50%', '43%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //             normal: {
    //                 show: false,
    //                 position: 'center',
    //             },
    //             emphasis: {
    //                 show: true,
    //                 textStyle: {
    //                     fontSize: '10',
    //                     fontWeight: 'bold'
    //                 }
    //             }
    //         },
    //         labelLine: {
    //             normal: {
    //                 show: false
    //             }
    //         },
    //         data:data
    //     }
    // ]
    series: [
        {
            name: '总体',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['60%', '43%'],
            avoidLabelOverlap: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: '{b} ({d}%)'
                    },
                    labelLine: {show: true}
                },
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '10',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data,

            }
        }
    ]
};

ztjetjOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    color: ['#F5D25A', '#6FD8DC', '#F6846C', '#60C3AE', '#5698D2', '#F56F70', '#2785B8'],//'#F6846C', '#F56F70','#5698D2','#2785B8','#60C3AE','#D8D6D7'
    title: {
        target: "self",
        // subtext:'清算笔数：10000亿元',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif",//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
            fontSize: "18"
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'item',
        confine: true,
        show: true,
        formatter: "{a} <br/>{b}: {c}(亿元) <br /> ({d}%)"
    },

    legend: {
        orient: 'vertical',
        left: 'left',
    },
    // series: [
    //     {
    //         name:'总体',
    //         type:'pie',
    //         radius: ['35%', '70%'],
    // 	center: ['50%', '43%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //             normal: {
    //                 show: false,
    //                 position: 'center'
    //             },
    //             emphasis: {
    //                 show: true,
    //                 textStyle: {
    //                     fontSize: '10',
    //                     fontWeight: 'bold'
    //                 }
    //             }
    //         },
    //         labelLine: {
    //             normal: {
    //                 show: false
    //             }
    //         },
    //         data:data
    //     }
    // ]
    series: [
        {
            name: '总体',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['60%', '43%'],
            avoidLabelOverlap: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: '{b} ({d}%)'
                    },
                    labelLine: {show: true}
                },
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '10',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data,

            }
        }
    ]
};
// 总体三
ztbsDetailedOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        target: "self",
        //subtext:'清算笔数：10000亿元',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {


            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                console.log(params, 777777777)
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万笔)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万笔)");
                }

            }
            ;


            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            console.info(params);
            return str;

        }
    },
    legend: {
        data: [],
        bottom: '25px'
    },
    grid: {
        left: '-30%',
        right: '3%',
        bottom: '30%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },

        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改


        }
    ],

    series: []
};

ztjeDetailedOption = {
    // 总体四
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        target: "self",
        //subtext:'清算金额：10000亿元',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            console.log(params, 222222222)
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(亿元)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(亿元)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: [],
        bottom: '14px'
    },
    grid: {
        left: '-40%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        position: 'left',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []


};
// 线上消费
option = {
    backgroundColor: '#FFFFFF',//设置背景色

    title: {
        target: "self",
        //subtext:'清算金额：10000亿元',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        /*position: ['50%', '50%'],*/
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {

            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(亿元)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(亿元)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: ['二维码', '手机闪付线上', '其他'],
        bottom: '14px'
    },
    grid: {
        left: '-14%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        position: 'left',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17']
        /*['20181201','20181202','20181203','20181204','20181205','20181206','20181207','20181208','20181209','20181210','20181211','20181212','20181213','20181214','20181215','20181216','20181217']*/
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',

            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []

};

barOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: 'ATM    >>',
        // link:'atmDetails.html',
        target: "self",
        //subtext:'清算金额：10000亿元',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            console.log(params, 3333333333)
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "(亿元)";
            }
            return relVal;
        }
    },

    legend: [
        {
            itemWidth: 18,
            itemHeight: 10,
            bottom: '1%',
            x: 'center',
            data: [],

        },
    ],
    grid: {
        left: '-14%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        axisLine: {
            lineStyle: {
                width: '1'//坐标线的宽度
            }
        },
        data: []//'01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17'
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []

};

posBarOption = {
    //backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: 'POS消费    >>',
        // link:'details.html?type=1',
        target: "self",
        //subtext:'清算金额：10000亿元',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "(亿元)";
            }
            return relVal;
        }
    },

    legend: [
        {
            itemWidth: 18,
            itemHeight: 10,
            bottom: '1%',
            x: 'center',
            data: [],

        },
    ],
    grid: {
        left: '-9%',
        right: '3%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        axisLine: {
            lineStyle: {
                width: '1'//坐标线的宽度
            }
        },
        axisLabel: {
            interval: 6,//0：全部显示，1：间隔为1显示对应类目，2：依次类推，（简单试一下就明白了，这样说是不是有点抽象）
            //rotate:-50,//倾斜显示，-：顺时针旋转，+或不写：逆时针旋转
            fontSize: 10
        },
        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 40, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: [
        {
            name: '信用卡',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            itemStyle: {
                color: '#7CB5EC'
            },
            data: [120, 132, 101, 134, 90, {
                value: 56,
                //自定义特殊 itemStyle，仅对该数据项有效
                itemStyle: {
                    color: 'rgba(124,181,236,0.3)',
                    borderType: 'dashed',
                    borderColor: '#6FD7DD',
                    borderWidth: 1
                }
            }, {
                value: 123,
                //自定义特殊 itemStyle，仅对该数据项有效
                itemStyle: {
                    color: 'rgba(124,181,236,0.3)',
                    borderType: 'dashed',
                    borderColor: '#6FD7DD',
                    borderWidth: 1
                }
            }]
        },
        {
            name: '借记卡',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            itemStyle: {
                color: '#EC6C70'
            },
            data: [320, 302, 301, 334, 390, {
                value: 56,
                //自定义特殊 itemStyle，仅对该数据项有效
                itemStyle: {
                    color: 'rgba(236,108,112,0.3)',
                    borderType: 'dashed',
                    borderColor: '#EC6C70',
                    borderWidth: 1
                }
            }, {
                value: 123,
                //自定义特殊 itemStyle，仅对该数据项有效
                itemStyle: {
                    color: 'rgba(236,108,112,0.3)',
                    borderType: 'dashed',
                    borderColor: '#EC6C70',
                    borderWidth: 1
                }
            }]
        }
    ]
};

yhyzOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '账户验证    >>',
        // link:'accountDetails.html',
        target: "self",
        //subtext:'清算金额：10000亿元',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万笔)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万笔)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: [],
        bottom: '14px'
    },
    grid: {
        left: '-20%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: ['01', '02', '03', '04', '05', '06', '07'],

    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 80, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: [
        {
            name: '账户验证',
            type: 'line',
            smooth: true,
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            itemStyle: {
                color: '#F5D360'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
        }
    ]
};

djywOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '贷记业务    >>',
        // link:'creditDetails.html',
        target: "self",
        //subtext:'清算金额：10000亿元',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(亿元)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(亿元)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: [],
        bottom: '14px'
    },
    grid: {
        left: '-20%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []


};

ewmBarOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '二维码    >>',
        // link:'qrcDetails.html',
        target: "self",
        //subtext:'成功笔数：10000亿笔',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "(万笔)";
            }
            return relVal;
        }
    },

    legend: [
        {
            itemWidth: 18,
            itemHeight: 10,
            bottom: '1%',
            x: 'center',
            data: [],

        },
    ],
    grid: {
        left: '-18%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },

        data: []//'01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17'
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []
};


sjsfBarOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '手机闪付    >>',
        // link:'payDetails.html',
        target: "self",
        //subtext:'成功笔数：10000亿笔',
        subtextStyle: {
            color: '#808080',//绿色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "(万笔)";
            }
            return relVal;
        }
    },
    // legend: {
    //     data: [],
    //     bottom: '14px'
    // },
    legend: [
        {
            itemWidth: 18,
            itemHeight: 10,
            bottom: '1%',
            x: 'center',
            data: [],

        },
    ],
    grid: {
        left: '-12%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: []
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],
    /*dataZoom: [
        {
            type: 'inside'
        }
    ],*/
    series: []
};

yhfzZtOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '总体    >>',
        // link:'userDetails.html',
        target: "self",
        //subtext:'活卡量：10000亿张',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(亿张)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(亿张)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: [],
        bottom: '14px'
    },
    grid: {
        left: '-11%',
        right: '3%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {

            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 40, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []

};


ewmSjsfOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '二维码+手机闪付    >>',
        // link:'userDetails.html',
        target: "self",
        //subtext:'活卡量：10000亿张',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万笔)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万笔)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: [],
        bottom: '14px'
    },
    grid: {
        left: '-20%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []

};

ysfAppOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '云闪付APP    >>',
        // link:'appPayDetails.html',
        target: "self",
        //subtext:'新增注册用户数：10000万户',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万户)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万户)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: [],
        bottom: '14px'
    },
    grid: {
        left: '-12%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        show: true,
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [


        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改
            minSpan: 16,

        }
    ],

    series: []

};

shfzZtOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '总体    >>',
        // link:'businessDetails.html',
        target: "self",
        //subtext:'活动商户：10000万户',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "（万户）";
            }
            return relVal;
        }
    },
    legend: {
        data: [],//'线上', '线下'
        bottom: '14px'
    },
    grid: {
        left: '-12%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: []//'01','02','03','04','05','06','07',
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []

};


ShfzEwmSjsfOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '二维码+手机闪付  >>',
        // link:'businessDetails.html',
        target: "self",
        //subtext:'活动商户数：10000万户',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万户)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万户)");
                }
            }
            ;

            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            //console.info(params);
            return str;
        }
    },
    legend: {
        data: [],//'线上', '线下'
        bottom: '14px'
    },
    grid: {
        left: '-14%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        show: true,
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: []//'01','02','03','04','05','06','07'
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []

};
// 发卡断直连
fkdzlOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '总体    >>',
        // link:'businessDetails.html',
        target: "self",
        //subtext:'活动商户：10000万户',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "（万笔）";
            }
            return relVal;
        }
    },
    legend: {
        data: [],//'线上', '线下'
        bottom: '14px'
    },
    grid: {
        left: '-23%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: []//'01','02','03','04','05','06','07'
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []

};

// 发卡断直连
sddzlOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: '总体    >>',
        // link:'businessDetails.html',
        target: "self",
        //subtext:'活动商户：10000万户',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "（万笔）";
            }
            return relVal;
        }
    },
    legend: {
        data: [],//'线上', '线下'
        bottom: '14px'
    },
    grid: {
        left: '-23%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        data: []//'01','02','03','04','05','06','07'
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],
    series: []

};

// 客户
fundOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        // text: 'ATM    >>',
        // link:'atmDetails.html',
        target: "self",
        //subtext:'清算金额：10000亿元',
        subtextStyle: {
            color: '#808080',//灰色
        },
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "(亿元)";
            }
            return relVal;
        }
    },

    legend: [
        {
            itemWidth: 18,
            itemHeight: 10,
            bottom: '1%',
            x: 'center',
            data: [],

        },
    ],
    grid: {
        left: '-8%',
        right: '3%',
        bottom: '20%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },
        axisLine: {
            lineStyle: {
                width: '1'//坐标线的宽度
            }
        },
        data: []//'01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17'
    },
    yAxis: {
        //type: 'value'
        show: false
    },
    dataZoom: [
        {
            type: 'inside',
            start: 40, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改

        }
    ],

    series: []
};
// 基础总体笔数
baseTotalOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        target: "self",
        //subtext:'清算笔数：10000亿元',
        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                console.log(params, 777777777)
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万笔)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万笔)");
                }

            }
            ;


            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            console.info(params);
            return str;

        }
    },
    legend: {
        data: [],
        bottom: '25px'
    },
    grid: {
        left: '-25%',
        right: '3%',
        bottom: '30%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },

        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改


        }
    ],

    series: []
};
// 基础总体金额
baseTotalsOption = {
    // 总体四
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        target: "self",

        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                console.log(params, 777777777)
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(亿元)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(亿元)");
                }

            }
            ;


            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            console.info(params);
            return str;

        }
    },
    legend: {
        data: [],
        bottom: '25px'
    },
    grid: {
        left: '-25%',
        right: '3%',
        bottom: '30%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },

        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改


        }
    ],

    series: []
};

// 基础总体笔数
baseTotalOption = {
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        target: "self",

        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {

                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(万笔)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(万笔)");
                }

            }
            ;


            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }

            return str;

        }
    },
    legend: {
        data: [],
        bottom: '25px'
    },
    grid: {
        left: '-25%',
        right: '3%',
        bottom: '30%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },

        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改


        }
    ],

    series: []
};
// 基础总体金额
baseTotalsOption = {
    // 总体四
    backgroundColor: '#FFFFFF',//设置背景色
    title: {
        target: "self",

        textStyle: {//标题内容的样式
            color: '#6A6A6A',//灰色
            //fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontWeight: "normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
            fontFamily: "san-serif"//主题文字字体，默认微软雅黑 fontSize:18//主题文字字体大小，默认为18px
        },
        subtextStyle: {
            color: '#808080',//灰色
        }
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        show: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
            var str = "";
            var n = []; //一个新的临时数组
            var m = [];
            for (var i = 0; i < params.length; i++) {
                console.log(params, 777777777)
                if (params[i].data == "" || undefined == params[i].data) {

                } else if (params[0].data == params[1].data) {
                    n.push(params[1].axisValue + "<br>" + params[1].marker + params[1].seriesName + ":" + params[1].data + "(亿元)");
                } else {
                    n.push(params[i].axisValue + "<br>" + params[i].marker + params[i].seriesName + ":" + params[i].data + "(亿元)");
                }

            }
            ;


            for (var i = 0; i < n.length; i++) //遍历当前数组
            {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (m.indexOf(n[i]) == -1) m.push(n[i]);
            }
            for (var i = 0; i < m.length; i++) {
                str += m[i];
            }
            console.info(params);
            return str;

        }
    },
    legend: {
        data: [],
        bottom: '25px'
    },
    grid: {
        left: '-25%',
        right: '3%',
        bottom: '30%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick: {//去除x横坐标刻度线
            alignWithLabel: true
        },

        data: ['01', '02', '03', '04', '05', '06', '07']
    },
    yAxis: {
        //type: 'value'
        show: false,
        scale: true,
        min: function (value) {
            if (value.min <= 0) {
                return 0;
            } else {
                return parseInt(value.min - (value.min * 0.2));
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 74, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改


        }
    ],

    series: []
};


if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

if (pieOption && typeof pieOption === "object") {
    pieChart.setOption(pieOption, true);
}

if (ztjetjOption && typeof ztjetjOption === "object") {
    ztjetjChart.setOption(ztjetjOption, true);
}

if (ztbsDetailedOption && typeof ztbsDetailedOption === "object") {
    ztbsDetailedChart.setOption(ztbsDetailedOption, true);
}

if (ztjeDetailedOption && typeof ztjeDetailedOption === "object") {
    ztjeDetailedChart.setOption(ztjeDetailedOption, true);
}

if (barOption && typeof barOption === "object") {
    barChart.setOption(barOption, true);
}
if (posBarOption && typeof posBarOption === "object") {
    posBarChart.setOption(posBarOption, true);
}

if (yhyzOption && typeof yhyzOption === "object") {
    yhyzChart.setOption(yhyzOption, true);
}

if (djywOption && typeof djywOption === "object") {
    djywChart.setOption(djywOption, true);
}

if (ewmBarOption && typeof ewmBarOption === "object") {
    ewmBarChart.setOption(ewmBarOption, true);
}

if (sjsfBarOption && typeof sjsfBarOption === "object") {
    sjsfBarChart.setOption(sjsfBarOption, true);
}

if (yhfzZtOption && typeof yhfzZtOption === "object") {
    yhfzZtChart.setOption(yhfzZtOption, true);
}

if (ewmSjsfOption && typeof ewmSjsfOption === "object") {
    ewmSjsfChart.setOption(ewmSjsfOption, true);
}

if (ysfAppOption && typeof ysfAppOption === "object") {
    ysfAppChart.setOption(ysfAppOption, true);
}

if (shfzZtOption && typeof shfzZtOption === "object") {
    shfzZtChart.setOption(shfzZtOption, true);
}

if (ShfzEwmSjsfOption && typeof ShfzEwmSjsfOption === "object") {
    ShfzEwmSjsfChart.setOption(ShfzEwmSjsfOption, true);
}

if (fkdzlOption && typeof fkdzlOption === "object") {
    fkdzlChart.setOption(fkdzlOption, true);
}
if (sddzlOption && typeof sddzlOption === "object") {
    sddzlChart.setOption(sddzlOption, true);
}


if (fundOption && typeof fundOption === "object") {
    fundChart.setOption(fundOption, true);
}
//基础总体
if (baseTotalOption && typeof baseTotalOption === "object") {
    baseTotalChart.setOption(baseTotalOption, true);
}
if (baseTotalsOption && typeof baseTotalsOption === "object") {
    baseTotalsChart.setOption(baseTotalsOption, true);
}

window.onresize = function () {
    myChart.resize();
    pieChart.resize();
    ztjetjChart.resize();
    ztbsDetailedChart.resize();
    ztjeDetailedChart.resize();
    yhfzZtChart.resize();
    ewmBarChart.resize();
    barChart.resize();
    posBarChart.resize();
    yhyzChart.resize();
    ewmSjsfChart.resize();
    ysfAppChart.resize();
    shfzZtChart.resize();
    ShfzEwmSjsfChart.resize();
    sjsfBarChart.resize();
    djywChart.resize();
    fkdzlChart.resize();
    sddzlChart.resize();
    fundChart.resize();
    baseTotalChart.resize();
    baseTotalsChart.resize();
}
// var mo=function(e){
// 	e.preventDefault();
// };

//  /*点击弹出按钮*/
//  function popBox() {
// 	var popBox = document.getElementById("popBox");
// 	var popLayer = document.getElementById("popLayer");
// 	popBox.style.display = "block";
// 	popLayer.style.display = "block";

// 	$('body').css("overflow", "hidden");
// 	document.addEventListener("touchmove",mo,false);
// };
// closeBox()
// /*点击关闭按钮*/
// function closeBox() {
// 	var popBox = document.getElementById("popBox");
// 	var popLayer = document.getElementById("popLayer");
// 	popBox.style.display = "none";
// 	popLayer.style.display = "none";

// 	$('body').css("overflow", "auto");
// 	document.removeEventListener("touchmove",mo,false);
// }


// function OncheckBox(){

//     if ($("input[type='checkbox']").is(':checked')) {
//        window.location.href='dark.html';
//     }
//     //取消
//     else
//     {
// 		window.location.href='index1.html';

//     }

// }
// //滚动时保存滚动位置
// $(window).scroll(function(){
// 	if($(document).scrollTop()!=0){
// 		sessionStorage.setItem("offsetTop", $(window).scrollTop());
// 	}
// });
// //onload时，取出并滚动到上次保存位置
// window.onload = function(){
// 	var offset = sessionStorage.getItem('offsetTop')
// 	$(document).scrollTop(offset);
// };

// // 地区异动
// function OncheckBoxed(){
//   var popBoxed = document.getElementById("popBoxed");
// 	var popLayered = document.getElementById("popLayered");
// 	popBoxed.style.display = "block";
// 	popLayered.style.display = "block";

// }

// // 机构异动
// function OncheckBoxeds(){
// 	var popBoxs = document.getElementById("popBoxs");
// 	var popLayers = document.getElementById("popLayers");
// 	popBoxs.style.display = "block";
// 	popLayers.style.display = "block";

// }

// /*点击机构关闭按钮*/
// function closeBoxs() {
// 	var popBoxs = document.getElementById("popBoxs");
// 	var popLayers = document.getElementById("popLayers");
// 	popBoxs.style.display = "none";
// 	popLayers.style.display = "none";
// 	window.location.reload();

// }

// /*点击地区关闭按钮*/
// function closeBoxsed() {
// 	var popBoxed = document.getElementById("popBoxed");
// 	var popLayered = document.getElementById("popLayered");
// 	popBoxed.style.display = "none";
// 	popLayered.style.display = "none";
// 	window.location.reload();

// }

// //机构
// function OncheckBoxs(){
// 	var popBoxs = document.getElementById("popBoxs");
// 	var popLayers = document.getElementById("popLayers");
// 	popBoxs.style.display = "none";
// 	popLayers.style.display = "none";
// 	//pocChart(31,"http://192.168.1.51:9010/bmws/authorize/updateCommList","post",'{"name":"IsShowOrgan","value":"'+jkldValue()+'"}');//地区异动
// }

// // 地区
// function OncheckBoxsed(){
// 	var popBoxed = document.getElementById("popBoxed");
// 	var popLayered = document.getElementById("popLayered");
// 	popBoxed.style.display = "none";
// 	popLayered.style.display = "none";
// 	var val4 = $('input[name="block"]:checked').val();
// 	//pocChart(32,urlHost+"business-run/total/bscal","get",null);//首页口径
// }

// //机构异动
// function jkldValue(){
// 	var val1 = $('input[name="block"]:checked').val();
// 	if(val1 == 'males'){
// 		return "0";
// 	}else if(val1 == 'females'){
// 		return "1";
// 	}
// }

// //地区异动
// function jkType(){
// 	var val2 = $('input[name="gender"]:checked').val();
// 	if(val2 == 'male'){
// 		return "0";
// 	}else if(val2 == 'female'){
// 		return "1";
// 	}
// }

function addTab(title, url, id) {
    alert(1)
    //console.log($(".layui-tab-title li[lay-id=" + id + "]").length);
    if ($(".layui-tab-title li[lay-id=" + id + "]").length > 0) {
        element.tabChange('navtab', id);
    } else {
        element.tabAdd('navtab', {
            title: '<span>' + title + '</span>',
            content: '<iframe src=' + url + ' style="width:100%;height:100%;" frameborder="0" scrolling="auto"></iframe>',
            id: id
        });
        element.tabChange('navtab', id);


    }
}












