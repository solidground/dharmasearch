jQuery(document).ready(function() {
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
  /**
  * Infinte scrolling
  */
  $('.container').infinitescroll({
    loading: {
      finished: undefined,
      finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
      img: "http://www.infinite-scroll.com/loading.gif",
      msg: null,
      msgText: "<em>Loading the next set of posts...</em>",
      selector: null,
      speed: 'fast',
      start: undefined
    },
    state: {
      isDuringAjax: false,
      isInvalidPage: false,
      isDestroyed: false,
      isDone: false, // For when it goes all the way through the archive.
      isPaused: false,
      currPage: 1
    },
    callback: undefined,
    debug: true,
    behavior: undefined,
    binder: $(window), // used to cache the selector
    nextSelector: "a#next:last",
    navSelector: "a#next:last",
    contentSelector: null, // rename to pageFragment
    extraScrollPx: 150,
    itemSelector: ".container div",
    animate: false,
    pathParse: undefined,
    dataType: 'html',
    appendCallback: true,
    bufferPx: 40,
    errorCallback: function () { },
    infid: 0, //Instance ID
    pixelsFromNavToBottom: undefined,
    path: undefined
  });
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
  * Set variables
  */
  var searched;
  var page = 1;
  /**
  * Bind search form
  */
  $('.form-search').submit(function(e) {
    // Start the spinner
    $('.spin').spin();
    e.preventDefault();
    searched = $('.input-search').val();
    // Clear the search form for next search
    $('.input-search').val(null);
    /**
    * Make call to dharma-api.com and render the results
    */
    $.getJSON('http://dharma-api.com/talks?api_key=c5257b4edb77e1d35a797d5ffc9b4691&rpp=10&search=' + searched + '&page=' + page,
        function lovely(response) {
          var data = response;
          if(!!data) {
            html = new EJS({url: 'talks.ejs'}).render(data);
            $('.results').html(html);
            // Initialize the new players
            init_audios();
            // Stop the spinner
            $('.spin').html(null);
          }
        }
    );
  });
  // Focus cursor in search box on page load
  $('.input-search').focus();
});
