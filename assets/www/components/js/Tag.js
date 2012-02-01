var todo = todo || {};

(function($){

	function Tag(){};
	todo.Tag = Tag; 
  
	Tag.prototype.build = function(data,config){
		var tags = brite.sdm.list("tag",{});
		var $e = null;
		$e = $("#tmpl-tag").render({"tags":tags});
		return $e;
	}
		
	Tag.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		$e.find(".delete").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.sdm.remove("tag",id);

			var tagTodos = brite.sdm.list("tagtodo",{});
			for(var i=0;i<tagTodos.length;i++){
				var o = tagTodos[i];
				if(id == o.tagId){
					brite.sdm.remove("tagtodo",o.id);
				}
			}
			brite.display("MainScreen");
		});

		$e.find(".edit").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('DialogTag',{id:id})
		});

		
		$e.find(".add").click(function(){
			brite.display('DialogTag',{});
		});

		$e.find(".filterTodo").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('Todo',{tagId:id})
		});
	}
	
	
})(jQuery);