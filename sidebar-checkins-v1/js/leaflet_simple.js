
// global variable
var map;
var route;

// event call to draw route
function draw_route() {
	var route_loc_array = [
		[42.340966, -71.098470],
		[42.341790, -71.096603],
		[42.340815, -71.093732],
		[42.339158, -71.092380],
		[42.337317, -71.091045]
	];
	
	var route_loc_popup_array = [
		"<b>Cutie Pie's Home</b>",
		"<b>Start of Nala</b>",
		"<b>Crossed Nala </b>",
		"<b>Reached Hungtington</b>",
		"<b>Finally !!! DD !!</b>"
	];
	

	var i,marker;
	var route_array = [];
	// preparing variables for route tracing
	for (i = 0; i < route_loc_array.length-1; i++) { 
		route_array.push(
			L.marker(route_loc_array[i]).bindPopup(route_loc_popup_array[i]).openPopup()
			);
		route_array.push(L.polyline([route_loc_array[i],route_loc_array[i+1]]));
	}
	route_array.push(
		L.marker(route_loc_array[route_loc_array.length-1])
			.bindPopup(route_loc_popup_array[route_loc_popup_array.length-1])
		);
	// final route variable ready to be mapped
	route = L.featureGroup(route_array);
	// setting the map to get the bounds of the map
	/* map.fitBounds(route.getBounds());	*/
	// add the route layer to the map
	/*	map.addLayer(route);				*/
	console.log(route);
	map.addLayer(route);
	route.snakeIn();			
}
	
	
function clear_route(){
	route.clear_snake();	
}


function render_simple(){
	//alert('ss');
	map = L.map('map').setView([42.337317, -71.091045], 15);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		//attribution: '&copy; ' + mapLink + ' Contributors',
		attribution: '<b>&copy; VizDom</b>',
		maxZoom: 18,
		}).addTo(map);
	
	
	var loc_array = [
		{"loc":[42.340966, -71.098470], "title":"Cutie Pie's Home"},
		{"loc":[42.332368, -71.108984], "title":"Babu's Home"},
		{"loc":[42.343774, -71.100441], "title":"Cutie Pie's Shopping"},
		{"loc":[42.333587, -71.104218], "title":"Babu's Shopping"},
	];
	//console.log(loc_array);
	var loc_popup_array = [
		"<b>Cutie Pie </b><br>This is you",
		"<b>Babu </b><br>This is me",
		"<b>Cutie Pie </b><br>This is where you shop my groceries",
		"<b>Babu </b><br>This is where I shop my groceries"
	];
	
	var markersLayer = new L.LayerGroup();	//layer contain searched elements
	map.addLayer(markersLayer);	
	
	// preparing variables for markers and popups
	for (i = 0; i < loc_array.length; i++) { 
		var title = loc_array[i].title,	//value searched
			loc = loc_array[i].loc;		//position found
			marker = new L.marker(new L.latLng(loc), {title: title});
		marker.bindPopup(loc_popup_array[i]);
		markersLayer.addLayer(marker);
	};
	
	
	var circle = L.circle([42.340966, -71.098470], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.2,
		radius: 400
	}).addTo(map);
	
	//marker.bindPopup("<b>Babu !!! </b><br>This is you");
			//.openPopup();
			
	circle.bindPopup("Mein hamesha aas paas hi hu !!!");
	
	
	// for the search bar	
	function customTip(text,val) {
		return '<a href="#">'+text+'<em style="background:'+text+'; width:14px;height:14px;float:right"></em></a>';
	}
	
	map.addControl( new L.Control.Search({
		layer: markersLayer,
		buildTip: customTip,
		autoType: false
	}) );
	
	
	// the side bar
	//var sidebar = L.control.sidebar('sidebar').addTo(map);
	var sidebar = L.control.sidebar('sidebar', {position: 'right'}).addTo(map);
}
