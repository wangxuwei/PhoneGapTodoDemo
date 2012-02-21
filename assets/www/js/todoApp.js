var todoApp = todoApp || {};
(function($){
	var ua = navigator.userAgent.toLowerCase();
	
	var isChrome = ua.match(/chrome\/([\d.]+)/);
	var isSafari = ua.match(/version\/([\d.]+)/);
	var isFirefox = ua.match(/firefox\/([\d.]+)/);
	var isIE = ua.match(/msie ([\d.]+)/);
	
	todoApp.isChrome = isChrome;
	todoApp.isSafari = isSafari;
	todoApp.isFirefox = isFirefox;
	todoApp.isIE = isIE;	
	
	
	//format date
	todoApp.formatDate = function(date,pattern){
		if(typeof pattern == "undefined"){
			pattern = "MM/dd/yyyy";
		}
		var o = {
			"M+" :  date.getMonth()+1,  //month
			"d+" :  date.getDate(),     //day
			"h+" :  date.getHours(),    //hour
			"m+" :  date.getMinutes(),  //minute
			"s+" :  date.getSeconds(), //second
			"q+" :  Math.floor((date.getMonth()+3)/3),  //quarter
			"S"  :  date.getMilliseconds() //millisecond
		}
		var str = "";
		var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		if(pattern.toLowerCase() == "long"){
			str = months[date.getMonth()] + " " + date.getDate() + ","+date.getFullYear();
		}else if(pattern.toLowerCase() == "medium"){
			str = months[date.getMonth()].substring(0,3) + " " + date.getDate() + ","+date.getFullYear();
		}else{
			str = pattern;
			if(/(y+)/.test(str)) {
				str = str.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
			}
			
			for(var k in o) {
				if(new RegExp("("+ k +")").test(str)) {
					str = str.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
				}
			}
			
		}
		return str;
		
	};
})(jQuery);

