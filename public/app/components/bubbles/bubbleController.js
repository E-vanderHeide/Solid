var diameter = 800,
format = d3.format(",d"),
color = d3.scale.category20c();

var maxCircleDiameter = 150;

var svg = d3.select("#canvas-bubbles").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

  d3.json("assets/Data/flare.json", function(data) {
    var valuesForCountry =  getDataForCountry("Spain",data );
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



    function getDataForCountry(country, data)
    {
      var countryValues = {
        name :"",
        data:[],
        getTotalAmountOfDeaths : function(){

          var total = 0;
          
          $.each(this.data, function(index, value){
            
            total += value.D;
          });
          return total;
        },
         getTotalAmountOfMedia : function(){

          var total = 0;
          
          $.each(this.data, function(index, value){
            
            total += value.M;
          });
          return total;
        }
      };
      $.each(data, function(index, value){
        if(value.Country == country){
          countryValues.name= country;
          countryValues.data.push({Cause:"01", D:parseInt(value.D01), M:parseInt(value.M01)});
          countryValues.data.push({Cause:"02", D:parseInt(value.D02), M:parseInt(value.M02)});
          countryValues.data.push({Cause:"03", D:parseInt(value.D03), M:parseInt(value.M03)});
          countryValues.data.push({Cause:"04", D:parseInt(value.D04), M:parseInt(value.M04)});
          countryValues.data.push({Cause:"05", D:parseInt(value.D05), M:parseInt(value.M05)});
          countryValues.data.push({Cause:"06", D:parseInt(value.D06), M:parseInt(value.M06)});
          countryValues.data.push({Cause:"07", D:parseInt(value.D07), M:parseInt(value.M07)});
        }
      });
      return countryValues;
    }