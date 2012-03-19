var _SQLiteDb;
(function($){
	if(todoApp.isChrome || todoApp.isSafari){
		var databaseOptions = {
				fileName: "sqlitetododemo",
				version: "1.0",
				displayName: "SQLite Todo Demo",
				maxSize: 1024
		};
		
		_SQLiteDb = openDatabase(
				databaseOptions.fileName,
				databaseOptions.version,
				databaseOptions.displayName,
				databaseOptions.maxSize
		);		
		brite.registerDao("todoApp_tag",new brite.dao.SQLiteDao("todoApp_Tags","id",[{column:'name',dtype:'TEXT'}]));
		brite.registerDao("todoApp_tagtodo",new brite.dao.SQLiteDao("todoApp_TagTodos","id",[{column:'tagId',dtype:'INTEGER'},{column:'todoId',dtype:'INTEGER'}]));	
		brite.registerDao("todoApp_todo",new brite.dao.SQLiteDao("todoApp_Todos","id",[{column:'taskName',dtype:'TEXT'},{column:'createDate',dtype:'TEXT'},{column:'startDate',dtype:'TEXT'},{column:'endDate',dtype:'TEXT'},{column:'status',dtype:'INTEGER'},{column:'repeat',dtype:'INTEGER'},{column:'imageId',dtype:'INTEGER'}]));
		brite.registerDao("todoApp_image",new brite.dao.SQLiteDao("todoApp_Image","id",[{column:'type',dtype:'TEXT'},{column:'url',dtype:'TEXT'},{column:'ext',dtype:'TEXT'}]));
	}else if(todoApp.isFirefox || todoApp.isIE){
		brite.registerDao("todoApp_tag",new brite.dao.InMemoryDao("todoApp_Tags","id"));
		brite.registerDao("todoApp_tagtodo",new brite.dao.InMemoryDao("todoApp_TagTodos","id"));	
		brite.registerDao("todoApp_todo",new brite.dao.InMemoryDao("todoApp_Todos","id"));
		brite.registerDao("todoApp_image",new brite.dao.InMemoryDao("todoApp_Image","id"));
	}
	
	
	
})(jQuery);

