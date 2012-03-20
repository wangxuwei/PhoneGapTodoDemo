(function($){

	function todoApp_DialogPrompt(){};
  
	// --------- Component Interface Implementation ---------- //
	todoApp_DialogPrompt.prototype.build = function(data,config){
		var obj = {};
		if(data && data.content){
			obj.content = data.content;
		}
		if(data && typeof data.confirm != "undefined"){
			obj.confirm = data.confirm;
		}
		var $e = $(Handlebars.compile($("#tmpl-todoApp_DialogPrompt").html())(obj));
		return $e;
	}
	
	todoApp_DialogPrompt.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.css("margin-left",-1*$e.width()/2 + "px").css("margin-top",-1*$e.height()/2 + "px");
		
		$e.find(".dialog-bottom").delegate(".btn.cancel","click",function(){
			c.close();	
		});
		
		$e.find(".dialog-bottom").delegate(".btn.ok","click",function() {
			if(c._answerCallback && $.isFunction(answerCallback)){
				this._answerCallback();
			}
			c.close();	
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	todoApp_DialogPrompt.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
	}
	todoApp_DialogPrompt.prototype.onAnswerCallback = function(answerCallback){
		this._answerCallback = answerCallback;
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_DialogPrompt", {
		parent : ".todoApp #page",
		loadTemplate : true
	},
	function() {
		return new todoApp_DialogPrompt();
	});

	// --------- /Component Registration --------- //
	
})(jQuery);