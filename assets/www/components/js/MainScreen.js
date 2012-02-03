var todoApp = todoApp || {};

(function($){

	function MainScreen(){};
	todoApp.MainScreen = MainScreen; 
  
	MainScreen.prototype.build = function(data,config){
		return $("#tmpl-MainScreen").render();
	}
		
	MainScreen.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		brite.display('Todo');
		
		$e.find(".mainScreen-header-content .button.tag").click(function(){
			brite.display("Tag");
		});
		$e.find(".mainScreen-header-content .button.addTodo").click(function(){
			brite.display('DialogTodo',{});
		});
	}
	
	
})(jQuery);