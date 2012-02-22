(function($){

	function TagsPanel(){};
	
	// --------- Component Interface Implementation ---------- //
	TagsPanel.prototype.build = function(data,config){
		var dfd = $.Deferred();
		var opts = {};
		brite.dm.list("tag",opts).done(function(tags){
			var $e = null;
			$e = $(Handlebars.compile($("#tmpl-TagsPanel").html())({
				tags:tags
			}));
			dfd.resolve($e);
		});
		return dfd.promise();
	}
	
	TagsPanel.prototype.postDisplay = function(data,config){
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
						brite.display("TagsPanel");
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
				brite.display('TodosPanel',{tagId:id});
			}
		});
		
		$e.find(".preDelete").click(function(e){
			var $this = $(this);
			e.stopPropagation();
			$this.toggleClass("rotate");
			$this.closest(".tag").find(".tagAction.btnDelete").toggle();
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("TagsPanel",{
        parent: ".rightContainer",
        loadTemplate:true,
        emptyParent:true
    },function(){
        return new TagsPanel();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);