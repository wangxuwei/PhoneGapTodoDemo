(function($){

	function todoApp_Dashboard(){};
	
	// --------- Component Interface Implementation ---------- //
	todoApp_Dashboard.prototype.create = function(data,config){
		var $e = null;
		var c = this;
		var dfd = $.Deferred();
		$.when(getCompleteString.call(c)).done(function(completeString){
			$e = $(Handlebars.compile($("#tmpl-todoApp_Dashboard").html())({dateStr:getDateString.call(c),completeStr:completeString}));
			dfd.resolve($e);
		});
		return dfd;
	}
	
	todoApp_Dashboard.prototype.init = function(data,config){
		var $e = this.$element;
		var c = this;
		c.showPanel();
	}
	
	todoApp_Dashboard.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		var $mainScreen = $e.closest(".todoApp_mainScreen");
		$mainScreen.bind("todayChange",function(){
			$e.find(".today .tips").html(getDateString.call(c));
		});
		
		$mainScreen.bind("completeChange",function(){
			$.when(getCompleteString.call(c)).done(function(completeString){
				$e.find(".todos .tips").html(completeString);
			});
		});
		
		$e.delegate(".dashboard-item","click",function(){
			var $item = $(this);
			var panel = $item.attr("data-panel");
			//clear history
			todoApp.history.clear();
			if(panel){
				c.showPanel(panel);
			}else{
				alert("Not support yet");
			}
		});
		
	}
	
	todoApp_Dashboard.prototype.showPanel = function(panel){
		var $e = this.$element;
		var c = this;
		
		if(!panel){
			panel = "todoApp_TodayPanel";
		}
		
		var $item = $e.find(".dashboard-item[data-panel='"+panel+"']")
		$item.closest(".todoApp_dashboard").find(".dashboard-item").removeClass("selected");
		$item.addClass("selected");
		
		brite.display(panel);
	}
	
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	getDateString = function(){
		var date = todoApp.formatDate(todoApp.today,"medium");
		var day = todoApp.getDay(todoApp.today.getDay());
		return date + "&nbsp;&nbsp;" + day;
	}
	
	getCompleteString = function(){
		var dfd = $.Deferred();
		brite.dm.list("todoApp_todo").done(function(todos){
			var completeTodos = [];
			for(var i = 0; i < todos.length; i++){
				if(todos[i].status == 1){
					completeTodos.push(todos[i]);
				}
			}
			var str = completeTodos.length + "/" + todos.length;
			dfd.resolve(str);
		});
		return dfd.promise();
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_Dashboard",{
        parent: ".leftContainer",
        loadTemplate:true
    },function(){
        return new todoApp_Dashboard();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);