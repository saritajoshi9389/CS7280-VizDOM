
// global variable
var map_right;
var route;

function render_small_right(mapCenter,dataPoints){
	//alert(latLong);
	document.getElementById('rightMap').innerHTML = "<div id='map-right' style='width: <?php echo $this->width; ?>; height: <?php echo $this->height; ?>;'></div>";
	map_right = L.map('map-right').setView(mapCenter, 12);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		//attribution: '&copy; ' + mapLink + ' Contributors',
		attribution: '<b>&copy; VizDom</b>',
		//minZoom : 9,
		maxZoom : 18
		}).addTo(map_right);
		
		
	var markersLayer = new L.LayerGroup();	//layer contain searched elements
	map_right.addLayer(markersLayer);

    var redIcon = L.icon({
        iconUrl: './images/pinmarker.png',//'images/Picture1.png',
        iconSize:     [30, 30], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [35, 25], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

	// L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
	// preparing variables for markers and popups
	if (dataPoints.length>500){var plot = 500;}else{var plot = dataPoints.length;}
	for (i = 0; i < plot; i++) {
		var title = dataPoints[i].name;	//value searched
		//if (is_init == true)
		//	var	loc = dataPoints[i].loc;		//position found
		//else{
			var loc = [dataPoints[i].latitude , dataPoints[i].longitude];
			//console.log(loc);
		//}


        if (dataPoints[i].Category) {
            marker = new L.marker(new L.latLng(loc), {
                icon: L.icon({
                    iconUrl: './images/' + dataPoints[i].Category + '.png',//'images/Picture1.png',
                    iconSize: [30, 30], // size of the icon
                    shadowSize: [50, 64], // size of the shadow
                    iconAnchor: [35, 25], // point of the icon which will correspond to marker's location
                    shadowAnchor: [4, 62],  // the same for the shadow
                    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
                }),
                title: title
            });
        }


		marker.bindPopup(title);
		//if (is_init == true)
			marker.on('click', onMarkerClick);
		markersLayer.addLayer(marker);
	};

	/*
	// for the search bar
	function customTip(text,val) {
		return '<a href="#">'+text+'<em style="background:'+text+'; width:14px;height:14px;float:right"></em></a>';
	}

	map.addControl( new L.Control.Search({
		layer: markersLayer,
		buildTip: customTip,
		autoType: false
	}) );
	*/

}
