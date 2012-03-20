(function($){

	function todoApp_TodoUpdate(){};
	
	// --------- Component Interface Implementation ---------- //
	todoApp_TodoUpdate.prototype.create = function(data,config){
		var c = this;
		var id = null;
		if(data && data.id){
			id = data.id;
		}
		var dfd = $.Deferred();
		brite.dm.get("todoApp_todo",id).done(function(todo){
			$.when(brite.dm.list("todoApp_tagtodo"),brite.dm.list("todoApp_tag")).done(function(tagtodos,tags){
				var vtags = [];
				for(var i = 0; i < tagtodos.length; i++){
					if(todo.id == tagtodos[i].todoId){
						for(var j=0; j<tags.length;j++){
							if(tags[j].id == tagtodos[i].tagId){
								vtags.push(tags[j]);
								break;
							}
						}
					}
				}
				var tagItems = [];
				for(var i = 0; i < tags.length; i++){
					tagItems.push({value:tags[i].id,label:tags[i].name});
				}
				
				c.tagItems = tagItems;
				todo.tags = vtags;
				c.todo = todo;
				var $e = $(Handlebars.compile($("#tmpl-todoApp_TodoUpdate").html())(todo));
				dfd.resolve($e);
			});
		});
		
		return dfd.promise();
	}
	
	todoApp_TodoUpdate.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		var $mainScreen = $e.closest(".todoApp_mainScreen");
		
		//load status flip item
		var statusValue = c.todo.status == 0 ? false : true;
		var $statusItem = $e.find(".todoPropItem.statusItem");
		brite.display("todoApp_FlipSwitch",{defaultValue:statusValue,mode:"single"},{parent:$e.find(".flipItem.status")}).done(function(flipSwitch){
			flipSwitch.onChange(function(value){
				var obj = {};
				obj.id = c.todo.id;
				obj.status = value ? 1 : 0;
				brite.dm.update("todoApp_todo",obj.id,obj).done(function(){
					$mainScreen.trigger("completeChange");
					resetItem.call(c,$statusItem,"status",obj.status);
				});
			});
		});
		
		//load end date flip item
		var $endDateItem = $e.find(".todoPropItem.endDate");
		var endDateValue = c.todo.endDate ? true : false;
		brite.display("todoApp_FlipSwitch",{defaultValue:endDateValue,mode:"single"},{parent:$e.find(".flipItem.endDate")}).done(function(flipSwitch){
			flipSwitch.onChange(function(value){
				$endDateItem.toggleClass("needOpen");
				if(value){
					endDate = todoApp.formatDate(new Date(Date.parse($e.find(".todoPropItem.dateItem.startDate").attr("data-value"))));
					$endDateItem.attr("data-value",endDate);
					$endDateItem.find(".item-value .label").html(endDate);
				}else{
					$endDateItem.attr("data-value","");
					$endDateItem.find(".item-value .label").html("No End Date");
				}
				var obj = getValues.call(c);
				brite.dm.update("todoApp_todo",obj.id,obj).done(function(){
				});
			});
		});
		
		$e.delegate(".todoPropItem.dateItem","click",function(){
			var $item = $(this);
			if($item.hasClass("startDate") || $endDateItem.hasClass("needOpen")){
				brite.display("todoApp_DateSelect",{date:todoApp.parseDate($item.attr("data-value"))}).done(function(dateSelect){
					dateSelect.onDone(function(returnDate){
						var startDate = null;
						var endDate = null;
						if($item.hasClass("startDate")){
							endDate = new Date(Date.parse($e.find(".todoPropItem.dateItem.endDate").attr("data-value")));
							startDate = returnDate;
						}else{
							endDate = returnDate;
							startDate = new Date(Date.parse($e.find(".todoPropItem.dateItem.startDate").attr("data-value")));
						}
						
						if(testStartAndEndDate(startDate,endDate)){
							var str = todoApp.formatDate(returnDate)
							$item.attr("data-value",str);
							$item.data("value",returnDate);
							$item.find(".item-value .label").html(str);
							var obj = getValues.call(c);
							console.log(obj);
							brite.dm.update("todoApp_todo",obj.id,obj).done(function(){
							});
						}else{
							brite.display("todoApp_DialogPrompt",{content:"Start date must be ealier than end date."});
						}
							
							
					});
				});
			}
		});
		
		$e.find(".todoPropItem.repeatItem").click(function(){
			var $item = $(this);
			brite.display("todoApp_ListSelect",{
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
					brite.dm.update("todoApp_todo",obj.id,obj).done(function(){
					});
				});
			});
		});
		
		$e.find(".todoPropItem.tagsItem").click(function(){
			var $item = $(this);
			var defaultValue = [];
			if($item.attr("data-value") != ""){
				defaultValue = $item.attr("data-value").split(",");
			}
			
			brite.display("todoApp_ListSelect",{
				title:"Tags",
				single:false,
				defaultValue:defaultValue,
				items:c.tagItems
			}).done(function(listSelect){
				listSelect.onDone(function(value,label){
					var valueStr = "";
					var labelStr = "";
					var tagtodos = [];
					for(var i = 0; i<value.length; i++){
						valueStr += value[i];
						labelStr += label[i];
						if(i!=value.length -1){
							valueStr += ",";
							labelStr += ",";
						}
						tagtodos.push({todoId:c.todo.id,tagId:value[i]});
					}
					
					brite.dm.list("todoApp_tagtodo",{equal:{todoId:c.todo.id}}).done(function(objs){
						var ids = [];
						for(var i = 0; i<objs.length; i++){
							ids.push(objs[i].id);
						}
						brite.dm.invoke("removeAll","todoApp_tagtodo",ids).done(function(){
							brite.dm.invoke("createAll","todoApp_tagtodo",tagtodos);
						});
					});
					
					$item.attr("data-value",valueStr);
					$item.find(".item-value").html(labelStr);
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
		obj.repeat = $e.find(".todoPropItem.repeatItem").attr("data-value");
		obj.endDate = $e.find(".todoPropItem.dateItem.endDate").attr("data-value");
		obj.startDate = $e.find(".todoPropItem.dateItem.startDate").attr("data-value");
		return obj;
	}
	
	resetItem = function($item,name,newValue){
		var $e = this.$element;
		var c = this;
		if(name == "status"){
			var $text = $item.find(".label");
			$text.html(todoApp.getConstant('TodoStatus',newValue));
		}
	}
	
	testStartAndEndDate = function(startDate,endDate){
		if(startDate * 1 > endDate * 1){
			return false;
		}
		return true;
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("todoApp_TodoUpdate",{
        parent: ".rightContainer",
        loadTemplate:true,
        emptyParent:true,
        transition:"slideLeft"
    },function(){
        return new todoApp_TodoUpdate();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);