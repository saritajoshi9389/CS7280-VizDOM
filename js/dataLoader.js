//make yelpData a global
var yelpData;
var cf;
var byState;
//alert('aa');
d3.csv('./header_final_join_data_103016_short.csv', dataLoaded); 

function dataLoaded(dataIn) {
	//alert('aa');
    yelpData = dataIn;
	cf = crossfilter(yelpData);
	//add a dimension using the "state" value
    byState = cf.dimension(function (d) {
        return d.state;
    });
	//loadDataOnMap('AZ');
    //console.log(yelpData);
	
    //updateData();
}

// load data for a specific state
// param :: state <--> state code
function loadDataOnMap (state){
	var businessState = byState.filterExact(state).top(Infinity);
	/*var marker = [];
	var markersState = cf.dimension(function (d) {
		marker = {'loc':[d['latitude'],d['longitude']],	'title':d['name']};
		//console.log(marker);
        return marker;
    });	*/
	//console.log(markersState);
	return businessState;

}


function updateData() {

    //crossfilter documentation at: https://github.com/square/crossfilter/wiki/API-Reference

    //set up initial crossfilter
    cf = crossfilter(yelpData);

    //add a dimension using the "state" value
    var byState = cf.dimension(function (d) {
        return d.state;
    });
	//console.log(byState.filterAll().top(Infinity));

    //check for incomparable values (cause errors - last blank row of the .csv had to be deleted)
    //console.log(yelpData.filter(function(d) { return !(d.state >= d.state); }));

    //get all of the users from Arizona in an array
    var arizonaUsers = byState.filterExact('AZ').top(Infinity);

    //grab the top 10 users in the arizonaUsers array (top 10 by state - shouldn't have any inherent ordering, since all the same state)
    var arizonaTop10 = byState.filterExact('AZ').top(10);

    /////////////////console.log(arizonaTop10);

    //sort the arizonaUsers array by review count (descending order)
    //this is just a standard JS sort - it looks like crossfilter's order function might do the same thing.
    var arizonaSorted = arizonaUsers.sort(function(a,b){
        return +b.review_count - +a.review_count; // + just coerces type to avoid string arithmetic
    });

    //return an array of the top 10 AZ businesses, based on # reviews
    var arizonaTop10Reviews = arizonaSorted.slice(0,10);

    /////////////////console.log(arizonaTop10Reviews);

    //set up another dimension for review counts (note: dimensions are expensive, and should be kept to a minimum where possible)
    var byReviews = cf.dimension(function(d){
        return d.review_count;
    });

    //return a count for the businesses with 10 to 100 reviews
    //I think this might also be possible with some combination of group and reduce, but haven't explored how those work yet
    var binReviews10to100 = byReviews.filterRange([10,100]).top(Infinity).length;

    /////////////////console.log(binReviews10to100);
	//loadDataOnMap('AZ');
} 




