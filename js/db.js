    var lk = {};
    lk.webdb = {};
    lk.webdb.db = null;
  
    lk.webdb.open = function() {
      var dbSize = 50 * 1024 * 1024; // 10MB
      lk.webdb.db = openDatabase("SSW4", "1.0", "SEO SERP Workbench", dbSize);
    }
  
    lk.webdb.createTable = function() {
      var db = lk.webdb.db;
      db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS items(ID INTEGER PRIMARY KEY ASC, prj INTEGER , day DATETIME , engine TEXT, query TEXT , url TEXT , position INTEGER )", []);
		tx.executeSql("CREATE UNIQUE INDEX idx1 ON items (prj , day, engine, query, url )", []);
      });
    }
	
    lk.webdb.onError = function(tx, e) {
	  //chrome.extension.getBackgroundPage().console.log("There has been an error: " + e.message);
    }
  
    lk.webdb.onSuccess = function(tx, r) {
		// ?
		//console.log("success");
    }
	
    lk.webdb.addItem = function(engine,query,url,position,customdate,prj,callback) {
	  if ( prj == undefined ) prj = chrome.extension.getBackgroundPage().localStorage.getItem("prjid");
      var db = lk.webdb.db;
      db.transaction(function(tx){
		if ( customdate == undefined ) {
			var day = new Date();
			var d = isoDate(day);
		} else {
			d = customdate;
		}
		
        tx.executeSql("INSERT or REPLACE INTO items(prj,day,engine,query,url,position) VALUES (?,?,?,?,?,?)", 
            [prj,d,engine,query,url,position],callback,lk.webdb.onError);
       });
    }

    lk.webdb.getAllItemsList = function( callback ) {
      var db = lk.webdb.db;
      db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM items ORDER BY engine,ID DESC LIMIT 500", [], callback , lk.webdb.onError);
      });
    }

    lk.webdb.deleteItem = function(id,q,s,callback) {
      var db = lk.webdb.db;
      db.transaction(function(tx){
        tx.executeSql("DELETE FROM items WHERE ID=?", [id],      
            function() {
				lk.webdb.getItemsList(q , s , callback);
            }, 
            lk.webdb.onError);
        });
    }

    function initdb(callback) {
	  //console.log("@initdb",1);
	  var name="prj1";
      lk.webdb.open();
	  //console.log("@initdb",2);
      lk.webdb.createTable();
	  //console.log("@initdb",3);
    }

    lk.webdb.listQueries = function( query,callback ) {
      var db = lk.webdb.db;
	  var q;
      db.transaction(function(tx) {
	    if ( query == "" )
			q = "SELECT query, count(query) as tot FROM items WHERE prj="+chrome.extension.getBackgroundPage().localStorage.getItem("prjid")+" GROUP BY query ORDER BY query";
		else
			q = "SELECT query, count(query) as tot FROM items WHERE prj="+chrome.extension.getBackgroundPage().localStorage.getItem("prjid")+" AND query LIKE '"+query+"' GROUP BY query ORDER BY query";
		//chrome.extension.getBackgroundPage().console.log(q);
		tx.executeSql(q, [], callback , lk.webdb.onError);
      });
    }

    lk.webdb.sitesByKeyword = function( query,site,callback ) {
	  //console.log("@lk.webdb.sitesByKeyword",site);
      var db = lk.webdb.db;
	  var q;
      db.transaction(function(tx) {
		q = "SELECT day,query, url, position FROM items WHERE prj="+chrome.extension.getBackgroundPage().localStorage.getItem("prjid")+" AND query LIKE '"+query+"' " + (site!="" ? " AND url LIKE '%"+site+"%'" : "") +" ORDER BY day";
		//chrome.extension.getBackgroundPage().console.log(q);
		tx.executeSql(q, [], callback , lk.webdb.onError);
      });
    }
	
    lk.webdb.getItemsList = function( query , site , callback ) {
      var db = lk.webdb.db;
	  var q;
      var where = "";
	  db.transaction(function(tx) {
	    if ( query != "" ) where += " AND query LIKE '"+query+"'";
	    if ( site != "" ) where += " AND url LIKE '"+site+"'";
		q = "SELECT * FROM items WHERE prj="+chrome.extension.getBackgroundPage().localStorage.getItem("prjid")+" " + where + " ORDER BY engine,ID DESC LIMIT 500";
        tx.executeSql(q, [], callback , lk.webdb.onError);
      });
    }
	
    lk.webdb.query = function( q , callback ) {
      var db = lk.webdb.db;
	  db.transaction(function(tx) {
		//chrome.extension.getBackgroundPage().console.log(q);
        tx.executeSql(q, [], callback , lk.webdb.onError);
      });
    }