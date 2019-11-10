// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    var $articleCard = $(`<div class="card my-2" style="width: 18rem;">`);

    // Display the apropos information on the page
    //$('#articles').append(`<div class="row>`);
      $articleCard.append(`<img class="card-img-top" src="${data[i].image}" alt="News Image">
                              <div class="card-body">
                              <h5 class="card-title"><a class="badge badge-light" href="${data[i].link}">${data[i].title}</a></h5>
                              <p class="card-text">${data[i].summary} <i>${data[i].article_date}</i></p></div>
                              <ul class="list-group list-group-flush">`);

    for (var j = 0; j < data[i].notes.length; j++) {
      $articleCard.append(`<li class="list-group-item">${data[i].notes[j].body}<button type='button' id='deletenote' class='btn btn-outline-danger btn-sm' data-noteid='${data[i]._id}'>Remove Note</button> </li>`)
    }
      $articleCard.append(`</ul><div class="card-body">
                             <button type='button' id='deletearticle' class='btn btn-outline-danger btn-sm' data-articleid='${data[i]._id}'>Delete Article</button>
                             <button type='button' id='articlebutton' class='btn btn-outline-primary btn-sm' 
                              data-articleid='${data[i]._id}' data-toggle='modal' data-target='#notesModal'>Add Note</button></div>`)

    //$('#articles').append(`<div class="col-sm"><img src="${data[i].image}"></div>`);
    //$("#articles").append(`<div class="col-sm"><a class="badge badge-light" href="${data[i].link}"><h3>${data[i].title}</h3></a><br>${data[i].summary}<br />${data[i].article_date} -- `);
    //$("#articles").append(`<button type='button' id='deletearticle' class='btn btn-outline-danger btn-sm' data-articleid='${data[i]._id}'>Delete Article</button>`);
    //$("#articles").append(`<button type='button' id='articlebutton' class='btn btn-outline-primary btn-sm' 
    //                        data-articleid='${data[i]._id}' data-toggle='modal' data-target='#notesModal'>Add Note</button></div>`);
    //$('#articles').append(`</div>`)
    // for (var j = 0; j < data[i].notes.length; j++) {
    //   $('#articles').append(`<div class="row>`);
    //   $("#articles").append(`<p><i>${data[i].notes[j].body}<i><span><button type='button' id='deletenote' class='btn btn-outline-danger btn-sm' data-noteid='${data[i]._id}'>Remove Note</button> </span></p>`);
    //   $('#articles').append(`</div>`);
    // }
    //$articleCard.append("</div>");
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
