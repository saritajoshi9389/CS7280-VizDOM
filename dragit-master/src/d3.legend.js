/**
 * Created by saritajoshi on 12/4/16.
 */
// d3.legend.js
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

(function() {
    d3.legend = function(g) {
        g.each(function() {
            var g= d3.select(this),
                items = {},
                svg = d3.select(g.property("nearestViewportElement")),
                legendPadding = g.attr("data-style-padding") || 5,
                lb = g.selectAll(".legend-box").data([true]),
                li = g.selectAll(".legend-items").data([true])

            lb.enter().append("rect").classed("legend-box",true)
            li.enter().append("g").classed("legend-items",true)

            svg.selectAll("[data-legend]").each(function() {
                var self = d3.select(this)
                items[self.attr("data-legend")] = {
                    pos : self.attr("data-legend-pos") || this.getBBox().y,
                    color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke")
                }
            })

            items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})


            li.selectAll("text")
                .data(items,function(d) { return d.key})
                .call(function(d) { d.enter().append("text")})
                .call(function(d) { d.exit().remove()})
                .attr("y",function(d,i) {
                    // return i+"em"
                        if (d.key == "Vegas"){return i-2.00+"em";}
                        if (d.key == "Phoenix"){return i-0.75+"em";}
                        if (d.key == "Charlotte"){return i +0.1 +"em";}
                        if (d.key == "Pittsburgh"){return i + 0.6+"em";}
                        if (d.key == "Montreal"){return i+1+"em";}
                        if (d.key == "Madison"){return i+1.5+"em";}
                        if (d.key == "Edinburgh"){return i+ 1.6+"em";}
                        if (d.key == "Urbana"){return i+1.8+"em";}
                        if (d.key == "Waterloo"){return i+2+"em";}
                        if (d.key == "Kalsruhe"){return i+2.5+"em";}
                        else{
                            return 0;
                        }


                }

                    )
                .attr("x","3em")
                .text(function(d) { ;return d.key})
                .style("font-size",20);

            li.selectAll("circle")
                .data(items,function(d) { return d.key})
                .call(function(d) { d.enter().append("circle")})
                .call(function(d) { d.exit().remove()})
                .attr("cy",function(d,i) {

                    if (d.key == "Vegas"){return i-2.00+"em";}
                    if (d.key == "Phoenix"){return i-0.75+"em";}
                    if (d.key == "Charlotte"){return i +0.1 +"em";}
                    if (d.key == "Pittsburgh"){return i + 0.6+"em";}
                    if (d.key == "Montreal"){return i+1+"em";}
                    if (d.key == "Madison"){return i+1.5+"em";}
                    if (d.key == "Edinburgh"){return i+ 1.6+"em";}
                    if (d.key == "Urbana"){return i+1.8+"em";}
                    if (d.key == "Waterloo"){return i+2+"em";}
                    if (d.key == "Kalsruhe"){return i+2.5+"em";}
                    else{
                        return 0;
                    }
                    // return i-0.25+"em"



                })
                .attr("cx",0)
                .attr("r",function(d)
                {
                    if (d.key == "Vegas"){return 25;}
                    if (d.key == "Phoenix"){return 19;}
                    if (d.key == "Charlotte"){return 17;}
                    if (d.key == "Pittsburgh"){return 15;}
                    if (d.key == "Montreal"){return 13;}
                    if (d.key == "Madison"){return 11;}
                    if (d.key == "Edinburgh"){return 9;}
                    if (d.key == "Urbana"){return 7;}
                    if (d.key == "Waterloo"){return 5;}
                    if (d.key == "Kalsruhe"){return 3;}
                    else{
                        return 0;
                    }
                })
                .style("fill",function(d) { console.log(d.value.color);return d.value.color})

            // Reposition and resize the box
            var lbbox = li[0][0].getBBox()
            lb.attr("x",(lbbox.x-legendPadding))
                .attr("y",(lbbox.y-legendPadding)+10)
                .attr("height",(lbbox.height+2*legendPadding+20))
                .attr("width",(lbbox.width+2*legendPadding+30))
        })
        return g
    }
})()