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
		brite.registerDao("tag",new brite.dao.SQLiteDao("Tags","id",[{column:'name',dtype:'TEXT'}]));
		brite.registerDao("tagtodo",new brite.dao.SQLiteDao("TagTodos","id",[{column:'tagId',dtype:'INTEGER'},{column:'todoId',dtype:'INTEGER'}]));	
		brite.registerDao("todo",new brite.dao.SQLiteDao("Todos","id",[{column:'taskName',dtype:'TEXT'},{column:'createDate',dtype:'TEXT'},{column:'startDate',dtype:'TEXT'},{column:'endDate',dtype:'TEXT'},{column:'status',dtype:'INTEGER'},{column:'repeat',dtype:'INTEGER'},{column:'imageId',dtype:'INTEGER'}]));
		brite.registerDao("image",new brite.dao.SQLiteDao("Image","id",[{column:'type',dtype:'TEXT'},{column:'url',dtype:'TEXT'},{column:'ext',dtype:'TEXT'}]));
	}else if(todoApp.isFirefox || todoApp.isIE){
		brite.registerDao("tag",new brite.dao.InMemoryDao("Tags","id"));
		brite.registerDao("tagtodo",new brite.dao.InMemoryDao("TagTodos","id"));	
		brite.registerDao("todo",new brite.dao.InMemoryDao("Todos","id"));
		brite.registerDao("image",new brite.dao.InMemoryDao("Image","id"));
	}
	
	
	
})(jQuery);

