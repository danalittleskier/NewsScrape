//var moment = require("moment");

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    var $articleCard = $(`<div class="card my-2" style="width: 18rem;">`);
    $articleCard.append(`<img class="card-img-top" src="${data[i].image}" alt="News Image">
                              <div class="card-body">
                              <h5 class="card-title"><a href="${data[i].link}" target="_blank">${data[i].title}</a></h5>
                              <p class="card-text">${data[i].summary} <br><i>${data[i].article_date}</i></p></div>
                              <ul class="list-group list-group-flush">`);

    for (var j = 0; j < data[i].notes.length; j++) {
      $articleCard.append(`<li class="list-group-item">${data[i].notes[j].body}<button type='button' class='btn btn-outline-danger btn-sm removenote' data-noteid='${data[i].notes[j]._id}'>Remove Note</button> </li>`)
    }
    $articleCard.append(`</ul><div class="card-body">
                             <button type='button' class='btn btn-outline-danger btn-sm deletearticle' data-articleid='${data[i]._id}'>Delete Article</button>
                             <button type='button' class='btn btn-outline-primary btn-sm articlebutton' 
                              data-articleid='${data[i]._id}' data-toggle='modal' data-target='.notesModal'>Add Note</button></div>`)

    $('#articles').append($articleCard);
  }

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

$(document).on("click", ".articlebutton", function () {
  //Keeep track of the article id where the note goes to
  var articleId = $(this).attr("data-articleid");

  $(".savenote").on("click", function () {

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

});



// When you click the delete article
$(document).on("click", ".deletearticle", function () {
  // Grab the id associated with the article from the delete button
  var articleId = $(this).attr("data-articleid");
  console.log("delete id " + articleId);
  $.ajax({
    method: "GET",
    url: "/delete/" + articleId,
    // On successful call
    success: function (response) {
      location.reload();
    }

  });

});


// When you click the remove note
$(document).on("click", ".removenote", function () {
  // Grab the id associated with the article from the delete button
  var noteId = $(this).attr("data-noteid");
  console.log("note id " + noteId);

  $.ajax({
    method: "GET",
    url: "/remove/" + noteId,
    // On successful call
    success: function (response) {
      location.reload();
    }
  });

});