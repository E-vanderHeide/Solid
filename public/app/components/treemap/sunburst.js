var width = 700,
    height = 500,
    radius = Math.min(width, height) / 2;

var minCoverage = 0,
    maxCoverage = 1,
    totalCoverage = 1;

var colorScheme = ["ffe67c", "ffd25d", "ffbe3d", "ffa12c", "#ff841b", "#ff633c", "#f34145", "#e81858", "#c40667", "#98006a"];
 var color_func = function(d) {
    var myColor = 0;
    myColor = Math.round((d["coverage"]-minCoverage)/(maxCoverage-minCoverage)*9);
    console.log(d["coverage"] + " color " + myColor);
    return colorScheme[myColor];
  };    

var svg = d3.select("#sunburst").append("svg")
    .attr("width", width)
    .attr("height", height + 100)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

//getDataSelectedCountry("sweden");

//add getDataSelectedCountry instead of flare.json to get the data for a specific country

//the root, this has to be changed to instead get the country sent from the map
  var root = norway;
  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes(root))
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)

      .each(getValues)
      .style("stroke", "#fff")
      .style("fill", color_func)
      .style("fill-rule", "evenodd")
      .style("opacity", 1)
      .on("mouseenter", mouseenter)
      .on("mouseleave", mouseleave)
      .each(stash);

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

function mouseenter(d){
  var xPosition = (width*0.5)-110;
  var yPosition = height*0.5-30;
  var dPercentage = (100 * d.value);
  var mValue = (d["coverage"]);

  if (d["name"] !== "Communicatable" && d["name"] !== "non" && d["name"] !== "infectus") {
    d3.select("#tooltip")
    .style("left", xPosition + "px")
    .style("top", yPosition + "px");
  d3.select("#tooltip #heading")
    .text(d["name"]);
  d3.select("#tooltip #death")
    .text("Death data: " + dPercentage + " % ");
  d3.select("#tooltip #media")
    .text("Media Coverage: " + mValue);
  d3.select("#tooltip").classed("hidden", false);
  }else{
    d3.select("#tooltip")
    .style("left", xPosition + "px")
    .style("top", yPosition + "px");
    d3.select("#tooltip #heading")
    .text(d["name"]);
    d3.select("#tooltip #death")
    .text("Average: " + d["coverage"]);
  d3.select("#tooltip #media")
    .text(" ");
    d3.select("#tooltip").classed("hidden", false);
  }

  d3.selectAll("path")
   .style("opacity", 0.3);

  d3.select(this)
    .style("opacity", 1);

}

function mouseleave(d){
  d3.select("#tooltip").classed("hidden", true);

  d3.selectAll("path")
    .style("opacity", 1);
}

function getValues(d){
  if (d["name"] == "Communicatable") {
      minCoverage = d["minCoverage"];
      maxCoverage = d["maxCoverage"];
      totalCoverage = d["totalCoverage"];
  }
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
var ordinal = d3.scale.ordinal()
  .domain([minCoverage,""," ","  ","   ","    ","     ","      ","       ",maxCoverage])
  .range(["#ffe67c", "#ffd25d", "#ffbe3d", "#ffa12c", "#ff841b", "#ff633c", "#f34145", "#e81858", "#c40667", "#98006a"]);


var legend2 = d3.select("#legend")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

legend2.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(20,20)");

var legendOrdinal = d3.legend.color()
  .shapeWidth(55)
  .shapePadding(1)
  .orient('horizontal')
  .title("Media Coverage")
  .scale(ordinal);

legend2.select(".legendOrdinal")
  .call(legendOrdinal); 
