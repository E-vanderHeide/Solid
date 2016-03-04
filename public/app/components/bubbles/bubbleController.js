var diameter = 800,
format = d3.format(",d"),
color = d3.scale.category20c();

var maxCircleDiameter = 150;




var bubbleSvg = d3.select("#canvas-bubbles").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");


function changeCountrySelection()
{
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

}

  
