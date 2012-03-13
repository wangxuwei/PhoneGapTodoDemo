(function($){

	/**
	 * Create a InMemoryDao type 
	 * 
	 * @param {String} tableName. create a table for dao with the tableName.
	 * @param {String} identity. the primary key of the table.
	 * 
	 */
	function InMemoryDao(tableName, identity){
		this.init(tableName, identity);
	}

	InMemoryDao.prototype.init = function(tableName, identity, tableDefine){
		this._identity = identity;
		this._tableName = tableName;
		this._data = getData.call(this);
	}

	// --------- DAO Interface Implementation --------- //
	/**
	 * DAO Interface: Return the property ID name
	 * @param {string} the objectType
	 * @return the id (this is not deferred), default value is "id"
	 * @throws error if dao cannot be found
	 */
	InMemoryDao.prototype.getIdName = function(objectType){
		return this._identity || "id";
	}

	
	/**
	 * DAO Interface: Return a deferred object for this objectType and id.
	 * @param {String} objectType
	 * @param {Integer} id
	 * @return
	 */
	InMemoryDao.prototype.get = function(objectType, id){
		var dao = this;
		var dfd = $.Deferred();
		if(id){
			var results = getData.call(this);
			for(var i = 0; i < results.length; i++){
				if(id == results[i].id){
					dfd.resolve(results[i]);
					break;
				}
			}
		}else{
			dfd.resolve(null);
		}

		return dfd.promise();
	}

	
	/**
	 * DAO Interface: Return a deferred object for this objectType and options
	 * @param {String} objectType
	 * @param {Object} opts 
	 *           opts.pageIndex {Number} Index of the page, starting at 0.
	 *           opts.pageSize  {Number} Size of the page
	 *           opts.match     {Object} add condition 'like' in the where clause.
	 *           opts.equal     {Object} add condition '=' the where clause.
	 *           opts.ids     	{Object} add condition 'id in (...)' the where clause.
	 *           opts.orderBy   {String}
	 *           opts.orderType {String} "asc" or "desc"
	 */
	InMemoryDao.prototype.list = function(objectType, opts){
		var dao = this;
		var resultSet;

		var dfd = $.Deferred();
		var results = getData.call(this);
		var newResults = [];
		if(opts){
			for(var i = 0; i < results.length; i++){
				var obj = results[i];
				var needPush = true;
				if(opts.match){
					var filters = opts.match;
					for(var k in filters){
						if(results[k].indexOf(filters[k]) == -1){
							needPush = false;
						}
					}
				}
				
				if(opts.equal){
					var filters = opts.equal;
					for(var k in filters){
						if(results[k] == filters[k]){
							needPush = false;
						}
					}
				}
				
				if(opts.ids && $.isArray(opts.ids)){
					var ids = opts.ids;
					if($.inArray(obj.id,opts.ids) == -1){
						needPush = false;
					}
				}
				
				if(needPush){
					newResults.push(obj); 
				}
			}
		}else{
			newResults = results;
		}
		
		if(opts && opts.orderBy){
			newResults.sort(function(a,b){
				var type = true;
				if(opts.orderType && opts.orderType.toLowerCase() == "desc"){
					type = false;
				}
				var value = a[opts.orderBy] >= b[opts.orderBy] ? 1 : -1;
				if(!type){
					value = value * -1;
				}
				return  value;
			});
		}
		
		if(opts && (opts.pageIndex || opts.pageIndex == 0)){
			if(opts.pageSize){
				newResults = newResults.slice(opts.pageIndex * opts.pageSize,(opts.pageIndex + 1) * opts.pageSize);
			}else if(opts.pageSize != 0){
				newResults = newResults.slice(opts.pageIndex * opts.pageSize);
			}
		}
		
		dfd.resolve(newResults);
		return dfd.promise();
	}

	
	/**
	 * DAO Interface: Create a new instance of the object for a give objectType and data. <br />
	 *
	 * The DAO resolve with the newly created data.
	 *
	 * @param {String} objectType
	 * @param {Object} data
	 */
	InMemoryDao.prototype.create = function(objectType, data){
		var dao = this;
		var dfd = $.Deferred();
		var results = getData.call(this);
		var newObj = $.extend({},data);
		newObj.id = getSeq.call(this);
		results.push(newObj);
		saveData.call(this,results);
		dfd.resolve(newObj);
		return dfd.promise();
	}

	/**
	 * DAO Interface: update a existing id with a set of property/value data.
	 *
	 * The DAO resolve with the updated data.
	 *
	 * @param {String} objectType
	 * @param {Integer} id
	 * @param {Object} data
	 */
	InMemoryDao.prototype.update = function(objectType, id, data){
		var dao = this;
		var dfd = $.Deferred();
		var newObj = null;
		if(id){
			var index = 0;
			var results = getData.call(this);
			for(var i = 0; i < results.length; i++){
				if(id == results[i].id){
					index = i;
					newObj = $.extend({},results[i],data);
					break;
				}
			}
			results.splice(i,1,newObj);
			saveData.call(this,results);
		}
		
		dfd.resolve(newObj);

		return dfd.promise();
	}

	/**
	 * DAO Interface: remove an instance of objectType for a given type and id.
	 *
	 * The DAO resolve with the id.
	 * 
	 * @param {String} objectType
	 * @param {Integer} id
	 * 
	 */
	InMemoryDao.prototype.remove = function(objectType, id){
		var dao = this;
		var dfd = $.Deferred();
		if(id){
			var index = 0;
			var results = getData.call(this);
			for(var i = 0; i < results.length; i++){
				if(id == results[i].id){
					index = i;
					break;
				}
			}
			results.splice(i,1);
			saveData.call(this,results);
		}
		
		dfd.resolve(id);

		return dfd.promise();

	}
	
	// -------- Custom Interface Implementation --------- //
	/**
	 * DAO Interface: remove an instance of objectType for a given type and ids.
	 *
	 * The DAO resolve with the ids.
	 * 
	 * @param {String} objectType
	 * @param {Array} ids
	 * 
	 */
	InMemoryDao.prototype.removeAll = function(objectType, ids){
		var dao = this;
		var dfd = $.Deferred();
		if(ids && ids.length > 0){
			var index = 0;
			var results = getData.call(this);
			var newArray = [];
			for(var i = 0; i < results.length; i++){
				if(!$.inArray(results[i].id,ids)){
					newArray.push(results[i]);
				}
			}
			saveData.call(this,newArray);
		}
		
		dfd.resolve(ids);

		return dfd.promise();

	}
	
	/**
	 * DAO Interface: Create instances of the object for a give objectType and objs. <br />
	 *
	 * The DAO resolve with the newly created data.
	 *
	 * @param {String} objectType
	 * @param {Array} array of data
	 */
	InMemoryDao.prototype.createAll = function(objectType, objs){
		var dao = this;
		var dfd = $.Deferred();
		var results = getData.call(this);
		var newObjArray = [];
		for(var i = 0; i < objs.length; i++){
			var data = objs[i];
			var newObj = $.extend({},data);
			newObj.id = getSeq.call(this);
			newObjArray.push(newObj);
			results.push(newObj);
		}
		
		saveData.call(this,results);
		dfd.resolve(newObjArray);
		return dfd.promise();
	}
	
	/**
	 * DAO Interface: Return a deferred object for this objectType and options
	 * @param {String} objectType
	 * @param {Object} opts 
	 *           opts.pageIndex {Number} Index of the page, starting at 0.
	 *           opts.pageSize  {Number} Size of the page
	 *           opts.match     {Object} add condition 'like' in the where clause.
	 *           opts.equal     {Object} add condition '=' the where clause.
	 *           opts.ids     	{Array}  add condition 'id in (...)' the where clause.
	 *           opts.orderBy   {String}
	 *           opts.orderType {String} "asc" or "desc"
	 */
	InMemoryDao.prototype.getCount = function(objectType, opts){
		var dao = this;
		var resultSet;

		var dfd = $.Deferred();
		this.list(objectType, opts).done(function(results){
			dfd.resolve(results.length);
		});
		return dfd.promise();
	}
	
	// -------- /Custom Interface Implementation --------- //
	
	// --------- /DAO Interface Implementation --------- //
	brite.dao.InMemoryDao = InMemoryDao;

	function getData() {
		//first init
		if(!this._data){
			this._data = [];
		}

		return this._data;
	}

	function saveData(data) {
		if (typeof data == 'undefined') {
			data = this._data;
		} else {
			this._data = data;
		}
	}

	/**
	 * private function, make the id auto increase
	 */
	function getSeq() {
		if(!this._sequence){
			this._sequence = 1;
		}else{
			this._sequence++;
		}
		return this._sequence;
	}
		
})(jQuery);