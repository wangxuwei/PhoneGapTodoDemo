(function($){

	function DialogTag(){};
  
	// --------- Component Interface Implementation ---------- //
	DialogTag.prototype.build = function(data,config){
		var id = "";
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("tag",id).done(function(tag){
			tag = tag || {};
			var $e = $(Handlebars.compile($("#tmpl-DialogTag").html())(tag));
			$("body").append("<div id='notTransparentScreen' class='dialogTagScreen'></div>");
			dfd.resolve($e);
		});
		return dfd.promise();
	}
		
	DialogTag.prototype.postDisplay = function(data,config){
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
				brite.dm.update("tag", id, tag).done(function(){
					brite.display("TagsPanel");
					c.close();
				});
			}else{
				brite.dm.create("tag",tag).done(function(){
					brite.display("TagsPanel");
					c.close();
				});
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	DialogTag.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTagScreen").remove();
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("DialogTag", {
		parent : "#page",
		loadTemplate : true
	},
	function() {
		return new DialogTag();
	});

	// --------- /Component Registration --------- //
	
})(jQuery);