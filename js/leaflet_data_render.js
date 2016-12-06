
// global variable
var map;
var route;
var zoomLevel = 0;
var dPoints;  // testing for global
var count = 0;
const MIN_ZOOM = 3.5;
const MAX_ZOOM = 15;
var current_mapCenter;
var init_mode ;
var brush_mode = false;
var RADIUS = 800000;
var cities = [
				{'latitude':55.963326,'longitude': -3.191736, 'name':'Edinburgh' , 'code':'EDH'},
				{'latitude':49.008558,'longitude': 8.400305 , 'name':'Karlsruhe','code':'BW'},
				{'latitude':45.527082,'longitude': -73.569271 , 'name':'Montreal','code':'QC'},
				{'latitude':43.465754,'longitude': -80.522003 , 'name':'Waterloo','code':'ON'},
				{'latitude':40.439709,'longitude': -79.993550 , 'name':'Pittsburgh','code':'PA'},
				{'latitude':35.232001,'longitude': -80.858802 , 'name':'Charlotte','code':'NC'},
				{'latitude':40.104516,'longitude': -88.228238 , 'name':'Champaign','code':'IL'},
				{'latitude':33.453039,'longitude': -112.081308 , 'name':'Phoenix','code':'AZ'},
				{'latitude':36.222228,'longitude': -115.284912 , 'name':'LasVegas','code':'NV'},
				{'latitude':43.069862,'longitude': -89.428404 , 'name':'Madison','code':'WI'}
			];	
var cf_cities = crossfilter(cities).dimension(function (d) {
													return d.code;
												});

// console.log("print cf cities",cf_cities);

function init_render(){
	//byState = init_data();
	//dataPoints = loadDataOnMap(byState,'AZ');
	init_center =  [55.963326 -5,-3.191736 -20];  //[45.638835, 50.436081+120];//[37.235613, -22.942755];49.638835, -37.436081//35.248855, -43.105153[35.248855, -43.105153];//[37.235613, -22.942755];
	//alert('bb');
	current_mapCenter = init_center;
	render_data(cities,init_center,true);
}

//var selectedCity;  //use global set in sidebar instead; conflict between internal and global?

function onMarkerClick(e) {
	// count = count - 1;
    //console.log("You clicked the map at " + e.latlng.toString());
    //dataPoints = loadDataOnMap('AZ');
	//var result = $.grep(myArray, function(e){ return e.name != selectedCity; });
	//console.log (result);
    clickedLatlng = [e.latlng.lat,e.latlng.lng]; //console.log(clickedLatlng);
    cities.forEach(function(element) {
        if (clickedLatlng[0] == element.latitude && clickedLatlng[1] == element.longitude){
            selectedCity = element.name;
            // console.log(selectedCity);
            		updateData();
			openSideBar(sidebar);
            dataPoints = getCityData(element.name);
            // console.log(dataPoints);
			if(zoomLevel == MIN_ZOOM ){
                for(var i=0;i<cities.length;i++){
                    if (selectedCity==cities[i].name)
                        var city_center = [cities[i].latitude , cities[i].longitude];
                };
				
				current_mapCenter = city_center;
                render_data(dataPoints,city_center,false);
				
			}

        }
       
    });
    if (e.originalEvent.target.title != selectedCity){
        selectedBusiness = e.originalEvent.target.title;
        updateData();
    }
}


var bounds = [
    [14.613103, -130.828446], // Southwest coordinates
    [67.150087, 17.767239]  // Northeast coordinates
];


function render_data(dataPoints,mapCenter,is_init){
	//alert('aa');
	init_mode = is_init;
    // console.log('center',mapCenter);	
	document.getElementById('combinedMap').innerHTML = "<div id='map' style='width: <?php echo $this->width; ?>; height: <?php echo $this->height; ?>;'></div>";
	if (is_init==true){
		zoomLevel = MIN_ZOOM;
	}
	else{
		zoomLevel = MAX_ZOOM;
		if (mapCenter != 0){
			cities.forEach(function(city) {
				if (selectedCity != city.name)
					dataPoints.push(city);
			});
		}
	}
	
	if (mapCenter == 0){
		//alert('ss');
		mapCenter = current_mapCenter;
	}
	
	map = L.map('map').setView(mapCenter,zoomLevel,{animation: true});
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'https://api.mapbox.com/styles/v1/sarita9999/ciwafa38h000o2pmrfnjw40hh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FyaXRhOTk5OSIsImEiOiJjaXVuZjYxcDIwMGpsMnV0NDA5b2pxdGZyIn0.3u24PnGOnV_J1v04ZOLqxw',{
		//'mapbox://styles/sharmodeep/civwpy7ps000m2kr3jma1wy6r'
		//'https://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}',{
		//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		//attribution: '&copy; ' + mapLink + ' Contributors',
		mapId: 'mapbox.mapbox-streets-v7',
		token:'pk.eyJ1Ijoic2FyaXRhOTk5OSIsImEiOiJjaXVuZjYxcDIwMGpsMnV0NDA5b2pxdGZyIn0.3u24PnGOnV_J1v04ZOLqxw',
		attribution: '<b>&copy; VizDom</b>',
		maxZoom: 18,
		minZoom : MIN_ZOOM,
        maxBounds: bounds // Sets bounds as max
		}).addTo(map);
		map.on('zoomend',function(){
			if(map.getZoom() < 4){
				callReset();
			}
	});
	
	var markersLayer = new L.LayerGroup();	//layer contain searched elements
	map.addLayer(markersLayer);//.addTo;

	

    var redIcon = L.icon({
        iconUrl: './images/markerr.png',//'images/Picture1.png',
        iconSize:     [30, 50], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [35, 25], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
	// L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
	// preparing variables for markers and popups
	for (i = 0; i < dataPoints.length; i++) { 

		// var title_marker = "<i style='color: grey;'>Name: </i>"+ dataPoints[i].name + "</br>" + "</br>" + "<i style='color:grey;'>Address: </i> &nbsp;&nbsp;"+ dataPoints[i].full_address+ "</br>" + "<i style='color: grey;'>City: </i> "+dataPoints[i].city + "</br>" + "<i style='color: grey;'>State: </i> "+ dataPoints[i].state+  "<i style='color: grey;'>Category: </i> "+ dataPoints[i].Category + "</br>" + "<img src='./images/star_tool.png' width='10%' height='10%'>  "+ dataPoints[i].stars;	//value searched
		// var title = dataPoints[i].name;	//value searched
		var title_marker = "<i style='color: grey;'>Name: </i>"+ dataPoints[i].name + "</br>" + "</br>" + "<i style='color:grey;'>Address: </i> &nbsp;&nbsp;"+ dataPoints[i].full_address+ "</br>" + "<i style='color: grey;'>City: </i> "+dataPoints[i].city + "</br>" + "<i style='color: grey;'>State: </i> "+ dataPoints[i].state+  "<i style='color: grey;'>Category: </i> "+ dataPoints[i].Category + "</br>" + "<img src='./images/star_tool.png' width='10%' height='10%'>  "+ Math.ceil(dataPoints[i].stars);	//value searched
		var title = dataPoints[i].name;
		//if (is_init == true)
		//	var	loc = dataPoints[i].loc;		//position found
		//else{
			var loc = [dataPoints[i].latitude , dataPoints[i].longitude];
			//console.log(loc);
		//}

		if (selectedCity == "All"){
			marker = new L.marker(new L.latLng(loc),{icon: redIcon, title: title});
		}
		else{
			if(dataPoints[i].Category){
				marker = new L.marker(new L.latLng(loc),{
					icon: L.icon({
						iconUrl: './images/' + dataPoints[i].Category + '.png',//'images/Picture1.png',
						iconSize:     [30, 30], // size of the icon
						shadowSize:   [50, 64], // size of the shadow
						iconAnchor:   [35, 25], // point of the icon which will correspond to marker's location
						shadowAnchor: [4, 62],  // the same for the shadow
						popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
					}),
					title: title});
			}
			
			/*
            var filterCircle1 = L.circle(L.latLng(55.963326, -3.191736), RADIUS, {   //40, -75) 55.963326,'longitude': -3.191736 //40, -75
                opacity: 1,
                weight: 1,
                fillOpacity: 0.4

            });
			*/
		}

		marker.bindPopup(title);
		//if (is_init == true)
		marker.on('click', onMarkerClick);
		markersLayer.addLayer(marker);/*
		if(i == dataPoints.length -1){
			if(is_init ==false){
				var dum;
                //map.addLayer(filterCircle1, true);
                //filterCircle1.setZIndex(10);
			}
		}	*/

	};


	// This is for the text display
	if (is_init == true){
		for (i = 0; i < cities.length; i++) {
			var textDisplay = cities[i].name,	//value searched
				location = [cities[i].latitude , cities[i].longitude];//position found
			var myTextLabel = L.marker(location, {
				icon: L.divIcon({
					className: 'text-labels-new',   // Set class for CSS styling
					html: textDisplay
				})//,
				//draggable: false,       // Allow label dragging...?
				//zIndexOffset: 10
			});

			myTextLabel.addTo(map);
		};
	}
	
	///// Circle 
	//var zoom = map.getZoom();
	//RADIUS = map.getZoom()*200000;
	
	
	
	
	//alert();
	if(brush_mode){
		
		callBrush();
	}
	

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
    


	function gethelper(){
		return dataPoints;
	}

	$("#tester").click(function(){
		if (!brush_mode){
			brush_mode = true;
			callBrush();
		}/*
		else{
			brush_mode = false;
			callBrush();
		}*/
		
	});


	
	
	
    function callBrush(){
        // console.log(dPoints[1]);
        //count = count + 1;
        //console.log('current count',count);
        //var RADIUS = 800000;
        //var circleList = [];
		/*
        var filterCircle = L.circle(L.latLng(55.963326, -3.191736), RADIUS, {   //40, -75) 55.963326,'longitude': -3.191736 //40, -75
            opacity: 1,
            weight: 1,
            fillOpacity: 0.4

        });*///.addTo(map); on("click", circleClick);  .bindPopup("Click reset button to disable");
        //circleList.push(filterCircle);
        //console.log('current list',circleList.length);
        // if(count == 2){
        // count = count -1;}
		var filterCircle = L.circle(L.latLng(current_mapCenter[0],current_mapCenter[1]), RADIUS, {
            opacity: 1,
            weight: 1,
            fillOpacity: 0.4

        });
		if (map.getZoom() == MAX_ZOOM){
			RADIUS = 200; filterCircle.setRadius(RADIUS);
		}if (map.getZoom() == MIN_ZOOM) {RADIUS = 800000; filterCircle.setRadius(RADIUS);}
		console.log(RADIUS, map.getZoom());
	
        if (brush_mode==true ){
			console.log (filterCircle.getRadius()+"\t"+map.getZoom()+"\t FROM CALL BRUSH");
			console.log (brush_mode);
			filterCircle.addTo(map); 
			//brush_mode = false;
		}
		else {
			console.log (filterCircle.getRadius());
			console.log (brush_mode); 
			map.removeLayer(filterCircle); 
		}

        // function circleClick(){
        //     map.removeLayer(filterCircle);
        // }

        var myZoom = {
            start:  map.getZoom(),
            end: map.getZoom()
        };

        map.on('zoomstart', function(e) {
            myZoom.start = map.getZoom();
        });

        map.on('zoomend', function(e) {
            myZoom.end = map.getZoom();
            var diff = myZoom.start - myZoom.end;
            if (diff > 0) {
                filterCircle.setRadius(filterCircle.getRadius() * 2);
            } else if (diff < 0) {
                filterCircle.setRadius(filterCircle.getRadius() / 2);
            } else if (map.getZoom() < 4){
                console.log('enters');
                filterCircle.setRadius(RADIUS);
            }
            // else if(map.getZoom() == MAX_ZOOM){
            	// console.log("It is max zoom");
            	// // count = 0;
             //    circleList[0] = L.Circle(L.latLng(55.963326, -3.191736), RADIUS, {   //40, -75) 55.963326,'longitude': -3.191736 //40, -75
             //        opacity: 1,
             //        weight: 1,
             //        fillOpacity: 0.4
            //
             //    }).addTo(map).bindPopup("Click reset button to disable");
            //
			// };
        });

        map.on('click', function(e){
        	var obj =  [e.latlng.lat,e.latlng.lng];            //{'lat':e.latlng.lat, 'lng':e.latlng.lng};
        	if(count > 0){
                //console.log(arePointsNear1(obj, filterCircle.getLatLng(), filterCircle.getRadius()/1000));
				for(var k =0; k < cities.length; k++){

					if(cities[k].latitude == obj[0] && cities[k].longitude == obj[1]){
						console.log("mmm", cities[k].latitude );
						filterCircle.setRadius(10);
					}
				}
        		// console.log(arePointsNear1(obj, filterCircle.getLatLng(), filterCircle.getRadius()/1000));
			}



		});

        filterCircle.on('mousemove', function(e) {
            filterCircle.setLatLng(e.latlng);
            // console.log(filterCircle.setLatLng(e.latlng));
            // console.log(filterCircle.getRadius(),'radius');
            // console.log(filterCircle.getLatLng(), 'center');
            console.log(filterCircle.getLatLng(), "layer circle 0");
            arePointsNear(filterCircle.getLatLng(),filterCircle.getRadius());
            // getListOfLatLng(filterCircle.getLatLng(),filterCircle.getRadius());
            // setFilter(function showAirport(cs) {
            // 	return e.latlng.distanceTo(L.latLng(
            // 			feature.geometry.coordinates[1],
            // 			feature.geometry.coordinates[0])) < RADIUS;
            // });
        });

        // map.on('mouseup',function(e){
        //     map.removeEventListener('mousemove');
        // })

	// console.log(filterCircle.getLatLng(), "layer circle");
    }

// This function retrieves the array of all selected city. We can then use custom city related files to appropriately plot the data
    function arePointsNear(center,radius_meter){
        // dataPoints1 = getCityData();
        // console.log(dataPoints1);
        // console.log('gives center',center.lat);
        // console.log('gives center',center.lng);
        // console.log('radar',radius_meter);
        var a = [];
        var dataAll = [];
        for (var i = 0; i < dataPoints.length; i++) {
            var title = dataPoints[i].name;	//value searched
            // console.log('title', title);
            //if (is_init == true)
            //	var	loc = dataPoints[i].loc;		//position found
            //else{
            var loc = [dataPoints[i].latitude , dataPoints[i].longitude];
            // console.log('lat',loc);
            if(arePointsNear1(loc,center,radius_meter/1000)){
                // console.log(title);
                // a.push(title);
				a.push(dataPoints[i]);
                // getAllRelevantData(a);
                // break;

            }
            else{
                continue;
            }

        }

        console.log(a, "sss");
		for (i =0 ; i< a.length;i++){
            if(a.length != 0)
            {
                dataAll.push(getBrushData(a[i].name,"All","All",1));
            }
		}
		console.log("Data Found\t"+dataAll.length);


        // getListOfLatLng(center,radius_meter,a);


        // This array returns the list of city within the radius of 70km in the circle
        // once we drill down to city info we can find near by latitude and longitude
        // Important we need to disable the the breaking of cities of the rendering part.
        // otherwise this code breaks then. Once we get the near by city, we may pull the data and check for
        // specific lat n lng on an iteration that plot if it returns a boolean true from the function
        //arePointsNear1



    }

    // function getAllRelevantData(allcities){
     //    console.log(allcities);
     //    // var getAllData = [];
     //    if(allcities.length != 0){
     //        for(i = 0; i < allcities.length;i++){
     //            // console.log(allcities[i].name, "city");
     //            getAllData.push(getBrushData(allcities[i].name,"All","All",1));
    //
     //        }
    //
     //    }
     //    console.log(getAllData);
    //
	// }


    // function getAllRelevantData(city){
    //     // console.log(allcities);
    //     // var getAllData = [];
    //     // if(allcities.length != 0){
    //         for(i = 0; i < allcities.length;i++){
    //             // console.log(allcities[i].name, "city");
    //             getAllData.push(getBrushData(allcities[i].name,"All","All",1));
    //
    //         }
    //
    //     }
    //     console.log(getAllData);
    //
    // }



// csvLayer = Papa.parse('Category-wise-segregation/stores_data.csv', {
// 	complete: function(results) {
// 		console.log(results);
// 	}
// });


// This gives an array of all lat lng in the radius of the circle
    function getListOfLatLng(from_center, km, a){
        if(a.length != 0) {
            var file = "City-wise-aggregate/".concat(a[0].toString().toLowerCase().concat("_data.csv"));
            //console.log(file);
            var listoflatlng = [];
            var ky = 40000 / 360;
            var kx = Math.cos(Math.PI * from_center.lat / 180.0) * ky;
            specificCity = Papa.parse(file, {
                complete: function(results) {
                    console.log(results);
                }
            });

            // console.log(specificCity[data]);
        }

    }



//
    function arePointsNear1(checkPoint, centerPoint, km) {

        //console.log('enter main logic');
        //console.log('print checkpoint', checkPoint[0]);
        //console.log('print checkpoint1', checkPoint[1]);
        var ky = 40000 / 360;
        var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng - checkPoint[1]) * kx;
        var dy = Math.abs(centerPoint.lat - checkPoint[0]) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }





}

// // add AreaSelect with keepAspectRatio:true
// var areaSelect = L.AreaSelect({
// 	width:100,
// 	height:150,
// 	keepAspectRatio:true
// });
// areaSelect.addTo(map);

function callReset(){
	// init_render();
	count = 0;

	d3.selectAll('.star').style('fill','transparent');
	console.log("Entered end",selectedCity);
	selectedCity = "All";
	selectedCategory ="All";
	selectedBusiness = "All";
	updateData();
    init_render();

	// openSideBar(sidebar);
}
// Brushing feature

// function callBrush(){
// 	// console.log(dPoints[1]);
// 	count = count + 1;
// 	console.log('current count',count);
// 	var RADIUS = 800000;
// 	var circleList = [];
// 	var filterCircle = L.circle(L.latLng(40, -75), RADIUS, {
// 		opacity: 1,
// 		weight: 1,
// 		fillOpacity: 0.4
//
// 	});//.addTo(map); on("click", circleClick);
// 	circleList.push(filterCircle);
//
// 	if (count ==1 ){circleList[0].addTo(map).bindPopup("Click reset button to disable");}
//
// 	function circleClick(){
// 		map.removeLayer(filterCircle);
// 	}
//
// 	var myZoom = {
// 		start:  map.getZoom(),
// 		end: map.getZoom()
// 	};
//
// 	map.on('zoomstart', function(e) {
// 		myZoom.start = map.getZoom();
// 	});
//
// 	map.on('zoomend', function(e) {
// 		myZoom.end = map.getZoom();
// 		var diff = myZoom.start - myZoom.end;
// 		if (diff > 0) {
// 			filterCircle.setRadius(filterCircle.getRadius() * 2);
// 		} else if (diff < 0) {
// 			filterCircle.setRadius(filterCircle.getRadius() / 2);
// 		} else if (map.getZoom() < 4){
// 			console.log('enters');
// 			filterCircle.setRadius(RADIUS);
// 		}
// 	});
//
// 	filterCircle.on('mousemove', function(e) {
// 		filterCircle.setLatLng(e.latlng);
// 		// console.log(filterCircle.setLatLng(e.latlng));
// 		// console.log(filterCircle.getRadius(),'radius');
// 		// console.log(filterCircle.getLatLng(), 'center');
// 		arePointsNear(filterCircle.getLatLng(),filterCircle.getRadius());
// 		// getListOfLatLng(filterCircle.getLatLng(),filterCircle.getRadius());
// 		// setFilter(function showAirport(cs) {
// 		// 	return e.latlng.distanceTo(L.latLng(
// 		// 			feature.geometry.coordinates[1],
// 		// 			feature.geometry.coordinates[0])) < RADIUS;
// 		// });
// 	});
//
// 	map.on('mouseup',function(e){
// 		map.removeEventListener('mousemove');
// 	})
//
//
// }
//
// // This function retrieves the array of all selected city. We can then use custom city related files to appropriately plot the data
// function arePointsNear(center,radius_meter){
// 	// dataPoints1 = getCityData();
// 	// console.log(dataPoints1);
// 	// console.log('gives center',center.lat);
// 	// console.log('gives center',center.lng);
// 	// console.log('radar',radius_meter);
// 	var a = [];
// 	for (i = 0; i < dataPoints.length; i++) {
// 		var title = dataPoints[i].name;	//value searched
// 		console.log('title', title);
// 		//if (is_init == true)
// 		//	var	loc = dataPoints[i].loc;		//position found
// 		//else{
// 		var loc = [dataPoints[i].latitude , dataPoints[i].longitude];
// 		console.log('lat',loc);
// 		if(arePointsNear1(loc,center,radius_meter/1000)){
// 			console.log(title);
// 			a.push(title);
// 			// break;
//
// 		}
// 		else{
// 			continue;
// 		}
//
// 	}
//
// 	console.log(a);
// 	getListOfLatLng(center,radius_meter,a);
//
//
// 	// This array returns the list of city within the radius of 70km in the circle
// 	// once we drill down to city info we can find near by latitude and longitude
// 	// Important we need to disable the the breaking of cities of the rendering part.
// 	// otherwise this code breaks then. Once we get the near by city, we may pull the data and check for
// 	// specific lat n lng on an iteration that plot if it returns a boolean true from the function
// 	//arePointsNear1
//
//
//
// }
//
// // csvLayer = Papa.parse('Category-wise-segregation/stores_data.csv', {
// // 	complete: function(results) {
// // 		console.log(results);
// // 	}
// // });
//
//
// // This gives an array of all lat lng in the radius of the circle
// function getListOfLatLng(from_center, km, a){
// 	if(a.length != 0) {
// 		var file = "City-wise-aggregate/".concat(a[0].toString().toLowerCase().concat("_data.csv"));
// 		console.log(file);
// 		var listoflatlng = [];
// 		var ky = 40000 / 360;
// 		var kx = Math.cos(Math.PI * from_center.lat / 180.0) * ky;
// 		specificCity = Papa.parse(file, {
// 			complete: function(results) {
// 				console.log(results);
// 			}
// 		});
//
// 		// console.log(specificCity[data]);
// 	}
//
// }
//
//
//
// //
// function arePointsNear1(checkPoint, centerPoint, km) {
// 	console.log('enter main logic');
// 	console.log('print checkpoint', checkPoint[0]);
// 	console.log('print checkpoint1', checkPoint[1]);
// 	var ky = 40000 / 360;
// 	var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
// 	var dx = Math.abs(centerPoint.lng - checkPoint[1]) * kx;
// 	var dy = Math.abs(centerPoint.lat - checkPoint[0]) * ky;
// 	return Math.sqrt(dx * dx + dy * dy) <= km;
// }


// var csvLayer =
// 	filterCircle.on('mousemove', function(e) {
// 		filterCircle.setLatLng(e.latlng);
// 		setFilter(function showAirport(cs) {
// 			return e.latlng.distanceTo(L.latLng(
// 					feature.geometry.coordinates[1],
// 					feature.geometry.coordinates[0])) < RADIUS;
// 		});
// 	});

// var csvLayer = omnivore.csv('Category-wise-segregation/stores_data.csv', null, L.mapbox.featureLayer())
// 	.addTo(map);
//
// map.on('mousemove', function(e) {
// 	filterCircle.setLatLng(e.latlng);
// 	csvLayer.setFilter(function showAirport(feature) {
// 		return e.latlng.distanceTo(L.latLng(
// 				feature.geometry.coordinates[1],
// 				feature.geometry.coordinates[0])) < RADIUS;
// 	});
// });
//