var width = 700,
    height = 700,
    widthLegend = 200;
    heightLegend = 170,
    radius = Math.min(width, height) / 2;

var minCoverage = 0,
    maxCoverage = 1,
    totalCoverage = 1;

var colorScheme = ["ffe67c", "ffd25d", "ffbe3d", "ffa12c", "#ff841b", "#ff633c", "#f34145", "#e81858", "#c40667", "#98006a"];
 var color_func = function(d) {
    var myColor = logScale(d["coverage"]);
    return colorScheme[myColor];
  };    

var svgS = d3.select("#sunburst").append("svg")
    .attr("width", width )
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width * .5 + "," + height * .5 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });


//the root, this has to be changed to instead get the country sent from the map
    var root;

  
  function drawSunBurst(country)
  {

    root = country;

    d3.select("#country")
      .text(country.name);

    svgS.datum(root).selectAll("path").data([]).exit().remove();

      var path = svgS.datum(root).selectAll("path")
      .data(partition.nodes(root))
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)

      .style("stroke", "#fff")
      .style("fill", color_func)
      .style("fill-rule", "evenodd")
      .style("opacity", 1)
      //when a node is clicked, news are updated by function drawNews(dalys) in news.js
      .on("click", mouseclick)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .each(stash)
      ;

      drawLegend();

  d3.selectAll("input").on("change", function change() {
    var value = this.value === "size"
        ? function(d) { return d.size; }
        : function() { return 1; };

    path
      .data(partition.value(value).nodes)
      .transition()
      .duration(1500)
      .attrTween("d", arcTween);
  });
 }

function mouseclick(d){
  var dPercentage = (100 * d.size).toFixed(2);
  var mValue = ((d["coverage"]/totalCoverage)*100).toFixed(2);

  if (mValue < 0.01) {
    mValue = "< 0.01";
  }

  if (d["name"] !== "communicatable" && d["name"] !== "non-communicatable" && d["name"] !== "injuries") {
    drawNews(d["name"], "disease" ,dPercentage, mValue, d["coverage"]);
  }else{
    drawNews(d["name"], "type" ,0, 0, d["coverage"]);
  }
}

function mousemove(d){
  var xPosition = (width*0.5)-290;
  var yPosition = height*0.5+100;
  var dPercentage = (100 * d.size).toFixed(2);
  var mValue = ((d["coverage"]/totalCoverage)*100).toFixed(2);
  if (mValue < 0.01) {
    mValue = "< 0.01";
  }

  if (d["name"] !== "communicatable" && d["name"] !== "non-communicatable" && d["name"] !== "injuries") {
    d3.select("#tooltip")
      .style("left", d3.event.layerX+40 + "px")
      .style("top", d3.event.layerY + "px");
    d3.select("#tooltip #heading")
      .text(d["name"]);
    d3.select("#tooltip #death")
      .text("DALY: " + dPercentage + " %");
    d3.select("#tooltip #media")
      .text("Media Coverage: " + mValue + " %" + " (" + d["coverage"] + ")");
    d3.select("#tooltip").classed("hidden", false);
  }else{
    d3.select("#tooltip")
    .style("left", d3.event.layerX+40 + "px")
    .style("top", d3.event.layerY + "px");
    d3.select("#tooltip #heading")
    .text(d["name"]);
    d3.select("#tooltip #death")
    .text("Average: " + d["coverage"]);
  d3.select("#tooltip #media")
    .text(" ");
    d3.select("#tooltip").classed("hidden", false);
  }

  d3.select("#sunburst").selectAll("path")
   .style("opacity", 0.3);

  d3.select(this)
    .style("opacity", 1);

}

function mouseleave(d){
  d3.select("#tooltip").classed("hidden", true);

  d3.selectAll("path")
    .style("opacity", 1);
}

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}


d3.select(self.frameElement).style("height", height + "px");

//legend functions

function drawLegend(){

  createScale();

d3.select("#the_legend").remove();  

var ordinal = d3.scale.ordinal()
  .domain([getMinCoverage(),scaleValues[1],scaleValues[2],scaleValues[3],scaleValues[4],scaleValues[5],scaleValues[6],scaleValues[7],scaleValues[8],getMaxCoverage()])
  .range(["#ffe67c", "#ffd25d", "#ffbe3d", "#ffa12c", "#ff841b", "#ff633c", "#f34145", "#e81858", "#c40667", "#98006a"]);


var legend2 = d3.select("#legend")
  .append("svg")
  .attr("height", heightLegend)
  .attr("id","the_legend");

legend2.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(50,0)")  
  .on('click', function(d){
    if ($(this).css("opacity") == 1) {
      console.log("hej hej ");
      var elemented = document.getElementById(this.id);
      console.log("hej hej2 " + elemented);
      d3.select(elemented)
        .transition()
        .duration(1000)
        .style("opacity", 0);
    };
  });

var legendOrdinal = d3.legend.color()
  .shapeWidth(55)
  .shapePadding(1)
  .orient('vertical')
  .scale(ordinal);

legend2.select(".legendOrdinal")
  .call(legendOrdinal); 

}

function getMinCoverage()
{
  var minCoverage = -1;
  $.each(root.children, function(i, v) {
        if(minCoverage > v.minCoverage || minCoverage == -1)
        {
          minCoverage = v.minCoverage;
        }
    });
  return minCoverage;
}

function getMaxCoverage()
{
  var maxCoverage = 0;
  $.each(root.children, function(i, v) {
        if(maxCoverage < v.maxCoverage)
        {
          maxCoverage = v.maxCoverage;
        }
    });
  return maxCoverage;
}

this.scaleValues = [];

function createScale() {

  var base = Math.pow(getMaxCoverage(),0.1);
  this.scaleValues[0] = 1;
  for (i = 1; i < 10; i++){
    this.scaleValues[i] = this.scaleValues[i-1] * base;
    }
  this.scaleValues[0]=0;

  for (i = 1; i < 10; i++){
    this.scaleValues[i] = Math.round(this.scaleValues[i]);
    }
}


function logScale(value)
{

  if(value == 0) {
    return 0 ;
  }


  var base = Math.pow(getMaxCoverage(),0.1);
  //console.log("base" + base);
  var position = Math.log(value) / Math.log(base);
  //console.log("position" + position);

  var result = Math.round(position);

  if(result == 0) {
    return 0;
  }
  else {
    return result-1;
  }

} 