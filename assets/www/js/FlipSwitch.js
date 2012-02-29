(function($){

	// --------- Component Interface Implementation ---------- //
	function FlipSwitch(){};
  
	FlipSwitch.prototype.create = function(data,config){
		var html = $(Handlebars.compile($("#tmpl-FlipSwitch").html())({}));
		return $(html);
	}
		
	FlipSwitch.prototype.postDisplay = function(data,config){
		var thisC = this;
		var $e = this.$element;
		var defaultValue = true;
		if(data && typeof data.defaultValue != 'undefined'){
			defaultValue = data.defaultValue;
		}
		if(data && data.mode){
			$e.addClass(data.mode);
		}
		
		//show default value
		showValue.call(thisC,defaultValue);
		
		//when click the switch button,change the value
		$e.find(".flipSwitch-buttons").click(function(){
			if(!$e.hasClass("disable")){
				var value = $e.attr("data-value") == 'on' ? true : false;
				value = !value;
				showValue.call(thisC,value);
				if(thisC._changeCallback && $.isFunction(thisC._changeCallback)){
					thisC._changeCallback(value);
				}
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Public API --------- //
	FlipSwitch.prototype.setValue = function(value){
		var thisC = this;
		var $e = this.$element;
		var defaultValue = value;
		showValue.call(thisC,defaultValue);
	}
	
	FlipSwitch.prototype.onChange = function(changeCallback){
		this._changeCallback = changeCallback;
	}
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private Methods --------- //
	function showValue(defaultValue){
		var $e = this.$element;
		var $leftButton = $e.find(".leftButton");
		var $rightButton = $e.find(".rightButton");
		var $text = $e.find(".flipSwitch-buttons .text");
		
		//clear 
		$e.find(".flipSwitch-buttons .button").removeClass("disSel");
		$text.removeClass("left right");
		if(defaultValue){
			$e.attr("data-value","on");
			//show label
			$text.html("On");
			$text.addClass("left");
			// add class disSel
			$rightButton.addClass("disSel");
		}else{
			$e.attr("data-value","off");
			$text.html("Off");
			$text.addClass("right");
			// add class disSel
			$leftButton.addClass("disSel");
		}
	}
	// --------- /Component Private Methods --------- //
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("FlipSwitch",{
		emptyParent: true,
		loadTemplate: true
	},function(){
		return new FlipSwitch();
	});	
	// --------- /Component Registration --------- //
})(jQuery);
