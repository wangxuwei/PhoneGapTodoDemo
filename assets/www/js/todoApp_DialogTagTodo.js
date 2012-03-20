(function($){

	function todoApp_DialogTagTodo(){};
  
	// --------- Component Interface Implementation ---------- //
	todoApp_DialogTagTodo.prototype.build = function(data,config){
		var todoId = data.todoId;
		var dfd = $.Deferred();
		$.when(brite.dm.get("todoApp_todo",todoId),brite.dm.list("todoApp_tag",{}),brite.dm.list("todoApp_tagtodo",{todoId:todoId})).done(function(todo,tags,tagTodos){
			for(var i = 0; i < tags.length; i++){
				var isChecked = false;
				for(var j = 0; j < tagTodos.length; j++){
					if(tagTodos[j].tagId == tags[i].id){
						isChecked = true;
						break;
					}
				}
				if(isChecked){
					tags[i].isChecked = true;
				}
			}
			todo.tagsList = tags;
			todo.tagTodoList = tagTodos;
			var $e = null;
			$e = $(Handlebars.compile($("#tmpl-todoApp_DialogTagTodo").html())(todo));
			$("body").append("<div id='notTransparentScreen' class='dialogTagTodoScreen'></div>");
			dfd.resolve($e);
		});
		
		return dfd.promise();
	}
		
	todoApp_DialogTagTodo.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.css("margin-left",-1*$e.width()/2 + "px").css("margin-top",-1*$e.height()/2 + "px");
		
		$e.find(".dialog-header").delegate(".button.ok","click",function(){
			c.close();		
		});
		
		$e.find(".save").click(function(){
			brite.dm.list("todoApp_tagtodo",{}).done(function(tagTodos){
				var todoId = $("#updateTagTodo").find("input[name='todoId']").val();
				var ids = [];
				for(var i=0;i<tagTodos.length;i++){
					var o = tagTodos[i];
					if(todoId == o.todoId){
						ids.push(o.id);
					}
				}
				brite.dm.remove("todoApp_tagtodo",ids).done(function(){
					var dfd = $.Deferred();
					var size = $e.find("#updateTagTodo").find("input[name='tagIds']:checked").size();
					$e.find("#updateTagTodo").find("input[name='tagIds']:checked").each(function(i,n){
						var tagTodo = {};
						tagTodo.todoId=todoId;
						tagTodo.tagId = $(this).val();
						brite.dm.create("todoApp_tagtodo",tagTodo).done(function(){
							if(i == size-1){
								dfd.resolve();
							}
						});
					});
					dfd.done(function(){
						c.close();
						brite.display("todoApp_TodosPanel");
					});
				});
			});
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	todoApp_DialogTagTodo.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTagTodoScreen").remove();
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_DialogTagTodo",{
        parent:".todoApp #page",
        loadTemplate:true
    },function(){
        return new todoApp_DialogTagTodo();
    }); 

	// --------- /Component Registration --------- //
	
})(jQuery);