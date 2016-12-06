var city_centres = [
				{'center':[55.963326, -3.191736], 'name':'Edinburgh'},
				{'center':[49.008558,8.400305] , 'name':'Karlsruhe'},
				{'center':[45.527082, -73.569271] , 'name':'Montreal'},
				{'center':[43.465754,-80.522003] , 'name':'Waterloo'},
				{'center':[40.439709, -79.993550] , 'name':'Pittsburgh'},
				{'center':[35.232001, -80.858802] , 'name':'Charlotte'},
				{'center':[40.104516,-88.228238] , 'name':'Champaign'},
				{'center':[33.453039,-112.081308] , 'name':'Phoenix'},
				{'center':[36.222228, -115.284912] , 'name':'LasVegas'},
				{'center':[43.069862,-89.428404] , 'name':'Madison'}
			];	
			
function compare_cities (){

        // alert("ya");
        openComparator();


    toggle_visibility('portfolio');

    function toggle_visibility(id) {
        var e = document.getElementById(id);
        if (e.style.display == 'block')
            e.style.display = 'none';
        else
            e.style.display = 'block';
    }

    var element_to_scroll_to = document.getElementById('portfolio');
    element_to_scroll_to.scrollIntoView();

	var cities = [];
    $("input:checkbox[class=compare_checkbox]:checked").each(function(){
		cities.push($(this).val());
	});
	
	// remove off all the existing graphs in the comparison view
	if (cities[0] === 'Urbana')
        cities[0] = 'Champaign';
    if (cities[0] === 'LasVegas')
        cities[0] = 'Las Vegas';
	if (cities[1] === 'Urbana')
        cities[1] = 'Champaign';
    if (cities[1] === 'LasVegas')
        cities[1] = 'Las Vegas';

	city1_data = getCityData(cities[0]); //console.log(city1_data);
	city2_data = getCityData(cities[1]); //console.log(city2_data);
	getCompareSideBySideData(cities[0],"All","All",1);
	getCompareSideBySideData(cities[1],"All","All",2);
	for(var i=0;i<city_centres.length;i++){
		if (cities[0]==city_centres[i].name)
			var city1_center = city_centres[i].center;
		if (cities[1]==city_centres[i].name)
			var city2_center = city_centres[i].center;
	};
	render_small_left(city1_center,city1_data);
	render_small_right(city2_center,city2_data);
	//var b = document.getElementById("city_compare"); console.log(b);
	//b.classList.remove("show");
	
}

var lastColor, myColor;

function drawSideBySide(graphNum, histData,comparison_city_num) {
	/*
	if (graphNum == 4){
		console.log(histData);
	} */
//sidebar doesn't load until after the script has executed. Add a delay to ensure that the div will exist before we select it
    $(document).ready(function () {

        //add an SVG element to the div
		d3.selectAll('#compareCities' + comparison_city_num +'_'+graphNum+' > *').remove();
        var sidebarSVG = d3.selectAll('#compareCities' + comparison_city_num +'_'+graphNum)
            .append('svg')
            .attr('id','compareCities'+ comparison_city_num +'_'+graphNum + 'SVG')
            .attr('width', '100%')
            .attr('height', function() {
                if (graphNum == 1 || graphNum == 2 || graphNum ==4) {
                    return '80%'
                }
                if (graphNum == 3) {
                    return '95%'
                }
            });

        var marginSB1 = {top:17, right:50,bottom:5,left:25},
			widthSB1 = 200 -(marginSB1.right+marginSB1.left),
			heightSB1 = 100 - (marginSB1.top + marginSB1.bottom);

        //set up scale factors (will update the domain when the data is loaded)
        var	x = d3.scaleBand().rangeRound([marginSB1.left, ((widthSB1+10))]).padding(0.1),
			y = d3.scaleLinear().rangeRound([0, heightSB1]);

        var	xHoriz = d3.scaleLinear().rangeRound([marginSB1.left, widthSB1]),
			yHoriz = d3.scaleBand().rangeRound([0, (heightSB1+20)]).padding(0.1);


        //create a group to plot bars in
        var barGroup = sidebarSVG.append('g')
            .attr('class','.bar-group-' + comparison_city_num+'_'+graphNum)
            .attr('transform',function(){
                if(graphNum ==1 || graphNum ==2 || graphNum ==4){return 'translate('+ marginSB1.right + ',' + 2*marginSB1.top +')'}
                if(graphNum ==3){return 'translate('+ (marginSB1.right+10) + ',' + 2*marginSB1.top +')'}});


        //add a title to the graph
        barGroup.append('text')
            .attr('x', widthSB1/2)
            .attr('y', function(){if(graphNum == 1 || graphNum ==2 || graphNum ==4){ return -10}
                if (graphNum == 3){return -20}})
            .style('font-size', 14)
            .attr('fill',"gray")
            .style('text-anchor', 'middle')
            .text(function(){
                if (graphNum == 1){
                    return 'How many people review?'
                }
                else if (graphNum == 2){
                    return 'Star ratings'
                }
                else if (graphNum == 3 || graphNum ==4) {
                    return 'Checkins'
                }
            });

        //add a title to the graph
        barGroup.append('text')
            .attr('x', widthSB1/2 + 10)
            .attr('y', heightSB1 + 30)
            .style('font-size', 11)
            .attr('fill',"gray")
            .style('text-anchor', 'middle')
            .text(function(){
                if (graphNum == 1){
                    return '# of reviews'
                }
                else if (graphNum == 2){
                    return '# of stars'
                }
                else if (graphNum == 3 || graphNum ==4){
                    return '# of checkins'
                }
            });

        //add a title to the graph
        barGroup.append('text')
            .attr('x', -35)
            .attr('y', function(d){
                if (graphNum == 1 || graphNum == 2 || graphNum ==4){
                    return -20;
                }
                if (graphNum == 3){
                    return -40;
                }
            })
            .style('font-size', 11)
            .attr('fill',"gray")
            .style('text-anchor', 'middle')
            .attr('transform','rotate(-90)')
            .text(function(){
                if (graphNum == 1){
                    return '# of users'
                }
                else if (graphNum == 2){
                    return '# of users'
                }
                else if (graphNum == 3 || graphNum ==4){
                    return 'city'
                }
            });



        //initial draw of histogram, once data has loaded

        var histMax = Math.ceil(d3.max(histData, function (d) {
                return +d.count;
            })/10)*10;


        //map axes onto data
        if (graphNum == 1 || graphNum == 2 || graphNum == 4){

            x.domain(histData.map(function (d) {
                if (graphNum == 1 || graphNum == 2 ){
                    return d.bin;
                }
                if (graphNum == 4 ){
                    return d.day;
                }

            }));
            y.domain([histMax,0]);
            colorscale.domain([0,histMax]);
            //call axes to initialize, set basic formatting
            var xAxis = barGroup.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + heightSB1 + ")")
                .call(d3.axisBottom(x)
                    .tickSizeOuter([0]));

            var yAxis = barGroup.append("g")
                .attr("class", function(){return "axis axis--y-" + comparison_city_num+'_'+graphNum})
                .attr("transform", "translate(" + marginSB1.left + ",0)")
                .call(d3.axisLeft(y)
                    .tickValues([0, histMax/4, histMax/2, 3*histMax/4, histMax])
                    .tickSizeOuter([0]));
        }
        if (graphNum == 3){
            xHoriz.domain([0,histMax]);
            yHoriz.domain(histData.map(function (d) {
                return d.City;
            }));
            colorscale.domain([0,histMax]);
            var xAxis = barGroup.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + heightSB1 + ")")
                .call(d3.axisBottom(xHoriz)
                    .tickValues([0, histMax])
                    .tickSizeOuter([0]));

            var yAxis = barGroup.append("g")
                .attr("class", function(){return "axis axis--y-" + comparison_city_num+'_'+graphNum})
                .attr("transform", "translate(" + marginSB1.left + ",-20)")
                .call(d3.axisLeft(yHoriz)
                    .tickSizeOuter([0]));
        }




        //create and format x axis labels
        xAxis.selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr('dx','-.8em')
            .attr("dy", "1.5em")
            .attr('font-size','12px')
            //.attr("transform", "translate(0,"+ -heightSB1 + ")rotate(-90)")
            .attr('fill','gray')
            .style("text-anchor", "center");

        yAxis.selectAll('text')
            .attr('fill',"gray");

        barGroup.append('text')
            .attr('class', 'bar-label')
            .attr('fill',"gray")
            .style('font-size', 12);

        if(graphNum ==1 || graphNum ==2 || graphNum ==4){
            //draw bars
            stackGroup = barGroup.selectAll(".bar")
                .data(histData)
                .enter()
                .append('rect')
                .attr('class','bar')
                .attr('id',function(d){
                    if (graphNum == 1 || graphNum ==2){
                        return "bar"+d.bin
                    }
                    else if (graphNum == 4){

                        return "bar"+d.day
                    }
                    })
                .attr('x', function(d){

                    if (graphNum ==1 || graphNum ==2 ){
                        return x(d.bin)
                    }
                    else if (graphNum == 4){

                        return x(d.day)
                    }
                    })
                .attr('fill', function(d){return colorscale(d.count)})
                .attr('y',function(d){return y(d.count)})
                .attr('width', x.bandwidth())
                .attr('height', function(d){return heightSB1 - y(d.count)})
                .on('mouseenter', function(d){

                    myColor = d3.select(this).attr('fill');
                    d3.select(this).attr('fill','orange');

                    if (comparison_city_num == 1){
                        if (graphNum == 1 || graphNum ==2){
                            if(d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.bin).node()) {
                                lastColor = d3.selectAll('#compareCities2' + '_' + graphNum).selectAll('#bar' + d.bin).attr('fill');
                            }
                            d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.bin).attr('fill','orange');
                        }
                        else if (graphNum == 4){
                            if(d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.day).node()){
                                lastColor =  d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.day).attr('fill');
                            }
                            d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.day).attr('fill','orange');
                        }
                    }
                    if (comparison_city_num == 2){
                        if (graphNum == 1 || graphNum ==2){
                            if(d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.bin).node()) {
                                lastColor = d3.selectAll('#compareCities1' + '_' + graphNum).selectAll('#bar' + d.bin).attr('fill');
                            }
                            d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.bin).attr('fill','orange');
                        }
                        else if (graphNum == 4){
                            if(d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.day).node()){
                                lastColor =  d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.day).attr('fill');
                            }
                            d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.day).attr('fill','orange');
                        }
                    }

                })
                .on('mouseleave', function(d){console.log(d);console.log('here1');

                    d3.select(this).attr('fill', myColor);

                    if (comparison_city_num == 1){
                        if (graphNum == 1 || graphNum ==2){
                            if(d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.bin).node()) {
                                d3.selectAll('#compareCities2' + '_' + graphNum).selectAll('#bar' + d.bin).attr('fill', lastColor);
                            }
                        }
                        else if (graphNum == 4){

                            if(d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.day).node()) {
                                d3.selectAll('#compareCities2' + '_' + graphNum).selectAll('#bar' + d.day).attr('fill', 'purple');
                            }
                        }
                    }
                    if (comparison_city_num == 2){
                        if (graphNum == 1 || graphNum ==2){
                            if(d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.bin).node()) {
                                d3.selectAll('#compareCities1' + '_' + graphNum).selectAll('#bar' + d.bin).attr('fill', lastColor);
                            }
                        }
                        else if (graphNum == 4){

                            if(d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.day).node()) {
                                d3.selectAll('#compareCities1' + '_' + graphNum).selectAll('#bar' + d.day).attr('fill', lastColor);
                            }
                        }
                    }

                }) ;
        }
        if(graphNum == 3){
            //draw bars
            stackGroup = barGroup.selectAll(".bar")
                .data(histData)
                .enter()
                .append('rect')
                .attr('class','bar')
                .attr('id',function(d){ return d.bin})
                .attr('x',xHoriz(0))//function(d){return xHoriz(d.count)})
                .attr('y',function(d){return yHoriz(d.city)-20})
                .attr('width', function(d){return  xHoriz(d.count)-xHoriz(0)})
                .attr('height', yHoriz.bandwidth())
                .attr('fill', function(d){return colorscale(d.count)})
                .on('mouseenter', function(d){

                    myColor = d3.select(this).attr('fill');
                    d3.select(this).attr('fill','orange');

                    if (comparison_city_num == 1){
                            if(d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.bin).node()){
                                lastColor =  d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.bin).attr('fill');
                            }
                            d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.day).attr('fill','orange');
                    }

                    if (comparison_city_num == 2){
                            if(d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.bin).node()){
                                lastColor =  d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.bin).attr('fill');
                            }
                            d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.day).attr('fill','orange');
                    }

                })
                .on('mouseleave', function(d){console.log(d);console.log('here1');

                    d3.select(this).attr('fill', myColor);

                    if (comparison_city_num == 1){
                        console.log('test1');
                            if(d3.selectAll('#compareCities2' +'_'+graphNum).selectAll('#bar'+d.day).node()) {
                                d3.selectAll('#compareCities2' + '_' + graphNum).selectAll('#bar' + d.day).attr('fill', lastColor);
                            }
                    }
                    if (comparison_city_num == 2){
                        console.log('test2');
                            if(d3.selectAll('#compareCities1' +'_'+graphNum).selectAll('#bar'+d.day).node()) {
                                d3.selectAll('#compareCities1' + '_' + graphNum).selectAll('#bar' + d.day).attr('fill', lastColor);
                            }
                    }


                })
        }

    });

}

//updates the bars/axes that have already been drawn, rather than making new ones each time

//note that this is not a full enter, exit, update pattern - only works when the bar identities stay the same
function updateSideBySide(graphNum, histData, comparison_city_num){

    var histMax = Math.ceil(d3.max(histData, function (d) {
        return +d.count;
    })/10)*10;

    //update y axis values
    y.domain([histMax,0]);
    colorscale.domain([0,histMax]);


    var barGroup = d3.selectAll('.bar-group-' + comparison_city_num+'_'+graphNum);

    var yAxis = barGroup.selectAll('.axis--y-'+comparison_city_num+'_'+graphNum)
        .call(d3.axisLeft(y).tickValues([0, histMax/4, histMax/2, 3*histMax/4, histMax]));

    //update bar heights
    barGroup.selectAll(".bar")
        .data(histData)  //rebind to the new data array (of the same dimension, with same x values)
        .attr('y',function(d){return y(d.count)})
        .attr('height', function(d){ return heightSB1 - y(d.count)})
        .attr('fill', function(d){return colorscale(d.count)});
}