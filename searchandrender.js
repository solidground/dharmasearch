function search_and_render(append){
  append = append === false ? false : true; // Default to true
  loading = true;
  var uri = api_uri('talks') + '&search=' + searched + '&page=' + page;
  console.log(uri);
  $.getJSON(uri, function(response) {
      if(!!response) {
        html = new EJS({url: 'talks.ejs'}).render(response);
        if(append){
          $('.results').append(html);
        }else{
          $('.results').html(html);
        }
        $('.metta').show();
        $('.metta_total').html(response.metta.total);
        loading = false;
      }
    }
  );
}