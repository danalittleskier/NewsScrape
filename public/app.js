// Grab the articles as a json
$.getJSON("/articles", function (data) {
  $('#articles').append(`<div class="container">`)
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $('#articles').append(`<div class="row>`);
    $('#articles').append(`<div class="col-sm"><img src="${data[i].image}"></div>`);
    $("#articles").append(`<div class="col-sm"><p><h3>${data[i].title}</h3>${data[i].link}<br />${data[i].summary}<br />${data[i].article_date} -- `);
    $("#articles").append(`<button type='button' id='deletearticle' class='btn btn-secondary btn-sm' data-articleid='${data[i]._id}'>Delete Article</button> </p></div>`);
    $("#articles").append(`<div class="row"><button type='button' id='articlebutton' class='btn btn-light btn-sm' 
                            data-articleid='${data[i]._id}' data-toggle='modal' data-target='#notesModal'>Add Note</button></div>`);
    $('#articles').append(`</div>`)
    for (var j = 0; j < data[i].notes.length; j++) {
      $('#articles').append(`<div class="row>`);
      $("#articles").append(`<p><i>${data[i].notes[j].body}<i><span><button type='button' id='deletenote' class='btn btn-light btn-sm' data-noteid='${data[i]._id}'>Delete Note</button> </span></p>`);
      $('#articles').append(`</div>`);
    }


  }
  $('#articles').append(`</div>`);
});

// When you click the savenote button
$(document).on("click", "#scrape", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (response) {
      location.reload();
    });

});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var articleId = $("#articlebutton").attr("data-articleid");

  var noteTitle = $("#note-title").val();
  var noteBody = $("#note-body").val();

  if (noteTitle === "" || noteBody === "") {
    alert("You need to enter a note title and body.");
    return;
  }

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/submit/" + articleId,
    data: {
      // Value taken from title input
      title: noteTitle,
      // Value taken from note textarea
      body: noteBody
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      location.reload();
      // Empty the notes section
    });

});

// When you click the delete article
$(document).on("click", "#deletearticle", function () {
  // Grab the id associated with the article from the delete button
  var articleId = $("#deletearticle").attr("data-articleid");

  $.ajax({
    method: "GET",
    url: "/delete/" + articleId,
    // On successful call
    success: function (response) {
      location.reload();
    }

  });

});
