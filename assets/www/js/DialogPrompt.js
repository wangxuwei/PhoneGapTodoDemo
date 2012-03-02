(function($){

	function DialogPrompt(){};
  
	// --------- Component Interface Implementation ---------- //
	DialogPrompt.prototype.build = function(data,config){
		var obj = {};
		if(data && data.content){
			obj.content = data.content;
		}
		if(data && typeof data.confirm != "undefined"){
			obj.confirm = data.confirm;
		}
		var $e = $(Handlebars.compile($("#tmpl-DialogPrompt").html())(obj));
		return $e;
	}
	
	DialogPrompt.prototype.postDisplay = function(data,config){
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
	DialogPrompt.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTagScreen").remove();
	}
	DialogPrompt.prototype.onAnswerCallback = function(answerCallback){
		this._answerCallback = answerCallback;
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("DialogPrompt", {
		parent : "#page",
		loadTemplate : true
	},
	function() {
		return new DialogPrompt();
	});

	// --------- /Component Registration --------- //
	
})(jQuery);