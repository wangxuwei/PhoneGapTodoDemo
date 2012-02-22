(function($){
	//user custom function
	Handlebars.registerHelper('getConstant', function(name,key) {
		return todoApp.getConstant(name,key);
	});
	
})(jQuery);