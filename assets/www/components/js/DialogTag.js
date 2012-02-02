var todo = todo || {};

(function($){

	function DialogTag(){};
	todo.DialogTag = DialogTag; 
  
	DialogTag.prototype.build = function(data,config){
		var id = "";
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("tag",id).done(function(tag){
			var $e = $("#tmpl-dialogTag").render(tag);
			dfd.resolve($e);
		});
		return dfd.promise();
	}
		
	DialogTag.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.find(".dialog-header").delegate("button","click",function(){
			c.close();	
		});
		
		$e.find(".save").click(function() {
			var tag = {};
			var id = $("#updateTag").find("input[name='id']").val();
			tag.name = $("#updateTag").find("input[name='name']").val();
			if(id && id!=""){
				brite.dm.update("tag", id, tag).done(function(){
					brite.display("MainScreen");
				});
			}else{
				brite.dm.create("tag",tag).done(function(){
					brite.display("MainScreen");
				});
			}
		});
	}
	
	DialogTag.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
	}
	
})(jQuery);