var todoApp = todoApp || {};
(function($){
	todoApp.history = {};
	var _historyStack = [];
	var _pathConfig = ["TodosPanel","TodoUpdate","TagsPanel","SearchPanel","TodayPanel"];
	
	jQuery.aop.before({target:brite,method:"display"},function(args){
		var name = args[0];
		var data = args[1];
		processHistory({name:name,data:data});
	});
	
	function processHistory(history){
		if(_pathConfig.indexOf(history.name) >=0){
			_historyStack.push(history);
		}
	}
	
	todoApp.history.goBack = function(){
		if(_historyStack.length > 0){
			_historyStack.pop();
			var current = _historyStack[_historyStack.length - 1];
			if(current){
				brite.display(current.name,current.data);
			}
		}
	}
	
})(jQuery);