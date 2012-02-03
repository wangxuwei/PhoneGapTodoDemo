var todoApp = todoApp || {};

(function($){

	function DialogTagTodo(){};
	todoApp.DialogTagTodo = DialogTagTodo; 
  
	DialogTagTodo.prototype.build = function(data,config){
		var todoId = data.todoId;
		var dfd = $.Deferred();
		$.when(brite.dm.get("todo",todoId),brite.dm.list("tag",{})).done(function(todo,tags){
			todo.tagsList = tags;
			var $e = null;
			$e = $("#tmpl-dialogTagTodo").render(todo);
			$("body").append("<div id='notTransparentScreen' class='dialogTagTodoScreen'></div>");
			dfd.resolve($e);
		});
		
		return dfd.promise();
	}
		
	DialogTagTodo.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.find(".dialog-header").delegate(".button.ok","click",function(){
			c.close();		
		});
		
		$e.find(".save").click(function(){
			brite.dm.list("tagtodo",{}).done(function(tagTodos){
				var todoId = $("#updateTagTodo").find("input[name='todoId']").val();
				var ids = [];
				for(var i=0;i<tagTodos.length;i++){
					var o = tagTodos[i];
					if(todoId == o.todoId){
						ids.push(o.id);
					}
				}
				console.log(ids);
				brite.dm.remove("tagtodo",ids).done(function(){
					var dfd = $.Deferred();
					var size = $e.find("#updateTagTodo").find("input[name='tagIds']:checked").size();
					$e.find("#updateTagTodo").find("input[name='tagIds']:checked").each(function(i,n){
						var tagTodo = {};
						tagTodo.todoId=todoId;
						tagTodo.tagId = $(this).val();
						brite.dm.create("tagtodo",tagTodo).done(function(){
							if(i == size-1){
								dfd.resolve();
							}
						});
					});
					dfd.done(function(){
						c.close();
						brite.display("Todo");
					});
				});
			});
		});
	}
	
	DialogTagTodo.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTagTodoScreen").remove();
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