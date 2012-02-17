(function($){

	function TagsPanel(){};
	
	// --------- Component Interface Implementation ---------- //
	TagsPanel.prototype.build = function(data,config){
		var dfd = $.Deferred();
		var opts = {};
		brite.dm.list("tag",opts).done(function(tags){
			var $e = null;
			$e = $("#tmpl-TagsPanel").render({"tags":tags});
			$("body").append("<div id='transparentScreen' class='tagScreen'></div>");
			dfd.resolve($e);
		});
		return dfd.promise();
	}
	
	TagsPanel.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		//draw arrow
		var $arrow = $e.find(".tagsPanelArrow");
		if(brite.ua.hasCanvas($arrow)){
			drawArrow.call(this,$arrow);
		}
		
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
				brite.display('TodosPanel',{tagId:id});
			}
		});
		
		$("#transparentScreen").click(function(){
			c.close();
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
	TagsPanel.prototype.close = function(){
		this.$element.bRemove();
		$("#transparentScreen.tagScreen").remove();
	}
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	drawArrow = function($item){
		var $e = this.$element;
		var c = this;
		$e.addClass("has-canvas");
		$item.addClass("has-canvas");
		
		$item.append("<canvas width=0 height=0 ></canvas>");
		var gtx = brite.gtx($item.find("canvas"));
		gtx.fitParent();
		var width = gtx.canvas().width;
		var height = gtx.canvas().height;
		
		gtx.strokeStyle("#9ca0aa");
		gtx.beginPath();
		gtx.moveTo(30, 0);
		gtx.lineTo(10, height);
		gtx.lineTo(50, height);
		gtx.closePath();
		gtx.lineWidth(1);
		gtx.stroke();
		var gradient = gtx.createLinearGradient(20, 0, 20, height);
		gradient.addColorStop(0.00, "rgb(159, 159, 164)");
		gradient.addColorStop(1.00, "rgb(95, 101, 118)");
		gtx.fillStyle(gradient);
		gtx.fill();
		
		
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("TagsPanel",{
        parent: "#page",
        loadTemplate:true
    },function(){
        return new TagsPanel();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);