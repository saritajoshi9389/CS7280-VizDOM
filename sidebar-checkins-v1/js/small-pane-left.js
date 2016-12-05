
// global variable
var map_left;
var route;

function render_small_left(mapCenter,dataPoints){
	//alert(latLong);
	document.getElementById('leftMap').innerHTML = "<div id='map-left' style='width: <?php echo $this->width; ?>; height: <?php echo $this->height; ?>;'></div>";
	map_left = L.map('map-left').setView(mapCenter, 12);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'https://api.mapbox.com/styles/v1/sarita9999/civx13ftr000z2kqm34rws3hn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FyaXRhOTk5OSIsImEiOiJjaXVuZjYxcDIwMGpsMnV0NDA5b2pxdGZyIn0.3u24PnGOnV_J1v04ZOLqxw',{
		mapId: 'mapbox.mapbox-streets-v7',
		token:'pk.eyJ1Ijoic2FyaXRhOTk5OSIsImEiOiJjaXVuZjYxcDIwMGpsMnV0NDA5b2pxdGZyIn0.3u24PnGOnV_J1v04ZOLqxw',
		attribution: '<b>&copy; VizDom</b>',
		//minZoom : 9,
		maxZoom : 18
		}).addTo(map_left);
		
		
	var markersLayer_left = new L.LayerGroup();	//layer contain searched elements
	map_left.addLayer(markersLayer_left);

	/*
	var greenIcon = L.icon({
		iconUrl: 'images/Picture1.png',
		iconSize:     [30, 30], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [35, 25], // point of the icon which will correspond to marker's location
		shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	});
	console.log(dataPoints);
	*/



 /*
    // L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
    // preparing variables for markers and popups
    for (i = 0; i < dataPoints.length; i++) {
        var title = dataPoints[i].name;	//value searched
        //if (is_init == true)
        //	var	loc = dataPoints[i].loc;		//position found
        //else{
        var loc = [dataPoints[i].latitude, dataPoints[i].longitude];
        //console.log(loc);
        //}

        if (selectedCity == "All") {
            marker = new L.marker(new L.latLng(loc), {icon: redIcon, title: title});
        }
        else {
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
            markersLayer_left.addLayer(marker);
        };

    }
*/


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
		//marker = new L.marker(new L.latLng(loc),{icon: redIcon, title: title});


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
		markersLayer_left.addLayer(marker);

	};

	
	
	// for the search bar
	function customTip(text,val) {
		return '<a href="#">'+text+'<em style="background:'+text+'; width:14px;height:14px;float:right"></em></a>';
	}
	
	map_left.addControl( new L.Control.Search({
		layer: markersLayer_left,
		buildTip: customTip,
		autoType: false
	}) );

}
