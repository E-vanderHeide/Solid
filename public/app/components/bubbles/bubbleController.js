var diameter = 800,
format = d3.format(",d"),
color = d3.scale.category20c();

var bubble = d3.layout.pack()
.sort(null)
.size([diameter, diameter])
.padding(1.5);

var svg = d3.select("#canvas-bubbles").append("svg")
.attr("width", diameter)
.attr("height", diameter)
.attr("class", "bubble");

d3.json("assets/Data/flare.json", function(error, root) {
if (error) throw error;

var data = getDataForCountry("Spain", root);
      // var node = svg.selectAll(".node")
      //     .data(bubble.nodes(classes(root))
      //     .filter(function(d) { return !d.children; }))
      //   .enter().append("g")
      //     .attr("class", "node")
      //     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      // node.append("title")
      //     .text(function(d) { return d.className + ": " + format(d.value); });

      // node.append("circle")
      //     .attr("r", function(d) { return d.r; })
      //     .style("fill", function(d) { return color(d.packageName); });

      // node.append("text")
      //     .attr("dy", ".3em")
      //     .style("text-anchor", "middle")
      //     .text(function(d) { return d.className.substring(0, d.r / 3); });
    });

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
      var classes = [];

      function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.size});
      }

      recurse(null, root);
      return {children: classes};
    }

    d3.select(self.frameElement).style("height", diameter + "px");

    function getDataForCountry(country, json)
    {
      var countryValues = {
        Deaths:{
          D01:0,
          D02:0,
          D03:0,
          D04:0,
          D05:0,
          D06:0,
          D07:0
        },
        Media:{
          M01:0,
          M02:0,
          M03:0,
          M04:0,
          M05:0,
          M06:0,
          M07:0
        }
      };

      $.each(json, function(index, value){
        if(value.Country == country){
          countryValues.Deaths.D01 = value.D01;
          countryValues.Deaths.D02 = value.D02;
          countryValues.Deaths.D03 = value.D03;
          countryValues.Deaths.D04 = value.D04;
          countryValues.Deaths.D05 = value.D05;
          countryValues.Deaths.D06 = value.D06;
          countryValues.Deaths.D07 = value.D07;

          countryValues.Media.M01 = value.M01;
          countryValues.Media.M02 = value.M02;
          countryValues.Media.M03 = value.M03;
          countryValues.Media.M04 = value.M04;
          countryValues.Media.M05 = value.M05;
          countryValues.Media.M06 = value.M06;
          countryValues.Media.M07 = value.M07;
        }
      });
      return countryValues;
    }