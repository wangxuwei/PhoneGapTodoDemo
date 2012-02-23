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
			c.todo = todo || {};
			var $e = $(Handlebars.compile($("#tmpl-DialogTodo").html())(c.todo));
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
		
		$e.find(".dialog-bottom").delegate(".btn.cancel", "click", function() {
			c.close();
		});
		$e.find(".dialog-bottom").delegate(".btn.ok", "click", function() {
			var todo = {};
			todo.taskName = $(".dialog-content").find("input[name='taskName']").val();
			todo.startDate = todoApp.formatDate(new Date());
			todo.status = 0;
			brite.dm.create("todo",todo).done(function(){
				brite.display("TodosPanel");
				c.close();
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