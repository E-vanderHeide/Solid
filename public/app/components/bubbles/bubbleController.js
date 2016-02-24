var diameter = 800,
format = d3.format(",d"),
color = d3.scale.category20c();

var maxCircleDiameter = 150;

var svg = d3.select("#canvas-bubbles").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

  d3.json("assets/Data/flare.json", function(data) {
    var valuesForCountry = getCountryByName(countries,"Spain")
    $.each(valuesForCountry.data, function(index, value){
      var enter = svg.selectAll("circle").data(valuesForCountry.data).enter();
      enter.append("circle")
          .attr("cy", 60)
          .attr("cx", function(d, i) { return i * 100 + 30; })
          .attr("r", function(d) 
            {
              //size based on percentage
              return maxCircleDiameter * (d.D/valuesForCountry.getTotalAmountOfDeaths());
            });
      enter.append("circle")
          .attr("cy", 60)
          .style("stroke", "red")
          .style("stroke-width", "3")
          .attr("cx", function(d, i) { return i * 100 + 30; })
          .attr("r", function(d) 
            {
              //size based on percentage
              return maxCircleDiameter * (d.M/valuesForCountry.getTotalAmountOfMedia()); 
            });
  });
});