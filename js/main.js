$('.about').click(function () {
  $('#about').modal();
});

// My first propper funtion I made all by myself!!
function format_date (date) {
  var year = date[0] + date[1] + date[2] + date[3];
  var month = date[5] + date[6];
  var day = date[8] + date[9];
  if (day[0] == 0) day = day[1];
  if (day == '01' || day == '21' || day == '31') day += 'st';
  else if (day == '02' || day == '22') day += 'nd';
  else if (day == '03' || day == '23') day += 'rd';
  else day += 'th';
  if (month == '01') month = 'January';
  if (month == '02') month = 'February';
  if (month == '03') month = 'March';
  if (month == '04') month = 'April';
  if (month == '05') month = 'May';
  if (month == '06') month = 'June';
  if (month == '07') month = 'July';
  if (month == '08') month = 'August';
  if (month == '09') month = 'September';
  if (month == '10') month = 'October';
  if (month == '11') month = 'November';
  if (month == '12') month = 'December';
  return day + ' ' + month + ' ' + year; 
}

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
/**
* Initialise audio players
*/
function init_audio () {
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
        // http://icanhazjs.com/
        for (var i = 0; i < 10; i++) {
          // Check and format results
          results[i].speaker.picture ? null : results[i].speaker.picture = 'img/nopic.png';
          results[i].title ? null : results[i].title = 'empty';
          results[i].speaker.name ? null : results[i].speaker.name = 'empty';
          results[i].date ? results[i].date = format_date(results[i].date) : results[i].date = 'empty';
          results[i].duration ? results[i].duration = '(' + parseInt(results[i].duration/60/60) + ' hours ' + parseInt(results[i].duration/60)%60 + ' minutes)' : results[i].duration = 'empty';
          results[i].description ? null : results[i].description = 'empty';
          results[i].license ? null : results[i].license = 'empty';
          results[i].permalink ? null : results[i].permalink = 'empty';
          results[i].source ? null : results[i].source = 'empty';
          // Propogate and append template
          ich.talk_template(results[i]).appendTo('.results');
        };
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
  setTimeout(function() {
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
    $('.search_string').html('with ' + '"' + searched + '".');
  }); 
  // Focus cursor in search box on page load
  $('.search-query').focus();
});
