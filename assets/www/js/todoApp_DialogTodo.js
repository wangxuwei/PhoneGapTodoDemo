(function($){

	function todoApp_DialogTodo(){};
  
	// --------- Component Interface Implementation ---------- //
	todoApp_DialogTodo.prototype.create = function(data,config){
		var c = this;
		var id = null;
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("todoApp_todo",id).done(function(todo){
			c.todo = todo || {};
			var $e = $(Handlebars.compile($("#tmpl-todoApp_DialogTodo").html())(c.todo));
			$("body").append("<div id='notTransparentScreen' class='dialogTodoScreen'></div>");
			dfd.resolve($e);
		});
		
		return dfd.promise();
	}
	
	todoApp_DialogTodo.prototype.init = function(data,config){
		var c = this;
		var $e = this.$element;
		var imageDfd = $.Deferred();
		if(c.todo){
			brite.dm.get("todoApp_image",c.todo.imageId).done(function(image){
				imageDfd.resolve(image);
			});
		}else{
			imageDfd.resolve(null);
		}
		
		imageDfd.done(function(image){
			if(image && image.type == "local"){
				image.src = localStorage.getItem("image_"+image.id);
			}
			var imagePickerInitDfd = brite.display("todoApp_ImagePicker", {
				image : image
			}, {
				parent : $e.find(".imageContainer")
			}).whenInit.done(function(imagePicker) {
				c.imagePicker = imagePicker;
			});
		});
		
		
	}
		
	todoApp_DialogTodo.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		$e.css("margin-left",-1*$e.width()/2 + "px").css("margin-top",-1*$e.height()/2 + "px");
		
		$e.find(".dialog-bottom").delegate(".btn.cancel", "click", function() {
			c.close();
		});
		$e.find(".dialog-bottom").delegate(".btn.ok", "click", function() {
			var todo = {};
			todo.taskName = $(".dialog-content").find("input[name='taskName']").val();
			todo.createDate = todoApp.formatDate(new Date());
			todo.startDate = todoApp.formatDate(new Date());
			todo.status = 0;
			todo.repeat = 0;
			brite.dm.create("todoApp_todo",todo).done(function(){
				brite.display("todoApp_TodosPanel");
				c.close();
			});
		});
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	todoApp_DialogTodo.prototype.close = function(){
		var $e = this.$element;
		$e.bRemove();
		$("#notTransparentScreen.dialogTodoScreen").remove();
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_DialogTodo",{
        parent:"#page",
        loadTemplate:true
    },function(){
        return new todoApp_DialogTodo();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);