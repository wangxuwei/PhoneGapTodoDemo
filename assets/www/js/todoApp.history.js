var todoApp = todoApp || {};
(function($){
	todoApp.history = {};
	var _historyStack = [];
	
	//first to config which component need to put in history
	var _pathConfig = {
			"TodosPanel" : {},
			"TodoUpdate" : {},
			"TagsPanel" : {},
			"SearchPanel" : {},
			"TodayPanel" : {}
	};
	
	// to get config for component which in pathConfig
	jQuery.aop.before({target:brite,method:"registerComponent"},function(args){
		var name = args[0];
		var config = args[1];
		processPathConfig(name,config);
	});
	
	
	// do intercept the component when display
	jQuery.aop.before({target:brite,method:"display"},function(args){
		var name = args[0];
		var data = args[1];
		var config = args[2];
		processHistory({name:name,data:data,config:config});
	});
	
	// to build pathConfig
	function processPathConfig(name,config){
		if(_pathConfig[name]){
			var defaultConfig = _pathConfig[name];
			var newConfig = $.extend(defaultConfig,config);
			_pathConfig[name] = newConfig;
		}
	}
	
	// push the component which in pathConfig to history stack
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