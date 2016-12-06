//make yelpData a global
var yelpData, checkinData, cityBusinesses, cityCategories;

//set value to all cities for first load
var selectedCity = "All";
var selectedCategory = "All";
var selectedBusiness = "All";
var selectedStar = "All";
var starInput = true;

var dummyArray = ["Madison","Montreal"];
var areaSelection = false;

//reset the window to the first panel when the page first loads (otherwise, the browser cache stores the last anchor point)
window.location.href='#';

queue()
    .defer(d3.csv, "./Final_Data_With_Categories_112616.csv")
    .defer(d3.csv, './category_daily_checkin.csv')//daily_star_city.csv')//
    .defer(d3.csv, './businesses_per_city.csv')
    .defer(d3.csv, './categories_per_city.csv')
    .defer(d3.csv, './Business_star_data.csv')
    //wait for a variable to be returned for each file loaded: blocks from blk_group file, neighborhoods from bos_neighborhoods, and income from the parsed acs.csv.
    .await(function (err, dataIn, checkinDataIn, businessesIn, categoriesIn,businessStars) {

        yelpData = dataIn;  //data stored as global for access from all functions
        checkinData = checkinDataIn;

        cityBusinesses = businessesIn;
        cityCategories = categoriesIn;

        updateData('All','All','All');  //update expects selected city name; "All" returns a null filter, which gives all values in the original csv
		//compare_cities ('Edinburgh', 'Karlsruhe');
    });


function getCityData(selectedCity){
    cf = crossfilter(yelpData);

    byCity = cf.dimension(function (d) {
        return d.city;
    });
    if (selectedCity === 'Urbana')
        selectedCity = 'Champaign';
    if (selectedCity === 'LasVegas')
        selectedCity = 'Las Vegas';
    byCity.filter(); //clear filter
    cityData = byCity.filterExact(selectedCity).top(Infinity);
    return cityData;
}


//called on first load and when cityDropdown value changes; accepts city name, which is then applied for filtering
function updateData(){//selectedCity, selectedCategory, selectedBusiness) {

    if (selectedBusiness != "All"){
        selectedStar = "All";
    }

    //set up initial crossfilter
    //note: need to update the global version, so that update function has access to it later
    cf = crossfilter(yelpData);

    byCity = cf.dimension(function (d) {
        return d.city;
    });

    //update HTML labels and set a filter on the city data
    if(selectedCity == "All"){
        if (selectedCategory == "All"){
            d3.selectAll('#city-name').html('All Cities');
            d3.selectAll('#avg-review').html('All Cities');
        }
        else {
            d3.selectAll('#city-name').html('All Cities' + ', '+ selectedCategory);
            d3.selectAll('#avg-review').html('All Cities');
        }

        if (dummyArray.length != 0){
            cityData = byCity.filter().top(Infinity);
        }
        else {
            cityData = byCity.filter().top(Infinity);
        }

    }

    else if (selectedBusiness == "All") {

        if (selectedCity === 'Urbana-Champaign' || selectedCity === 'Urbana' )
            selectedCity = 'Champaign';
        if (selectedCity === 'LasVegas')
            selectedCity = 'Las Vegas';

        if (selectedCategory == "All"){
            d3.selectAll('#city-name').html(selectedCity);
        }
        else {
            d3.selectAll('#city-name').html(selectedCity + ', '+ selectedCategory);
        }

        byCity.filter(); //clear filter
        cityData = byCity.filterExact(selectedCity).top(Infinity); //filter by city
        //console.log(cityData);
    }
    else{  //business is selected
        d3.selectAll('#city-name').html(selectedBusiness);
        byCity.filter(); //clear filter
        cityData = byCity.filterExact(selectedCity).top(Infinity); //filter by city
    }

    //filter by category, if appropriate
    catCf = crossfilter(cityData);
    byCategory = catCf.dimension(function(d){ return d.Category});

    //update HTML labels and set a filter on the city data
    if(selectedCategory == "All"){
        //console.log('all');
        categoryData = byCategory.filter().top(Infinity);
    }
    else {
        //console.log('filtering');
        byCategory.filter(); //clear filter
        categoryData = byCategory.filterExact(selectedCategory).top(Infinity); //filter by category
    }

    //filter by business, if appropriate
    busCf = crossfilter(categoryData);

    byBusiness = busCf.dimension(function(d){ return d.name}); //d.business_id});

    //update HTML labels and set a filter on the city data
    if(selectedBusiness == "All"){
        businessData = byBusiness.filter().top(Infinity);
    }
    else {
        byBusiness.filter(); //clear filter
        var businessData = byBusiness.filterExact(selectedBusiness).top(Infinity); //filter by category
    }

    //sort the cityData array by review count (descending order)
    //this is just a standard JS sort - it looks like crossfilter's order function might do the same thing.
    var businessSorted = businessData.sort(function(a,b){
        return +b.review_count - +a.review_count; // + just coerces type to avoid string arithmetic
    });


    //return an array of the top 10 businesses in the selected city(ies), based on # reviews
    var cityTop10Reviews = businessSorted.slice(0,10);


    //make a new (secondary) crossfilter on the results on the final city, category, business filter
    selectedCityStars = crossfilter(businessData);

    //create a dimension using the star ratings for the selected city
    selectedStars = selectedCityStars.dimension(function(d){
        return Math.ceil((d.stars/5)*5);
    });

    if(selectedBusiness == "All" && selectedStar != "All"){
        starFilter = selectedStars.filter(function(d){ return +d <= selectedStar});
    }
    else{
        starFilter = selectedStars;
    }

	
    var starSubset = starFilter.top(Infinity);

	if (selectedStar != "All" && !init_mode){
		render_data(starSubset,0,false);
	}

    var starSubsetCf = crossfilter(starSubset);

    starSubsetbyStars = starSubsetCf.dimension(function(d){
        return Math.ceil((d.stars/5)*5);
    });

    //group the data into bins for each star rating
    avgStarsGrouped = starSubsetbyStars.group().all();

    var sumStars = 0;
    var totalStars = 0;
    var starHist = [];

    //go through the array, and sum up the total # of stars and the rating values
    //also, format an object for the histogram draw function
    for (var i = 0; i<avgStarsGrouped.length; i++){
        sumStars += avgStarsGrouped[i].key*avgStarsGrouped[i].value;
        totalStars += avgStarsGrouped[i].value;
        starHist.push({bin:avgStarsGrouped[i].key, count:avgStarsGrouped[i].value});
    }
        if (starHist.length < 5){
        for (var i = 1; i<=5; i++){
            var checkStars = [];
             checkStars = starHist.filter(function(d){return d.bin == i});
            if (checkStars.length == 0){
                starHist.push({bin:i,count:0});
            }
        }
    }

    starHist.sort(function(b,a){return b.bin -a.bin});

    //update the HTML label with the average star rating values
    d3.selectAll('#avg-stars').html('Avg. Stars: ' + (sumStars/totalStars).toFixed(2));

    if (selectedBusiness != "All"){
        d3.selectAll('.star').style('fill','transparent');

        for (var k=1; k<= Math.ceil(sumStars/totalStars).toFixed(2);k++){
            d3.select('#star'+ k).style('fill','#ffde26');
        }
    }


    starCf = crossfilter(starFilter.top(Infinity));

    //set up another dimension for review counts (note: dimensions are expensive, and should be kept to a minimum where possible)
    var byReviews = starCf.dimension(function(d){
        return d.review_count;
    });



    //set the HTML indicators to the appropriate value
    d3.selectAll('#num-reviews').html('# Reviews: ' +byReviews.groupAll().reduceSum(function(fact)
            //seems to be a NaN somewhere in the file, and that returns NaN for the whole dataset
        {if (isNaN(+fact.review_count)){
            return 0;
        }
        else {
            return +fact.review_count;
        }}).value().toLocaleString());

    //set up a histogram array for the review information
    var histogramBins = [];

    for (var i=1; i<11; i++ ){
        var tempBin = byReviews.filterRange([10*i,10*(i+1)]).top(Infinity).length;

        histogramBins.push({
            bin:i,
            width:25,
            count:tempBin
        })
    }


    var checkinBins = [];

    if(selectedCity == "All"){

        //remove all but the selected category from the array
        var catFilter = checkinData.filter(function(d){ return d.category == selectedCategory});

        if (catFilter[0].star){
            var starFilter = checkinData.filter(function(d){return d.star == selectedStar});

            catFilter = starFilter;

        }

             catFilter.forEach(function(d,i) {

            d.total = 0;

            for (var j = 0; j < 7; j++) {
                var num = "day_" + j;
                d.total += +d[num];
            }
            checkinBins.push({
                bin: i,
                city: d.City,
                count: d.total
            });

        });


        checkinBins.sort(function(a,b){return b.count - a.count});
        //console.log(checkinBins);
    }
    else if (selectedBusiness == "All"){
        //remove all but the selected category from the array
        var catFilter = checkinData.filter(function(d){ return d.category == selectedCategory});

        if (catFilter[0].star){
            var starFilter = checkinData.filter(function(d){return d.star == selectedStar});

            catFilter = starFilter;

        }

        var tempCheckins = catFilter.filter(function(d){return d.City == selectedCity});
        checkinBins = [{day:"Su", bin:0,count:tempCheckins[0].day_0},
            {day:"M", bin:1,count:tempCheckins[0].day_1},
            {day:"T", bin:2,count:tempCheckins[0].day_2},
            {day:"W", bin:3,count:tempCheckins[0].day_3},
            {day:"R", bin:4,count:tempCheckins[0].day_4},
            {day:"F", bin:5,count:tempCheckins[0].day_5},
            {day:"Sa", bin:6,count:tempCheckins[0].day_6}];
    }
    else {
        console.log('in else statement');
        checkinBins = [{day:"Su", bin:0,count:0},
                        {day:"M", bin:1,count:0},
                        {day:"T", bin:2,count:0},
                        {day:"W", bin:3,count:0},
                        {day:"R", bin:4,count:0},
                        {day:"F", bin:5,count:0},
                        {day:"Sa", bin:6,count:0}];

        businessData.forEach(function(d){
            checkinBins[0].count += +d.day_0;
            checkinBins[1].count += +d.day_1;
            checkinBins[2].count += +d.day_2;
            checkinBins[3].count += +d.day_3;
            checkinBins[4].count += +d.day_4;
            checkinBins[5].count += +d.day_5;
            checkinBins[6].count += +d.day_6;
        })

    }

    var countBins;

    if (selectedCity == "All"){

    }
    else if (selectedBusiness == "All") {
        countBins = cityCategories.filter(function(d){return d.City == selectedCity});
    }

    //if the bar-group selection returns null, a bar group has not yet been defined, and the sidebar needs to be initialized
    if (selectedCity == "All" && selectedCategory == "All" && selectedBusiness == "All"){
    		
	//clear out old SVGS before re-drawing
	
	d3.selectAll('#sidebar1SVG').remove();
	d3.selectAll('#sidebar2SVG').remove();
	d3.selectAll('#sidebar3SVG').remove();
	d3.selectAll('#sidebar4SVG').remove();
	d3.selectAll('#sidebar5SVG').remove();

        drawSidebar(1,histogramBins); 	// reviews
        drawSidebar(2,starHist);
        drawSidebar(3,checkinBins);
        //drawSidebar(5,countBins);
    }
    //otherwise, just call the update function with new data
    else {
        updateHistogram(1,histogramBins);
        updateHistogram(2,starHist);
        if (selectedCity != "All" && d3.selectAll('.bar-group-4')._groups[0].length == 0){
            drawSidebar(4,checkinBins);
        }
        else if(selectedCity == "All" && d3.selectAll('.bar-group-4')._groups[0].length == 0){
            updateHistogram(3,checkinBins);
        }
        else {
            updateHistogram(4,checkinBins);
        }

    }

}



function radioCategory(catIn){
    selectedCategory = catIn;
    updateData(selectedCity, catIn, selectedBusiness);
}



 
 //called on first load and when cityDropdown value changes; accepts city name, which is then applied for filtering
function getCompareSideBySideData(city, cat_sidebyside, bus_sidebyside, comaparison_city_num){//city, cat_sidebyside, bus_sidebyside) {

    //set up initial crossfilter
    //note: need to update the global version, so that update function has access to it later
    var cf = crossfilter(yelpData);

    var byCity = cf.dimension(function (d) {
        return d.city;
    });
	// console.log('checkin', byCity);
	document.getElementById('compareCities'+comaparison_city_num+'_header').innerHTML = city+' Overview';

    //update HTML labels and set a filter on the city data
    if(city == "All"){
        if (cat_sidebyside == "All"){
            d3.selectAll('#city-name').html('All Cities');
            d3.selectAll('#avg-review').html('All Cities');
        }
        else {
            d3.selectAll('#city-name').html('All Cities' + ', '+ cat_sidebyside);
            d3.selectAll('#avg-review').html('All Cities');
        }
        cityData = byCity.filter().top(Infinity);
    }

    else if (bus_sidebyside == "All") {

        if (city === 'Urbana-Champaign' || city === 'Urbana' )
            city = 'Champaign';
        if (city === 'LasVegas')
            city = 'Las Vegas';

        if (cat_sidebyside == "All"){
            d3.selectAll('#city-name').html(city);
        }
        else {
            d3.selectAll('#city-name').html(city + ', '+ cat_sidebyside);
        }

        byCity.filter(); //clear filter
        cityData = byCity.filterExact(city).top(Infinity); //filter by city
    }
    else{  //business is selected
        d3.selectAll('#city-name').html(bus_sidebyside);
        byCity.filter(); //clear filter
        cityData = byCity.filterExact(city).top(Infinity); //filter by city
    }

    //filter by category, if appropriate
    catCf = crossfilter(cityData);
    byCategory = catCf.dimension(function(d){ return d.Category});

    //update HTML labels and set a filter on the city data
    if(cat_sidebyside == "All"){
        categoryData = byCategory.filter().top(Infinity);
    }
    else {
        byCategory.filter(); //clear filter
        categoryData = byCategory.filterExact(cat_sidebyside).top(Infinity); //filter by category
    }

    //filter by business, if appropriate
    busCf = crossfilter(categoryData);
    byBusiness = busCf.dimension(function(d){ return d.business_id});

    //update HTML labels and set a filter on the city data
    if(bus_sidebyside == "All"){
        businessData = byBusiness.filter().top(Infinity);
    }
    else {
        byBusiness.filter(); //clear filter
        var businessData = byBusiness.filterExact(bus_sidebyside).top(Infinity); //filter by category
    }

    //sort the cityData array by review count (descending order)
    //this is just a standard JS sort - it looks like crossfilter's order function might do the same thing.
    var businessSorted = businessData.sort(function(a,b){
        return +b.review_count - +a.review_count; // + just coerces type to avoid string arithmetic
    });

    //return an array of the top 10 businesses in the selected city(ies), based on # reviews
    var cityTop10Reviews = businessSorted.slice(0,10);

    //set up another dimension for review counts (note: dimensions are expensive, and should be kept to a minimum where possible)
    var byReviews = busCf.dimension(function(d){
        return d.review_count;
    });


    //set the HTML indicators to the appropriate value
    d3.selectAll('#num-reviews').html('# Reviews: ' +byReviews.groupAll().reduceSum(function(fact)
            //seems to be a NaN somewhere in the file, and that returns NaN for the whole dataset
        {if (isNaN(+fact.review_count)){
            return 0;
        }
        else {
            return +fact.review_count;
        }}).value().toLocaleString());

    //make a new (secondary) crossfilter on the results on the final city, category, business filter
    cityStars = crossfilter(businessData);

    //create a dimension using the star ratings for the selected city
    selectedStars = cityStars.dimension(function(d){
        return Math.ceil((d.stars/5)*5);
    });

    //group the data into bins for each star rating
    avgStarsGrouped = selectedStars.group().all();

    var sumStars = 0;
    var totalStars = 0;
    var starHist = [];

    //go through the array, and sum up the total # of stars and the rating values
    //also, format an object for the histogram draw function
    for (var i = 0; i<avgStarsGrouped.length; i++){
        sumStars += avgStarsGrouped[i].value*(i+1);
        totalStars += avgStarsGrouped[i].value;
        starHist.push({bin:avgStarsGrouped[i].key, count:avgStarsGrouped[i].value});
    }

    //update the HTML label with the average star rating values
    d3.selectAll('#avg-stars').html('Avg. Stars: ' + (sumStars/totalStars).toFixed(2));

    //set up a histogram array for the review information
    var histogramBins = [];

    for (var i=1; i<11; i++ ){
        var tempBin = byReviews.filterRange([10*i,10*(i+1)]).top(Infinity).length;

        histogramBins.push({
            bin:i,
            width:25,
            count:tempBin
        })
    }


    var checkinBins_compare = [];


    if(city == "All"){
        //remove all but the selected category from the array
        var catFilter = checkinData.filter(function(d){ return d.category == selectedCategory});

        if (catFilter[0].star){
            var starFilter = checkinData.filter(function(d){return d.star == selectedStar});

            catFilter = starFilter;

        }


        catFilter.forEach(function(d,i) {

            d.total = 0;

            for (var j = 0; j < 7; j++) {
                var num = "day_" + j;
                d.total += +d[num];
            }
            checkinBins_compare.push({
                bin: i,
                city: d.City,
                count: d.total
            });

        });


        checkinBins_compare.sort(function(a,b){return b.count - a.count});

    }
    else if (selectedBusiness == "All"){
        //remove all but the selected category from the array
        var catFilter = checkinData.filter(function(d){ return d.category == selectedCategory});

        if (catFilter[0].star){
            var starFilter = checkinData.filter(function(d){return d.star == selectedStar});

            catFilter = starFilter;

        }

        var tempCheckins = catFilter.filter(function(d){return d.City == city});
        checkinBins_compare = [{day:"Su", bin:0,count:tempCheckins[0].day_0},
            {day:"M", bin:1,count:tempCheckins[0].day_1},
            {day:"T", bin:2,count:tempCheckins[0].day_2},
            {day:"W", bin:3,count:tempCheckins[0].day_3},
            {day:"R", bin:4,count:tempCheckins[0].day_4},
            {day:"F", bin:5,count:tempCheckins[0].day_5},
            {day:"Sa", bin:6,count:tempCheckins[0].day_6}];
    }
    else {
        checkinBins_compare = [{day:"Su", bin:0,count:0},
            {day:"M", bin:1,count:0},
            {day:"T", bin:2,count:0},
            {day:"W", bin:3,count:0},
            {day:"R", bin:4,count:0},
            {day:"F", bin:5,count:0},
            {day:"Sa", bin:6,count:0}];

        businessData.forEach(function(d){
            checkinBins_compare[0].count += +d.day_0;
            checkinBins_compare[1].count += +d.day_1;
            checkinBins_compare[2].count += +d.day_2;
            checkinBins_compare[3].count += +d.day_3;
            checkinBins_compare[4].count += +d.day_4;
            checkinBins_compare[5].count += +d.day_5;
            checkinBins_compare[6].count += +d.day_6;
        })

    }






	
    //if the bar-group selection returns null, a bar group has not yet been defined, and the sidebar needs to be initialized
    if (d3.selectAll('.bar-group-1_1')._groups[0].length == 0){
		//console.log('reached');
        drawSideBySide(1,histogramBins,comaparison_city_num); 	// reviews
        drawSideBySide(2,starHist,comaparison_city_num);
        drawSideBySide(4,checkinBins_compare,comaparison_city_num);
    }


}






function getBrushData(city,cat_sidebyside, bus_sidebyside, comaparison_city_num) {

    //set up initial crossfilter
    //note: need to update the global version, so that update function has access to it later
    var cf = crossfilter(yelpData);
    // console.log(yelpData);
    var byCity = cf.dimension(function (d) {
        return d.city;
    });

    // update HTML labels and set a filter on the city data
    if(city == "All"){

        cityData = byCity.filter().top(Infinity);
    }

    else if (bus_sidebyside == "All") {

        if (city === 'Urbana-Champaign' || city === 'Urbana' )
            city = 'Champaign';
        if (city === 'LasVegas')
            city = 'Las Vegas';

        if (cat_sidebyside == "All"){
            // d3.selectAll('#city-name').html(city);
        }
        else {
            // d3.selectAll('#city-name').html(city + ', '+ cat_sidebyside);
        }

        byCity.filter(); //clear filter
        cityData = byCity.filterExact(city).top(Infinity); //filter by city
        //console.log(cityData);
    }
    else{  //business is selected
        // d3.selectAll('#city-name').html(bus_sidebyside);
        byCity.filter(); //clear filter
        cityData = byCity.filterExact(city).top(Infinity); //filter by city
    }

    return cityData;

}

/* Open when someone clicks on the span element */
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}