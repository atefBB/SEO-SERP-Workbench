var bg = chrome.extension.getBackgroundPage();
var totItemsAdded;
var nowItemsAdded;
var latestQuery = "";

/* new */

var reports_graph;

function actionSiteRemoveAll(){
	var r=confirm("Are you sure to remove all sites ?");
	if (r==true) {
		bg.localStorage.setItem("prj_urls_" + bg.localStorage.getItem("prjid") , "" );
		list_sites();
	}
}

function actionSiteImport(){

	var rui = "<h3>Import</h3>";
	rui += "<p>Type here the list of sites to be imported. One per line, or if you prefer comma or space separated.</p>";
	rui += "<textarea id='imported' style='width:95%; height:150px;'></textarea>";
	rui += "<input type='submit' class='xbutton' value=' proceed ' id='sitesdoimport' />";
	rui += "&nbsp;&nbsp;&nbsp;<input type='submit' class='xbutton' value='cancel' id='request_cancel' />";
	
	UI_request(rui,600,240,'#imported');
	
	
	$("#sitesdoimport").click(function() {
		var data = $("#imported").val();
		if ( data != "" ) {
		
			data = data.replace(/\r/g,"").replace(/\n/g,",").replace(/ /g,",").replace(/;/g,",");
			temp = data.split(","); 
			console.log("split",temp);
			
			pleaseWait("importing...");
			
			for (var i = 0; i < temp.length; i++) {
				//console.log( "import" , temp[i] );
				siteAdd(temp[i]);
			}
			
			pleaseWait("");
			list_sites();
			$("#overlay").fadeOut("fast");
		
		}
	});

}

function actionSiteEdit(txt){
	var r=prompt("Site editing",txt);
	if (r!=null && r!="") {
		siteDelete(txt);
		siteAdd(r);
		list_sites();
	}	
}

function actionSiteAdd(){
	var r=prompt("Please type the new site matching text","www.site.com");
	if (r!=null && r!="") {
		if ( siteAdd(r) ) {
			list_sites();
		} else {
			alert("Already used");
		}
	}
}

function siteAdd(r){
	var sites = get_sites(false);
	
	var dupes = false;
	for (var i = 0; i < sites.length; i++) {
		if ( r == sites[i] ) {
			dupes = true;
		}
	}
	
	if ( dupes == true ) {
		return false;
	} else {
		var allsites = sites.join(",");
		allsites += "," + r;
		bg.localStorage.setItem("prj_urls_" + bg.localStorage.getItem("prjid") , allsites );
		return true;
	}
}

function actionSiteDelete(txt){
	var r=confirm("Are you sure to delete '" + txt + "' ?");
	if (r==true) {
		siteDelete(txt);
		list_sites();
	}
}

function get_sites(sorted) {
	var u = bg.localStorage.getItem("prj_urls_" + bg.localStorage.getItem("prjid") );
	console.log("@get_sites",u);
	if ( u != null ) {
		sites = u.split(",");
		if (sorted) sites.sort();
		return sites;
	} else {
		return [];
	}
}

function siteDelete(txt){
	var sites = get_sites(false);
	
	for (var i = 0; i < sites.length; i++) {
		if ( txt == sites[i] ) {
			sites.splice(i,1);
			allsites = sites.join(",");
			bg.localStorage.setItem("prj_urls_" + bg.localStorage.getItem("prjid") , allsites );
			// break ?
		}
	}
}

function list_sitesEvents(){
	$(".siteEdit").click(function(){
		var id = $(this).attr('rel');
		actionSiteEdit(id);
	});
	
	$(".siteDel").click(function(){
		var id = $(this).attr('rel');
		actionSiteDelete(id);
	});
	
	$("#newSite").click(function(){
		actionSiteAdd(true);
	});

	$("#importSites").click(function(){
		actionSiteImport(true);
	});

	$("#removeAllSites").click(function(){
		actionSiteRemoveAll(true);
	});
	
}

function list_sites() {
	var sites = get_sites(true);
	var out;
	out = "<p><input type='submit' class='xbutton' value='add new' id='newSite' /> <input type='submit' class='xbutton' value='import' id='importSites' /> <input type='submit' class='xbutton' value='remove all' id='removeAllSites' /></p>";
	
	if ( sites ) {
		out += "<table class='list' cellspacing=0 style='width:100%;'>";
		out += "<tr><th colspan=3>URL matching text</th></tr>";
		for (var i in sites) {
			if ( sites[i] != "" ) {
				out += "<tr><td>" + sites[i] + "</td>";
				out += "<td style='width:1%'>" + "<input type='submit' rel='"+sites[i]+"' class='sbutton siteEdit' value='edit' />" + "</td>";
				out += "<td style='width:1%'>" + "<input type='submit' rel='"+sites[i]+"' class='sbutton siteDel' value='X' />" + "</td>";
				out += "</tr>";
			}
		}
		out += "</table>";
	
	} else {
		out += "No sites yet.";
	}

	$("#sitesList").html(out);
	list_sitesEvents();
}


/* old */

function pleaseWait(mex) {
	if ( mex != undefined ) {
		$("#overlayMex").removeClass("request").addClass("message").html( mex );
		$("#overlay").show(0);
	} else {
		$("#overlay").fadeOut("fast");
	}
}

function windowFit() {
	var h = $(window).height();
	$('#pagesList').css({"max-height":(h-102)+"px"});
	$('#queriesList').css({"max-height":(h-102)+"px"});
	$('#optionsList').css({"max-height":(h-76)+"px"});
	$('#projectsList').css({"max-height":(h-76)+"px"});
	$('#sitesList').css({"max-height":(h-76)+"px"});
	$('#resultDiv').css({"max-height":(h-170)+"px"});
	$('#reportsList').css({"max-height":(h- 307 )+"px"});
	
	if ( $("#chart_div").is(":visible") ) {
		//console.log("yES", $(window).width() );
		reports_graph.refresh( {width:$(window).width()-400} );
	} else {
		//console.log("nO");
	}

}

var tmex;

function mexHide(){
	$("#mex").fadeOut("fast");
}

function mex(txt){
	clearTimeout(tmex);
	$("#mex").fadeOut("fast", function() {
		$("#mex").html(txt).fadeIn();
		//tmex=setTimeout("mexHide()",10000);
		tmex=setTimeout(function() { mexHide(); }, 10000);
	});
}

/* info messages */

function addSite(o) {
	var site = $(o).attr('site').trim();
	siteAdd(site);
	$("#r .addsite[site='"+site+"']").hide();
	$("#list_sites").click();
	mex("site "+site+" added");
}

function activateTab(o,panel) {
	if ( panel == "reports_panel" ) {
		// sites selector
		var sites = get_sites(false);
		var out="<option></option>";
		for (var i = 0; i < sites.length; i++) {
			out += "<option>"+sites[i]+"</option>";
		}
		$("#reports_filter_sites").html(out);	
	}


	var h = $(window).height();
	$('#reportsList').css({"max-height":(h- $('#reportsList').offset().top -10 )+"px"});
	$(".rightpanel:not([id='"+panel+"'])").slideUp();
	$("#"+panel).slideDown("normal");
	if (o!=null) {
		$(".bar span").removeClass("on");
		$(o).addClass("on");
	}
}

function init_step3() {

	selectPrj( bg.localStorage.getItem("prjid") );
	
	// UI
	windowFit();

	$(window).resize(function() {
		windowFit();
	});

	$("input[type='text']").each(function() {
		$(this).after("<img src='gfx/clear.png' class='inputClear'>");
	});		

	$(".inputClear").each(function() {
		$(this).click(function() {
			$(this).parent("label").children("input").val('').keyup();
		});
	});
	
	$("#query").focus();
	mex("Welcome to SEO SERP Workbench");

	// APP INIT
	
	lastkeyword = bg.localStorage.getItem("lastkeyword");
	lastsite = bg.localStorage.getItem("prj_urls_" + bg.localStorage.getItem("prjid") )
	
	// va settato quando si crea un prj da zero
	if  ( lastkeyword == undefined || lastsite == undefined ) {
		$("#query").val( "lcd" );
		bg.localStorage.setItem("prj_urls_" + bg.localStorage.getItem("prjid") , "sony,sharp,lg,amazon,wikipedia,bestbuy,engadget,facebook" );
	} else {
		if  ( lastkeyword != undefined ) $("#query").val( lastkeyword );
	}
	
	$("#export_csv b:eq(0)").click(function() {
		var q = $("#keywordfilter_pageslist").val();
		if ( q != "" ) q = "%"+q+"%";
		var s = $("#sitefilter_pageslist").val();
		if ( s != "" ) s = "%"+s+"%";
		
		$("#copyExport ").show();
		$("#export_csv").html("loading...");
		chrome.extension.getBackgroundPage().lk.webdb.getItemsList(q , s , loadItemsExport);

	});
	
	$("#show_tips").click(function() { 
		activateTab(this,"tips_panel");
	});	

	$("#list_queries").click(function() {
		activateTab(this,"queries_panel");
		filter_queries();
	});	
	
	$("#list_results").click(function() {
		activateTab(this,"stats_panel");
		filter_pageslist();
	});			

	$("#list_sites").click(function() {
		activateTab(this,"sites_panel");
		list_sites();
		//chrome.extension.getBackgroundPage().lk.webdb.getItemsList( "SELECT  " , s , sitesList);
	});	

	$("#list_projects").click(function() {
		activateTab(this,"projects_panel");
		chrome.extension.getBackgroundPage().lk.webdb.query( "SELECT prj,count(*) as tot FROM items GROUP BY prj" , projectsList);
	});	

	$("#show_about").click(function() {
		activateTab(this,"about_panel");
		//show_about();
	});	

	$("#show_reports").click(function() {
		activateTab(this,"reports_panel");
	});	
	
	$("#doImport").click(function() {
		bg.lk.webdb.query( "SELECT max(prj) AS tot from items" , importData );
	});

	$("#download_queries").click(function() {
		mex("Downloading file");
		var data = get_tableData("#table_queries",":eq(1),:eq(2)");
		console.log(data);
		saveTxt( "keywords_"+bg.localStorage.getItem("prj_id_"+bg.localStorage.getItem("prjid"))+"_"+fileDate( new Date() )+".csv" , data );
	});
	
	function prjItemAdded() {
		nowItemsAdded ++;
		bg.console.log("import - adding items - "+nowItemsAdded+" of "+totItemsAdded);
		$("#overlayMex").html("adding item "+nowItemsAdded+" of "+totItemsAdded);
		if ( nowItemsAdded == totItemsAdded ) {
			$("#copyImport>textarea").val("");
			$("#list_projects").click();
			$("#overlay").fadeOut("fast");
		}
	}

	
	function importData(tx,rs) {
		var nextid = rs.rows.item(0).tot+1; // continua da questo id

		var t2;
		var data = $("#copyImport>textarea").val();
		var temp = data.split("\n"); 
		var engine = "";
		
		totItemsAdded = 0;
		nowItemsAdded = 0;
		
		//$("#overlayMex").removeClass("request").addClass("message").html("");
		//$("#overlay").show();
		pleaseWait("importing...");
		
		for (var i = 0; i < temp.length; i++) {
			t2 = temp[i].split(",");
			//console.log(t2);
			//console.log(t2.length);
			
			if ( temp[i][0] == "#" ) {						// sites list
				console.log(">>>>"+temp[i]);
				bg.localStorage.setItem("prj_urls_"+nextid , temp[i].substring(1) );
			} else if ( t2.length == 4 ) {					// search data
				
				if ( engine != "" ) {
					console.log(t2[1]);
					console.log( t2[0],t2[1],t2[2],t2[3] );
					totItemsAdded ++;
					bg.lk.webdb.addItem(engine,t2[0],t2[1],t2[2],t2[3],nextid,prjItemAdded);
				} else {
					console.log("### engine error ###");
				}
			
			} else if ( t2[0] != "" ) {						// new project/engine
			
				if (engine != "") nextid++;
				engine = t2;
				console.log("engine:" + engine + " new project:"+nextid);
				var day = new Date();
				var d = isoDate(day,true);
				bg.localStorage.setItem("prj_id_"+nextid , "import "+engine+" "+d );
				bg.localStorage.setItem("prj_se_"+nextid , engine );
				bg.localStorage.setItem("prj_up_"+nextid , d );
				
			}
		}
	}
	
	$("#dosearch").click(function() {
		process(0);
	});
	
	$("#stats_panel").hide();
	$("#tips_panel").hide();

	$("#list_results").click();
	
	$("#overlay").fadeOut("fast");

}

function selectPrj(id) {
	bg.localStorage.setItem("prjid",id);
	$("#projectinfo").html( bg.localStorage.getItem("prj_id_"+id) + " - " + bg.localStorage.getItem("prj_se_"+id) );
	$("#versiontitle").text( "v"+bg.ver );
	
	$("#query").val( "" );
	
	$("#list_projects").click();
}

function deletePrj(id,tot) {

	var r=confirm("Are you sure to delete this project "+id+" along with "+tot+" results?");
	if (r==true) {
		var q = "DELETE FROM items where prj="+id;
		pleaseWait("deleting project");
		bg.lk.webdb.query( q , function(){
			pleaseWait();
			$("#list_projects").click();
		} );
	}
}

function projectsListEvents(){
	$("#newproject").click(function() {
		addProject(true);
	});
	
	$("#projects_panel").slideDown("normal");
	
	$(".selPrj").click(function() {
		var id = $(this).attr('rel');
		selectPrj(id);
	});

	$(".delPrj").click(function() {
		var id = $(this).attr('rel');
		var tot = $(this).attr('tot');
		deletePrj(id,tot);
	});
	
}

function projectsList(tx, rs) {
	var projectsList = document.getElementById("projectsList");
	var rowOutput = "Use different projects to handle different keywords / sites.";
	rowOutput += "<p><input type='submit' class='xbutton' value='add new' id='newproject' /></p>";
	if ( rs.rows.length > 0 ) {
		var now = new Date();
		rowOutput += "<div>";
		rowOutput += "<table class='list' cellspacing=0 style='width:100%'>";
		rowOutput += "<tr><th>Name</th><th>Search engine</th><th>Results</th><th></th><th></th></tr>";
		for (var i=0; i < rs.rows.length; i++) {
			rowOutput += "<tr";
			if ( rs.rows.item(i).prj == bg.localStorage.getItem("prjid") ) rowOutput += " class='selected'";
			rowOutput += "><td>" + bg.localStorage.getItem("prj_id_"+rs.rows.item(i).prj);
			var t = bg.localStorage.getItem("prj_up_"+rs.rows.item(i).prj);
			if ( t != null ) {
				t = new Date( t );
				if ( ( now.getTime() - t.getTime() ) < 300000 ) {
					rowOutput += " <span style='color:red'>NEW</span>";
				}
			}
			rowOutput += "</td>";
			rowOutput += "<td>" + bg.localStorage.getItem("prj_se_"+rs.rows.item(i).prj) + "</td>";
			rowOutput += "<td style='text-align:center'>" + rs.rows.item(i).tot + "</td>";
			rowOutput += "<td style='width:1%'>" + "<input rel='"+rs.rows.item(i).prj+"' type='submit' class='xbutton selPrj' value='use' />" + "</td>";
			rowOutput += "<td style='width:1%'>" + "<input rel='"+rs.rows.item(i).prj+"' tot='"+rs.rows.item(i).tot+"' type='submit' class='xbutton delPrj' value='X' />" + "</td>";
			rowOutput += "</tr>";
		}
		rowOutput += "</table>";
		rowOutput += "</div>";
	} else {
		rowOutput += "<p>Please search some keywords to initialize this project.</p>";
	}
	projectsList.innerHTML = rowOutput;
	projectsListEvents();
	
}


function sitesList(tx, rs) {
	var pagesList = document.getElementById("pagesList");
	if ( rs.rows.length > 0 ) {
		var engine = "";
		var rowOutput = "<table class='list'>";
		
		for (var i=0; i < rs.rows.length; i++) {
			if ( engine != rs.rows.item(i).engine ) {
				engine = rs.rows.item(i).engine;
				rowOutput += "<tr><th colspan=6>"+engine + "</th></tr>";
				rowOutput += "<tr><th></th><th>query</th><th>site</th><th>position</th><th>date</th><th></th></tr>";
			}
			rowOutput += renderItems(rs.rows.item(i));
		}
		rowOutput += "</table>";
	} else {
		rowOutput = "<br><br>Please search some keywords to initialize this project.<br><br><br>";
	}
	pagesList.innerHTML = rowOutput;
}


function addProject_step2a(tx,rs) { // just add
	var nextid = rs.rows.item(0).tot+1;
	// store cfg
	bg.localStorage.setItem("prj_id_"+nextid , $("#prjname").val() );
	bg.localStorage.setItem("prj_se_"+nextid , $("#searchengine").val() );
	selectPrj( nextid );

	//$("#list_results").click();
	mex("Search your keywords to initialize the project");
	
	// close request
	$("#overlay").fadeOut("fast");
	
}

function addProject_step2b(tx,rs) { // and init ...
	var nextid = rs.rows.item(0).tot+1;
	// store cfg
	bg.localStorage.setItem("prj_id_"+nextid , $("#prjname").val() );
	bg.localStorage.setItem("prj_se_"+nextid , $("#searchengine").val() );
	selectPrj( nextid );
	
	//$("#list_results").click();
	mex("Search your keywords to initialize the project");
	
	init_step3();
}

function addProject(canCancel) {

	var day = new Date();
	var d = isoDate(day,false);

	var rui = "<h3>Add a new project</h3>";
	rui += "<label for='prjname'>Project name</label><input type='text' id='prjname' value='PRJ "+d+"'><br><br>";
	rui += "<label for='searchengine'>Search engine</label>";
	
	rui += "<select id='searchengine' name='searchengine'>";
	rui += array2options(googles,"www.");
	rui += "</select><br><br>";
	
	rui += "<label></label><input type='submit' class='xbutton' value=' ok ' id='newprjadd' />";
	if ( canCancel ) rui += "&nbsp;&nbsp;&nbsp;<input type='submit' class='xbutton' value='cancel' id='request_cancel' />";
	
	UI_request(rui,300,140,"#prjname");
		
	$("#newprjadd").click(function() {
		if ( $("#prjname").val() == "" || bg.localStorage.getItem("prj_"+$("#prjname").val()) != undefined ) {
			$("label[for='prjname']").css({"color":"red"});
		} else {
			if ( canCancel )
				bg.lk.webdb.query( "SELECT max(prj) AS tot from items" , addProject_step2a );	// just add
			else
				bg.lk.webdb.query( "SELECT max(prj) AS tot from items" , addProject_step2b );	// and init ...
		}
	});
	
	$('#prjname').keypress(function(event) {
		if (event.keyCode == '13') {
			$("#newprjadd").click();
		}
	});
	
}

function init_step2(tx,rs) {
	bg.console.log("projects: "+rs.rows.length);
	if ( rs.rows.length > 0 )
		init_step3();
	else
		addProject(false);
}

var t;
function dbCheck() {
	//console.log("@dbCheck",bg,bg.lk);
	if ( bg.lk.webdb.db == null ) {
		//t=setTimeout("dbCheck()",100);
		t=setTimeout(function() { dbCheck(); }, 100);
	} else {
		bg.lk.webdb.query( "SELECT DISTINCT prj from items" , init_step2 );
	}
}

// ???
function queryDetails(query) {
	bg.lk.webdb.getItemsList(query,"",loadItemsList);
}

function setSearch(query) {
	$("#query").attr("value",query);
	$("#resultDiv").html( "" );
	$("#dosearch").click();
	//latestQuery = query;	// global
}

function sitesReportByKeyword(keyword){
	$("#reports_filter_queries").val(keyword);
	activateTab( $("#show_reports") ,"reports_panel");
	
	bg.lk.webdb.sitesByKeyword(keyword , "", showSitesByKeyword);
}

function showSitesByKeyword(tx, rs){
	console.log("@showSitesByKeyword");
	
	var queriesList = document.getElementById("reportsList");
	var rowOutput="";
	
	var grid = {};
	
	if ( rs.rows.length > 0 ) {
		var rowOutput = "<table class='list'>";
		rowOutput += "<tr><th>day</th><th>keyword</th><th>url</th><th>position</th><th style='width:1%'></th></tr>";
		var pagesList = document.getElementById("pagesList");
		for (var i=0; i < rs.rows.length; i++) {
			row = rs.rows.item(i);
			//console.log(row);
			rowOutput += "<tr><td>" + rs.rows.item(i).day +"</td><td>" + rs.rows.item(i).query +"</td>";
			rowOutput += "<td><span>" + rs.rows.item(i).url  + "</span></td><td><span>" + rs.rows.item(i).position  + "</span></td>";
			rowOutput += "<td></td></tr>";
			
			if(!grid[row.day]) grid[row.day] = {};
			grid[ row.day ][ row.url ] = row.position;
			
		}
		
		//console.log("GRID",grid);
		
		
		var sites = {};
		var header = [];
		header[0] = "Date";
		var ct = 1;
		for (var key in grid) {
			var obj = grid[key];
			for (var prop in obj) {
				if (!sites[prop]) {
					sites[prop]=ct;
					header[ct] = prop;
					ct++;
				}
			}
		}
		//console.log("SITES",sites);
		//console.log("HEADER",header);


		var gdata = [];
		gdata.push( header );

		var arr;

		for (var key in grid) {
		   var obj = grid[key];
		   
		   arr = [];
			for (var i = 0; i < ct; i++) {
				arr[i] = null;
			}		   
		   
		   //console.log("CLEAR ARR",arr);
		   arr[0] = key;
		   for (var prop in obj) {
			  //console.log("*",key,prop + " = " + obj[prop],"SITESPROP:",sites[prop]);
			  arr[ sites[prop] ] = obj[prop];
		   }
		   gdata.push(arr);
		   console.log("ARR",arr);
		   console.log("---");
		}

		//console.log("FINAL ARR",gdata);


	
		rowOutput += "</table>";
		queriesList.innerHTML = rowOutput;
		
		function oGraph(gdata,opt){
			//console.log("@oGraph",gdata);
			
			var data = google.visualization.arrayToDataTable(gdata);
			var refreshdelay;
			this.draw = draw;
			this.refresh = refresh;
			
			//console.log(data);
		
			var options = {
				  width: opt.width,
				  height: opt.height,
				  vAxis: {
					direction: -1,
					logScale:opt.logScale,
					minValue:1,
					maxValue:100
				  },
				  chartArea:{
					left:40,
					top:10,
					width:"66%",
					height:"80%"
				  },
				  lineWidth:3,
				  pointSize:7,
				  legend: {
					textStyle: {
						fontSize: 11
					}
				  }
			};
		
			function draw(){
				//console.log("@draw");
				$("#chart_div").html("loading");
				var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
				$("#chart_div").css({width:options.width,height:options.height});
				chart.draw(data, options);
				//console.log("width",options.width);
			}
			
			function refresh( opt ){
				//console.log("@refresh");
				options.width = opt.width;
				clearTimeout(refreshdelay);
				refreshdelay = setTimeout(draw,300);
			}
			
		}
	
		$("#chart_div").show();
		reports_graph = new oGraph(gdata , {width:$(window).width()-400, height:200, logScale:$('#reports_filter_log').is(':checked') });
		reports_graph.draw( {width:$(window).width()-400} );
		windowFit();
		
	} else {
		$("#chart_div").hide();
		rowOutput = "<br><br>No results<br><br><br>";
		queriesList.innerHTML = rowOutput;
	}

	
}

function showQueriesEvents(){
	$("#queriesList .querySearch").click(function(){
	
		//$("#table_queries tr").removeClass("latest");
		//$(this).parent().parent().addClass("latest");
		
		var q = $(this).attr('query');
		setSearch(q);
	});
	
	$("#queriesList .sitesReport").click(function(){
		var q = $(this).attr('query');
		sitesReportByKeyword(q);
	});
	
}

function showQueries(tx, rs) {
	var queriesList = document.getElementById("queriesList");
	if ( rs.rows.length > 0 ) {
		var rowOutput = "<table class='list' id='table_queries'>";
		rowOutput += "<tr><th style='width:1%'></th><th>query</th><th>results</th><th style='width:1%'></th></tr>";
		var pagesList = document.getElementById("pagesList");
		for (var i=0; i < rs.rows.length; i++) {
			rowOutput += "<tr" + ( latestQuery == rs.rows.item(i).query ? " class='latest'" : "" ) + "><td><img src='gfx/mini_search14.png' title='search' class='icon querySearch' query='" + safeString(rs.rows.item(i).query) + "'></td>";
			rowOutput += "<td><span>" + rs.rows.item(i).query  + "</span></td><td><span>" + rs.rows.item(i).tot  + "</span></td>";
			rowOutput += "<td><input type='submit' class='sbutton sitesReport' query='" + safeString(rs.rows.item(i).query) + "' value='sites report' /></td></tr>";
		}
		rowOutput += "</table>";
	} else {
		rowOutput = "<br><br>Please search some keywords to initialize this project.<br><br><br>";
	}
	queriesList.innerHTML = rowOutput;
	showQueriesEvents();
}

function loadItemsListEvents(){
	$(".querySearch").click(function(){
		var q = $(this).attr('query');
		setSearch(q);
	});
	
	$(".queryDelete").click(function(){
		var rowid = $(this).attr('rowid');
		deleteItem(rowid,loadItemsList);
	});
	
}

function loadItemsList(tx, rs) {
	var pagesList = document.getElementById("pagesList");
	if ( rs.rows.length > 0 ) {
		var rowOutput = "<table class='list'>";
		rowOutput += "<tr><th style='width:1%'></th><th>query</th><th>site</th><th>position</th><th>date</th><th style='width:1%'></th></tr>";
		for (var i=0; i < rs.rows.length; i++) {
			rowOutput += renderItems(rs.rows.item(i));
		}
		rowOutput += "</table>";
	} else {
		rowOutput = "<br><br>Please search some keywords to initialize this project.<br><br><br>";
	}
	pagesList.innerHTML = rowOutput;
	loadItemsListEvents();
}

function renderItems(row) {
	return "<tr" + ( latestQuery == row.query ? " class='latest'" : "" ) + "><td><img src='gfx/mini_search14.png' title='search' class='icon querySearch' query='" + safeString(row.query) +"' ></td><td>" + row.query  + "</td><td>" + row.url + "</td><td>" + row.position +  "</td><td class='date'>" + row.day + "<td><span class='sbutton queryDelete' title='delete entry' rowid='" + row.ID +"'>X</span></td></tr>";
}

function loadItemsExport(tx, rs) {
	if ( rs.rows.length > 0 ) {
		var engine = "";
		var rowOutput = "";
		
		for (var i=0; i < rs.rows.length; i++) {
			if ( engine != rs.rows.item(i).engine ) {
				engine = rs.rows.item(i).engine;
				rowOutput += engine + "\n\n";
			}
			rowOutput += renderItemsExport(rs.rows.item(i));
		}
	} else {
		rowOutput = "No data";
	}
	
	$("#copyExport textarea").html(rowOutput).show().focus().select();

	document.execCommand("Copy");
	$("#export_csv").html("<b>The data was copied to your clipboard</b>.<br><br>You can try to open a text editor and paste it there, then save the new file for example as <b>data.csv</b> and import it in Excel or Google Docs to have a spread sheet to work on.<br>The next SEO SERP version will let you import this data too, so you can share it with another pc or with other people.");
	
	//CopiedTxt = document.selection.createRange();
	//CopiedTxt.execCommand("Copy");
	
	//bg.console.log(rowOutput);
	
}

function renderItemsExport(row) {
	var date = new Date( Date.parse( row.day ) );
	return row.query  + "," + row.url + "," + row.position +  "," + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + "\n";
}

function deleteItem(id,callback){
	var q = $("#keywordfilter_pageslist").val();
	if ( q != "" ) q = "%"+q+"%";
	var s = $("#sitefilter_pageslist").val();
	if ( s != "" ) s = "%"+s+"%";			  
	bg.lk.webdb.deleteItem(id,q,s,callback);	
}

function doSearch( query , site , se ) {
	if (bg.getSearchResults) { // ?
		$("#resultDiv").html( "processing..." ).show(0);
		latestQuery = query;
		bg.getSearchResults(query,site,se,
		function(html) {
			$("#resultDiv").html( html ).stop().hide(0).slideDown("fast");
			// if results is visible
			filter_pageslist();
			// if queries is visible
			filter_queries();
		});
	}
}

function process(evt) {
	var q = $("#query").val();
	var s = bg.localStorage.getItem("prj_urls_" + bg.localStorage.getItem("prjid") );
	var se = bg.localStorage.getItem("prj_se_" + bg.localStorage.getItem("prjid") );
	
	if (evt.keyCode == 13 || evt==0 ) {
		if ( q != "" ) { // && s != ""
			$("#resultDiv").hide(0);
			doSearch( q , s , se );
		} else {
			$("#resultDiv").html( "empty values" ).show();
		}
	}
}

function filter_pageslist(evt) {
	var q = $("#keywordfilter_pageslist").val();
	if ( q != "" ) q = "%"+q+"%";
	var s = $("#sitefilter_pageslist").val();
	if ( s != "" ) s = "%"+s+"%";
	bg.lk.webdb.getItemsList(q , s , loadItemsList);
}

function filter_queries(evt) {
	var q = $("#filter_queries").val();
	if ( q != "" ) q = "%"+q+"%";
	bg.lk.webdb.listQueries(q , showQueries);
}

function show_about(evt) {
	//var out = "";
	//out += "<h1>SEO SERP Workbench - version " + bg.ver + "</h1>";
	//out += "<a href='http://www.omiod.com' target='_blank'>homepage</a>";
	//$("#aboutPage").html( out );
}

function update_reports(evt) {
	var q = $("#reports_filter_queries").val();
	var site = $("#reports_filter_sites").val();
	console.log("@update_reports",q,site);
	if ( q != "" ) q = "%"+q+"%";
	bg.lk.webdb.sitesByKeyword(q , site , showSitesByKeyword);
}

// graph init
google.load("visualization", "1", {packages:["corechart"]});

/* events */

document.addEventListener('DOMContentLoaded', function () {
	$("body").append("<div id='overlay'><div id='overlayMex' class='message'>initializing, please wait"+( nowItemsAdded != totItemsAdded ? " import in progress":"" )+"</div></div>");
	t=setTimeout(function() { dbCheck(); }, 100);
});

$(function() {

	$("#keywordfilter_pageslist , #sitefilter_pageslist").keyup(function(e){
		filter_pageslist(e);
	});

	$("#filter_queries").keyup(function(e){
		filter_queries(e);
	});

	$("#reports_filter_queries").keyup(function(e){
		update_reports(e);
	});

	$("#reports_filter_sites , #reports_filter_log").change(function(e){
		update_reports(e);
	});

	$("#query").keypress(function(e){
		process(e);
	});

	$("body").on("click" , ".addsite" , function(){
		console.log("click");
		addSite($(this));
	});
	
	
});

(function() {
var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
po.src = 'https://apis.google.com/js/plusone.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();