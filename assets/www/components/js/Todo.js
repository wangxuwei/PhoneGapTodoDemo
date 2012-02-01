var todo = todo || {};

(function($){

	function Todo(){};
	todo.Todo = Todo; 
  
	Todo.prototype.build = function(data,config){
		var todos = brite.sdm.list("todo",{});
		if(data && data.tagId){
			var tagTodos = brite.sdm.list("tagtodo",{});
			var a = [];
			for(var i = 0; i<tagTodos.length;i++){
				if(tagTodos[i].tagId == data.tagId){
					a.push(tagTodos[i]);
				}
			}
			var b =[];
			for(var i=0; i<a.length;i++){
				for(var j = 0; j<todos.length;j++){
					if(a[i].todoId == todos[j].id){
						b.push(todos[j]);
					}
				}
			}
			todos = b;
		}

		var $e = $($("#tmpl-todo").render({"todos":todos}));
		
		return $e;
	}
		
	Todo.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		$e.find(".add").click(function(){
			brite.display('DialogTodo',{});
		});

		$e.find(".edit").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('DialogTodo',{id:id});
		});

		$e.find(".deleteTag").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.sdm.remove("tagtodo",id);
			brite.display("Todo");
		});

		$e.find(".addTag").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('DialogTagTodo',{todoId:id});
		});

		$e.find(".delete").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.sdm.remove("todo",id);
			var tagTodos = brite.sdm.list("tagtodo",{});
			for(var i=0;i<tagTodos.length;i++){
				var o = tagTodos[i];
				if(id == o.todoId){
					brite.sdm.remove("tagtodo",o.id);
				}
			}
			brite.display("Todo");
		});
	}
	
	
})(jQuery);