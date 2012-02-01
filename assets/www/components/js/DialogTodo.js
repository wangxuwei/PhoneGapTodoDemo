var todo = todo || {};

(function($){

	function DialogTodo(){};
	todo.DialogTodo = DialogTodo; 
  
	DialogTodo.prototype.build = function(data,config){
		var id = null;
		if(data && data.id){
			id = data.id;
		}
		var todo = brite.sdm.get("todo",id);
		var $e = $("#tmpl-dialogTodo").render(todo);
		return $e;
	}
		
	DialogTodo.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$(".dialog-header").delegate("button", "click", function() {
			c.close();
		});
		
		$e.find(".save").click(function(){
			var todo = {};
			todo.taskName = $("#updateTodo").find("input[name='taskName']").val();
			todo.startDate = $("#updateTodo").find("input[name='startDate']").val();
			todo.endDate = $("#updateTodo").find("input[name='endDate']").val();
			todo.status = $("#updateTodo").find("input[name='status']").val();
			todo.id = $("#updateTodo").find("input[name='id']").val();
			brite.sdm.update("todo",todo);
			brite.display("Todo");
		});
	}
	
	DialogTodo.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
	}
	
	
})(jQuery);