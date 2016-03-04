d3.json("assets/Data/mock.json", function(err, data) {

  countries = getDataForCountries(data);

  var config = {"data0":"name",
  "data1": "1",
  "label0":"label 0",
  "label1":"label 1",
  "color0":"#99ccff",
  "color1":"#0050A1",
  "width":850,
  "height":850}

  var width = config.width,
  height = config.height,
  MAP_KEY = config.data0,
  MAP_VALUE = config.data1;

  var COLOR_COUNTS = 9;

  function Interpolate(start, end, steps, count) {
    var s = start,
    e = end,
    final = s + (((e - s) / steps) * count);
    return Math.floor(final);
  }

  function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function(_r, _g, _b) {
      r = _r;
      g = _g;
      b = _b;
    };
    
    setColors(_r, _g, _b);
    this.getColors = function() {
      var colors = {
        r: r,
        g: g,
        b: b
      };
      return colors;
    }; 
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  var COLOR_FIRST = config.color0, COLOR_LAST = config.color1;

  var rgb = hexToRgb(COLOR_FIRST);

  var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

  rgb = hexToRgb(COLOR_LAST);
  var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

  var startColors = COLOR_START.getColors(),
  endColors = COLOR_END.getColors();

  var colors = [];
  for (var i = 0; i < COLOR_COUNTS; i++) {
    var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
    var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
    var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
    colors.push(new Color(r, g, b));
  }
  var projection = d3.geo.mercator()
  .scale((width + 1) / 2 / Math.PI)
  .translate([width / 2, height / 2])
  .precision(.1);

  var path = d3.geo.path()
  .projection(projection);

  var graticule = d3.geo.graticule();

  var svg = d3.select("#canvas-map").append("svg")
  .attr("width", width)
  .attr("height", height);

  svg.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);

    //var valueHash = {};
    
    function log10(val) {
      return Math.log(val);
    }
    
     //countries.forEach(function(d) {
     //  valueHash[d.name] = +d.data.D;
     //});

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
    var mapCountries = topojson.feature(world, world.objects.countries).features;

    svg.append("path")
    .datum(graticule)
    .attr("class", "choropleth")
    .attr("d", path);

    var g = svg.append("g");

    g.append("path")
    .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
    .attr("class", "equator")
    .attr("d", path);

    var country = g.selectAll(".country").data(mapCountries);

    country.enter().insert("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("id", function(d,i) { return d.id; })
    .attr("title", function(d) { return d.properties.name; })
    .style("fill", function(d) {
      var matchedCountry = getCountryByName(countries, d.properties.name);

      if(matchedCountry)
      {
        //make this domain dynamic
        var c = d3.scale.threshold().domain([100,200,300,400,500,600,700,800,900]).range(colors);
        console.log(matchedCountry.getCorrelation());

        var co =  c(matchedCountry.getCorrelation()).getColors();  

        return "rgb("+co.r + ","+co.g+","+co.b+")";

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
    html += matchedCountry ? matchedCountry.getCorrelation() : "";
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
      .style("top", (d3.event.layerY + 15) + "px")
      .style("left", (d3.event.layerX + 15) + "px")
    } else {
      var tooltip_width = $("#tooltip-container").width();
      d3.select("#tooltip-container")
      .style("top", (d3.event.layerY + 15) + "px")
      .style("left", (d3.event.layerX - tooltip_width - 30) + "px")
    }
  })
  .on("mouseout", function() {
    $(this).attr("fill-opacity", "1.0");
    $("#tooltip-container").hide();
  })
  //action when clicking with the mouse on a country
  .on("click", function(d){
    selectedCountry = getCountryByName(countries, d.properties.name);
    var circle= bubbleSvg.selectAll("circle");
    var data = circle.data(selectedCountry.data);
    var enter = data.enter();

    enter.append("circle")
    .attr("class", "deathBubble")
    .attr("cy", 60)
    .attr("cx", function(d, i) { return i * 100 + 30; })
    .attr("r", function(d){
              //size based on percentage
              return maxCircleDiameter * (d.D/selectedCountry.getTotalAmountOfDeaths());
            });
    enter.append("circle")
    .attr("class", "mediaBubble")
    .attr("cy", 60)
    .style("stroke", "red")
    .style("stroke-width", "3")
    .style("fill-opacity","0.5")
    .attr("cx", function(d, i) { return i * 100 + 30; })
    .attr("r", function(d) 
    {
              //size based on percentage
              return maxCircleDiameter * (d.M/selectedCountry.getTotalAmountOfMedia()); 
            });  


    var deathBubbles= bubbleSvg.selectAll(".deathBubble");

    deathBubbles.transition().duration(500)
    .attr("r", function(d){
     return maxCircleDiameter * (d.D/selectedCountry.getTotalAmountOfDeaths());
   });

    var mediaBubbles= bubbleSvg.selectAll(".mediaBubble");

    mediaBubbles.transition().duration(500)
    .attr("r", function(d){
      return maxCircleDiameter * (d.M/selectedCountry.getTotalAmountOfMedia()); 
    });


  });

  g.append("path")
  .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
  .attr("class", "boundary")
  .attr("d", path);

  svg.attr("height", config.height * 2.2 / 3);
  });

  d3.select(self.frameElement).style("height", (height * 2.3 / 3) + "px");
  });