(function($){

	function DialogTag(){};
  
	DialogTag.prototype.build = function(data,config){
		var id = "";
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("tag",id).done(function(tag){
			var $e = $("#tmpl-DialogTag").render(tag);
			$("body").append("<div id='notTransparentScreen' class='dialogTagScreen'></div>");
			dfd.resolve($e);
		});
		return dfd.promise();
	}
		
	DialogTag.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.css("margin-left",-1*$e.width()/2 + "px").css("margin-top",-1*$e.height()/2 + "px");
		
		$e.find(".dialog-header").delegate(".button.ok","click",function(){
			c.close();	
		});
		
		$e.find(".save").click(function() {
			var tag = {};
			var id = $("#updateTag").find("input[name='id']").val();
			tag.name = $("#updateTag").find("input[name='name']").val();
			if(id && id!=""){
				brite.dm.update("tag", id, tag).done(function(){
					brite.display("MainScreen");
					c.close();
				});
			}else{
				brite.dm.create("tag",tag).done(function(){
					brite.display("MainScreen");
					c.close();
				});
			}
		});
	}
	
	DialogTag.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTagScreen").remove();
	}
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("DialogTag", {
		parent : "#page",
		loadTemplate : true
	},
	function() {
		return new DialogTag();
	});

	// --------- Component Registration --------- //
	
})(jQuery);