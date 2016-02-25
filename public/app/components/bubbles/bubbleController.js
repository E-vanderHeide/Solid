var diameter = 800,
format = d3.format(",d"),
color = d3.scale.category20c();

var maxCircleDiameter = 150;




var bubbleSvg = d3.select("#canvas-bubbles").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");