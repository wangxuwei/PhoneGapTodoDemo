(function($){

	function ListSelect(){};
	
	// --------- Component Interface Implementation ---------- //
	ListSelect.prototype.create = function(data,config){
		var c = this;
		var id = null;
		var obj = {};
		obj.title = "List Select";
		obj.items = [];
		if(data){
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
		
		if(typeof c.defaultValue != 'undefined'){
			$e.find(".item[data-value='"+c.defaultValue+"']").addClass("selected");
		}else{
			$e.find(".item:first").addClass("selected");
		}
	}
	
	ListSelect.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.delegate(".item","click",function(){
			var $item = $(this);
			$item.closest(".items").find(".item").removeClass("selected");
			$item.addClass("selected");
		});
		
		$e.delegate(".panel-header .button.cancel","click",function(){
			c.close();
		});
		
		$e.delegate(".panel-header .button.done","click",function(){
			if(c._doneCallback && $.isFunction(c._doneCallback)){
				var value = $e.find(".item.selected").attr("data-value");
				c._doneCallback(value);
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
        loadTemplate:true,
    },function(){
        return new ListSelect();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);