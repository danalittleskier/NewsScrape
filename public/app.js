// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p><h3>" + data[i].title + "</h3>" + data[i].link +"<br />" + data[i].summary + "<br />"+ data[i].article_date +  "</p>");
    for(var j=0; j < data[i].notes.length; j++){
      $("#articles").append("<p>" + data[i].notes[j].body + "</p>");
    }
    $("#articles").append("<button type='button' id='articlebutton' class='btn btn-primary btn-sm' data-articleid='" + data[i]._id + "' data-toggle='modal' data-target='#notesModal'>Add Note</button>");
  }
});


// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $("#articlebutton").attr("data-articleid");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/submit/" + thisId,
    data: {
      // Value taken from title input
      title: $("#note-title").val(),
      // Value taken from note textarea
      body: $("#note-body").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      location.reload();
      // Empty the notes section
    });

});
