var todo = todo || {};

(function($){

	function DialogTagTodo(){};
	todo.DialogTagTodo = DialogTagTodo; 
  
	DialogTagTodo.prototype.build = function(data,config){
		var todoId = data.todoId;
		var todo = brite.sdm.get("todo",todoId);
		var tags = brite.sdm.list("tag",{});
		todo.tagsList = tags;
		var $e = null;
		$e = $("#tmpl-dialogTagTodo").render(todo);
		return $e;
	}
		
	DialogTagTodo.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$(".dialog-header").delegate("button","click",function(){
			c.close();		
		});
		
		$e.find(".save").click(function(){
			var tagTodos = brite.sdm.list("tagtodo",{});
			var todoId = $("#updateTagTodo").find("input[name='todoId']").val();
			for(var i=0;i<tagTodos.length;i++){
				var o = tagTodos[i];
				if(todoId == o.todoId){
					brite.sdm.remove("tagtodo",o.id);
				}
			}
				
			$("#updateTagTodo").find("input[name='tagIds']:checked").each(function(){
				var tagTodo = {};
				tagTodo.todoId=todoId;
				tagTodo.tagId = $(this).val();
				brite.sdm.update("tagtodo",tagTodo);
			});
			brite.display("Todo");
		});
	}
	
	DialogTagTodo.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
	}
	
	function getChecked(tagId){
		var tags = this.data.tags;
		for(var i=0; i<tags.length;i++){
			if(tagId == tags[i].id){
				return "checked";
			}
		}
		return "";
	}
	
})(jQuery);