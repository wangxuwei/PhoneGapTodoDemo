var todo = todo || {};

(function($){

	function Tag(){};
	todo.Tag = Tag; 
  
	Tag.prototype.build = function(data,config){
		var dfd = $.Deferred();
		brite.dm.list("tag",{}).done(function(tags){
			var $e = null;
			$e = $("#tmpl-tag").render({"tags":tags});
			dfd.resolve($e);
		});
		return dfd.promise();
	}
		
	Tag.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		$e.find(".delete").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.dm.remove("tag",id).done(function(){
				brite.dm.list("tagtodo",{}).done(function(tagTodos){
					var ids = [];
					for(var i=0;i<tagTodos.length;i++){
						var o = tagTodos[i];
						if(id == o.tagId){
							ids.push(o.id);
						}
					}
					brite.dm.remove("tagtodo",ids).done(function(){
						brite.display("MainScreen");
					});
				});
			});
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