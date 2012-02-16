(function($){

	/**
	 * Create a LocalStorageDao type 
	 * 
	 * @param {String} tableName. create a table for dao with the tableName.
	 * @param {String} identity. the primary key of the table.
	 * 
	 */
	function LocalStorageDao(tableName, identity){
		this.init(tableName, identity);
	}

	LocalStorageDao.prototype.init = function(tableName, identity, tableDefine){
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
	LocalStorageDao.prototype.getIdName = function(objectType){
		return this._identity || "id";
	}

	
	/**
	 * DAO Interface: Return a deferred object for this objectType and id.
	 * @param {String} objectType
	 * @param {Integer} id
	 * @return
	 */
	LocalStorageDao.prototype.get = function(objectType, id){
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
	 *           opts.match     {Object} add condition in the where clause.
	 *           opts.orderBy   {String}
	 *           opts.orderType {String} "asc" or "desc"
	 */
	LocalStorageDao.prototype.list = function(objectType, opts){
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
	LocalStorageDao.prototype.create = function(objectType, data){
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
	LocalStorageDao.prototype.update = function(objectType, id, data){
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
	LocalStorageDao.prototype.remove = function(objectType, id){
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
	LocalStorageDao.prototype.removeAll = function(objectType, ids){
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
	LocalStorageDao.prototype.createAll = function(objectType, objs){
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
	
	// -------- /Custom Interface Implementation --------- //
	
	// --------- /DAO Interface Implementation --------- //
	brite.dao.LocalStorageDao = LocalStorageDao;

	function getData() {
		//first init
		if (this._data == null) {
			if (localStorage) {
				var localStorageKey = this._tableName;
				var dataString = localStorage.getItem(localStorageKey);
				if (dataString) {
					this._data = JSON.parse(dataString);
				} else {
					this._data = [];
				}
			} else {
				this._data = [];
			}
		}

		return this._data;
	}

	function saveData(data) {
		if (typeof data == 'undefined') {
			data = this._data;
		} else {
			this._data = data;
		}
		// if support localStorage
		if (localStorage) {
			var localStorageKey = this._tableName;
			if (data != null) {
				localStorage.removeItem(localStorageKey);
				localStorage.setItem(localStorageKey, JSON.stringify(data));
			}
		}
	}

	/**
	 * private function, make the id auto increase
	 */
	function getSeq() {
		var sequence = 1;
		if (localStorage) {
			var localStorageKey = this._tableName + "_SEQ";
			var dataString = localStorage.getItem(localStorageKey);
			if (dataString) {
				sequence = parseInt(dataString);
				localStorage.setItem(localStorageKey,sequence+1);
			}
		}

		return sequence;
	}
		
})(jQuery);