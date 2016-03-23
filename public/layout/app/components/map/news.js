//update news when clicked
//TO DO: change dalys names on the database to something easier for wkipedia to find?
function drawNews(dalys, type, dPercentage, mValue, coverage)
  	{
      //console.log("dPercentage = "+dPercentage+", mValue = "+mValue+", coverage = "+coverage);
  		//API call to Wikipedia to get text about the dalys
  		$.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="  + dalys + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            // console.log("data = vvv");
            // console.log(data);

            var markup;
            var blurb;
            var image;

            if(data.parse){
              // console.log("PARSE");

              markup = data.parse.text["*"];
              //console.log(markup);
              
              blurb = $('<div></div>').html(markup);

              //console.log(blurb.find('.redirectText').find('a').attr("href")); 
              //REDIRECT sample url: /w/index.php?title=Injury&amp;redirect=no
              var redirectText = blurb.find('.redirectText').find('a').attr("href");
              var newTitle = $.urlParam(redirectText,'title');

              if(redirectText){
                // console.log("Redirect");
                // console.log("newTitle = "+newTitle); //new dalys
                redrawNews(newTitle);
              }

              // remove links as they will not work
              blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
   
              // remove any references
              blurb.find('sup').remove();
   
              // remove cite error
              blurb.find('.mw-ext-cite-error').remove();

              //add the info to the text box
              $('#dalysInfo').html($(blurb).find('p').first());

              image = blurb.find('.infobox').find('img').addClass("img-responsive");

            }else{
              // console.log("ERROR");

              markup = data.error["info"];
              // console.log("markup = "+markup);

              blurb = $('<div></div>').html(markup); 

              // remove links as they will not work
              blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
   
              // remove any references
              blurb.find('sup').remove();
   
              // remove cite error
              blurb.find('.mw-ext-cite-error').remove();

              // $('#dalysInfo').html(blurb);
              $('#dalysInfo').html("Sorry, we could not find more information...");

              image = '<img src="images/logo_130.png" class="img-responsive">';
              
            }

            //add image
            $('#dalysImg').html(image);
        },
        //this does not work, because the page is always found, even though the page might not have text
        error: function (errorMessage) {
        	document.getElementById("dalysInfo").innerHTML = "Sorry, we could not find more information...";
        }
      });
      
      var head = "<h4>"+dalys+"</h4>";
      if (type == "disease"){
        head += "<h4>DALY: "+dPercentage+"%  Media coverage: "+mValue+"%  ("+coverage+")</h4>";
      }else{
        head += "<h4>Average: "+coverage+"</h4>";
      }
      $('#dalysHead').html(head);

  		//the user has to selected a node before seeing these links displayed
  		document.getElementById("newsTitle").innerHTML = "News sources:";

  		var sessionlist = " ";
  		sessionlist += '<a href="http://www.bbc.co.uk/search?q=' + dalys + '" target="_blank">BBC</a>';
  		//add BBC search link to the news box
  		document.getElementById("bbcLink").innerHTML = sessionlist;

  		var sessionlist = " ";
  		sessionlist += '<a href="http://edition.cnn.com/search/?text=' + dalys + '" target="_blank">CNN</a>';
  		//add CNN search link to the news box
  		document.getElementById("cnnLink").innerHTML = sessionlist;

  		var sessionlist = " ";
  		sessionlist += '<a href="https://en.wikipedia.org/wiki/' + dalys + '" target="_blank"><i>more on Wikipedia</i></a>';
  		//add Wikipedia reference to the "More" link
  		document.getElementById("dalysMore").innerHTML = sessionlist;
  		//TO DO: add more news sources depending on country?

      
      $.urlParam = function(redirectURL, name){
        // var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(redirectURL);
        //console.log("urlParam // results = "+results);
        if (results==null){
           return null;
        }else{
           return results[1] || 0;
        }
      }
}

function redrawNews(dalys){
  $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="  + dalys + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
          // console.log(data);
            var markup;
            var blurb;
            var image;

            if(data.parse){
              // console.log("PARSE");

              markup = data.parse.text["*"];
             
              blurb = $('<div></div>').html(markup);

              // remove links as they will not work
              blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
   
              // remove any references
              blurb.find('sup').remove();
   
              // remove cite error
              blurb.find('.mw-ext-cite-error').remove();

              //add the info to the text box
              $('#dalysInfo').html($(blurb).find('p').first());

              // console.log(blurb);

              image = blurb.find('.infobox').find('img').addClass("img-responsive");

            }else{
              // console.log("ERROR");

              markup = data.error["info"];
             
              blurb = $('<div></div>').html(markup); 

              // remove links as they will not work
              blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
   
              // remove any references
              blurb.find('sup').remove();
   
              // remove cite error
              blurb.find('.mw-ext-cite-error').remove();

              // $('#dalysInfo').html(blurb);
              $('#dalysInfo').html("The selected object doesn't have data on Wikipedia.");

              image = '<img src="images/logo_130.png" class="img-responsive">';
              
            }

            //add image
            $('#dalysImg').html(image);
        },
        //this does not work, because the page is always found, even though the page might not have text
        error: function (errorMessage) {
          document.getElementById("dalysInfo").innerHTML = "Sorry, we could not find more information...";
        }
      });
}

