(function($){
	
	brite.registerTransition("slideLeft",function(component,data,config){
		var $parent = $(config.parent);
		var $current = $parent.children();
		var $new = component.$element;
		var $old = $parent.children();
		$parent.append($new);
		slide($new,$old,"left");
	});
	
	
	function slide($new,$current,direction,reverse){
		var dt = direction;
		if(reverse){
			dt = getReverseDirection(direction);
		}
		var vertical = false;
		var back = false;
		if(dt == "up" || dt == "down"){
			vertical = true;
		}
		if(dt == "right" || dt == "down"){
			back = true;
		}
		
		var dfd = $.Deferred();
		var width = $current.width(); // should probably take from parent to be safe
		var fromX = back ? (-1) * width : width;
		var currentToX = fromX * -1;
		if(vertical){
			width = $current.height();
			fromX = back ? (-1) * width : width;
			currentToX = fromX * -1;
			$current.height(width);
			$new.height(width);
			
		}else{
			// fix the width of the two view during animation.
			$current.width(width);
			$new.width(width);
		}
		
		$current.css("position","absolute");
		if(vertical){
			$new.css("-webkit-transform","translate(0," + -1 * currentToX + "px)");
		}else{
			$new.css("-webkit-transform","translate(" + -1 * currentToX + "px,0)");
		}
		
		setTimeout(function(){
			var currentDfd = $.Deferred();
			var newDfd = $.Deferred();
			
			$current.addClass("transitioning");
			if(vertical){
				$current.css("-webkit-transform","translate(0," + currentToX + "px)");
			}else{
				$current.css("-webkit-transform","translate(" + currentToX + "px,0)");
			}
			$current.bind("webkitTransitionEnd",function(){
				$current.removeClass("transitioning");
				$current.attr("style","");
				$current.remove();
				currentDfd.resolve();
			});
			
			$new.addClass("transitioning");	
			$new.css("-webkit-transform","translate(0,0px)");
			$new.bind("webkitTransitionEnd",function(){
				$new.removeClass("transitioning");
				$new.attr("style","");
				newDfd.resolve();
			});
			
			$.when(currentDfd,newDfd).done(function(){
				setTimeout(function(){
					dfd.resolve();
				},400);				
			});
		},1);
		
		return dfd.promise();		
	}
	
	
	//--------- /Helper Functions --------//
	function getReverseDirection(direction){
		if(direction == "left"){
			direction = "right";
		}else if(direction == "right"){
			direction = "left";
		}else if(direction == "up"){
			direction = "down";
		}else if(direction == "down"){
			direction = "up";
		}
		return direction;
	}
	//--------- /Helper Functions --------//
	
})(jQuery);
