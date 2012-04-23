// ==UserScript==
// @name	Geocaching Map Enhancements
// @version	0.5.7
// @namespace	inge.org.uk/userscripts
// @description	Adds Ordnance Survey maps and grid reference search to Geocaching.com, along with several other enhancements.
// @match	*://*.geocaching.com/map/*
// @match	*://*.geocaching.com/seek/cache_details.aspx*
// @match	*://*.geocaching.com/seek/default.aspx*
// @match	*://*.geocaching.com/seek/
// @include	*.geocaching.com/map/*
// @include	*.geocaching.com/seek/cache_details.aspx*
// @include	*.geocaching.com/seek/default.aspx*
// @include	*.geocaching.com/seek/
// @license	MIT License; http://www.opensource.org/licenses/mit-license.php
// @copyright	2011-12, James Inge (http://geo.inge.org.uk/)
// @attribution Geonames (http://www.geonames.org/)
// @attribution Chris Veness (http://www.movable-type.co.uk/scripts/latlong-gridref.html)
// @attribution jenda^^ (http://userscripts.org/scripts/show/127710)
// @icon	http://geo.inge.org.uk/userscripts/GeocachingMap48.png
// ==/UserScript==
if($('#map_canvas').length != 0){

(function(){
//	Grid reference conversion adapted from code (C) Copyright Chris Veness, 2005-2010, used under a Creative Commons CC-BY license.
//	Brightness code adapted from script by jenda^^.
//	Elevation data and reverse geocoding from Geonames.

// Default parameters
var GME_parameters = {
	version: "0.5.7",
	useNewTab: true,		// True opens geocache lists in a new window, rather than replacing the map.
	filterFinds: false,	// True filters finds out of list searches.
	osgbSearch: true,		// Enhance search box with OSGB grid references, zooming, etc. (may interfere with postal code searches)
	follow: false,	// Locator widget follows current location (moving map mode)
	brightness: 1,	// Default brightness for maps (0-1), can be overridden by custom map parameters.
	measure: "metric",	// Or "imperial" - used for the scale indicators
	defaultMap: "MapQuest",
	excludeMaps: ["MapQuest Aerial", "London Street Maps", "My Topo", "Amapy turistická"],	// Standard maps to ignore (case sensitive)
	includeMaps: [
//	{alt:"Readable Name", tileUrl: "URL template including {s} (subdomain) and either {q} (quadkey) or {x},{y},{z} (Google/TMS tile coordinates + zoom)", subdomains: "0123", minZoom: 0, maxZoom: 24, attribution: "Copyright message (HTML allowed)", name: "shortname", overlay:false }
// 	Don't use the same name for custom maps as standard maps that are in the ignore list. It won't work.
//	Documentation for options at http://leaflet.cloudmade.com/reference.html#tilelayer
		{alt:"Bing Maps", tileUrl: "http://ecn.t{s}.tiles.virtualearth.net/tiles/r{q}?g=864&mkt=en-gb&lbl=l1&stl=h&shading=hill&n=z", subdomains: "0123", minZoom: 0, maxZoom: 20, attribution: "<a href=\'http://maps.bing.com/\'>Bing</a> map data copyright Microsoft and its suppliers", name: "bingmap" },
		{alt:"Bing Aerial View", tileUrl: "http://ecn.t{s}.tiles.virtualearth.net/tiles/a{q}?g=737&n=z", subdomains: "0123", minZoom: 0, maxZoom: 20, attribution: "<a href=\'http://maps.bing.com/\'>Bing</a> map data copyright Microsoft and its suppliers", name: "bingaerial" },
		{alt:"Google Maps",tileUrl:"http://mt.google.com/vt?&x={x}&y={y}&z={z}",name:"googlemaps",attribution:"<a href=\'http://maps.google.com/\'>Google</a> Maps",subdomains:"1234",tileSize:256,minZoom:0,maxZoom:22},
		{alt:"Google Satellite",tileUrl:"http://mt.google.com/vt?lyrs=s&x={x}&y={y}&z={z}",name:"googlemapssat",attribution:"<a href=\'http://maps.google.com/\'>Google</a> Maps Satellite",subdomains:"1234",tileSize:256,minZoom:0,maxZoom:22},
		{alt:"Google Terrain",tileUrl:"http://mt0.google.com/vt/v=w2p.110&hl=en&x={x}&y={y}&z={z}",name:"googleterrain",attribution:"<a href=\'http://maps.google.com/\'>Google</a> Terrain",subdomains:"1234",tileSize:256,minZoom:0,maxZoom:18},
		{alt:"Ordnance Survey", tileUrl: "http://ecn.t{s}.tiles.virtualearth.net/tiles/r{q}?g=737&productSet=mmOS", subdomains: "0123", minZoom: 0, maxZoom: 17, attribution: "Ordnance Survey imagery from <a href=\'http://maps.bing.com/\'>Bing Maps</a>", name: "bingos" },
		{alt:"London Street Maps", tileUrl: "http://ecn.t{s}.tiles.virtualearth.net/tiles/r{q}?g=864&productSet=mmCB", subdomains: "0123", minZoom: 14, maxZoom: 17, attribution: "<a href=\'http://maps.bing.com/\'>Bing</a> map data copyright Microsoft and its suppliers", name: "binglondon" },
		{alt:"Amapy turistická",tileUrl:"http://maps11.i0.cz/mps/ch_turis/{z}/{x}/{x}_{y}.gif",name:"amapy",attribution:"<a href=\'http://amapy.centrum.cz/\'>Amapy</a> turistická",tileSize:256,minZoom:13,maxZoom:16},
        {alt:"Eniro Topo",tileUrl: "http://ed-map-fi.wide.basefarm.net/ol_tiles/fi/topo/{z}/{x}/{y}.png", name: "enirotopo", attribution: '<a href="http://www.eniro.fi/kartta" target="_blank">Topo maps provided by Eniro</a>',tileSize: 256, minZoom: 0, maxZoom: 18, add_layer: true},
        {alt:"Eniro Street",tileUrl: "http://ed-map-fi.wide.basefarm.net/ol_tiles/fi/maps/{z}/{x}/{y}.png", name: "enirostreet", attribution: '<a href="http://www.eniro.fi/kartta" target="_blank">Street maps provided by Eniro</a>', tileSize: 256, minZoom: 10, maxZoom: 19, add_layer: true}
	]
};

var GME_custom = { maps: [] };

if( localStorage ) {
	try {
		var params = localStorage.getItem("GME_parameters");
		if( params ) {
			var p2 = JSON.parse(params);
			if( p2.version == GME_parameters.version ) {
				GME_parameters = p2;
			} else {
				for( var a in GME_parameters ) {if(!p2[a]){p2[a]=GME_parameters[a];}}
				if(/\/map\//.test(location.pathname)) {
					alert( "Geocaching Map Enhancements has been updated. You may want to check your configuration using the cog icon." );
					p2.version = GME_parameters.version;
					localStorage.setItem("GME_parameters",JSON.stringify(p2));
				}
				GME_parameters = p2;
			}
		}
		var custom = localStorage.getItem("GME_custom");
		if( custom ) {
			GME_custom = JSON.parse(custom);
		}
	} catch(e){}
}

var GME_css = ['\
	.ui-field-contain, .ui-mobile fieldset.ui-field-contain {margin: 0;}\
	.ui-title {margin-top: 0.3em !important; margin-bottom: 0.4em !important;}\
	.ui-btn-inner {padding-top:0.2em; padding-bottom:0.2em;}\
	.ui-dialog .ui-header {margin-top: 3%; }\
	.leaflet-corner.leaflet-bottom.leaflet-left {z-index:8;}\
	.leaflet-control-gme,.leaflet-control-zoomwarning {border-radius:7px;background: rgba(0,0,0,0.25);padding:5px;z-index:8;top:20px;}\
	.leaflet-control-gme a,.leaflet-control-zoomwarning span { display: inline-block; padding:3px; margin-right:0.5em;vertical-align:middle;background:url(http://www.geocaching.com/map/css/themes/images/icons-18-black.png) no-repeat rgba(255,255,255,0.75);border-radius:4px;height:19px;width:19px;}\
	.leaflet-control-zoomwarning {top:98px;cursor:help;}\
	.leaflet-control-zoomwarning span { background-color: rgba(200,0,0,0.75);margin:0;background-position: -502px 2px;height:14px;width:14px; }\
	.leaflet-control-gme a:hover { background-color: #fff; }\
	.leaflet-control-gme span { padding:5px;border-width:3px;border-radius:4px;background:rgba(255,255,255,0.75);vertical-align:middle;font-size:12px;}\
	.leaflet-control-scale {bottom:5em !important;margin-left:10px !important; left: 30px;}\
	.gme-left {left: 30px;}\
	a.GME_list { background-position: -430px 4px;}\
	a.GME_refresh { background-position: -320px 4px;}\
	a.GME_home { background-position: -572px 4px;}\
	a.GME_config { background-position: -284px 4px;}\
	.groundspeak-control-findmylocation a { padding: 3px; }\
	a.GME_locate_active, a.GME_info_active {border:solid 3px #02b; padding:0; background-color:#fff;}\
	a.GME_locate_active:hover, a.GME_info_active:hover {border-color:#63f;}\
	a.GME_info { background-position: -537px 4px;}\
	a.GME_info_active {background-position: -540px 1px;}\
	@media print { #search { display: none !important}}\
'].join('');

var GME_html_config = ['\
	<div data-role="header"><h1>Configure GME</h1></div>\
	<div data-role="content">\
		<div data-role="collapsible-set">\
			<div data-role="collapsible" id="GME_settings_maps">\
				<h3>Choose maps</h3>\
				<div data-role="fieldcontain" id="GME_map_default_field">\
					<label for="GME_map_default" class="select">Default map:</label>\
					<select name="GME_map_default" id="GME_map_default"></select>\
				</div>\
				<div class="ui-grid-a">\
					<fieldset data-role="controlgroup" data-mini="true" id="GME_mapfields1" class="ui-block-a"></fieldset>\
					<fieldset data-role="controlgroup" data-mini="true" id="GME_mapfields2" class="ui-block-b"></fieldset>\
				</div>\
			</div>\
			<div data-role="collapsible">\
				<h3>Add more maps</h3>\
				<div data-role="fieldcontain">\
					<label for="GME_map_custom" class="select">Mapsource:</label>\
					<input type="text" name="GME_map_custom" id="GME_map_custom" data-inline="true">\
					<div class="ui-grid-a">\
						<div class="ui-block-a"><a href="#" data-icon="plus" data-role="button" id="GME_custom_add">Add mapsource</a></div>\
						<div class="ui-block-b"><a href="#GME_popup2" data-icon="info" data-role="button" data-rel="dialog">Mapsource format info</a></div>\
					 </div>\
				</div>\
				<a href="#" data-icon="delete" data-role="button" id="GME_custom_clear">Clear all user-added mapsources</a>\
			</div>\
			<div data-role="collapsible">\
				<h3>Other settings</h3>\
				<fieldset data-role="controlgroup" data-mini="true">\
					<input type="checkbox"', GME_parameters.useNewTab?' checked="checked"':'',' name="GME_useNewTab" id="GME_useNewTab" /><label for="GME_useNewTab">Use new tabs for cache list and other websites</label>\
					<input type="checkbox"', GME_parameters.filterFinds?' checked="checked"':'',' name="GME_filterFinds" id="GME_filterFinds" /><label for="GME_filterFinds">Only list unfound caches</label>\
					<input type="checkbox"', GME_parameters.osgbSearch?' checked="checked"':'',' name="GME_osgbSearch" id="GME_osgbSearch" /><label for="GME_osgbSearch">Enhanced search</label>\
					<input type="checkbox"', GME_parameters.follow?' checked="checked"':'',' name="GME_follow" id="GME_follow" /><label for="GME_follow">FollowMe location mode</label>\
				</fieldset>\
				<div data-role="fieldcontain">\
					<label for="GME_brightness">Map brightness:</label><input type="range" name="GME_brightness" id="GME_brightness" value="',GME_parameters.brightness*100,'" data-mini="true" data-highlight="true" min="0" max="100" />\
				</div>\
				<div data-role="fieldcontain">\
					<label for="GME_measure">Scale:</label>\
					<select name="GME_measure" id="GME_measure" data-role="slider" data-mini="true">\
						<option value="metric"', GME_parameters.measure=='metric'?' selected="selected"':'','>Metric</option>\
						<option value="imperial"', GME_parameters.measure=='imperial'?' selected="selected"':'','>Imperial</option>\
					</select>\
				</div>\
			</div>\
		</div>\
		<div class="ui-grid-b">\
			<div class="ui-block-a"><a href="#" data-icon="delete" data-role="button" data-rel="back">Cancel</a></div>\
			<div class="ui-block-b"><a href="#" data-icon="back" data-role="button" id="GME_default">Reset defaults</a></div>\
			<div class="ui-block-c"><a href="#" data-icon="check" data-role="button" id="GME_set">OK</a></div>\
		</div>\
	</div>\
	<div data-role="footer"></div>\
'].join('');

var GME_html_custominfo = '\
	<div data-role="header"><h1>Custom Mapsources</h1></div>\
	<div data-role="content">\
		<p>Custom mapsources can be added by supplying entering a <a href="http://www.json.org/">JSON</a> configuration string that tells GME what to call the map, where to find it, and how it is set up. e.g.</p>\
		<p><code>{"alt":"OS NPE (GB only)","tileUrl":"http://ooc.openstreetmap.org/npe/{z}/{x}/{y}.png", "minZoom":6, "maxZoom": 15, "attribution": "OpenStreetMap NPE" }</code></p>\
		<p>The <code>"alt"</code> and <code>"tileUrl"</code> parameters are mandatory. <code>"tileUrl"</code> can contain {x}, {y} and {z} for Google-style coordinate systems (also works with TMS systems like Eniro, but needs the <code>"scheme":"tms"</code> parameter), or {q} for Bing-style quadkeys. GME can also connect with WMS servers, in which case a <code>"layers"</code> parameter is required.</p>\
		<p>The other parameters are the same as those used by the <a href="http://leaflet.cloudmade.com/reference.html#tilelayer">Leaflet API</a>, with the addition of a <code>"overlay":true</code> option, that makes the mapsource appear as a selectable overlay. e.g.</p>\
		<p><code>{"alt":"Nexrad Weather (USA)","tileUrl":"http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", "layers":"nexrad-n0r-900913", "format":"image/png", "transparent": true, "attribution": "Weather data © 2012 IEM Nexrad", "overlay":true}</code></p>\
	</div>\
	<div data-role="footer"><a href="#" data-icon="back" data-role="button" data-rel="back">Back</a></div>\
';

var GME_script_osgb = [
	'function OSGridToLatLng(E,N) {\
		var a = 6377563.396, b = 6356256.910;\
		var F0 = 0.9996012717;\
		var lat0 = 49*Math.PI/180, lon0 = -2*Math.PI/180;\
		var N0 = -100000, E0 = 400000;\
		var e2 = 1 - (b*b)/(a*a);\
		var n = (a-b)/(a+b), n2 = n*n, n3 = n*n*n;\
		var lat=lat0, M=0;\
		do {\
			lat = (N-N0-M)/(a*F0) + lat;\
			var Ma = (1 + n + (5/4)*n2 + (5/4)*n3) * (lat-lat0);\
			var Mb = (3*n + 3*n*n + (21/8)*n3) * Math.sin(lat-lat0) * Math.cos(lat+lat0);\
			var Mc = ((15/8)*n2 + (15/8)*n3) * Math.sin(2*(lat-lat0)) * Math.cos(2*(lat+lat0));\
			var Md = (35/24)*n3 * Math.sin(3*(lat-lat0)) * Math.cos(3*(lat+lat0));\
			M = b * F0 * (Ma - Mb + Mc - Md);\
		} while (N-N0-M >= 0.01);\
		var cosLat = Math.cos(lat), sinLat = Math.sin(lat);\
		var nu = a*F0/Math.sqrt(1-e2*sinLat*sinLat);\
		var rho = a*F0*(1-e2)/Math.pow(1-e2*sinLat*sinLat, 1.5);\
		var eta2 = nu/rho-1;\
		var tanLat = Math.tan(lat);\
		var tan2lat = tanLat*tanLat, tan4lat = tan2lat*tan2lat, tan6lat = tan4lat*tan2lat;\
		var secLat = 1/cosLat;\
		var nu3 = nu*nu*nu, nu5 = nu3*nu*nu, nu7 = nu5*nu*nu;\
		var VII = tanLat/(2*rho*nu);\
		var VIII = tanLat/(24*rho*nu3)*(5+3*tan2lat+eta2-9*tan2lat*eta2);\
		var IX = tanLat/(720*rho*nu5)*(61+90*tan2lat+45*tan4lat);\
		var X = secLat/nu;\
		var XI = secLat/(6*nu3)*(nu/rho+2*tan2lat);\
		var XII = secLat/(120*nu5)*(5+28*tan2lat+24*tan4lat);\
		var XIIA = secLat/(5040*nu7)*(61+662*tan2lat+1320*tan4lat+720*tan6lat);\
		var dE = (E-E0), dE2 = dE*dE, dE3 = dE2*dE, dE4 = dE2*dE2, dE5 = dE3*dE2, dE6 = dE4*dE2, dE7 = dE5*dE2;\
		lat = lat - VII*dE2 + VIII*dE4 - IX*dE6;\
		var lon = lon0 + X*dE - XI*dE3 + XII*dE5 - XIIA*dE7;\
		var tx=446.448, ty=-125.157, tz=542.060, rx=7.2819014902652306237205098174164e-7, ry=1.1974897923405539041670878328241e-6, rz=4.0826160086234026020206666559563e-6, s1=0.9999795106;\
		var sinPhi = Math.sin(lat), cosPhi = Math.cos(lat);\
		var sinLambda = Math.sin(lon), cosLambda = Math.cos(lon);\
		var eSq = (a*a - b*b) / (a*a);\
		var nu2 = a / Math.sqrt(1 - eSq*sinPhi*sinPhi);\
		var x1 = nu2 * cosPhi * cosLambda;\
		var y1 = nu2 * cosPhi * sinLambda;\
		var z1 = (1-eSq)*nu2 * sinPhi;\
		var x2 = tx + x1*s1 - y1*rz + z1*ry;\
		var y2 = ty + x1*rz + y1*s1 - z1*rx;\
		var z2 = tz - x1*ry + y1*rx + z1*s1;\
		a = 6378137, b = 6356752.3142;\
		eSq = (a*a - b*b) / (a*a);\
		var p = Math.sqrt(x2*x2 + y2*y2);\
		var phi = Math.atan2(z2, p*(1-eSq)), phiP = 2*Math.PI;\
		var precision = 4 / a;\
		while (Math.abs(phi-phiP) > precision) {\
			nu = a / Math.sqrt(1 - eSq*Math.sin(phi)*Math.sin(phi));\
			phiP = phi;\
			phi = Math.atan2(z2 + eSq*nu*Math.sin(phi), p);\
		}\
		var lambda = Math.atan2(y2, x2);\
		return {lat: phi*180/Math.PI, lng:lambda*180/Math.PI};\
	}\
	function gridrefLetToNum(letters, numbers) {\
		letters = letters.toUpperCase();\
		var l1 = letters.charCodeAt(0) - "A".charCodeAt(0);\
		var l2 = letters.charCodeAt(1) - "A".charCodeAt(0);\
		if (l1 > 7) l1--;\
		if (l2 > 7) l2--;\
		var e = ((l1-2)%5)*5 + (l2%5);\
		var n = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);\
		e += numbers.slice(0, numbers.length/2);\
		n += numbers.slice(numbers.length/2);\
		switch (numbers.length) {\
			case 2: e += "5000"; n += "5000"; break;\
			case 4: e += "500"; n += "500"; break;\
			case 6: e += "50"; n += "50"; break;\
			case 8: e += "5"; n += "5"; break;\
		}\
		return [e, n];\
	}\
	function GME_parseGR(searchVal) {\
    var gr = searchVal.match(/^\\s*([hnstHNST][A-Ha-hJ-Zj-z])\\s*((?:\\d\\d){1,5})\\s*$/);\
    if( gr != null ) {\
      if(gr.length==3){\
        if(2* Math.floor(gr[2].length / 2 ) == gr[2].length){\
          var ngr = gridrefLetToNum(gr[1], gr[2]);\
          return OSGridToLatLng(ngr[0], ngr[1]);\
        }\
      }\
      return null;\
    }\
    gr = searchVal.match(/^\\s*(\\d{3,6})\\s*,\\s*(\\d{4,7})\\s*$/);\
    if( gr != null ) {\
      if(gr.length==3){\
        return OSGridToLatLng(gr[1], gr[2]);\
      }\
    }\
  	return null;\
	}'
].join("");

var GME_script_map = '\
	function GME_checkAPI() {\
		if(typeof L === "object") {\
			GME_extendLeaflet();\
			window.setTimeout(GME_load,1000);\
		} else {\
			window.setTimeout(GME_checkAPI,1000);\
		}\
		return;\
	}\
	function GME_extendLeaflet() {\
		L.QuadkeyLayer = L.TileLayer.extend({\
			tile2quad: function(x, y, z) {\
				var quad = "";\
				for (var i = z; i > 0; i--) {\
					var digit = 0;\
					var mask = 1 << (i - 1);\
					if ((x & mask) != 0) digit += 1;\
					if ((y & mask) != 0) digit += 2;\
					quad = quad + digit;\
				}\
				return quad;\
			},\
			getTileUrl: function(p, z) {\
				var subdomains = this.options.subdomains;\
				return this._url.replace("{s}", subdomains[(p.x + p.y) % subdomains.length]).replace("{q}", this.tile2quad(p.x, p.y, z));\
			}\
		});\
		L.complexLayer = L.TileLayer.extend({\
			getTileUrl: function(p, z) {\
				return this._url.replace("{s4}", p.x%4 + 4*(p.y%4)).replace("{x}", p.x).replace("{y}", p.y).replace("{z}", z);\
			}\
		});\
		L.genericLayer = function( url, options ) {\
			return /{q}/.test(url)?(new L.QuadkeyLayer( url, options )):(/{s4}/.test(url)?(new L.complexLayer(url,options)):(/{x}/.test(url)?(new L.TileLayer( url, options )):(new L.TileLayer.WMS( url, options))));\
		};\
	}\
	function GME_included(mapname) {\
		for( var p=0,q=GME_parameters.excludeMaps.length;p<q;p++) {\
			if( mapname == GME_parameters.excludeMaps[p] ) return false;\
		}\
		return true;\
	}\
	function GME_load_map(){\
		var defMap=0;\
		var allMaps = Groundspeak.Map.MapLayers.concat(GME_parameters.includeMaps).concat(GME_custom.maps);\
		for(var a={},b={},d=0,i=0,j=allMaps.length;i<j;i++) {\
			if(GME_included(allMaps[i].alt)) {\
				var k=allMaps[i],l=L.genericLayer(k.tileUrl,k);\
				if(k.overlay) {\
					b[k.alt]=l;\
				} else {\
					a[k.alt]=l;\
					if(k.alt==GME_parameters.defaultMap) defMap = d;\
					d++;\
				}\
			}\
		}\
		var c=new L.Control.Layers(a, b);\
		if(/map/.test(document.location.pathname)) {\
			$(".leaflet-control-layers").remove();\
			MapSettings.Map.removeLayer(MapSettings.Map._layers[1]);\
		}\
		MapSettings.Map.addControl(c);\
		MapSettings.Map.addEventListener("layeradd",GME_switchlayer,MapSettings.Map);\
		$(".leaflet-control-layers-base input")[defMap].click();\
	}\
	function GME_switchlayer(e) {\
		if(!e.layer.options.overlay && e.layer.options.tileUrl ) {\
			this._layersMaxZoom = e.layer.options.maxZoom;\
			this._layersMinZoom = e.layer.options.minZoom;\
			if(this.getZoom() > this._layersMaxZoom) { this.setZoom(this._layersMaxZoom) }\
			if(this.getZoom() < this._layersMinZoom) { this.setZoom(this._layersMinZoom) }\
			this._brightness = typeof e.layer.options.brightness!="undefined"?e.layer.options.brightness:GME_parameters.brightness;\
			GME_setbrightness(this);\
		}\
	}\
	function GME_setbrightness(map){\
		function blank(l) {setTimeout(function(){l.style.opacity=0;},1500);}\
		var z=0,layers = $("#map_canvas .leaflet-layer, #map_canvas2 .leaflet-layer"), brightness=typeof map._brightness!="undefined"?map._brightness:GME_parameters.brightness;\
		if(brightness<1) {\
			$(".leaflet-container").css("backgroundColor","#000");\
		} else {\
			$(".leaflet-container").css("backgroundColor","#ddd");\
		}\
		for (var i=layers.length-1; i>=0; i--) {\
			var ztmp = layers[i].parentElement.style.zIndex;\
			if (z<ztmp) z=ztmp;\
		}\
		for (var i=0,j=layers.length; i<j; i++) {\
			if (layers[i].parentElement.style.zIndex==z) {\
				if (/map\\.tile/.test(layers[i].innerHTML)) {\
					layers[i].style.opacity=1;\
				} else {\
					layers[i].style.opacity=brightness;\
				}\
			} else {\
				if(brightness<1) {\
					blank(layers[i]);\
				}\
			}\
		}\
	}';

GME_script_widget = ['\
	L.GMEControl=L.Control.extend({\
		options:{position:"bottomleft"},\
		onAdd:function(contextmap){\
			var container=L.DomUtil.create("div","leaflet-control-gme gme-left");\
			this._map = contextmap;\
			this._markers = [];\
			this._scale = GME_parameters.measure;\
			this._zoomWarned = false;\
			this.zoomWarning = new L.ZoomWarning();\
			var a = document.createElement("a");\
			a.target="_top";\
			a.style.cursor="pointer";\
			a.className = "GME_list";\
			a.title = "List ',GME_parameters.filterFinds?'unfound ':'','caches near map centre";\
			L.DomEvent.addListener(a,"click",this._list,this);\
			container.appendChild(a);\
			var b = document.createElement("a");\
			b.style.cursor="pointer";\
			b.className = "GME_refresh";\
			b.title = "Refresh session";\
			b.id = "GME_refresh";\
			L.DomEvent.addListener(b,"click",this._refresh,this);\
			container.appendChild(b);\
			if(typeof userHomeLocation === "object") {\
				if(typeof userHomeLocation.lat === "number") {\
					var d = document.createElement("a");\
					d.style.cursor="pointer";\
					d.title = "Go to home location";\
					d.className = "GME_home";\
					L.DomEvent.addListener(d,"click",this._goHome,this);\
					container.appendChild(d);\
				}\
			}',
			localStorage?
				'var c = document.createElement("a");\
				c.style.cursor="pointer";\
				c.className = "GME_config";\
				c.title = "Configure Geocaching Map Enhancements";\
				c.setAttribute("data-role", "button");\
				c.setAttribute("data-rel", "dialog");\
				c.transition="pop";\
				c.href="#GME_popup";\
				container.appendChild(c);':'',
			'var d = document.createElement("a");\
			d.className = "GME_info";\
			d.title = "Enable location info tool";\
			L.DomEvent.addListener(d,"click",this._info,this);\
			this._info_on = false;\
			container.appendChild(d);\
			var e = document.createElement("span");\
			e.id = "GME_scale";\
			e.title = "Approximate width of the full map view";\
			e.style.cursor="help";\
			this._map.on("viewreset", this._updateScale, this );\
			container.appendChild(e);\
			return container;\
		},\
		_DMM:function(ll) {\
			return [Geo.toLat(ll.lat,"dm",3),Geo.toLon(ll.lng,"dm",3)].join(" ");\
		},\
		_dropMarker:function(lat,lng) {\
			var ll = new L.LatLng(lat, lng);\
			var radius = window.prompt("Radius (',GME_parameters.measure=='metric'?'km)?", 0.161':'miles)?", 0.1',');\
			if( radius != null ) {\
				radius *= GME_parameters.measure=="metric"?1000:1609.344;\
				if(isNaN(radius)) radius = 161;\
			} else {\
				radius = 161;\
			}\
			var circle = new L.Circle( ll, radius, {weight:2} );\
			var m = this._markers.push(circle) - 1;\
			var r = GME_parameters.measure=="metric"?(radius/1000).toFixed(3)+" km":(radius/1609.344).toFixed(3)+" miles";\
			circle.bindPopup(["<p><strong>Marker</strong><br/>Radius: ", r, "<br/>Centre: decimal ",ll.toUrl(),"<br/><strong>",this._DMM(ll),"</strong><br/><span style=\'float:right;\'><a href=\'#\' onclick=\'GME_control._removeMarker(",m,");\'>Remove</a></span></p>"].join(""));\
			this._map.addLayer(circle);\
		},\
		_getHeight:function(lat,lng) {\
			var s=document.createElement("script");\
			s.type="text/javascript";\
			s.id="GME_height_callback";\
			s.src=["http://api.geonames.org/astergdemJSON?lat=",lat,"&lng=",lng,"&username=gme&callback=GME_control._getHeight_call"].join("");\
			document.documentElement.firstChild.appendChild(s);\
		},\
		_getHeight_call:function(json) {\
			if(typeof json.astergdem != "undefined" && typeof json.lat != "undefined" && typeof json.lng!= "undefined") {\
				var m = new L.Popup();\
				if( json.astergdem == -9999 ) {\
					m.setContent("<p><strong>Spot Height</strong><br/>(Ocean)</p>");\
				} else {\
					var h = GME_parameters.measure=="metric"?json.astergdem+" m":Math.round(json.astergdem*3.2808)+" ft";\
					m.setContent(["<p><strong>Spot Height</strong><br/>Approx ",h," above sea level</p>"].join(""));\
				}\
				m.setLatLng(new L.LatLng(json.lat, json.lng));\
				GME_control._map.openPopup(m);\
			}\
			$("#GME_height_callback").remove();\
		},\
		_goHome:function() {\
			this._map.panTo(userHomeLocation);\
		},\
		_info:function(e) {\
			L.DomEvent.stopPropagation(e);\
			if(this._info_on) {\
				this._info_on = false;\
				L.DomEvent.removeListener(this._map,"click",this._info_show,this);\
				$(".GME_info").removeClass("GME_info_active").attr("title","Enable location info tool");\
			} else {\
				this._info_on = true;\
				L.DomEvent.addListener(this._map,"click",this._info_show,this);\
				$(".GME_info").addClass("GME_info_active").attr("title","Disable location info tool");\
			}\
		},\
		_info_show:function(e) {\
			L.DomEvent.stopPropagation(e);\
			var geograph="",geograph_url="",height="",ll=e.latlng.toUrl(),\
			bounds_GB=new L.LatLngBounds(new L.LatLng(49.58223,-13.62305),new L.LatLng(62.79493,2.10938)),\
			bounds_CI=new L.LatLngBounds(new L.LatLng(49.15477,-2.71637),new L.LatLng(49.74578,-1.93359)),\
			bounds_DE=new L.LatLngBounds(new L.LatLng(47.24941,5.95459),new L.LatLng(55.14121,14.89746));\
			if(bounds_GB.contains(e.latlng)) {\
				geograph_url="http://www.geograph.org.uk/search.php?location=";\
			}\
			if(bounds_CI.contains(e.latlng)) {\
				geograph_url="http://channel-islands.geographs.org/search.php?location=";\
			}\
			if(bounds_DE.contains(e.latlng)) {\
				geograph_url="http://geo-en.hlipp.de/search.php?location=";\
			}\
			if(geograph_url) {\
				geograph=["<br/><a ",GME_parameters.useNewTab?"target=\'geograph\' ":"","href=\'",geograph_url,ll,"\'>Geograph pictures</a>"].join("");\
			}\
			if(e.latlng.lat > -65 && e.latlng.lat < 83) {\
				height=["<br/><a href=\'javascript:GME_control._getHeight(",ll,");\'>Get height</a>"].join("");\
			}\
			if(typeof userHomeLocation==="object" && typeof userHomeLocation.lat==="number"){\
				var dir=["<br/><a ",GME_parameters.useNewTab?"target=\'directions\' ":"","href=\'http://maps.google.com/maps?q=from%3A",userHomeLocation.lat,",",userHomeLocation.lng,"+to%3A",ll,"\'>Google Directions</a>"].join("");\
			}\
			var popupContent = [\
				"<p><strong>",this._DMM(e.latlng),"</strong><br/>Dec: ",ll,\
				"<br/><a href=\'javascript:GME_control._dropMarker(",ll,")\'>Drop marker</a>",\
				height,geograph,dir,\
				"<br/><a ",GME_parameters.useNewTab?"target=\'streetview\' ":"","href=\'http://maps.google.com/maps?q=&layer=c&cbll=",ll,"&cbp=12,0,0,0,0\'>Google Streetview</a>",\
				"<br/><a ",GME_parameters.useNewTab?"target=\'wiki\' ":"","href=\'http://wikimapia.org/#lat=",e.latlng.lat,"&lon=",e.latlng.lng,"&z=",this._map.getZoom(),"\'>Wikimapia</a>",\
				"</p>"].join("");\
			var popup = new L.Popup();\
			popup.setLatLng(e.latlng);\
			popup.setContent(popupContent);\
			this._map.addLayer(popup);\
		},\
		_list:function() {\
			var url = ["http://www.geocaching.com/seek/nearest.aspx?lat=", this._map.getCenter().lat, "&lng=", this._map.getCenter().lng,GME_parameters.filterFinds?"&f=1":""].join("");\
			$(".GME_list").attr("href", url);',
			GME_parameters.useNewTab ? '$(".GME_list").attr("target", url);':'',
		'},\
		_refresh:function() {\
			document.location = ["http://coord.info/map?ll=",this._map.getCenter().toUrl(),"&z=",this._map.getZoom()].join("");\
		},\
		_removeMarker:function(mark){\
			this._map.removeLayer(this._markers[mark]);\
		},',
		GME_parameters.osgbSearch?'_search:function() {\
			var a = $("#search").find(":input").first(),searchVal=$.trim(a.val()||"");\
			if (searchVal.length > 0) {\
				var m = searchVal.match(/^\\s*(?:z|zoom)\\s*(\\d\\d?)\\s*$/i);\
				if( m != null && m.length == 2) {\
					GME_control._map.setZoom(m[1]);\
					return false;\
				}\
				var gr = GME_parseGR(searchVal);\
				if(gr != null) {\
					GME_control._map.panTo(new L.LatLng(gr.lat,gr.lng));\
				} else {\
					GME_control._searchVal=searchVal;\
					var s=document.createElement("script");\
					s.type="text/javascript";\
					s.id="GME_search_callback";\
					s.src=["http://api.geonames.org/countryCode?lat=", GME_control._map.getCenter().lat, "&lng=", GME_control._map.getCenter().lng, "&type=JSON&username=gme&callback=GME_control._search_call&radius=100"].join("");\
					document.documentElement.firstChild.appendChild(s);\
				}\
			}\
			return false;\
		},\
		_search_call:function(json) {\
			if( typeof json.countryCode != "undefined" ) {\
				var s=document.createElement("script");\
				s.type="text/javascript";\
				s.id="GME_search_callback2";\
				s.src=["http://api.geonames.org/searchJSON?q=", encodeURIComponent(this._searchVal),"&countryBias=", json.countryCode, "&maxRows=10&username=gme&callback=GME_control._search_call2"].join("");\
				document.documentElement.firstChild.appendChild(s);\
			} else {\
				this._search_gs(this._searchVal);\
			}\
			$("#GME_search_callback").remove();\
		},\
		_search_call2:function(json) {\
			if(typeof json.geonames != "undefined" && json.geonames.length > 0) {\
				GME_control._map.panTo(new L.LatLng(json.geonames[0].lat,json.geonames[0].lng));\
			} else {\
				this._search_gs(this._searchVal);\
			}\
			$("#GME_search_callback2").remove();\
		},\
		_search_gs:function(searchVal) {\
			$.getJSON("/api/geocode",{q:searchVal},function(a){\
				a.status=="success"?MapSettings.Map.panTo(new L.LatLng(a.data.lat,a.data.lng)):alert("Sorry, no results found for "+escape(searchVal));\
			});\
		},':'',
		'_updateScale:function() {\
			var m = this._map;\
			var b=m.getBounds();\
			var w = Math.cos(m.getCenter().lat * L.LatLng.DEG_TO_RAD) * 111319.49079327358 * Math.abs(b.getSouthWest().lng - b.getSouthEast().lng);\
			if(this._scale=="metric") {\
				if(w>3000) {\
					s=["Width: ",Math.round(w/1000)," km"].join("");\
				} else {\
					s=["Width: ",Math.round(w)," m"].join("");\
				}\
			} else {\
				if(w>3047) {\
					s=["Width: ",Math.round(w/1609.344)," mi"].join("");\
				} else {\
					s=["Width: ",Math.round(w*3.2808)," ft"].join("");\
				}\
			}\
			$("#GME_scale").html(s);\
			return s;\
		}\
	});\
	L.FollowMyLocationControl=Groundspeak.Map.Control.FindMyLocation.extend({\
		onAdd:function(a){\
			this._map=a;\
			this._tracking=false;\
			var container=L.DomUtil.create("div","leaflet-control-toolbar groundspeak-control-findmylocation gme-left");\
			var e = document.createElement("a");\
			e.id="GME_loc";\
			e.title=GME_parameters.follow?"Follow My Location":"Find My Location";\
			e.className="groundspeak-control-findmylocation-lnk";\
			if(GME_parameters.follow) {\
				L.DomEvent.addListener(e,"click",this._click,this);\
			} else {\
				L.DomEvent.addListener(e,"click",this._click_once,this._map);\
			}\
			container.appendChild(e);\
			return container;\
		},\
		_click:function(e){\
			L.DomEvent.stopPropagation(e);\
			if( this._tracking ) {\
				this._map.stopLocate();\
				this._map.removeEventListener("locationfound",this._located,this._map);\
				this._tracking = false;\
				$(".groundspeak-control-findmylocation-lnk").removeClass("GME_locate_active");\
				$("#GME_loc").attr("title","Follow My Location");\
			} else {\
				this._map.addEventListener("locationfound",function(l){this.panTo(l.latlng);},this._map);\
				this._map.locate({enableHighAccuracy:true,watch:true,timeout:60000});\
				this._tracking = true;\
				$(".groundspeak-control-findmylocation-lnk").addClass("GME_locate_active");\
				$("#GME_loc").attr("title","Stop following");\
			}\
		},\
		_click_once:function(){\
			this.locate({setView:true,maxZoom:this.getZoom(),minZoom:this.getZoom(),enableHighAccuracy:true,timeout:60000});\
		}\
	});\
	L.ZoomWarning=L.Control.extend({\
		options:{position:"topleft"},\
		onAdd:function(a){\
			var c=L.DomUtil.create("div","leaflet-control-zoomwarning gme-left");\
			var b=document.createElement("span");\
			b.title="Caches not visible at this zoom level";\
			c.appendChild(b);\
			return c;\
		}\
	});',
	localStorage?
		'function GME_addCustom(){\
			var n={};\
			try{\
				var n = JSON.parse(document.getElementById("GME_map_custom").value);\
			} catch(e) {\
				alert("Map source string must be valid JSON");\
				return;\
			}\
			if( n.alt && n.tileUrl ) {\
				var m = GME_custom.maps.concat(n);\
				GME_custom.maps = m;\
				localStorage.setItem("GME_custom",JSON.stringify(GME_custom));\
				GME_setConfig();\
				$("#GME_settings_maps h3 a").trigger("click");\
			} else {\
				alert("Map source must include at least \\"alt\\" and \\"tileUrl\\" parameters");\
			}\
			return;\
		}\
		function GME_default(){\
			delete localStorage.GME_custom;\
			delete localStorage.GME_parameters;\
			GME_control._refresh();\
		}\
		function GME_clearCustom(){\
			GME_custom.maps = [];\
			localStorage.setItem("GME_custom",JSON.stringify(GME_custom));\
			$("#GME_settings_maps h3 a").trigger("click");\
			GME_setConfig();\
		}\
		function GME_setConfig() {\
			var mapfields1 = "", mapfields2 = "", alt="",allMaps=Groundspeak.Map.MapLayers.concat(GME_parameters.includeMaps).concat(GME_custom.maps),mapselect = "";\
			var half = Math.ceil(allMaps.length/2);\
			for( var a=0;a<half;a++) {\
				var alt = allMaps[a].alt, overlay=allMaps[a].overlay;\
				if(!overlay) mapselect += ["<option value=\'",alt,"\'>",alt,"</option>"].join("");\
				mapfields1 += ["<input type=\'checkbox\' ",GME_included(alt)?"checked=\'checked\' ":"","name=\'",alt,"\' id=\'checkbox1-",a,"\' /><label for=\'checkbox1-",a,"\'>",alt,overlay?" (Overlay)":"","</label>"].join("");\
			}\
			for( var a=half;a<allMaps.length;a++) {\
				var alt = allMaps[a].alt, overlay=allMaps[a].overlay;\
				if(!overlay) mapselect += ["<option value=\'",alt,"\'>",alt,"</option>"].join("");\
				mapfields2 += ["<input type=\'checkbox\' ",GME_included(alt)?"checked=\'checked\' ":"","name=\'",alt,"\' id=\'checkbox2-",a,"\' /><label for=\'checkbox2-",a,"\'>",alt,overlay?" (Overlay)":"","</label>"].join("");\
			}\
			$("#GME_mapfields1").html(mapfields1);\
			$("#GME_mapfields2").html(mapfields2);\
			$("#GME_map_default").html(mapselect);\
			var sel = $("#GME_map_default").children(),defSet=false;\
			for( var a=sel.length-1;a>-1;a--) {\
				if( sel[a].value == GME_parameters.defaultMap ) {\
					sel[a].selected = "selected";\
					defSet = true;\
				}\
			}\
			if(defSet) {\
				$("#GME_map_default_field .ui-btn-text").html(GME_parameters.defaultMap);\
			} else {\
				$("#GME_map_default_field .ui-btn-text").html(sel[0].value);\
			}\
			$("#GME_settings_maps").trigger("create");\
		}\
		function GME_storeSettings(){\
			GME_parameters.defaultMap = $("#GME_map_default")[0].value;\
			var excludeMaps = [], list = $("#GME_mapfields1, #GME_mapfields2").children();\
			for( var a=0, b=list.length;a<b; a++ ) {\
				if( list[a].firstChild.checked == false && list[a].firstChild.name != GME_parameters.defaultMap) {\
					excludeMaps.push(list[a].firstChild.name);\
				}\
			}\
			GME_parameters.excludeMaps = excludeMaps;\
			GME_parameters.useNewTab = $("#GME_useNewTab")[0].checked?true:false;\
			GME_parameters.filterFinds = $("#GME_filterFinds")[0].checked?true:false;\
			GME_parameters.osgbSearch = $("#GME_osgbSearch")[0].checked?true:false;\
			GME_parameters.follow = $("#GME_follow")[0].checked?true:false;\
			GME_parameters.measure = $("#GME_measure")[0].value;\
			GME_parameters.brightness = $("#GME_brightness").val()/100;\
			localStorage.setItem("GME_parameters",JSON.stringify(GME_parameters));\
			GME_control._refresh();\
		}':'',
	'function GME_check_zoom(e) {\
		if(this._map.getZoom() > 18 ) {\
			if(!this._zoomWarned) {\
				this._map.addControl(GME_control.zoomWarning);\
				this._zoomWarned = true;\
				if(amplify&&typeof amplify.store("ShowPanel")!="undefinded"&&amplify.store("ShowPanel")) {\
					$(".leaflet-control-zoomwarning").css("left","390px");\
				}\
			}\
		} else {\
			if(this._zoomWarned) {\
				this._map.removeControl(GME_control.zoomWarning);\
				this._zoomWarned = false;\
			}\
		}\
		GME_setbrightness(this._map);\
	}\
	function GME_load_widget(){\
		GME_control = new L.GMEControl();\
		MapSettings.Map.on("zoomend", GME_check_zoom,GME_control);\
		MapSettings.Map.addControl( GME_control );\
		GME_control._updateScale();\
		$(window).resize(function() { setTimeout(function(){GME_control._updateScale()}, 500) });\
		$(".groundspeak-control-findmylocation").remove();\
		MapSettings.Map.addControl(new L.FollowMyLocationControl());\
		if(localStorage) {\
			GME_setConfig();\
			$("#GME_set").bind("vclick", GME_storeSettings);\
			$("#GME_default").bind("vclick", GME_default);\
			$("#GME_custom_add").bind("vclick", GME_addCustom);\
			$("#GME_custom_clear").bind("vclick", GME_clearCustom);\
			$("#GME_settings_maps").trigger("create");\
		}\
		$("a.ToggleSidebar").unbind();\
		$("a.ToggleSidebar").click(function(a){a.preventDefault();pnlOpen?(pnlOpen=false,$(".Sidebar").animate({left:"-355px"},500),$(".leaflet-control-zoom,.leaflet-control-toolbar,.leaflet-control-scale,.gme-left").animate({left:"30px"},500),$(this).removeClass("Open")):(pnlOpen=true,$(".Sidebar").animate({left:"0"},500),$(".leaflet-control-zoom,.leaflet-control-toolbar,.leaflet-control-scale,.gme-left").animate({left:"390px"},500),$(this).addClass("Open"));amplify.store("ShowPanel",pnlOpen);return false;});\
	}\
'].join('');

var page = document.location.href;
if( page.match(/cache_details\.aspx/) ) {
	// On a geocache listing
	var l = document.getElementById("ctl00_ContentBody_trNotLoggedIn");
	if(l) return; // Not logged in, so no maps...
	var s = document.createElement("script");
	s.type = "text/javascript";		
	s.innerHTML = [
		'var GME_parameters=',JSON.stringify(GME_parameters), ', GME_custom=',JSON.stringify(GME_custom),', MapSettings={};',
		GME_script_map,
		'function GME_load() {\
			Groundspeak = { Map:{ MapLayers:[{ alt:"MapQuest", tileUrl:"http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg", name:"mpqosm", attribution:"Tiles Courtesy of <a href=\'http://www.mapquest.com/\'>MapQuest</a> <img src=\'http://developer.mapquest.com/content/osm/mq_logo.png\'>, Map and map data © 2012 <a href=\'http://www.openstreetmap.org/\'>OpenStreetMap</a> and contributors, <a href=\'http://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>.", subdomains:"1234", maxZoom:18 }]}};\
			$("#map_canvas").replaceWith("<div style=\'width: 325px; height: 325px; position: relative;\' id=\'map_canvas2\'></div>");\
			MapSettings.Map = new L.Map("map_canvas2",{center: new L.LatLng(mapLatLng.lat, mapLatLng.lng), zoom:14});\
			GME_load_map();\
			var pinIcon = L.Icon.extend({iconSize: new L.Point(20, 23),iconAnchor: new L.Point(10,23)});\
			var llBounds = new L.LatLngBounds();\
			var cc = new L.LatLng(mapLatLng.lat, mapLatLng.lng);\
			llBounds.extend(cc);\
			var cache = new L.Marker(cc, {\
				icon: new pinIcon({iconUrl:"/images/wpttypes/pins/" + mapLatLng.type + ".png", iconAnchor: new L.Point(10,23)}),\
				clickable: false, zIndexOffset:99, title: mapLatLng.name\
			});\
			MapSettings.Map.addLayer(cache);\
			if (cmapAdditionalWaypoints != null && cmapAdditionalWaypoints.length > 0) {\
				for (var x = cmapAdditionalWaypoints.length - 1; x > -1; x--) {\
					var item = cmapAdditionalWaypoints[x],ll = new L.LatLng(item.lat, item.lng), marker = new L.Marker(ll, {\
						icon: new pinIcon({iconUrl:"/images/wpttypes/pins/" + item.type + ".png", iconAnchor: new L.Point(10,23)}),\
						title: item.name, clickable:false\
					});\
					llBounds.extend(ll);\
					MapSettings.Map.addLayer(marker);\
				}\
				MapSettings.Map.fitBounds(llBounds);\
			}\
			MapSettings.Map.on("zoomend", GME_setbrightness, MapSettings.Map);\
		}\
		GME_checkAPI();'
	].join("");
	document.documentElement.firstChild.appendChild(s);
	document.documentElement.firstChild.removeChild(s);
} else {
	if( page.match(/seek/)) {
		// On the Hide & Seek page
		var target = null, container = null;
		var targets = document.getElementsByTagName("h5");
		for( var i=0,j=targets.length; i<j; i++) {
			if( targets[i].innerHTML.match(/WGS84/)) {
				target = targets[i];
				break;
			}
		}
		if( target ) {
			var grDiv = document.createElement("div");
			grDiv.innerHTML = '<h5>Ordnance Survey Grid Reference :</h5><dl><dt>Grid reference : </dt><dd><form name="grForm" id="grForm"><input type="text" class="Text EqualWidthInput" maxlength="50" name="grRef" size="15" id="grRef">&nbsp;<input type="submit" class="Button blockWithModalSpinner" name="submitGR" value="Go" id="grSub"></form></dd></dl>';
			target.parentNode.insertBefore(grDiv,target);

			var s1 = document.createElement("script");
			s1.type = "text/javascript";		
			s1.innerHTML = [
				GME_script_osgb,
				'function GME_search_gr() {\
					var searchVal = $.trim($("#grRef").val());\
					if (searchVal.length > 0) {\
						var gr = GME_parseGR(searchVal);\
						if(gr != null) {\
							document.location = ["http://www.geocaching.com/seek/nearest.aspx?origin_lat=",gr.lat,"&origin_long=",gr.lng].join("");\
						} else {\
							alert("Could not recognise grid reference.");\
						}\
					}\
				}\
				$("#grRef").keypress(function (e) {\
					if (e.which == 13) {\
						e.preventDefault();\
						e.stopImmediatePropagation();\
						GME_search_gr();\
					}\
				});\
				$("#grSub").click(function (e) {\
					e.preventDefault();\
					e.stopImmediatePropagation();\
					GME_search_gr();\
				});'
			].join('');
			document.documentElement.firstChild.appendChild(s1);
		}
	} else {
		// On a Geocaching Maps page
		var c = document.createElement('style');
		c.type = 'text/css';
		c.innerHTML = GME_css;
		document.documentElement.firstChild.appendChild(c);

		if( localStorage ) {
			var d1 = document.createElement('div');
			d1.title = 'Configure Geocaching Map Enhancements';
			d1.setAttribute('data-role', 'page');
			d1.id = 'GME_popup';
			d1.innerHTML = GME_html_config;
			var d2 = document.createElement('div');
			d2.title = 'Custom Mapsource Format';
			d2.setAttribute('data-role', 'page');
			d2.id = 'GME_popup2';
			d2.innerHTML = GME_html_custominfo;
			document.documentElement.lastChild.appendChild(d1);
			document.documentElement.lastChild.appendChild(d2);
		}

		var s = document.createElement("script");
		s.type = "text/javascript";		
		s.innerHTML = [
			'var GME_control=null, GME_parameters=',JSON.stringify(GME_parameters), ', GME_custom=',JSON.stringify(GME_custom),';',
			GME_script_map,GME_script_widget,GME_parameters.osgbSearch?GME_script_osgb:'',
			'function GME_load() {\
				GME_load_map();\
				GME_load_widget();',
				GME_parameters.osgbSearch?
					'var sb = $("#SearchBox_Button").parent();\
					$("#SearchBox_Button").unbind();\
					$("#SearchBox_Button").remove();\
					sb.append("<button title=\'Search\' id=\'SearchBox_OS\' data-iconpos=\'notext\' data-icon=\'search\' class=\'ui-btn-hidden\' aria-disabled=\'false\'>Search</button>");\
					$("#SearchBox_Text").keydown(function(event){if(event.keyCode == 13){$("#SearchBox_OS").click();return false;}});\
					$("#search p")[0].innerHTML="Search by Address, Coordinates, <span style=\'cursor:help;\' title=\'Jump to a specific zoom level by typing zoom then a number. Zoom 1 shows the whole world, maxiumum zoom is normally 18-22.\'>zoom</span> or <span style=\'cursor:help;\' title=\'To search using a British National Grid reference, just type it in the search box and hit the button! You can use 2, 4, 6, 8 or 10-digit grid refs with the 2-letter prefix but no spaces in the number (e.g. SU12344225) or absolute grid refs with a comma but no prefix (e.g. 439668,1175316).\'>Grid Ref</span>";\
					$("#SearchBox_OS").click(GME_control._search);':'',
				'if(amplify&&typeof amplify.store("ShowPanel")!="undefinded"&&amplify.store("ShowPanel")) {\
					$(".leaflet-control-toolbar,.groundspeak-control-findmylocation,.leaflet-control-scale,.gme-left").css("left","390px");\
				}\
			}\
			GME_checkAPI();'
		].join("");
		document.documentElement.firstChild.appendChild(s);
		document.documentElement.firstChild.removeChild(s);
	}
}
})();
}
