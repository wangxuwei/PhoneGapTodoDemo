var todoApp = todoApp || {};
(function($){
	
	var _constant = {
			"todoStatus":{
				0:"created",
				1:"Done"
			}
	}
	
	todoApp.getConstant = function(name,key){
		label = _constant[name][key];
		if(typeof label == 'undefined'){
			label = "";
		}
		return label;
	}
	
})(jQuery);

