var todoApp = todoApp || {};
(function($){
	
	var _constant = {
			"TodoStatus":{
				0:"Init",
				1:"Done"
			},
			"TodoRepeat":{
				0:"No repeat",
				1:"Daily",
				2:"Weekly",
				3:"Monthly",
				4:"Yearly"
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

