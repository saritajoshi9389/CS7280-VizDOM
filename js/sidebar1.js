//create globals for sharing axis scaling between functions
var x, y, colorscale, xHoriz, yHoriz, marginSB1, widthSB1, heightSB1;
var starClicked = false;

function drawSidebar(graphNum, histData) {

//sidebar doesn't load until after the script has executed. Add a delay to ensure that the div will exist before we select it
    $(document).ready(function () {
        //var sidebar1SVG = document.getElementById('sidebar1');
        //var width = sidebar1SVG.width();

        //console.log(histData);
        var div = d3.selectAll('.tooltip')
            .style("opacity", 0);

        //from https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
       /* var tool_tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) { return 'testing' });*/


        //add an SVG element to the div
        var sidebarSVG = d3.selectAll('#sidebar' + graphNum)
            .append('svg')
            .attr('id','sidebar'+ graphNum + 'SVG')
            .attr('width', '100%')
            .attr('height', function() {
                if (graphNum == 1 || graphNum == 2 || graphNum ==4) {
                    return '80%'
                }
                if (graphNum == 3) {
                    return '95%'
                }
            });

       // d3.selectAll('svg').call(tool_tip);


        if (!d3.selectAll('#sidebarStar').node()){
            var starSVG = d3.selectAll('#stardiv')
                .append('svg')
                .attr('id','sidebarStar')
                .attr('width', '100%')
                .attr('height','40px');
        }



        if(graphNum == 4){
            d3.selectAll('#sidebar3SVG')
                .remove();
        }

        //can't get width, since parent element starts out collapsed
        //var widthSB1 = d3.select("#sidebar1SVG").node().getBoundingClientRect().width;
        //var heightSB1 = d3.select("#sidebar1").attr('viewbox');//.node().getBoundingClientRect().height;


        marginSB1 = {top:17, right:30,bottom:5,left:25};
        widthSB1 = 200 -(marginSB1.right+marginSB1.left);
        heightSB1 = 100 - (marginSB1.top + marginSB1.bottom);

        //console.log(widthSB1,heightSB1);

        //set up scale factors (will update the domain when the data is loaded)
        x = d3.scaleBand().rangeRound([marginSB1.left, ((widthSB1+10))]).padding(0.1);
        y = d3.scaleLinear().rangeRound([0, heightSB1]);

        /*
        if (graphNum == 1){
            colorscale = d3.scaleLinear().range(["#9e9ac8","#54278f"]); //"#807dba","#6a51a3",
        }
        else if (graphNum ==2){*/
            colorscale = d3.scaleLinear().range(["#9ecae1","#08519c"]); //"#4292c6","#2171b5",
        /*}
        else if (graphNum ==3 || graphNum ==4){
            colorscale = d3.scaleLinear().range(["#74c476","#006d2c"]); //"#41ab5d","#238b45",
        }
        else {
            colorscale = d3.scaleLinear().range(["#fd8d3c","#a63603"]); //"#f16913","#d94801",
        }*/



        xHoriz = d3.scaleLinear().rangeRound([marginSB1.left, widthSB1]);
        yHoriz = d3.scaleBand().rangeRound([0, (heightSB1+20)]).padding(0.1);


        //plot the rating stars
        starGroup = d3.select("#sidebarStar").append('g').attr('id','starGroup')
            .attr('transform','translate(50,12)');

        starGroup.selectAll('.star')
            .data([{star:1},{star:2},{star:3},{star:4},{star:5}])
            .enter()
            .append("polygon")
            .attr('class','star')
            .attr('id',function(d){return 'star' + d.star;})
            .attr("points", CalculateStarPoints(10, 10, 5, 10, 5))
            .attr('transform',function(d,i){return 'rotate(-19)translate(' + i*25 + ','+ (i*8.75) +')'})
            .style('stroke','lightgray')
            .style('fill','transparent')
            .on('mouseenter',function(d){

                if (selectedBusiness == "All"){
                    if (starClicked == false){
                        d3.select(this).style('fill','#ffde26');
                        for (var k=1; k<=d.star;k++){
                            d3.select('#star'+ k).style('fill','#ffde26');
                        }
                    }
                }


            })
            .on('mouseleave', function(d){
                if(selectedBusiness == "All"){
                    if(starClicked == false){
                        d3.selectAll('.star').style('fill','transparent');
                    }
                }

            })
            .on('click',function(d){
                if (selectedBusiness == 'All'){
                    if (starClicked == false){
                        starClicked = true;
                        selectedStar = d.star;
                        updateData();
                    }
                    else{
                        starClicked = false;
                        d3.selectAll('.star').style('fill','transparent');
                    }
                }
            });



        //create a group to plot bars in
        var barGroup = sidebarSVG.append('g')
            .attr('class','bar-group-' + graphNum)
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

        //add axis labels to the graph
        barGroup.append('text')
            .attr('x', widthSB1/2 + 10)
            .attr('y', heightSB1 + 30)
	    .attr('class','x-label')
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
                else if (graphNum == 3){
                    return '# of checkins'
                }
		else if ( graphNum ==4){
                    return 'day'
                }
            });

        //add axis labels to the graph
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
	    .attr('class','y-label')
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
                else if (graphNum == 3){
                    return 'city'
		 }
                else if (graphNum ==4){
                    return '# checkins'
                
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
	    if (histMax > 0){
            	y.domain([histMax,0]);
            	colorscale.domain([0,histMax]);
	    }
            else{
                y.domain([1,0]);
                colorscale.domain([0,histMax]);
            }
            //call axes to initialize, set basic formatting
            var xAxis = barGroup.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + heightSB1 + ")")
                .call(d3.axisBottom(x)
                    .tickSizeOuter([0]));

            var yAxis = barGroup.append("g")
                .attr("class", function(){return "axis axis--y-" + graphNum})
                .attr("transform", "translate(" + marginSB1.left + ",0)")
                .call(d3.axisLeft(y)
                    .tickValues([0, histMax/4, histMax/2, 3*histMax/4, histMax])
                    .tickSizeOuter([0]));
        }
        if (graphNum == 3){
            xHoriz.domain([0,histMax]);
            yHoriz.domain(histData.map(function (d) {
                return d.city;
            }));
            colorscale.domain([0,histMax]);
            var xAxis = barGroup.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + heightSB1 + ")")
                .call(d3.axisBottom(xHoriz)
                    .tickValues([0, histMax])
                    .tickSizeOuter([0]));

            var yAxis = barGroup.append("g")
                .attr("class", function(){return "axis axis--y-" + graphNum})
                .attr("transform", "translate(" + marginSB1.left + ",-20)")
                .call(d3.axisLeft(yHoriz)
                    .tickSizeOuter([0]));
        }




        //create and format x axis labels
        xAxis
            .selectAll("text")
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
                .attr('x', function(d){
                    if (graphNum ==1 || graphNum ==2 ){
                        return x(d.bin)
                    }
                    else if (graphNum == 4){
                        return x(d.day)
                    }
                    })
                .attr('y',function(d){return y(d.count)})
                .attr('width', x.bandwidth())
                .attr('height', function(d){return heightSB1 - y(d.count)})
                .attr('fill', function(d){ return colorscale(d.count)})
                .on('mouseover', function(d){

                    //console.log(d3.event.pageX);

                    var clientRect = d3.selectAll('.bar-group-1').node().getBoundingClientRect();

                    //console.log(clientRect);
                    //console.log(d3.mouse(document.body));

                    //console.log(d3.event.pageY - $('#sidebar'+ graphNum + 'SVG').offset().top + $('.sidebar-content').scrollTop());

                    div = d3.selectAll('.tooltip');
                    div//.transition()
                        //.duration(200)
                        .style("opacity", .9);
                    div.html(d.count)
                        //.style("left", (d3.mouse(document.body)[0]-clientRect.left+7 + "px")) //+d3.select(this).attr('x')
                        //.style("top", (d3.mouse(document.body)[1]-clientRect.top+75  + "px"));//+d3.select(this).attr('y')
                        .style("left", (d3.event.pageX - $('.sidebar-content').offset().left  + $('.sidebar-content').scrollLeft() + "px")) //+d3.select(this).attr('x')
                        .style("top", (d3.event.pageY  - $('.sidebar-content').offset().top   + $('.sidebar-content').scrollTop() + -10 +"px"));//+d3.select(this).attr('y')

                    //tool_tip.show();

                })
                .on('mouseleave', function(d){//console.log(d);

                    div//.transition()
                        //.duration(100)
                        .style("opacity", 0);

                    //tool_tip.hide();

                });
        }
        if(graphNum == 3){
            //draw bars
            stackGroup = barGroup.selectAll(".bar")
                .data(histData)
                .enter()
                .append('rect')
                .attr('class','bar')
                .attr('x',xHoriz(0))//function(d){return xHoriz(d.count)})
                .attr('y',function(d){return yHoriz(d.city)-20})
                .attr('width', function(d){return  xHoriz(d.count)-xHoriz(0)})
                .attr('height', yHoriz.bandwidth())
                .attr('fill', function(d){return colorscale(d.count)})
                .on('mouseover', function(d){

                    // console.log(d3.event.pageX);

                    var clientRect = d3.selectAll('.bar-group-3').node().getBoundingClientRect();

                    //console.log(clientRect);
                    //console.log(d3.mouse(document.body));

                    div = d3.selectAll('.tooltip');
                    div//.transition()
                    //.duration(200)
                        .style("opacity", .9);
                    div.html(d.count)
                        //.style("left", (d3.mouse(document.body)[0]-clientRect.left+7 + "px")) //+d3.select(this).attr('x')
                        //.style("top", (d3.mouse(document.body)[1]-clientRect.top+75  + "px"));//+d3.select(this).attr('y')
                        .style("left", (d3.event.pageX - $('.sidebar-content').offset().left  + $('.sidebar-content').scrollLeft() + "px")) //+d3.select(this).attr('x') //#sidebar'+ graphNum + 'SVG
                        .style("top", (d3.event.pageY  - $('.sidebar-content').offset().top   + $('.sidebar-content').scrollTop() + -10 +"px"));//+d3.select(this).attr('y')

                    //tool_tip.show();
                })
                .on('mouseleave', function(d){//console.log(d);

                    div//.transition()
                    //.duration(100)
                        .style("opacity", 0);

                    //tool_tip.hide();

                })
                .on('click', function(d){console.log(d)});
        }

    });

}

//updates the bars/axes that have already been drawn, rather than making new ones each time
//note that this is not a full enter, exit, update pattern - only works when the bar identities stay the same
function updateHistogram(graphNum, histData){

    var histMax = Math.ceil(d3.max(histData, function (d) {
        return +d.count;
    })/10)*10;

    //update y axis values
    if (histMax > 0){
    	y.domain([histMax,0]);
    	colorscale.domain([0,histMax]);
    }
    else{
        y.domain([1,0]);
        colorscale.domain([0,histMax]);
    }


    var barGroup = d3.selectAll('.bar-group-' + graphNum);

    if (graphNum != 3){
    var yAxis = barGroup.selectAll('.axis--y-'+graphNum)
        .call(d3.axisLeft(y).tickValues([0, histMax/4, histMax/2, 3*histMax/4, histMax]));

    //update bar heights
    barGroup.selectAll(".bar")
        .data(histData)  //rebind to the new data array (of the same dimension, with same x values)
        .attr('y',function(d){return y(d.count)})
        .attr('height', function(d){ return heightSB1 - y(d.count)})
        .attr('fill', function(d){ return colorscale(d.count)});
    }
    else {
        xHoriz.domain([0,histMax]);

        var xAxis = barGroup.selectAll('.axis--x-'+graphNum)
            .call(d3.axisBottom(xHoriz));

        barGroup.selectAll(".bar")
            .data(histData)  //rebind to the new data array (of the same dimension, with same x values)
            .attr('x',xHoriz(0))//function(d){return xHoriz(d.count)})
            .attr('width', function(d){return  xHoriz(d.count)-xHoriz(0)})
            .attr('fill', function(d){ return colorscale(d.count)});
    }
}


//expects svgNum in format '1_1' to match id in index.html (lines 325-330)
function drawSideBySide(svgNum, dataset){

    //select the appropriate div from the DOM (assemble identifier from input call)
    var comparisonSVG = d3.selectAll('#compareCities' + svgNum)
        .append('svg')                                              //create an SVG element in the div
        .attr('id','comparison'+ svgNum + 'SVG');                    //give the SVG element an id

}

//this contains the d3 selections for updating the bar charts, when the data is reloaded
//(use for everything except the first draw)
function updateSideBySide(svgNum, dataset){

}


//from https://dillieodigital.wordpress.com/2013/01/16/quick-tip-how-to-draw-a-star-with-svg-and-javascript/
function CalculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius)
{
    var results = "";

    var angle = Math.PI / arms;

    for (var i = 0; i < 2 * arms; i++)
    {
        // Use outer or inner radius depending on what iteration we are in.
        var r = (i & 1) == 0 ? outerRadius : innerRadius;

        var currX = centerX + Math.cos(i * angle) * r;
        var currY = centerY + Math.sin(i * angle) * r;

        // Our first time we simply append the coordinates, subsequet times
        // we append a ", " to distinguish each coordinate pair.
        if (i == 0)
        {
            results = currX + "," + currY;
        }
        else
        {
            results += ", " + currX + "," + currY;
        }
    }

    return results;
}