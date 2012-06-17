/**
* Set variables
*/
var API_KEY = "c5257b4edb77e1d35a797d5ffc9b4691";
var API = "http://dharma-api.com/";
var searched;
var page = 1;
var loading = false;

/**
* Build the URI for an API request
*/
function api_uri(method){
  return API + method + '?api_key=' + API_KEY;
}

/**
* Initialises the audio players
*/
function init_audios() {
  $.each($(".cp-jplayer"), function(index, value) {
    var el = $(value);
    new CirclePlayer('#' + el.attr('id'),
      {
        m4a: el.attr("rel")
      },
      {
      cssSelectorAncestor: '#' + el.next('.cp-container').attr('id')
      }
    );
  });
}

/**
* Make call to dharma-api.com and render the results
*/
function search_and_render(append){
  if (append === false) {
    $('.results').html(null);
    page = 1;
  }
  loading = true;
  var uri = api_uri('talks') + '&search=' + searched + '&page=' + page;
  console.log(uri);
  $.getJSON(uri, function(response) {
      if(response) {
          var i = 0;
          var siid = setInterval(
            function talk() {
              if ( i > 11) {
                // Do nothing
                clearInterval(siid);
              } else {
                html = new EJS({url: 'talk.ejs'}).render(response.results[i++]);
                var height = $('.body').height();
                $('.results').append(html);
              }
            }, 100);
          loading = false;
          $('.metta').show();
          $('.metta_total').html(response.metta.total);
      }
  });
}

/**
* Spinner
*/
$.fn.spin = function(opts) {
  this.each(function() {
    var $this = $(this),
        data = $this.data();

    if (data.spinner) {
      data.spinner.stop();
      delete data.spinner;
    }
    if (opts !== false) {
      data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
    }
  });
  return this;
};

$(document).ajaxStart(function(){
  // Start the spinner
  $('.spin').spin();
  init_audios();
});

$(document).ajaxComplete(function(){
  // Initialize the new players
  init_audios();
  // Stop the spinner
  $('.spin').html(null);
});

jQuery(document).ready(function() {

  EJS.config({cache: false}); // Development only
 
  /**
  * Infinite scrolling
  */
  $(window).scroll(function(){
    if((($(window).scrollTop() + $(window).height()) + 600) >= $(document).height()){
      if(loading === false){
        console.log('scrolled');
        page = page + 1;
        search_and_render(true);
      }
    }
  });
 
  
  /**
  * Bind search form
  */
  $('.form-search').submit(function(e) {
    e.preventDefault();
    
    searched = $('.input-search').val();
    
    // Clear the search form for next search
    $('.input-search').val(null);
    
    search_and_render(false);

  });
  
  // Focus cursor in search box on page load
  $('.input-search').focus();

  // Tweet about #dharmasearch button
  !function(d,s,id) {
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)) {
      js=d.createElement(s);
      js.id=id;js.src="//platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(document,"script","twitter-wjs");

});
