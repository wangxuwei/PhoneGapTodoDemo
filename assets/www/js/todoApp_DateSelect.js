(function($){

	function todoApp_DateSelect(){};
	var step = 30;
	
	// --------- Component Interface Implementation ---------- //
	todoApp_DateSelect.prototype.create = function(data,config){
		var c = this;
		var id = null;
		var obj = {};
		obj.months = [];
		var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		for(var i=0; i < month.length;i++){
			obj.months.push({value:i,label:month[i],top:((i)*step)});
		}
		
		obj.years = [];
		for(var i = 1990; i < 2050 ;i++){
			obj.years.push({value:i,label:i,top:((i-1990)*step)});
		}
		obj.dates = [];
		for(var i = 1; i < 32 ;i++){
			obj.dates.push({value:i,label:i,top:((i-1)*step)});
		}
		
		var $e = $(Handlebars.compile($("#tmpl-todoApp_DateSelect").html())(obj));
		var $screen = $("<div id='transparentScreen' class='dateScreen'></div>");
		c.$screen = $screen;
		$("body").append($screen);
		return $e;
	}
	
	todoApp_DateSelect.prototype.init = function(){
	}
	
	todoApp_DateSelect.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$(window).resize(function(){
			processWidth.call(c);
		});
		
		c.$screen.click(function(){
			c.hide();
		});
		
		if(data && data.date && todoApp.isValidDate(data.date)){
			c.show(data.date);
		}else{
			c.show(new Date());
		}
		var $dateContent = $e.find(".dateContent");
		var $month = $e.find(".month.column");
		var $year = $e.find(".year.column");
		var $date = $e.find(".date.column");
		var monthWidthR = $month.width();
		var dateWidthR = $date.width();
		var yearWidthR = $year.width();
		
//		$e.delegate(".unit","click",function(){
//			var $unit = $(this);
//			var curDate = new Date(Date.parse($dateContent.attr("data-value")));
//			var newDate = new Date(curDate*1);
//			var $column = $unit.closest(".column");
//			if($column.hasClass("date")){
//				newDate.setDate($unit.attr("data-value") * 1);
//			}else if($column.hasClass("month")){
//				newDate.setMonth($unit.attr("data-value") * 1);
//			}else{
//				newDate.setFullYear($unit.attr("data-value") * 1);
//			}
//			setValue.call(c,newDate);
//		});
		
		$e.delegate(".dateBottom .btn","click",function(){
			var $btn = $(this);
			if($btn.hasClass("done")){
				var newDate = getValue.call(c);
				if(c._doneCallback && $.isFunction(c._doneCallback)){
					c._doneCallback(newDate);
				}
			}
			c.hide();
		});
		
		//drag direction, default is drap down
		var direction = true;
		var $scrollable = null;
		$e.bDrag(".column, .bar",{
			start: function(event,dragExtra){
				event.stopPropagation();
				event.preventDefault();
			},
			drag: function(event,dragExtra){
				event.stopPropagation();
				event.preventDefault();
				$scrollable = $(this);
				var $dateColumn = $scrollable;
				if($scrollable.hasClass("bar")){
					var barWidth = $scrollable.width();
					var widthR =  (dragExtra.startPageX - $scrollable.offset().left);
					if(widthR <= yearWidthR){
						$scrollable = $year;
					}else if(widthR <= yearWidthR + monthWidthR && widthR > yearWidthR){
						$scrollable = $month;
					}else{
						$scrollable = $date;
					}
				}
				
				var n = $scrollable.find(".unit").size();
				
				var tempArray = [];
				$scrollable.find(".unit").each(function(){
					var $unit = $(this);
					tempArray.push($unit);
					var top = $unit.position().top;
					var temp = top;
					top = top + dragExtra.deltaPageY;
					$unit.css("top",top+"px");
				});
				
				if(dragExtra.deltaPageY >= 0){
					direction = true;
					tempArray.reverse();
					$.each(tempArray,function(){
						var $unit = $(this);
						if($unit.position().top > (n-1)*step){
							var $first = $scrollable.find(".unit:first");
							var newTop = $first.position().top - step;
							$unit.insertBefore($first);
							$unit.css("top",newTop+"px");
							if($dateColumn.hasClass("year")){
								var value = $first.attr("data-value") * 1;
								var label = $first.text() * 1;
								var newValue = value - 1;
								var newLabel = label - 1;
								$unit.attr("data-value",newValue);
								$unit.text(newLabel);
							}
						}
					});
				}else{
					direction = false;
					$.each(tempArray,function(){
						var $unit = $(this);
						if($unit.position().top < (-1)*step){
							var $last = $scrollable.find(".unit:last");
							var newTop = $last.position().top + step;
							$unit.insertAfter($last);
							$unit.css("top",newTop+"px");
							if($dateColumn.hasClass("year")){
								var value = $last.attr("data-value") * 1;
								var label = $last.text() * 1;
								var newValue = value + 1;
								var newLabel = label + 1;
								$unit.attr("data-value",newValue);
								$unit.text(newLabel);
							}
						}
					});
				}
			}, 
			
			end: function(event,dragExtra){
				event.stopPropagation();
				var $dateContent = $scrollable.closest(".dateContent");
				$scrollable.find(".unit").each(function(){
					var top = $(this).position().top;
					top = Math.round(top/step) * step;
					$(this).css("top",top+"px");
				});
				
				//set to data-value
				var $date = $dateContent.find(".date");
				var $month = $dateContent.find(".month");
				var $year = $dateContent.find(".year");
				var date = null;
				$date.find(".unit").each(function(){
					if($(this).position().top == 2 * step){
						date = $(this).attr("data-value");
						return;
					}
				});
				var month = null;
				$month.find(".unit").each(function(){
					if($(this).position().top == 2 * step){
						month = $(this).attr("data-value");
						return;
					}
				});
				var year = null;
				$year.find(".unit").each(function(){
					if($(this).position().top == 2 * step){
						year = $(this).attr("data-value");
						return;
					}
				});
				var lastDay = getLastDay(year,month);
				if(date * 1 > lastDay){
					if(direction){
						date = lastDay;
					}else{
						date = 1;
					}
				}
				var dateStr= (month*1 + 1) + "/" + date + "/" + year;
				var newDate = new Date(Date.parse(dateStr));
				setValue.call(c,newDate);
			}
			
		});
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	todoApp_DateSelect.prototype.close = function(){
		var c = this;
		var $e = this.$element;
		
		$e.bRemove();
	}
	
	todoApp_DateSelect.prototype.onDone = function(doneCallback){
		this._doneCallback = doneCallback;
	}
	
	todoApp_DateSelect.prototype.show = function(dateValue){
		var $e = this.$element;
		var $screen = this.$screen;
		$screen.show();
		$e.show();
		processWidth.call(this);
		setValue.call(this,dateValue);
		
		if(brite.ua.hasTransition()){
			//slide
			$e.css(todoApp.transition.getCssPrefix() + "transform","translate(0px,300px)");
			setTimeout(function(){
				$e.addClass("transitioning");
				$e.css(todoApp.transition.getCssPrefix() + "transform","translate(0px,0px)");
				$e.bind(todoApp.transition.getTransitionEnd(),function(){
					$e.removeClass("transitioning");
					$e.unbind(todoApp.transition.getTransitionEnd());
				});
			},0);
		}
	}
	
	todoApp_DateSelect.prototype.hide = function(){
		var $e = this.$element;
		var $screen = this.$screen;
		
		if(brite.ua.hasTransition()){
			//slide
			$e.css(todoApp.transition.getCssPrefix() + "transform","translate(0px,0px)");
			setTimeout(function(){
				$e.addClass("transitioning");
				$e.css(todoApp.transition.getCssPrefix() + "transform","translate(0px,300px)");
				$e.bind(todoApp.transition.getTransitionEnd(),function(){
					$e.removeClass("transitioning");
					$e.hide();
					$screen.hide();
					$e.bRemove();
					$screen.remove();
					$e.css(todoApp.transition.getCssPrefix() + "transform","translate(0px,0px)");
					$e.unbind(todoApp.transition.getTransitionEnd());
				});
			},0);
		}else{
			$e.hide();
			$screen.hide();
			$e.bRemove();
			$screen.remove();
		}
		
		
	}
	
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	setValue = function(newdate){
		var c = this;
		var $e = this.$element;
		var $dateContent = $e.find(".dateContent");
		var year = newdate.getFullYear();
		var month = newdate.getMonth();
		var date = newdate.getDate();
		
		var $date = $dateContent.find(".date .unit[data-value='"+date+"']");
		reOrderUnit.call(c,$date);
		
		var $month = $dateContent.find(".month .unit[data-value='"+month+"']");
		reOrderUnit.call(c,$month);
		
		var $year = $dateContent.find(".year .unit[data-value='"+year+"']");
		reOrderUnit.call(c,$year);
		
		var lastDay = getLastDay.call(c,year,month);
		$dateContent.find(".date .unit").removeClass("disable");
		for(var i = lastDay + 1; i <= 31; i++){
			$dateContent.find(".date .unit[data-value='"+i+"']").addClass("disable");
		}
		
		$dateContent.attr("data-value",todoApp.formatDate(newdate));
	}
	
	getValue = function(){
		var $e = this.$element;
		var $dateContent = $e.find(".dateContent");
		var dateStr = $dateContent.attr("data-value");
		return new Date(todoApp.parseDate(dateStr));
	}
	
	processWidth = function(){
		var $e = this.$element;
//		var $dateScreen = this.$screen;
		// reduce border, margin and padding 
		var width = $e.width() - 40;
		var monthWidthR = 0.58;
		var dateWidthR = 0.14;
		var yearWidthR = 0.28;
		var $month = $e.find(".month");
		var $date = $e.find(".date");
		var $year = $e.find(".year");
		$month.width(width * monthWidthR);
		$date.width(width * dateWidthR);
		$year.width(width * yearWidthR);
	}
	
	reOrderUnit = function($baseUnit){
		var $dateColumn = $baseUnit.closest(".column");
		var size = $dateColumn.find(".unit").size();
		$baseUnit.css("top",2*step+"px");
		var lastTop = 2*step;
		var firstTop = 2*step;
		
		var nextArray = [];
		$baseUnit.nextAll(".unit").each(function(i,n){
			var $unit = $(this);
			var top = (i+3)*step;
			$unit.css("top",top+"px");
			if(top >= (size-1)*step){
				nextArray.push($unit);
			}else{
				lastTop = top;
			}
		});
		if(nextArray.length > 0){
			nextArray.reverse();
			$.each(nextArray,function(i,n){
				var $unit = $(this);
				var $first = $dateColumn.find(".unit:first");
				var top = firstTop - step;
				firstTop = top;
				$unit.css("top",top+"px");
				$unit.insertBefore($first);
				if($dateColumn.hasClass("year")){
					var value = $first.attr("data-value") * 1;
					var label = $first.text() * 1;
					var newValue = value - 1;
					var newLabel = label - 1;
					$unit.attr("data-value",newValue)
					$unit.text(newLabel);
				}
			});
		}
		
		var prevArray = [];
		$baseUnit.prevAll(".unit").each(function(i,n){
			var $unit = $(this);
			var top = (1-i)*step;
			firstTop = top;
			$unit.css("top",top+"px");
			if(top < (-1)*step){
				prevArray.push($unit);
			}else{
				firstTop = top;
			}
		});
		if(prevArray.length > 0){
			prevArray.reverse();
			$.each(prevArray,function(i,n){
				var $unit = $(this);
				var $last = $dateColumn.find(".unit:last");
				var top = lastTop + step;
				lastTop = top;
				$unit.insertAfter($last);
				$unit.css("top",top+"px");
				if($dateColumn.hasClass("year")){
					var value = $last.attr("data-value") * 1;
					var label = $last.text() * 1;
					var newValue = value + 1;
					var newLabel = label + 1;
					$unit.attr("data-value",newValue)
					$unit.text(newLabel);
				}
			});
		}
	}
	
	getLastDay = function(year,month){
		var date = new Date(year * 1,month * 1 + 1,1);
		var lastDay = new Date(date.getTime()-1000*60*60*24).getDate();
		return lastDay;
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_DateSelect",{
        parent: ".todoApp #page",
        loadTemplate:true,
    },function(){
        return new todoApp_DateSelect();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);