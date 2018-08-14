/*
SEO SERP Workbench
http://www.omiod.com/

Made by Andrea Doimo 

0.9.2 - first official release
0.9.3 - correct handling of quoted queries / data import / projects handling / many fixes / add site button from list
0.9.4 - added pws=0
0.9.5 - added google.com.vn, google.co.th and google.gr - added HTTPS permission to follow recent Google™ breaking changes
1.0   - graphics update - new sites manager - new reports area with graphs to visualize the keyword trend for each site
1.0.1 - graphics fixes - downloadable quesries list - more reports filters - queries downloadable as .csv file
1.1   - upgraded to Extension with manivest V2
1.1.1 - small fix
1.1.2 - small fixes - added google.pt, google.ch, google.se, google.be, max number of results limited to 50 to prevent wrong results
1.1.3 - Re-enabled full url tracking.
1.1.4 - small fix
1.1.5 - added www.google.com.ar, www.google.cl, www.google.com.co, www.google.com.mx, www.google.com.pe, www.google.co.ve - lastest seach query is highlighted - fixed https sites - slightly bigger fonts - other internal fixes
1.2   - small fix and version bump
1.2.1 - added google.tn, google.com.qa - updated FAQ
*/

var ver="1.2.1";
//var ver = chrome.app.getDetails().version;

function getSearchResults(query, site, se, callback) {

	siteurl = site;
	var req = false;
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
	} else {
		return;
	}
	
	sites = siteurl.split(",");
	done = new Array();
	
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				output = cleanResults(req.responseText);
				out = getSERP(query,se,output);
				
				localStorage.setItem("lastkeyword", query );
				localStorage.setItem("prj_urls_" + localStorage.getItem("prjid") , site );
				_gaq.push(['_trackEvent', 'site', se ]);
				
			} else {
				out = "ERROR - Bad response ("+req.status+")<br>You have made too many requests and Google will not repond for a while.";
				_gaq.push(['_trackEvent', 'error', req.status]);
			}
			callback(out);
		}
	};
	req.open('GET', 'http://' + se + '/search?q=' + query + '&num=50&as_qdr=all&safe=off&pws=0', true);
	req.send(null);
	
	_gaq.push(['popup', 'submit2', se]);
	
}

function cleanResults(response) {
  response = response.substring(response.indexOf('<body'));
  response = response.replace('<body', '<div');
  response += '</div>';
  return response;
}

function getDomain(url) {
	url = url.replace(/(http|https):\/\//,"");
	return url.split("/")[0];
}

function getParameterByName(name, uri) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(uri);

    if(results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
};

function getSERP(query,se,html) {
	var out;
	
	r = $(html).find("li.g h3");
	
	out = "<b>SERP rankings</b> for keyword <b><a href='http://" + se + "/search?q=" + query + "&num=50&as_qdr=all&safe=off&pws=0' target='_blank' title='view result page'>" + query + "</a></b></br>";
	out += "<table cellspacing=0 cellpadding=0 id='r'>";
  
	ct = 1;
	found = 0;
	nomatchlist = "";
	r.each( function() {
		var fullurl = $(this).children("a:eq(0)").attr("href");
		
		//var tmp = document.createElement ('a');
		//tmp.href = fullurl;
		//url = tmp.hostname;
		
		url = fullurl || "";
		
		console.log("URL",url);
		
		if ( url != "" && url.indexOf( "http" ) == 0 ) {
			console.log("B");
			matched = false;
			for (var i in sites) {
				if ( sites[i] != "" ) {
					console.log("A");
					if ( url.indexOf( sites[i] ) != -1 && done[i]==undefined ) {
						console.log("A1");
						urlico = getDomain(url);
						console.log("urlico",urlico);
						out += "<tr><td class='n'># " + ct + "</td><td class='s'><img src='http://www.google.com/s2/favicons?domain=" + urlico + "' class='urlico' ><a href='" + fullurl + "' target='_blank' title='" + url + "'>" + urlico + "</a></td></tr>";
						done[i] = ct;
						found ++;
						matched = true;
						
						lk.webdb.addItem(se,query,urlico,ct);
						
						break;
					}
					if ( url.indexOf( sites[i] ) != -1 ) {
						matched = true;
					}
				}
			}

			if ( !matched && ct <=10 ) {
				urlico = getDomain(url);
				nomatchlist += "<tr><td class='n'># " + ct + " </td>";
				nomatchlist += "<td class='s'><img src='http://www.google.com/s2/favicons?domain=" + urlico + "' class='urlico' ><a href='" + url + "' target='_blank' title='" + url + "'>" + urlico + "</a>";
				nomatchlist += " <span class='sbutton addsite' site='" + urlico + "'>add</span>";
				nomatchlist += "</td></tr>";
			}
			
		} else {
			console.log("*********** bad ulr");
		}
		
		ct ++;
		
	});
	out += "</table>";
	
	if ( found == 0 ) {
		out += "<br>No results.<br>";
		out += "Try adding some of the sites below.<br>";
	}
	
	var out2 = "";
	
	for (var i in sites) {
		if ( sites[i] != "" ) {
			if ( done[i] == undefined ) {
				out2 += sites[i] + ( i < sites.length-1 ? " , " : "" );
			}
		}
	}
	
	if ( nomatchlist != "" ) out += "<br/><br/><b>Unmatched top results</b> : <small>(consider adding them to your websites list)</small><br/><table cellspacing=0 cellpadding=0 id='r'>" + nomatchlist + "</table>";
	
	if ( out2 != "" ) out += "<br/><b>Not found</b> : "+out2;
 
  return out;
}


var out;
var siteurl;
var sites;
var done;

console.log("BG3");

initdb();

//

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-58832-25']);
_gaq.push(['_trackPageview']);
_gaq.push(['_trackEvent', 'v', ver]);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://stats.g.doubleclick.net/dc.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();




