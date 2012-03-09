var todoApp = todoApp || {};
(function($){
	todoApp.history = {};
	var _historyStack = [];
	var _pathConfig = {
			"TodosPanel" : {},
			"TodoUpdate" : {transition:"slideLeft"},
			"TagsPanel" : {},
			"SearchPanel" : {},
			"TodayPanel" : {}
	};
	
	jQuery.aop.before({target:brite,method:"display"},function(args){
		var name = args[0];
		var data = args[1];
		var config = args[2];
		processHistory({name:name,data:data,config:config});
	});
	
	function processHistory(current){
		if(_pathConfig[current.name]){
			_historyStack.push(current);
		}
	}
	
	todoApp.history.goBack = function(){
		if(_historyStack.length > 0){
			var current = _historyStack.pop();
			var history = _historyStack[_historyStack.length - 1];
			if(history){
				var transition;
				if(current.config){
					transition = current.config.transition;
				}
				if(!transition){
					transition = getReverseTransition(_pathConfig[current.name].transition);
				}
				var config = null;
				if(transition){
					config = {transition:transition};
				}
				brite.display(history.name,history.data,config);
			}
		}
	}
	
	function getReverseTransition(transition){
		if(transition == "slideLeft"){
			transition = "slideRight";
		}else if(transition == "slideRight"){
			transition = "slideLeft";
		}else if(transition == "slideUp"){
			transition = "slideDown";
		}else if(transition == "slideDown"){
			transition = "slideUp";
		}
		return transition;
	}
	
})(jQuery);