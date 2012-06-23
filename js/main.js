var _gaq = [];
_gaq.push(['_setAccount', 'UA-31671486-5'], ['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$('.about').click(function () {
  $('#about').modal();
});

function soundmanager () {
  /**
  * Soundmanager stuff
  */
  soundManager.url = 'soundmanager/swf/'; // path to directory containing SM2 SWF

  soundManager.useFastPolling = true; // increased JS callback frequency, combined with useHighPerformance = true

  threeSixtyPlayer.config.scaleFont = (navigator.userAgent.match(/msie/i)?false:true);
  threeSixtyPlayer.config.showHMSTime = true;

  // enable some spectrum stuffs

  threeSixtyPlayer.config.useWaveformData = true;
  threeSixtyPlayer.config.useEQData = true;

  // enable this in SM2 as well, as needed

  if (threeSixtyPlayer.config.useWaveformData) {
    soundManager.flash9Options.useWaveformData = true;
  }
  if (threeSixtyPlayer.config.useEQData) {
    soundManager.flash9Options.useEQData = true;
  }
  if (threeSixtyPlayer.config.usePeakData) {
    soundManager.flash9Options.usePeakData = true;
  }

  if (threeSixtyPlayer.config.useWaveformData || threeSixtyPlayer.flash9Options.useEQData || threeSixtyPlayer.flash9Options.usePeakData) {
    // even if HTML5 supports MP3, prefer flash so the visualization features can be used.
    soundManager.preferFlash = true;
  }

  // favicon is expensive CPU-wise, but can be used.
  if (window.location.href.match(/hifi/i)) {
    threeSixtyPlayer.config.useFavIcon = true;
  }

  if (window.location.href.match(/html5/i)) {
    // for testing IE 9, etc.
    soundManager.useHTML5Audio = true;
  }

}

function init_audio () {
  soundManager.stopAll();
  soundManager.flashLoadTimeout = 0;
  soundManager.onerror = {};
  soundManager.reboot();
}

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
* Make call to dharma-api.com and render the results
*/
function search_and_render(append){
  if(append === false) {
    $(".results").html(null);
    page = 1;
    $("body").unhighlight();
  }
  loading = true;
  var uri = api_uri('talks') + '&rpp=10&search=' + searched + '&page=' + page;
  $.ajax({
    url: uri,
    dataType: 'jsonp',
    beforeSend: function(){
      $('.spin').spin();
    },
    success: function(response) {
      if(response) {
        var results = response.results;
        // Ajax template and render
        $.get('talk.html', function(template) {
          $.tmpl(template, results).appendTo('.results');
        });
        loading = false;
        $('.metta_total').html(response.metta.total);
      }
    },
    complete: function(){
      init_audio();
      // Stop the spinner
      $('.spin').html(null);
    }
  });
  // Highlight search phrase
  setTimeout(function function_name (argument) {
    $(".results, .metta_total").highlight(searched);
  }, 2000);
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

jQuery(document).ready(function() {
 
  soundmanager();

  // Displays results on homepage
  searched = $('.search-query').val();
  search_and_render();
 
  /**
  * Infinite scrolling
  */
  $(window).scroll(function(){
    if((($(window).scrollTop() + $(window).height()) + 600) >= $(document).height()){
      if(loading === false){
        page = page + 1;
        search_and_render(true);
      }
    }
  });
   
  /**
  * Bind search form
  */
  $('.search-form').submit(function(e) {
    e.preventDefault();
    searched = $('.search-query').val();

    // Clear the search form for next search
    $('.search-query').val(null);
    search_and_render(false);
    $('.search_string').html('with ' + '"' + searched + '"');

  });
  
  // Focus cursor in search box on page load
  $('.search-query').focus();

});
