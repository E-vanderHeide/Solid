function SuperCategory(name, size, meanCoverage, maxCoverage, minCoverage, totalCoverage, children){
  this.name = name;
  this.depth = 1;
  this.size = size;
  this.coverage = meanCoverage;
  this.maxCoverage = maxCoverage;
  this.minCoverage = minCoverage;
  this.totalCoverage = totalCoverage;
  this.children = children;
}

function Category(name, size, coverage)
{
  this.name = name;
  this.size = size;
   this.depth = 2;
  this.coverage = coverage;
}

function Country(name, categories){
      this.name = name;

      this.children = categories;


      this.getColorCriteriumValue = function(criterium)
      {
        // if(criterium == "correlation")
        // {
        //   return this.getCorrelation();
        // }
        // else
        // {
        //   var dataType = criterium.substring(0,1);
        //   var number = criterium.substring(1,3);
        //   console.log("number: " + number + " dataType: " + dataType);

        //   var matchingData =  $.grep(this.data, function(d){ return d.Cause == number })[0];

        //   console.log("Country: " + this.name + " Cause " + matchingData.Cause + " Death " +  matchingData.D/this.getTotalAmountOfDeaths()+ " Media " +  matchingData.M/this.getTotalAmountOfMedia());

        //   if(dataType == "D")
        //   {
        //     return matchingData.D/this.getTotalAmountOfDeaths();
        //   }else
        //   {
        //     return matchingData.M/this.getTotalAmountOfMedia();
        //   }

        // }
         return 0.5;
      };
      this.getTotalAmountOfDeaths = function(){

        var total = 0;

        $.each(this.children, function(index, value){

          total += value.size;
        });
        return total;
      };
      this.getTotalAmountOfMedia = function(){

        var total = 0;

        $.each(this.children, function(index, value){

          total += value.totalCoverage;
        });
        return total;
      };
      this.getCorrelation = function(){
        var daly = [];
        var media = [];

        /** Create the arrays for media and death for calculating the correlation **/
        $.each(this.children, function(index, value){
          for (var i=0; i<value.children.length; i++) {
            var subCat = value.children[i];
            daly.push(subCat.size);
            media.push(subCat.coverage);
          };
        });

        /** Calcualte the correlation **/
        
        var shortestArrayLength = 0;
     
        if(daly.length == media.length) {
            shortestArrayLength = daly.length;
        } else if(daly.length > media.length) {
            shortestArrayLength = media.length;
            console.error('daly has more items in it, the last ' + (daly.length - shortestArrayLength) + ' item(s) will be ignored');
        } else {
            shortestArrayLength = daly.length;
            console.error('media has more items in it, the last ' + (media.length - shortestArrayLength) + ' item(s) will be ignored');
        }

        var dalyMedia = [];
        var daly2 = [];
        var media2 = [];
  
        for(var i=0; i<shortestArrayLength; i++) {
            dalyMedia.push(daly[i] * media[i]);
            daly2.push(daly[i] * daly[i]);
            media2.push(media[i] * media[i]);
        }
  
        var sum_media = 0;
        var sum_daly = 0;
        var sum_dalyMedia = 0;
        var sum_daly2 = 0;
        var sum_media2 = 0;
  
        for(var i=0; i< shortestArrayLength; i++) {
            sum_daly += daly[i];
            sum_media += media[i];
            sum_dalyMedia += dalyMedia[i];
            sum_daly2 += daly2[i];
            sum_media2 += media2[i];
        }
  
        var step1 = (shortestArrayLength * sum_dalyMedia) - (sum_daly * sum_media);
        var step2 = (shortestArrayLength * sum_daly2) - (sum_daly * sum_daly);
        var step3 = (shortestArrayLength * sum_media2) - (sum_media * sum_media);
        var step4 = Math.sqrt(step2 * step3);
        var correlation = step1 / step4;
  
        return correlation;
      }
    }


   function getDataForCountry(data)
   {
    var superCategories = [];
    for(var i=0; i<data.children.length; i++)
    {
      var value = data.children[i];
      var children = [];
      for(var j = 0; j<value.children.length; j++)
      {
        var subCat = value.children[j];
        children.push(new Category(subCat.name, subCat.size, subCat.coverage));

      }
      superCategories.push(new SuperCategory(value.name, value.size, value.coverage, value.maxCoverage, value.minCoverage, value.totalCoverage, children));
    }

    // var countryData = [];
    // addDataToCountryDataArray(countryData, "01", parseInt(data.D01), parseInt(data.M01));
    // addDataToCountryDataArray(countryData, "02", parseInt(data.D02), parseInt(data.M02));
    // addDataToCountryDataArray(countryData, "03", parseInt(data.D03), parseInt(data.M03));
    // addDataToCountryDataArray(countryData, "04", parseInt(data.D04), parseInt(data.M04));
    // addDataToCountryDataArray(countryData, "05", parseInt(data.D05), parseInt(data.M05));
    // addDataToCountryDataArray(countryData, "06", parseInt(data.D06), parseInt(data.M06));
    // addDataToCountryDataArray(countryData, "07", parseInt(data.D07), parseInt(data.M07));
   // countryData.getColorCriteriumValue("D01");

    return new Country(data.name, superCategories);
  }

  function getDataForCountries(data)
  {
    var countries = [];
    for(var i = 0; i<data.length; i++)
    {
      var value = data[i];
      countries.push(getDataForCountry(value));

    }
    return countries;
  }

  function getCountryByName(countries, name){
    var foundCountries =  $.grep(countries, function(e){ return e.name == name});
        return foundCountries[0]///>0?foundCountries[0]: false;
  }


  function addDataToCountryDataArray(array, cause, death, media)
  {
    var value = {Cause:cause, D:death, M:media};
    array.push(value);


    var extreme =  $.grep(extremes, function(e){ return e.Cause == cause});
    if(extreme.length == 0)
    {
      extremes.push(value);
    }
    else
    {
      if(extreme.D < death)
      {
        extreme.D = death;
      }
      if(extreme.M < media)
      {
        extreme.M = media;
      }
    }
  }

  function generateColorScale(minimum, maximum, numberOfValues)
  {
    var result = Array(numberOfValues);
    var gap = (maximum - minimum)/(numberOfValues-1);


    var currentValue = minimum;
    for(var i = 0; i<numberOfValues; i++)
    {
      result[i] = currentValue;
      currentValue += gap;
    }
   // result[i+1] = currentValue;
    return result;
  }

  //Current selected country on map
  var selectedCountry;
  //List of all countries
  var countries = [];
  //List of extremes for each Cause of death
  var extremes = [];

var CauseIndex = 3;

// function changeColorCodingMap()
// {
//   colorCriterium = "D0" + CauseIndex;
// //update();
//   drawMap();
//   CauseIndex ++;
//   if(CauseIndex >7)
//   {
//     CauseIndex = 1;
//   }


//   //change the domain

//   //change selected variable
// }