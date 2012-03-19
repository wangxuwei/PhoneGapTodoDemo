(function($){

	function todoApp_TodosPanel(){};
	// --------- Component Interface Implementation ---------- //
	todoApp_TodosPanel.prototype.build = function(data,config){
		var dfd = $.Deferred();
		var opts = {tagId:null};
		if(data && data.tagId){
			opts.tagId = data.tagId;
		}
		$.when(brite.dm.list("todoApp_todo",{}),brite.dm.list("todoApp_tagtodo"),brite.dm.list("todoApp_tag")).done(function(todos,tagTodos,tags){
					
			//filter tagId and date;
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
			
			var tag = null;
			for(var i = 0; i < tags.length; i++){
				if(opts.tagId == tags[i].id){
					tag = tags[i];
				}
			}
			var $e = $(Handlebars.compile($("#tmpl-todoApp_TodosPanel").html())({
				"todos":todos,
				"tag":tag
			}));
			dfd.resolve($e);
		});
		
		
		return dfd.promise();
	}
		
	todoApp_TodosPanel.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		
		$e.find(".add").click(function(){
			brite.display('todoApp_DialogTodo',{});
		});
		
		$e.find(".todosList").delegate(".todo","click",function(){
			var $this = $(this);
			var id = $this.attr("data-obj_id");
			brite.display('todoApp_TodoUpdate',{id:id});
		});

		$e.find(".edit").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('todoApp_DialogTodo',{id:id});
		});

		$e.find(".deleteTag").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.dm.remove("todoApp_tagtodo",id).done(function(){
				brite.display("todoApp_TodosPanel");
			});
		});

		$e.find(".addTag").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('todoApp_DialogTagTodo',{todoId:id});
		});

		$e.find(".delete").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.dm.remove("todoApp_todo",id).done(function(){
				brite.dm.list("todoApp_tagtodo",{}).done(function(tagTodos){
					var ids = [];
					for(var i=0;i<tagTodos.length;i++){
						var o = tagTodos[i];
						if(id == o.todoId){
							ids.push(o.id);
						}
					}
					brite.dm.remove("todoApp_tagtodo",ids).done(function(){
						brite.display("todoApp_TodosPanel");
					});
				});
				
			});
		});
		$e.find(".preDelete").click(function(e){
			e.stopPropagation();
			var $this = $(this);
			$this.toggleClass("rotate");
			$this.closest(".todo").find(".todoAction.btnDelete").toggleClass("show");
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_TodosPanel",{
        parent: ".rightContainer",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new todoApp_TodosPanel();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);