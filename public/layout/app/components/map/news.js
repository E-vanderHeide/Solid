//update news when clicked
//TO DO: change dalys names on the database to something easier for wkipedia to find?
function drawNews(dalys)
  	{
  		//API call to Wikipedia to get text about the dalys
  		$.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="  + dalys + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
 
            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);
 
            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
 
            // remove any references
            blurb.find('sup').remove();
 
            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();

            //add the info to the text box
            $('#dalysInfo').html($(blurb).find('p'));
 
        },
        //this does not work, because the page is always found, even though the page might not have text
        error: function (errorMessage) {
        	document.getElementById("dalysInfo").innerHTML = "Sorry, we could not find more information...";
        }
    });

  		//the user has to selected a node before seeing these links displayed
  		document.getElementById("newsTitle").innerHTML = "Sample News:";

  		var sessionlist = " ";
  		sessionlist += '<a href="http://www.bbc.co.uk/search?q=' + dalys + '" target="_blank">BBC</a>';
  		//add BBC search link to the news box
  		document.getElementById("bbcLink").innerHTML = sessionlist;

  		var sessionlist = " ";
  		sessionlist += '<a href="http://edition.cnn.com/search/?text=' + dalys + '" target="_blank">CNN</a>';
  		//add CNN search link to the news box
  		document.getElementById("cnnLink").innerHTML = sessionlist;

  		var sessionlist = " ";
  		sessionlist += '<a href="https://en.wikipedia.org/wiki/' + dalys + '" target="_blank">More</a>';
  		//add Wikipedia reference to the "More" link
  		document.getElementById("dalysMore").innerHTML = sessionlist;

  		//TO DO: add more news sources depending on country?
	}


