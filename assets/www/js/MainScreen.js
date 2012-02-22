(function($){

	function MainScreen(){};
  
	// --------- Component Interface Implementation ---------- //
	MainScreen.prototype.build = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-MainScreen").html())());
	}
		
	MainScreen.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		brite.display('Dashboard');
		brite.display('TodosPanel');
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("MainScreen",{
        parent: "#page",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new MainScreen();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);