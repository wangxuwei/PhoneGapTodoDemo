(function($){

	function todoApp_TodayPanel(){};
	// --------- Component Interface Implementation ---------- //
	todoApp_TodayPanel.prototype.build = function(data,config){
		var dfd = $.Deferred();
		var opts = {tagId:null};
		var date = null;
		if(data && data.tagId){
			opts.tagId = data.tagId;
		}
		if(data && data.date){
			date = data.date;
		}else{
			date = todoApp.today;
		}
		this.date = date;
		$.when(brite.dm.list("todoApp_todo",{}),brite.dm.list("todoApp_tagtodo"),brite.dm.list("todoApp_tag")).done(function(todos,tagTodos,tags){
					
			//filter tagId and date;
			var a = [];
			for ( var i = 0; i < todos.length; i++) {
				var ifPush = false;
				
				if(!opts.tagId){
					if(date){
						var startDate = todoApp.parseDate(todos[i].startDate);
						var startDateStr = todoApp.formatDate(startDate,"yyyy-MM-dd");
						var endDate = null;
						var dateStr = todoApp.formatDate(date,"yyyy-MM-dd");
						if(todos[i].endDate){
							endDate = todoApp.parseDate(todos[i].endDate);
						}
						if(endDate){
							var endDateStr = todoApp.formatDate(endDate,"yyyy-MM-dd");
							if(dateStr >= startDateStr && endDateStr >= dateStr){
								ifPush = true;
							}
						}else{
							if(dateStr >= startDateStr){
								ifPush = true;
							}
						}
						
						if(ifPush){
							var repeat = todos[i].repeat;
							if(repeat == 0){
								if(dateStr != startDateStr){
									ifPush = false;
								}
							}else if(repeat == 2){
								if((date.getDate() - startDate.getDate()) % 7 !=0){
									ifPush = false;
								}
							}else if(repeat == 3){
								if(date.getDate() != startDate.getDate()){
									ifPush = false;
								}
							}else if(repeat == 4){
								if(!(date.getDate() == startDate.getDate() && date.getMonth() == startDate.getMonth())){
									ifPush = false;
								}
							}
						}
					}else{
						ifPush = true;
					}
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
			var $e = $(Handlebars.compile($("#tmpl-todoApp_TodayPanel").html())({
				"todos":todos,
				"date":todoApp.formatDate(date,"long"),
				"day":todoApp.getDay(date.getDay(),"long")
			}));
			dfd.resolve($e);
		});
		
		
		return dfd.promise();
	}
		
	todoApp_TodayPanel.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		var $mainScreen = $e.closest(".todoApp_mainScreen");
		$e.find(".todayInfo").click(function(){
			brite.display("todoApp_DateSelect",{date:c.date}).done(function(dateSelect){
				dateSelect.onDone(function(returnDate){
					todoApp.today = returnDate;
					$mainScreen.trigger("todayChange");
					brite.display("todoApp_TodayPanel");
				});
			});
		});
		
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
				brite.display("todoApp_TodayPanel");
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
						brite.display("todoApp_TodayPanel");
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
	brite.registerComponent("todoApp_TodayPanel",{
        parent: ".rightContainer",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new todoApp_TodayPanel();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);