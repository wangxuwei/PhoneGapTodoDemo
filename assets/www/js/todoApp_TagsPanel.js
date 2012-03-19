(function($){

	function todoApp_TagsPanel(){};
	
	// --------- Component Interface Implementation ---------- //
	todoApp_TagsPanel.prototype.build = function(data,config){
		var dfd = $.Deferred();
		var opts = {};
		var editMode = false;
		if(data && data.editMode){
			editMode = true;
		}
		brite.dm.list("todoApp_tag",opts).done(function(tags){
			var $e = null;
			$e = $(Handlebars.compile($("#tmpl-todoApp_TagsPanel").html())({
				tags:tags
			}));
			$e.data("editMode",editMode);
			if(editMode){
				$e.addClass("editMode");
			}
			dfd.resolve($e);
		});
		return dfd.promise();
	}
	
	todoApp_TagsPanel.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.find(".delete").click(function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.dm.remove("todoApp_tag",id).done(function(){
				brite.dm.list("todoApp_tagtodo",{}).done(function(tagTodos){
					var ids = [];
					for(var i=0;i<tagTodos.length;i++){
						var o = tagTodos[i];
						if(id == o.tagId){
							ids.push(o.id);
						}
					}
					brite.dm.remove("todoApp_tagtodo",ids).done(function(){
						var editMode = $e.data("editMode");
						brite.display("todoApp_TagsPanel",{editMode:editMode});
					});
				});
			});
		});

		$e.find(".edit").click(function(){
			var $this = $(this);
			$this.toggleClass("press");
			$e.toggleClass("editMode");
			if($e.hasClass("editMode")){
				$e.data("editMode",true);
			}else{
				$e.data("editMode",false);
			}
		});
		
		$e.find(".add").click(function(){
			brite.display('todoApp_DialogTag',{}).done(function(dialogTag){
				dialogTag.onAnswerOkCallback(function(){
					var editMode = $e.data("editMode");
					brite.display("todoApp_TagsPanel",{editMode:editMode});
				});
			});
		});

		$e.delegate(".tag .icoEdit","click",function(e){
			e.stopPropagation();
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('todoApp_DialogTag',{id:id}).done(function(dialogTag){
				dialogTag.onAnswerOkCallback(function(tag){
					refreshTagItem.call(c,$item,tag);
				});
			});
		});
		
		$e.delegate(".tag","click",function(){
			var $item  = $(this).closest("*[data-obj_id]");
			var id = $item.attr("data-obj_id");
			brite.display('todoApp_TodosPanel',{tagId:id},{transition:"slideLeft"});
		});
		
		$e.find(".preDelete").click(function(e){
			var $this = $(this);
			e.stopPropagation();
			$this.toggleClass("rotate");
			$this.closest(".tag").find(".tagAction.btnDelete").toggleClass("show");
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	refreshTagItem = function($tag,tag){
		$tag.find(".tagName .action").html(tag.name);
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_TagsPanel",{
        parent: ".rightContainer",
        loadTemplate:true,
        emptyParent:true
    },function(){
        return new todoApp_TagsPanel();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);