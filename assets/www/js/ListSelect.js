(function($){

	function ListSelect(){};
	
	// --------- Component Interface Implementation ---------- //
	ListSelect.prototype.create = function(data,config){
		var c = this;
		c.single = true;
		var id = null;
		var obj = {};
		obj.title = "List Select";
		obj.items = [];
		if(data){
			if(typeof data.single != 'undefined'){
				c.single = data.single;
			}
			if(data.title){
				obj.title = data.title;
			}
			if(data.items){
				obj.items = data.items;
			}
			if(typeof data.defaultValue != 'undefined'){
				obj.defaultValue = data.defaultValue;
			}
		}
		c.items = obj.items;
		c.defaultValue = obj.defaultValue;
		var $e = $(Handlebars.compile($("#tmpl-ListSelect").html())(obj));
		
		return $e;
	}
	
	ListSelect.prototype.init = function(){
		var $e = this.$element;
		var c = this;
		
		if(c.single){
			if(typeof c.defaultValue != 'undefined'){
				$e.find(".item[data-value='"+c.defaultValue+"']").addClass("selected");
			}else{
				$e.find(".item:first").addClass("selected");
			}
		}else{
			if(typeof c.defaultValue != 'undefined'){
				if($.isArray(c.defaultValue)){
					for(var i = 0; i < c.defaultValue.length; i++){
						$e.find(".item[data-value='"+c.defaultValue[i]+"']").addClass("selected");
					}
				}else{
					$e.find(".item[data-value='"+c.defaultValue+"']").addClass("selected");
				}
			}
		}
	}
	
	ListSelect.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.delegate(".item","click",function(){
			var $item = $(this);
			if(c.single){
				$item.closest(".items").find(".item").removeClass("selected");
				$item.addClass("selected");
			}else{
				$item.toggleClass("selected");
			}
		});
		
		$e.delegate(".panel-header .button.cancel","click",function(){
			c.close();
		});
		
		$e.delegate(".panel-header .button.done","click",function(){
			if(c._doneCallback && $.isFunction(c._doneCallback)){
				var value = [];
				var label = [];
				$e.find(".item.selected").each(function(){
					value.push($(this).attr("data-value"));
					label.push($(this).attr("data-label"));
				});
				if(c.single && value.length > 0){
					value = value[0];
					label = label[0];
				}
				c._doneCallback(value,label);
			}
			c.close();
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	ListSelect.prototype.close = function(){
		var c = this;
		var $e = this.$element;
		
		$e.bRemove();
	}
	
	ListSelect.prototype.onDone = function(doneCallback){
		this._doneCallback = doneCallback;
	}
	
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("ListSelect",{
        parent: "#page",
        loadTemplate:true
    },function(){
        return new ListSelect();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);