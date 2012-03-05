(function($){

	function Dashboard(){};
	
	// --------- Component Interface Implementation ---------- //
	Dashboard.prototype.create = function(data,config){
		var $e = null;
		$e = $(Handlebars.compile($("#tmpl-Dashboard").html())());
		return $e;
	}
	
	Dashboard.prototype.init = function(data,config){
		var $e = this.$element;
		var c = this;
		c.showPanel();
	}
	
	Dashboard.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.delegate(".dashboard-item","click",function(){
			var $item = $(this);
			var panel = $item.attr("data-panel");
			if(panel){
				c.showPanel(panel);
			}else{
				alert("Not support yet");
			}
		});
	}
	
	Dashboard.prototype.showPanel = function(panel){
		var $e = this.$element;
		var c = this;
		
		if(!panel){
			panel = "Today";
		}
		
		var $item = $e.find(".dashboard-item[data-panel='"+panel+"']")
		$item.closest(".dashboard").find(".dashboard-item").removeClass("selected");
		$item.addClass("selected");
		
		if(panel == "Today"){
			brite.display("TodosPanel",{date:new Date()});
		}else{
			brite.display(panel);
		}
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