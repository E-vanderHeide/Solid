var colorCriterium = "D01",
    mapCountries,
    COLOR_COUNTS = 10,
    colors = [],
    widthLegend = 200,
    heightLegend = 170,
    width = 400,
    height = 400;

var colorSchemeMap = ["#f9f1a9", "#e5f0a5", "#d0efa1", "#aad59b", "#85ba95", "#5fa08f", "#438484", "#276878", "#10496a", "#053158"];

drawMap();
var svg;
function drawMap(){
  d3.json("assets/Data/data.json", function(err, data) {
  countries = getDataForCountries(data);
  drawSunBurst(countries[0]);
});

  function Interpolate(start, end, steps, count) {
    var s = start,
    e = end,
    final = s + (((e - s) / steps) * count);
    return Math.floor(final);
  }

  var projection = d3.geo.mercator()
  .scale((width + 1) / 2 / Math.PI)
  .translate([width / 2, height / 2])
  .precision(.1);
  
   var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  var path = d3.geo.path()
  .projection(projection);

  var graticule = d3.geo.graticule();
  
if(!svg)
{
  svg = d3.select("#canvas-map").append("svg")
  .attr("width", width)
  .attr("height", height);
}

  svg.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);
  
  //for the zoooming & paning
   var g = svg.append("g");
   
   svg
    .call(zoom)
    .call(zoom.event);

    function log10(val) {
      return Math.log(val);
    }

  var quantize = d3.scale.quantize()
  .domain([0, 1.0])
  .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));

  quantize.domain(
    [
      d3.min(countries, function(d){
       return (+d.data[0].D) 
      }),
      d3.max(countries, function(d){
       return (+d.data[0].D) 
      })
    ]
  );

  //After this it's all about drawing the map (borders and so on)
  d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/world-topo-min.json", function(error, world) {
    mapCountries = topojson.feature(world, world.objects.countries).features;

    svg.append("path")
    .datum(graticule)
    .attr("class", "choropleth")
    .attr("d", path);
    
    g.append("path")
    .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
    .attr("class", "equator")
    .attr("d", path);

    var country = g.selectAll(".country").data(mapCountries);

    drawLegend();

    country.enter().insert("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("id", function(d,i) { return d.id; })
    .attr("title", function(d) { return d.properties.name; })
    //.style("fill", color_funcMap)
    .style("fill", function(d) {
      var matchedCountry = getCountryByName(countries, d.properties.name);

      if(matchedCountry)
      {
        var myColorMap = logScaleMap(matchedCountry.getCorrelation());
        return colorSchemeMap[myColorMap];
        
       } 
       else {
        return "#ccc";
       }
            
    })


  /* When the mouse is howered over a country */
  .on("mousemove", function(d) {
    var html = "";
    var matchedCountry = getCountryByName(countries, d.properties.name);
    /* Show the name */
    html += "<div class=\"tooltip_kv\">";
    html += "<span class=\"tooltip_key\">";
    html += d.properties.name;
    html += "</span>";
    html += "<span class=\"tooltip_value\">";
    html += matchedCountry ? matchedCountry.getCorrelation().toFixed(3) : "";
    html += "";
    html += "</span>";
    html += "</div>";

    $("#tooltip-container").html(html);
    $(this).attr("fill-opacity", "0.5");
    $("#tooltip-container").show();

    var coordinates = d3.mouse(this);

    var map_width = $('.choropleth')[0].getBoundingClientRect().width;

    if (d3.event.pageX < map_width / 2) {
      d3.select("#tooltip-container")
      .style("top", (d3.event.layerY + 150) + "px")
      .style("left", (d3.event.pageX - map_width / 2) + "px")
    } else {
      var tooltip_width = $("#tooltip-container").width();
      d3.select("#tooltip-container")
      .style("top", (d3.event.layerY + 150) + "px")
      .style("left", (d3.event.pageX - map_width / 2 ) + "px")
    }
  })
  .on("mouseout", function() {
    $(this).attr("fill-opacity", "1.0");
    $("#tooltip-container").hide();
  })
  //action when clicking with the mouse on a country
  .on("click", function(d){
    selectedCountry = getCountryByName(countries, d.properties.name);
    console.log("selectedCountry: " + selectedCountry.name);
    drawSunBurst(selectedCountry);
  

  });

  g.append("path")
  .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
  .attr("class", "boundary")
  .attr("d", path);

  svg.attr("height", height);
  });
  
  //function that zooms and pan with limits (cannot go outside the map)
   function zoomed() {
	   var t = d3.event.translate;
	   var s = d3.event.scale;
	   
	   var w_max = 0;
	   var w_min = width * (1 - s);
	   var h_max = height < s*width/1.25 ? s*(width/1.25-height)/1.25 : (1-s)*height/1.25;
	   var h_min = height < s*width/1.25 ? -s*(width/1.25-height)/2-(s-1)*height : (1-s)*height/1.25;
		
		//mark the limits of the translate
	   t[0] = Math.min(w_max, Math.max(w_min, t[0]));
	   t[1] = Math.min(h_max, Math.max(h_min, t[1]));
	   zoom.translate(t);

	   g.attr("transform", "translate(" + t + ")scale(" + s + ")");
}

//legend functions
function drawLegend(){

  createScaleMap();

  var ordinal = d3.scale.ordinal()
  .domain([-1,scaleValuesMap[8],scaleValuesMap[7],scaleValuesMap[6],scaleValuesMap[5],scaleValuesMap[4],scaleValuesMap[3],scaleValuesMap[2],scaleValuesMap[1],1])
  .range(["#f9f1a9", "#e5f0a5", "#d0efa1", "#aad59b", "#85ba95", "#5fa08f", "#438484", "#276878", "#10496a", "#053158"]);

  var legend3 = d3.select("#legendMap")
  .append("svg")
  .attr("height", heightLegend)
  .attr("id","the_legend");

  legend3.append("g")
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
  // .title("Correlation")
  .scale(ordinal);

  legend3.select(".legendOrdinal")
  .call(legendOrdinal); 
}

this.scaleValuesMap = [];
function createScaleMap() 
{
  var posArray = [];
  var base = 22.22;
  this.scaleValuesMap[0] = 100;
  var temp = 100;
  for (i = 1; i < 5; i++){
    temp = temp - base;
    this.scaleValuesMap[i] = (temp * 0.01).toFixed(2);
    }
  this.scaleValuesMap[0] = 1;
  for (i = 5; i < 9; i++){
    temp = temp - base;
    this.scaleValuesMap[i] = (temp * 0.01).toFixed(2);
    }
  this.scaleValuesMap[9] = -1;
}

function logScaleMap(value)
{
  if(value == 0) {
    return 0 ;
  }

  //To get all of the values positive, before rangeing between -1 and 1
  value += 1;
  var position = value.toFixed(2);
  position = (position * 10)/2;

  if(position == 0) {
    return 0;
  }
  else {
    return position.toFixed(0) -1;
  }
}
  d3.select(self.frameElement).style("height", (height) + "px");
}
