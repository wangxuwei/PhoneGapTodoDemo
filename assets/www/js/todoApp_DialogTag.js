(function($){

	function todoApp_DialogTag(){};
  
	// --------- Component Interface Implementation ---------- //
	todoApp_DialogTag.prototype.build = function(data,config){
		var id = "";
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("todoApp_tag",id).done(function(tag){
			tag = tag || {};
			var $e = $(Handlebars.compile($("#tmpl-todoApp_DialogTag").html())(tag));
			$("body").append("<div id='notTransparentScreen' class='dialogTagScreen'></div>");
			dfd.resolve($e);
		});
		return dfd.promise();
	}
		
	todoApp_DialogTag.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.css("margin-left",-1*$e.width()/2 + "px").css("margin-top",-1*$e.height()/2 + "px");
		
		$e.find(".dialog-bottom").delegate(".btn.cancel","click",function(){
			c.close();	
		});
		
		$e.find(".dialog-bottom").delegate(".btn.ok","click",function() {
			var tag = {};
			var id = $(".dialog-content").find("input[name='id']").val();
			tag.name = $(".dialog-content").find("input[name='name']").val();
			if(id && id!=""){
				brite.dm.update("todoApp_tag", id, tag).done(function(){
					if(c._answerOkCallback && $.isFunction(c._answerOkCallback)){
						c._answerOkCallback(tag);
					}
					c.close();
				});
			}else{
				brite.dm.create("todoApp_tag",tag).done(function(){
					if(c._answerOkCallback && $.isFunction(c._answerOkCallback)){
						c._answerOkCallback(tag);
					}
					c.close();
				});
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	todoApp_DialogTag.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTagScreen").remove();
	}
	
	todoApp_DialogTag.prototype.onAnswerOkCallback = function(answerOkCallback){
		this._answerOkCallback = answerOkCallback;
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_DialogTag", {
		parent : ".todoApp #page",
		loadTemplate : true
	},
	function() {
		return new todoApp_DialogTag();
	});

	// --------- /Component Registration --------- //
	
})(jQuery);