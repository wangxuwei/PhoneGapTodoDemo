var todo = todo || {};

(function($){

	function DialogTag(){};
	todo.DialogTag = DialogTag; 
  
	DialogTag.prototype.build = function(data,config){
		var id = "";
		if(data && data.id){
			id = data.id;
		}
		var tag = brite.sdm.get("tag",id);
		var $e = $("#tmpl-dialogTag").render(tag);
		return $e;
	}
		
	DialogTag.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$(".dialog-header").delegate("button","click",function(){
			c.close();	
		});
		
		$e.find(".save").click(function() {
			var tag = {};
			tag.name = $("#updateTag").find("input[name='name']").val();
//			tag.id = $("#updateTag").find("input[name='id']").val();
			console.log(tag);
			brite.sdm.create("tag", tag);
			brite.display("MainScreen");
		});
	}
	
	DialogTag.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
	}
	
})(jQuery);