function SuperCategory(name, size, meanCoverage, maxCoverage, minCoverage, totalCoverage, subCategories){
  this.name = name;
  this.size = size;
  this.meanCoverage = meanCoverage;
  this.maxCoverage = maxCoverage;
  this.minCoverage = minCoverage;
  this.totalCoverage = totalCoverage;
  this.subCategories = subCategories;
}

function Category(name, size, coverage)
{
  this.name = name;
  this.size = size;
  this.coverage = coverage;
}

function Country(name, categories){
      this.name = name;

      this.categories = categories;


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

        $.each(this.categories, function(index, value){

          total += value.size;
        });
        return total;
      };
      this.getTotalAmountOfMedia = function(){

        var total = 0;

        $.each(this.categories, function(index, value){

          total += value.totalCoverage;
        });
        return total;
      };
      this.getCorrelation = function(){
        // var correlation = 0;
        // var sum = 0;
        // var counter = 0;
        // $.each(this.data, function(index, value){
        //   sum += Math.abs(value.D - value.M);
        //   counter++;
        // });
        // correlation = sum / counter;
        // return Math.round(correlation); 
        return 0;
      }
    }


   function getDataForCountry(data)
   {
    var superCategories = [];
    $.each(data.children, function(index, value)
    {
      var subCategories = [];
      $.each(value.children, function(jndex, subCat)
      {
        subCategories.push(new Category(subCat.name, subCat.size, subCat.coverage));

      });
      superCategories.push(new SuperCategory(value.name, value.size, value.coverage, value.maxCoverage, value.minCoverage, value.totalCoverage, subCategories));
    });

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
    $.each(data, function(index, value){
      countries.push(getDataForCountry(value));

    });
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

function changeColorCodingMap()
{
  colorCriterium = "D0" + CauseIndex;
//update();
  drawMap();
  CauseIndex ++;
  if(CauseIndex >7)
  {
    CauseIndex = 1;
  }


  //change the domain

  //change selected variable
}