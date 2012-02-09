
(function($) {

	function SQLiteDao(tableName,identity,tableDefine) {
		
		this.init(tableName,identity,tableDefine);
	}

	SQLiteDao.prototype.init = function(tableName,identity,tableDefine) {
		_SQLiteDb.transaction(
			function( transaction ){
 
				var createSql = "CREATE TABLE IF NOT EXISTS "+tableName+" (" +
						identity+" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT" ;
				var dlen = tableDefine.length;
				for(var i=0;i<dlen;i++){
					var field = tableDefine[i];
					createSql+=","+field.column+" "+field.dtype;
//					if(field.mapToEntry && field.mapToEntry!=''){
//						createSql+=","+field.column+"_mapToEntry TEXT";
//					}
				}
				createSql+=");";
				//alert(createSql);
				transaction.executeSql(createSql);
 
			}
		);
		this._identity = identity;
		this._tableName = tableName;
		return this;
	}

	// ------ DAO Interface Implementation ------ //
	SQLiteDao.prototype.getIdName = function(tableName) {
		return this._identity||"id";
	}

	SQLiteDao.prototype.get = function(objectType, id) {
		var dao = this;
		var dfd = $.Deferred();
		if(id){
			var sql = "SELECT * FROM " + dao._tableName + " where "+dao.getIdName(dao._tableName) +"="+id;
			_SQLiteDb.transaction(
					function( transaction ){
						transaction.executeSql(sql,[],function( transaction, results ){
								var row = results.rows.item(0);
								dfd.resolve(row); 			
							}
						);
	 
					}
				);
		}else{
			dfd.resolve(null);
		}
		
		return dfd.promise();
	}

	SQLiteDao.prototype.list = function(objectType, opts) {
		var dao = this;
		var resultSet ;

		var dfd = $.Deferred();
		_SQLiteDb.transaction(
				function( transaction ){
 					var selSql = "SELECT " +
								"* " +
							"FROM " +
								dao._tableName +
							" where 1=1 ";
							if(opts){
								var filters =  opts;
								for (var k in filters)  
							      {  
							  			selSql+=" and "+k+"='"+filters[k]+"'";
							      } 
							}
//							alert(selSql);
					transaction.executeSql(
						(
							selSql
						),
						[],
						function( transaction, results ){
							dfd.resolve(parseRows2Json(results.rows));
							
						}
					);
					
 
				}
			);
		return dfd.promise();
	}

	SQLiteDao.prototype.create = function(objectType, data) {
		var dao = this;
		var newId;
		var insSql = "INSERT INTO "+dao._tableName+" (" ;
		var idx = 0;
		var values="";
		var valus=[];
		for (var k in data)  
	      {  
	      	if(idx>0){
	      		insSql+=",";
	      		values+=",";
	      	}
	  			insSql+=k;
	  			values+="?";
	  			valus[idx]=data[k];
	  			idx++;
	      } 
			
		insSql+=	" ) VALUES (" +
					values+
				");";
//				alert(insSql);
		var dfd = $.Deferred();
		_SQLiteDb.transaction(function(transaction){
				transaction.executeSql(insSql,valus,function( transaction, results ){
					dfd.resolve(results.insertId);
				});
		});
		return dfd.promise();
	}

	SQLiteDao.prototype.update = function(objectType, id, data) {
		var dao = this;
		var uptSql = "UPDATE "+dao._tableName+" set " ;
		var idx = 0;
		for (var k in data)  
	      {  
	      	if(idx>0){
	      		uptSql+=",";
	      	}
	  			uptSql+=k+"='"+data[k]+"'";
	  			idx++;
	      } 
			
		uptSql+=" where "+dao.getIdName(dao._tableName)+"="+id;
//		alert(uptSql);
		var dfd = $.Deferred();
		_SQLiteDb.transaction(
			function( transaction ){
				transaction.executeSql(
					(
						uptSql
					),
					[]
					,
					function( transaction, results ){
						dfd.resolve(id);
					}
				);
		});
		return dfd.promise();	
	}

	SQLiteDao.prototype.remove = function(objectType, ids) {
		var dao = this;
		var dfd = $.Deferred();
		_SQLiteDb.transaction(
				function( transaction ){
 
					var delSql = "DELETE FROM " +dao._tableName +" where ";
					var condition = "1 != 1";
					if(ids){
						if($.isArray(ids) && ids.length > 0){
							condition = dao.getIdName(dao._tableName)+" in (";
							for(var i=0; i<ids.length; i++){
								condition += "'"+ids[i]+"'";
								if(i != ids.length -1 ){
									condition += ",";
								}
							}
							condition += ")";
						}else if(!$.isArray(ids)){
							condition = dao.getIdName(dao._tableName)+" = '"+ids+"'";
						}
					}
					delSql = delSql + condition;
					transaction.executeSql(
						(
							delSql
						),
						[]
						,
						function(transaction, results){
							dfd.resolve(ids);
						}
					);
 
				}
			);	
			return dfd.promise();

	}
	brite.dao.SQLiteDao = SQLiteDao;

	function parseRows2Json(rows){
		var json = [];
		var rlen = rows.length;
		for(var i=0;i<rlen;i++){
			json.push(rows.item(i));
		}
		return json;
	}
})(jQuery);