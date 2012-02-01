var todo = todo || {};

(function($){

	function MainScreen(){};
	todo.MainScreen = MainScreen; 
  
	MainScreen.prototype.build = function(data,config){
		return $("#tmpl-MainScreen").render();
	}
		
	MainScreen.prototype.postDisplay = function(data,config){
		brite.display('Tag',{});
		brite.display('Todo',{});
	}
	
	
})(jQuery);