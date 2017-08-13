
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr+','+cityStr;
    var streetUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location='+address+'';
    $body.append('<img class="bgimg" src="'+streetUrl+'">');


    var nytimesURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&sort=newest&api-key=0a8130bcd10d413bb75ec88876062901'
    $.getJSON(nytimesURL,function(data)
    {
    	$nytHeaderElem.text('Articles about '+cityStr);
    	articles = data.response.docs;
    	for(var i =0;i<articles.length;i++)
    	{
    		var article = articles[i];
    		$nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
    	};
    }).fail(function(){
    	$nytElem.append('ERROR! Articles cannot be loaded now');
    });


    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search='+cityStr+'&format=json&callback=wikiCallback' ;
    $.ajax
    (
    	{
    		url: wikiURL,
	    	dataType: "jsonp",
	    	jsonp: "callback",
	    	success: function(response)
	    	{
	    		var articleList = response[1];
	    		var urlList = response[3];
	    		for(var j =0;j<articleList.length;j++)
		    	{
		    		articleStr = articleList[j];
		    		urlStr = urlList[j];
		    		$wikiElem.append('<li><a href="'+urlStr+'">'+articleStr+'</a></li>');
		    	};
		    },
	        error: function(errorMessage) {
	             console.log("damnn");
	          }
	    	});

    return false;
};

$('#form-container').submit(loadData);
