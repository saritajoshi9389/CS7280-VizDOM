
// global variable
var map;
var route;
var cities = [
				{'loc':[55.963326, -3.191736], 'name':'Edinburgh' , 'code':'EDH'},
				{'loc':[49.008558, 8.400305] , 'name':'Karlsruhe','code':'BW'},
				{'loc':[45.527082, -73.569271] , 'name':'Montreal','code':'QC'},
				{'loc':[43.465754, -80.522003] , 'name':'Waterloo','code':'ON'},
				{'loc':[40.439709, -79.993550] , 'name':'Pittsburgh','code':'PA'},
				{'loc':[35.232001, -80.858802] , 'name':'Charlotte','code':'NC'},
				{'loc':[40.104516, -88.228238] , 'name':'Urbana','code':'IL'},
				{'loc':[33.453039, -112.081308] , 'name':'Phoenix','code':'AZ'},
				{'loc':[36.222228, -115.284912] , 'name':'LasVegas','code':'NV'},
				{'loc':[43.069862, -89.428404] , 'name':'Madison','code':'WI'}
			];	
var cf_cities = crossfilter(cities).dimension(function (d) {
													return d.code;
												});

function init_render(){
	//byState = init_data();
	//dataPoints = loadDataOnMap(byState,'AZ');
	init_center = [35.248855, -43.105153];//[37.235613, -22.942755];
	render_data(cities,init_center);
}


function onMarkerClick(e) {
    //console.log("You clicked the map at " + e.latlng.toString());
    //dataPoints = loadDataOnMap('AZ');
    clickedLatlng = [e.latlng.lat,e.latlng.lng];
    cities.forEach(function(element) {
        if (clickedLatlng[0] == element.loc[0] && clickedLatlng[1] == element.loc[1]){
            var selectedCity = element.name;
            console.log(selectedCity);
            updateData(selectedCity);
			openSideBar(sidebar);
            //dataPoints = loadDataOnMap(element.code);
            //console.log(dataPoints);
        }
        else{/*
         console.log('clickedLatlng',clickedLatlng);
         console.log(element.loc);
         console.log('N');*/
        }
    });
}


var bounds = [
    [14.613103, -130.828446], // Southwest coordinates
    [67.150087, 17.767239]  // Northeast coordinates
];

function render_data(dataPoints,mapCenter){
	//alert('ss');
	
	map = L.map('map').setView(mapCenter, 3.5);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'https://api.mapbox.com/styles/v1/sarita9999/civx13ftr000z2kqm34rws3hn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FyaXRhOTk5OSIsImEiOiJjaXVuZjYxcDIwMGpsMnV0NDA5b2pxdGZyIn0.3u24PnGOnV_J1v04ZOLqxw',{
		//'mapbox://styles/sharmodeep/civwpy7ps000m2kr3jma1wy6r'
		//'https://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}',{
		//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		//attribution: '&copy; ' + mapLink + ' Contributors',
		mapId: 'mapbox.mapbox-streets-v7',
		token:'pk.eyJ1Ijoic2FyaXRhOTk5OSIsImEiOiJjaXVuZjYxcDIwMGpsMnV0NDA5b2pxdGZyIn0.3u24PnGOnV_J1v04ZOLqxw',
		attribution: '<b>&copy; VizDom</b>',
		maxZoom: 18,
		minZoom : 3,
            maxBounds: bounds // Sets bounds as max
		}).addTo(map);
	
	
	var markersLayer = new L.LayerGroup();	//layer contain searched elements
	map.addLayer(markersLayer);

	var greenIcon = L.icon({
		iconUrl: 'images/Picture1.png',
		iconSize:     [30, 30], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [35, 25], // point of the icon which will correspond to marker's location
		shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	});

	// L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
	// preparing variables for markers and popups
	for (i = 0; i < dataPoints.length; i++) { 
		var title = dataPoints[i].name,	//value searched
			loc = dataPoints[i].loc;		//position found
			marker = new L.marker(new L.latLng(loc),{icon: greenIcon, title: title});
		marker.bindPopup(title);
		marker.on('click', onMarkerClick);
		markersLayer.addLayer(marker);
	};

	// This is for the text display
    for (i = 0; i < dataPoints.length; i++) {
        var textDisplay = dataPoints[i].name,	//value searched
            location = dataPoints[i].loc;		//position found
        var myTextLabel = L.marker(location, {
            icon: L.divIcon({
                className: 'text-labels-new',   // Set class for CSS styling
                html: textDisplay
            }),
            draggable: false,       // Allow label dragging...?
            zIndexOffset: 1000
        });

        myTextLabel.addTo(map);
    };
   

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
	var sidebar = L.control.sidebar('sidebar', {position: 'right',autoPan:true}).addTo(map);
	setTimeout(function () {
      defaultOpenUp(sidebar);
	}, 2000);
}
