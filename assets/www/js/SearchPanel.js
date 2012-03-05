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
			$e = $(Handlebars.compile($("#tmpl-SearchPanel").html())({list:list}));
			dfd.resolve($e);
		});
		return dfd.promise();
	}
	
	SearchPanel.prototype.postDisplay = function(data,config){
		var $e = this.$element;
		var c = this;
		
		$e.find(".btn.search").click(function(){
			var name = $e.find("input[name='searchName']").val();
			search.call(this,name).done(function(list){
				var $dataList = $e.find(".searchList .dataList");
				$dataList.empty();
				for(var i = 0; i < list.length; i++){
					var $item = $(Handlebars.compile($("#tmpl-SearchPanel-item").html())(list[i]));
					$dataList.append($item);
				}
			});
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
		});
		return dfd.promise();
	}
	
	function getName(){
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