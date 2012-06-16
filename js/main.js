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
  * Initialises the jPlayer audio players on the page
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
  * Initialize talk object
  */
  var talk = {
      name: '',
      option: 'talks',
      list: [],
      page: 1    
  };

  $('.form-search').submit(function(e) {
    $('.spin').spin();
    e.preventDefault();
    talk.name = $('.input-search').val();
    $('.input-search').val(null);
    $.getJSON('http://dharma-api.com/talks?api_key=c5257b4edb77e1d35a797d5ffc9b4691&rpp=10&search=' + talk.name + '&page=' + talk.page + '&callback=?',
      function(response) {
        // Cache the results
        talk.list = response.results;
        talk.metta = response.metta;
        if(!!talk.metta) {
          var metta =   '<ul>';
              metta +=    '<li><span>Total:</span>"' + talk.metta.total + '"</li>';
              metta +=    '<li><span>Ordered by:</span>"' + talk.metta.ordered_by + '"</li>';
              metta +=    '<li><span>Loving Kindness:</span>"' + talk.metta.loving_kindness + '"</li>';
              metta +=  '</ul>';
              $('.metta').html(metta);
        }
        if(!!talk.list) {
          $('.results').html(null);
          $(talk.list).each(function(i, item) {
            var picture;
            if(typeof item.speaker.picture == 'undefined') {
              picture = 'img/nopic.jpg';
            } else {
              picture = item.speaker.picture;
            }
            var description;
            if(typeof item.description == 'undefined') {
              description = '';
            } else {
              description = item.description;
            }

            var results =   '<div class="row_item row-fluid">';
                results +=    '<div class="span2">';
                results +=      '<div class="img_div">';
                results +=        '<img src="' + picture + '" ' + 'class="speakers_img">';
                results +=      '</div>';
                results +=    '</div>';
                results +=    '<div class="span7">';
                results +=      '<ul class="talk_details">';
                results +=        '<li><h1 class="title">' + item.title + '</h1></li>';
                results +=        '<li><span>Description:</span>' + description + '</li>';
                results +=        '<li><span>Speaker:</span>' + item.speaker.name + '</li>';
                results +=        '<li><span>Date:</span>' + item.date + '</li>';
                results +=        '<li><span>Duration:</span>' + item.duration + '</li>';
                results +=        '<li><span>Source:</span>' + item.source + '</li>';
                results +=        '<li><span>Licence:</span><a href="' + item.license + '">Creative Commons</a></li>';
                results +=        '<li><a href="' + item.permalink + '"><span>Download &rarr;</span></a></li>';
                results +=      '</ul>';
                results +=    '</div>';
                results +=    '<div class="span2">';
                results +=      '<div id="jquery_jplayer_' + item.id + '" class="cp-jplayer" rel="' + item.permalink + '"></div>';
                results +=      '<div id="cp_container_' + item.id + '" class="cp-container">';
                results +=        '<div class="cp-buffer-holder"> <!-- .cp-gt50 only needed when buffer is > than 50% -->';
                results +=          '<div class="cp-buffer-1"></div>';
                results +=          '<div class="cp-buffer-2"></div>';
                results +=        '</div>';
                results +=        '<div class="cp-progress-holder"> <!-- .cp-gt50 only needed when progress is > than 50% -->';
                results +=          '<div class="cp-progress-1"></div>';
                results +=          '<div class="cp-progress-2"></div>';
                results +=        '</div>';
                results +=        '<div class="cp-circle-control"></div>';
                results +=        '<ul class="cp-controls">';
                results +=          '<li><a href="#" class="cp-play" tabindex="1">play</a></li>';
                results +=          '<li><a href="#" class="cp-pause" style="display:none;" tabindex="1">pause</a></li> <!-- Needs the inline style here, or jQuery.show()uses display:inline instead of display:block -->';
                results +=        '</ul>';
                results +=      '</div>';
                results +=    '</div>';
                results +=  '</div>';                       
                $(results).appendTo('.results')   

          });
          init_audios();
          $('.spin').html(null);
        }
      }
    );
  });
  init_audios();
  $('.input-search').focus();

});
