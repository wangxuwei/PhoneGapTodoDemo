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
		var imageDfd = $.Deferred();
		if(c.todo){
			brite.dm.get("image",c.todo.imageId).done(function(image){
				imageDfd.resolve(image);
			});
		}else{
			imageDfd.resolve(null);
		}
		
		imageDfd.done(function(image){
			if(image && image.type == "local"){
				image.src = localStorage.getItem("image_"+image.id);
			}
			var imagePickerInitDfd = brite.display("ImagePicker", {
				image : image
			}, {
				parent : $e.find(".imageContainer")
			}).whenInit.done(function(imagePicker) {
				c.imagePicker = imagePicker;
			});
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
			var imageDfd = $.Deferred();
			if(image.file){
				imageObj = {};
				imageObj.type = "local";
				imageObj.ext = image.file.fileName.substring(image.file.fileName.lastIndexOf("."),image.file.fileName.length);
				brite.dm.create("image",imageObj).done(function(imageObj){
					localStorage.setItem("image_"+imageObj.id,c.imagePicker.getCurrentImageSrc());
					imageDfd.resolve(imageObj.id);
				});
			}else if(image.url){
				imageObj = {};
				imageObj.type = "url";
				imageObj.url = image.url;
				imageObj.ext = image.url.substring(image.url.lastIndexOf("."),image.url.length);
				brite.dm.create("image",imageObj).done(function(imageObj){
					imageDfd.resolve(imageObj.id);
				});
			}else{
				imageDfd.resolve(null);
			}
			
			imageDfd.done(function(imageId){
				brite.dm.remove("image",todo.imageId).done(function(){
					localStorage.removeItem("image_"+todo.imageId);
					//new Image
					todo.imageId = imageId;
					if(id && id!=""){
						brite.dm.update("todo", id, todo).done(function(){
							c.close();
							brite.display("TodosPanel");
						});
					}else{
						brite.dm.create("todo",todo).done(function(){
							c.close();
							brite.display("TodosPanel");
						});
					}
				});
				
			});
			
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