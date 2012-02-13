var _SQLiteDb;
(function($){
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
	brite.registerDao("todo",new brite.dao.SQLiteDao("Todos","id",[{column:'taskName',dtype:'TEXT'},{column:'startDate',dtype:'TEXT'},{column:'endDate',dtype:'TEXT'},{column:'status',dtype:'TEXT'},{column:'imageId',dtype:'INTEGER'}]));
	brite.registerDao("image",new brite.dao.SQLiteDao("Image","id",[{column:'type',dtype:'TEXT'},{column:'url',dtype:'TEXT'},{column:'ext',dtype:'TEXT'}]));
	
})(jQuery);

