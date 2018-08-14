var bg = chrome.extension.getBackgroundPage();

function process(evt) {
	console.log("@process");
	var time = $("#time").val();
	var rank = $("#rank").val();

	if (evt==0 ) {
		filter_pageslist(time,rank);
	}
}

function filter_pageslist(time,rank) {
	console.log("@filter_pageslist");
	var q = "";
	if ( time == "today" ) {
		var date = new Date();
		q += "AND DAY ='"+isoDate(date)+"'";
	}
	if ( rank == "1-10" ) {
		q += "AND position <= 10";
	}
	if ( rank == "1-50" ) {
		q += "AND position <= 50";
	}
	
	q = "SELECT day,query,url,position FROM items WHERE prj="+chrome.extension.getBackgroundPage().localStorage.getItem("prjid") + " " + q + " ORDER BY ID";
	bg.lk.webdb.query( q , loadItemsList );
	
}
	
var grid = {};
var sites = {};

function loadItemsList(tx, rs) {
	grid = {};
	sites = {};
	
	$("#div_grid").html("<p>please wait ...</p>");
	
	if ( rs.rows.length > 0 ) {
		for (var i=0; i < rs.rows.length; i++) {
			row = rs.rows.item(i);
			if(!grid[row.query]) grid[row.query] = {};
			grid[ row.query ][ row.url ] = row.position;
			sites[row.url]=0;		// crea l'indice nuovo, e lo pone z 0 per il voto finale
		}
	} else {
		console.log("Please search some keywords");
	}

	//console.log(sites);
	
	function sortObject(o) {
		var sorted = {},
		key, a = [];
		for (key in o) {
			if (o.hasOwnProperty(key)) { a.push(key); }
		}
		a.sort();
		for (key = 0; key < a.length; key++) {
			sorted[a[key]] = o[a[key]];
		}
		return sorted;
	}
	
	sites=sortObject(sites);

	out = "<table id='grid' cellpadding=0 cellspacing=0><tr><td class='corner'>&nbsp;</td>";
	
	for(var s in sites) {
		out += "<th>"+s+"</th>";
	}
	out += "</tr>";

	for(var v in grid) {					// query
		out += "<tr><th>" + v + "</th>";
		for(var s in sites) {				// sites
			found=false;
			for(var c in grid[v]) {			// results	
				if ( s == c ) {
					found=true;
					out += "<td>"+grid[v][c] + "</td>";
					break;
				} 
			}
			if ( !found ) {
				out += "<td>&nbsp;</td>";
				sites[s] += 100;
			} else {
				sites[s] += grid[v][c];
			}
			
		}
		out += "</tr>";
	}
	
	var tot=0;
	for(var v in grid) { tot++ }
	tot = tot * 100;
	
	out += "<tr><th colspan='999'></th></tr>";
	
	out += "<tr><th style='font-weight:bold'>rating</th>";
	for(var s in sites) {
		out += "<td>"+(100-Math.floor(sites[s]/tot*100))+"%</td>";
	}
	out += "</tr>";
	
	out += "</table>";

	//console.log(sites);
	
	$("#div_grid").html(out);
	
	$("#grid td").each(function() {
		var v = $(this).html();
		if ( v < 11 )
			$(this).addClass("good");
		else if ( v < 51 )
			$(this).addClass("fair");
		else if ( v < 101 )
			$(this).addClass("bad");
		else
			$(this).addClass("empty");
	});		
	
	
}

$(function() {
	//filter_pageslist();
	$("#view").click(function(){
		process(0);
	}).click();
});
