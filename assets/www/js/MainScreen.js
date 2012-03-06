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
		
		fitLayoutByWidth.call(c);
		$(window).resize(function(){
			var width = $e.width();
			fitLayoutByWidth.call(c,width);
		});
		
		$e.find(".btnCorner").click(function(){
			var $leftExternalContainer = $e.find(".leftExternalContainer");
			if($leftExternalContainer.hasClass("show")){
				hideLeftPanel.call(c);
			}else{
				showLeftPanel.call(c);
			}
		});
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	fitLayoutByWidth = function(width){
		var c = this;
		if(typeof width == 'undefined'){
			width = $e.width();
		}
		// the 960 is width of ipad.
		if(width < 960){
			moveOutLeftPanel.call(c);
		}else if(width >= 960){
			moveInLeftPanel.call(c);
		}
	}
	
	moveInLeftPanel = function(){
		var $e = this.$element;
		var $leftContainer = $e.find(".leftContainer");
		var $leftExternalContainer = $e.find(".leftExternalContainer");
		var $rightContainer = $e.find(".rightContainer");
		$leftExternalContainer.hide();
		$leftContainer.insertBefore($rightContainer);
		$rightContainer.css("width","70%");
		$leftContainer.css("width","30%");
	}
	
	moveOutLeftPanel = function(){
		var $e = this.$element;
		var c = this;
		var $leftContainer = $e.find(".leftContainer");
		var $leftExternalContainer = $e.find(".leftExternalContainer");
		var $leftExternalContainerContent = $e.find(".leftExternalContainer-content");
		var $rightContainer = $e.find(".rightContainer");
		$leftContainer.appendTo($leftExternalContainerContent);
		hideLeftPanel.call(c);
		$leftExternalContainer.show();
		$leftExternalContainer.addClass("transitioning");
		$rightContainer.css("width","100%");
		$leftContainer.css("width","100%");
	}
	
	showLeftPanel = function(){
		var $e = this.$element;
		var $leftExternalContainer = $e.find(".leftExternalContainer");
		$leftExternalContainer.css("-webkit-transform","translate(0px,0px)");
		$leftExternalContainer.addClass("show");
		$leftExternalContainer.find(".btnCorner .ico").removeClass("icoTriggleRight");
		$leftExternalContainer.find(".btnCorner .ico").addClass("icoTriggleLeft");
	}
	
	hideLeftPanel = function(){
		var $e = this.$element;
		var $leftExternalContainer = $e.find(".leftExternalContainer");
		$leftExternalContainer.css("-webkit-transform","translate(-"+$leftExternalContainer.width()+"px"+",0px)");
		$leftExternalContainer.removeClass("show");
		$leftExternalContainer.find(".btnCorner .ico").removeClass("icoTriggleLeft");
		$leftExternalContainer.find(".btnCorner .ico").addClass("icoTriggleRight");
	}
	
	// --------- /Component Private API --------- //
	
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