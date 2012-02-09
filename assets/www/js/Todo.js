(function($){

	function Todo(){};
  
	Todo.prototype.build = function(data,config){
		var dfd = $.Deferred();
		var opts = {tagId:null};
		if(data && data.tagId){
			opts.tagId = data.tagId;
		}
		$.when(brite.dm.list("todo",{}),brite.dm.list("tagtodo"),brite.dm.list("tag")).done(function(todos,tagTodos,tags){
					
			//filter tagId
			var a = [];
			for ( var i = 0; i < todos.length; i++) {
				var ifPush = false;
				if(!opts.tagId){
					ifPush = true;
				}else{
					for ( var j = 0; j < tagTodos.length; j++) {
						if (todos[i].id == tagTodos[j].todoId && tagTodos[j].tagId == opts.tagId) {
							ifPush = true;
							break;
						}
					}
				}
				
				if(ifPush){
					a.push(todos[i]);
				}
			}
			todos = a;
			for ( var i = 0; i < todos.length; i++) {
				var c = [];
				for ( var j = 0; j < tagTodos.length; j++) {
					if (todos[i].id == tagTodos[j].todoId) {
						for ( var k = 0; k < tags.length; k++) {
							if (tags[k].id == tagTodos[j].tagId) {
								tags[k].tagTodoId = tagTodos[j].id;
								c.push(tags[k]);
								break;
							}
						}
					}
				}
				todos[i].tags = c;
			}
			var $e = $($("#tmpl-Todo").render({
				"todos" : todos
			}));
			dfd.resolve($e);
		});
		
		
		return dfd.promise();
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
			brite.dm.remove("tagtodo",id).done(function(){
				brite.display("Todo");
			});
		});

		$e.find(".addTag").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('DialogTagTodo',{todoId:id});
		});

		$e.find(".delete").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.dm.remove("todo",id).done(function(){
				brite.dm.list("tagtodo",{}).done(function(tagTodos){
					var ids = [];
					for(var i=0;i<tagTodos.length;i++){
						var o = tagTodos[i];
						if(id == o.todoId){
							ids.push(o.id);
						}
					}
					brite.dm.remove("tagtodo",ids).done(function(){
						brite.display("Todo");
					});
				});
				
			});
		});
		$e.find(".preDelete").click(function(){
			var $this = $(this);
			$this.toggleClass("rotate");
			$this.closest(".todo").find(".todoAction.btnDelete").toggle();
		});
	}
	
	// --------- Component Registration --------- //
	brite.registerComponent("Todo",{
        parent: ".mainScreen-main",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new Todo();
    });
	// --------- Component Registration --------- //
	
	
})(jQuery);