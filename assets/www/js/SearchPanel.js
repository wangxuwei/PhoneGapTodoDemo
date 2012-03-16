(function($){

	function SearchPanel(){};
	
	// --------- Component Interface Implementation ---------- //
	SearchPanel.prototype.build = function(data,config){
		var dfd = $.Deferred();
		var opts = {};
		var name;
		if(data && data.name){
			name = data.name;
		}
		search.call(this,name).done(function(list){
			var $e = null;
			$e = $(Handlebars.compile($("#tmpl-SearchPanel").html())({list:list,name:name}));
			dfd.resolve($e);
		});
		return dfd.promise();
	}
	
	SearchPanel.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.find("input[name='searchName']").keyup(function(e){
			if(e.which == 13){
				var name = getName.call(c);
				search.call(c,name).done(function(list){
					searchCallback.call(c,list);
				});
			}
		});
		
		$e.delegate(".searchList .item","click",function(){
			var $this = $(this);
			var objType = $this.bObjRef();
			if(objType.type == 'Todo'){
				brite.display("TodoUpdate",{id:objType.id});
			}else{
				brite.display("DialogTag",{id:objType.id}).done(function(dialogTag){
					dialogTag.onAnswerOkCallback(function(){
						var name = getName.call(c);
						brite.display("SearchPanel",{name:name});
					});
				});
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //
	// --------- /Component Public API --------- //
	
	
	// --------- Component Private API --------- //
	search = function(name){
		var dfd = $.Deferred();
		if(name == ""){
			name = null;
		}
		$.when(brite.dm.list("todo",{match:{taskName:name}}),brite.dm.list("tag",{match:{name:name}})).done(function(todos,tags){
			var list = [];
			for(var i = 0; i < todos.length; i++){
				todos[i].type = "Todo";
			}
			for(var i = 0; i < tags.length; i++){
				tags[i].type = "Tag";
			}
			list = list.concat(todos,tags);
			dfd.resolve(list);
			$(document).trigger("currentHistoryDataChange",{name:name});
		});
		return dfd.promise();
	}
	
	searchCallback = function(list){
		var $e = this.$element;
		var $searchList = $e.find(".searchList");
		$searchList.empty();
		if(list.length > 0){
			var $dataList = $(Handlebars.compile($("#tmpl-SearchPanel-dataList").html())({list:list}));
			$searchList.append($dataList);
		}else{
			var $item = $(Handlebars.compile($("#tmpl-SearchPanel-emptyList").html())());
			$searchList.append($item);
		}
	}
	
	getName = function(){
		var $e = this.$element;
		var name = $e.find("input[name='searchName']").val();
		return name;
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("SearchPanel",{
        parent: ".rightContainer",
        loadTemplate:true,
        emptyParent:true
    },function(){
        return new SearchPanel();
    }); 
	// --------- /Component Registration --------- //
	
})(jQuery);