var todoApp = todoApp || {};

(function($){

	function Tag(){};
	todoApp.Tag = Tag; 
  
	Tag.prototype.build = function(data,config){
		var dfd = $.Deferred();
		brite.dm.list("tag",{}).done(function(tags){
			var $e = null;
			$e = $("#tmpl-tag").render({"tags":tags});
			$("body").append("<div id='transparentScreen' class='tagScreen'></div>");
			dfd.resolve($e);
		});
		return dfd.promise();
	}
		
	Tag.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
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
			var $this = $(this);
			c._editMode = !c._editMode;
			$e.attr("editMode",c._editMode);
			$this.toggleClass("press");
			$e.find(".tag.all").toggleClass("editMode");
		});

		
		$e.find(".add").click(function(){
			brite.display('DialogTag',{});
		});

		$e.find(".tag").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			if(c._editMode){
				if(id != ""){
					brite.display('DialogTag',{id:id});
				}
			}else{
				brite.display('Todo',{tagId:id});
			}
		});
		
		$("#transparentScreen").click(function(){
			c.close();
		});
		
		$e.find(".preDelete").click(function(){
			var $this = $(this);
			$this.toggleClass("rotate");
			$this.closest(".tag").find(".tagAction.btnDelete").toggle();
		});
	}
	
	Tag.prototype.close = function(){
		this.$element.bRemove();
		$("#transparentScreen.tagScreen").remove();
	}
	
})(jQuery);