(function($){

	function DialogTodo(){};
  
	// --------- Component Interface Implementation ---------- //
	DialogTodo.prototype.create = function(data,config){
		var c = this;
		var id = null;
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("todo",id).done(function(todo){
			c.todo = todo;
			var $e = $("#tmpl-DialogTodo").render(todo);
			$("body").append("<div id='notTransparentScreen' class='dialogTodoScreen'></div>");
			dfd.resolve($e);
		});
		
		return dfd.promise();
	}
	
	DialogTodo.prototype.init = function(data,config){
		var c = this;
		var $e = this.$element;
		
		var imagePickerInitDfd = brite.display("ImagePicker", {
			image : c.todo?localStorage.getItem("image_"+c.todo.imageId):null
		}, {
			parent : $e.find(".imageContainer")
		}).whenInit.done(function(imagePicker) {
			c.imagePicker = imagePicker;
		});
		
	}
		
	DialogTodo.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.css("margin-left",-1*$e.width()/2 + "px").css("margin-top",-1*$e.height()/2 + "px");
		
		$e.find(".dialog-header").delegate(".button.ok", "click", function() {
			c.close();
		});
		
		$e.find(".save").click(function(){
			var todo = {};
			todo.taskName = $("#updateTodo").find("input[name='taskName']").val();
			todo.startDate = $("#updateTodo").find("input[name='startDate']").val();
			todo.endDate = $("#updateTodo").find("input[name='endDate']").val();
			todo.status = $("#updateTodo").find("input[name='status']").val();
			todo.imageId = $("#updateTodo").find("input[name='imageId']").val();
			var id = $("#updateTodo").find("input[name='id']").val();
			var image = c.imagePicker.getImage();
			var imageUrl = c.imagePicker.getCurrentImageSrc();
			var imageObj = null;
			if(image.file){
				imageObj = {};
				imageObj.type = "local";
				imageObj.ext = image.file.fileName.substring(image.file.fileName.lastIndexOf("."),image.file.fileName.length);
			}
			var imageDfd = $.Deferred();
			if(id && id!=""){
				brite.dm.remove("image",todo.imageId).done(function(){
					localStorage.removeItem("image_"+todo.imageId);
					if(imageObj != null){
						brite.dm.create("image",imageObj).done(function(imageId){
							localStorage.setItem("image_"+imageId,c.imagePicker.getCurrentImageSrc());
							imageDfd.resolve(imageId);
						});
					}else{
						imageDfd.resolve(imageId);
					}
				});
				imageDfd.done(function(imageId){
					if(imageId != null){
						todo.imageId = imageId;
					}
					brite.dm.update("todo", id, todo).done(function(){
						c.close();
						brite.display("Todo");
					});
				});
			}else{
				if(imageObj != null){
					brite.dm.create("image",imageObj).done(function(imageId){
						localStorage.setItem("image_"+imageId,c.imagePicker.getCurrentImageSrc());
						imageDfd.resolve(imageId);
					});
				}else{
					imageDfd.resolve(imageId);
				}
				imageDfd.done(function(imageId){
					if(imageId != null){
						todo.imageId = imageId;
					}
					brite.dm.create("todo",todo).done(function(){
						c.close();
						brite.display("Todo");
					});
				});
				
			}
			
		});
		
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	DialogTodo.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTodoScreen").remove();
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("DialogTodo",{
        parent:"#page",
        loadTemplate:true
    },function(){
        return new DialogTodo();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);