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
})(jQuery);

