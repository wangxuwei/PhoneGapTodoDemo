(function($){

	function Dashboard(){};
	
	// --------- Component Interface Implementation ---------- //
	Dashboard.prototype.create = function(data,config){
		var $e = null;
		$e = $("#tmpl-Dashboard").render();
		return $e;
	}
	
	Dashboard.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.find(".dashboard-item").click(function(){
			var $item = $(this);
			$item.closest(".dashboard").find(".dashboard-item").removeClass("selected");
			$item.addClass("selected");
		});
		
		$e.find(".todos").click(function(){
			brite.display("TodosPanel");
		});
		$e.find(".tags").click(function(){
			brite.display("TagsPanel");
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("Dashboard",{
        parent: ".leftContainer",
        loadTemplate:true
    },function(){
        return new Dashboard();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);