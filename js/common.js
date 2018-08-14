var googles = [
	'google.com', 'google.com.au', 
	'google.com.ar', 'google.com.br', 
	'google.com.by', 'google.com.co', 
	'google.com.mx', 'google.com.pe', 
	'google.com.qa', 'google.com.sv', 
	'google.com.tr', 'google.com.tw', 
	'google.com.ua', 'google.com.vn', 
	'google.co.il', 'google.co.in', 
	'google.co.jp', 'google.co.th', 
	'google.co.uk', 'google.co.ve', 
	'google.co.za', 'google.be', 
	'google.ca', 'google.ch', 
	'google.cl', 'google.cn', 
	'google.de', 'google.dk', 
	'google.es', 'google.fr', 
	'google.gr', 'google.hu', 
	'google.ie', 'google.it', 
	'google.nl', 'google.no', 
	'google.pl', 'google.pt', 
	'google.ro', 'google.ru', 
	'google.se', 'google.sk', 
	'google.tn'
];

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}

function pad(str, len, pad) {
    str = String(str);
    if (typeof(len) == "undefined") {
        var len = 0;
    }
    if (typeof(pad) == "undefined") {
        var pad = '0';
    }
    if (len + 1 >= str.length) str = Array(len + 1 - str.length).join(pad) + str;
    return str;
}

function isoDate(d, time) {
    var extra = "";
    if (time) extra = " " + pad(d.getHours(), 2) + ":" + pad((d.getMinutes() + 1), 2) + ":" + pad(d.getSeconds(), 2)
    return d.getFullYear() + "-" + pad((d.getMonth() + 1), 2) + "-" + pad(d.getDate(), 2) + extra;
}

function fileDate(d) {
    return d.getFullYear() + pad((d.getMonth() + 1), 2) + pad(d.getDate(), 2) + "-" + pad(d.getHours(), 2) + pad((d.getMinutes() + 1), 2) + pad(d.getSeconds(), 2);
}

function safeString(str) {
    str = str.replace(/\"/g, '&#34;');
    str = str.replace(/\'/g, '&#39;');
    return str;
}
/*
function addslashes(str) {
	str=str.replace(/\\/g,'\\\\');
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\"');
	str=str.replace(/\0/g,'\\0');
	return str;
}
function stripslashes(str) {
	str=str.replace(/\\'/g,'\'');
	str=str.replace(/\\"/g,'"');
	str=str.replace(/\\0/g,'\0');
	str=str.replace(/\\\\/g,'\\');
	return str;
}
*/
function UI_request(rui, wid, hei, focus) {
    $("#overlayMex").removeClass("message").addClass("request").html("");
    $("#overlayMex").append(rui);
    $("#overlayMex.request").css({
        'width': wid,
        'height': hei,
        'margin-left': -wid / 2,
        'margin-top': -hei / 2
    });
    $("#overlay").fadeIn("fast");
    $("#request_cancel").click(function() {
        $("#overlay").fadeOut("fast");
    });
    if (focus != "") $(focus).focus();
}

function array2options(values, prevalue) {
    var selectHtml = "";
    $.each(values, function(index, value) {
        selectHtml += '<option value="' + prevalue + value + '">' + value + '</option>';
    });
    return selectHtml;
}