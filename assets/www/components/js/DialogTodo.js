var todo = todo || {};

(function($){

	function DialogTodo(){};
	todo.DialogTodo = DialogTodo; 
  
	DialogTodo.prototype.build = function(data,config){
		var id = null;
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("todo",id).done(function(todo){
			var $e = $("#tmpl-dialogTodo").render(todo);
			dfd.resolve($e);
		});
		return dfd.promise();
	}
		
	DialogTodo.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.find(".dialog-header").delegate("button", "click", function() {
			c.close();
		});
		
		$e.find(".save").click(function(){
			var todo = {};
			todo.taskName = $("#updateTodo").find("input[name='taskName']").val();
			todo.startDate = $("#updateTodo").find("input[name='startDate']").val();
			todo.endDate = $("#updateTodo").find("input[name='endDate']").val();
			todo.status = $("#updateTodo").find("input[name='status']").val();
			var id = $("#updateTodo").find("input[name='id']").val();
			if(id && id!=""){
				brite.dm.update("todo", id, todo).done(function(){
					c.close();
					brite.display("Todo");
				});
			}else{
				brite.dm.create("todo",todo).done(function(){
					c.close();
					brite.display("Todo");
				});
			}
		});
	}
	
	DialogTodo.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
	}
	
	
})(jQuery);