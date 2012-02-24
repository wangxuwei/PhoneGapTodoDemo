(function($){

	function TodoUpdate(){};
	
	// --------- Component Interface Implementation ---------- //
	TodoUpdate.prototype.create = function(data,config){
		var c = this;
		var id = null;
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("todo",id).done(function(todo){
			c.todo = todo;
			var $e = $(Handlebars.compile($("#tmpl-TodoUpdate").html())(todo));
			dfd.resolve($e);
		});
		
		return dfd.promise();
	}
	
	TodoUpdate.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.find("input[name='status']").change(function(){
			var obj = getValues.call(c);
			var $item = $(this).closest(".item-value");
			brite.dm.update("todo",obj.id,obj).done(function(){
				resetItem.call(c,$item,"status",obj.status);
			});
		});
		
		$e.find(".todoPropItem.dateItem").click(function(){
			var $item = $(this);
			brite.display("DateSelect",{date:todoApp.parseDate($item.attr("data-value"))}).done(function(dateSelect){
				dateSelect.onDone(function(date){
					var str = todoApp.formatDate(date)
					$item.attr("data-value",str);
					$item.data("value",date);
					$item.find(".text").html(str);
					var obj = getValues.call(c);
						brite.dm.update("todo",obj.id,obj).done(function(){
					});
				});
			});
		});
		
		$e.find(".todoPropItem.repeatItem").click(function(){
			var $item = $(this);
			brite.display("ListSelect",{
				title:"Repeat Option",
				defaultValue:$item.attr("data-value"),
				items:[
				    {value:0,label:todoApp.getConstant("TodoRepeat",0)},
				    {value:1,label:todoApp.getConstant("TodoRepeat",1)},
				    {value:2,label:todoApp.getConstant("TodoRepeat",2)},
				    {value:3,label:todoApp.getConstant("TodoRepeat",3)},
				    {value:4,label:todoApp.getConstant("TodoRepeat",4)},
				]
			}).done(function(listSelect){
				listSelect.onDone(function(value){
					$item.attr("data-value",value);
					$item.find(".item-value .text").html(todoApp.getConstant("TodoRepeat",value));
					var obj = getValues.call(c);
					brite.dm.update("todo",obj.id,obj).done(function(){
					});
				});
			});
		});
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	getValues = function(){
		var $e = this.$element;
		var c = this;
		var obj = {};
		obj.id = $e.find("input[name='id']").val();
		obj.status = typeof $e.find("input[name='status']").attr("checked") == 'undefined' ? 0 : 1;
		obj.repeat = $e.find(".todoPropItem.repeatItem").attr("data-value");
		return obj;
	}
	
	resetItem = function($item,name,newValue){
		var $e = this.$element;
		var c = this;
		if(name == "status"){
			var $text = $item.find(".text");
			$text.html(todoApp.getConstant('TodoStatus',newValue));
		}
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("TodoUpdate",{
        parent: ".rightContainer",
        loadTemplate:true,
        emptyParent:true
    },function(){
        return new TodoUpdate();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);