(function($){
	//user custom function
	Handlebars.registerHelper('getConstant', function(name,key) {
		return todoApp.getConstant(name,key);
	});
	
	//history helper
	Handlebars.registerHelper('hasHistory', function(options) {
		if(todoApp.history.hasHistory()){
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	
})(jQuery);