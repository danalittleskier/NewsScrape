var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");

var router = express.Router();
//Require all models
var db = require("../models");

router.get("/scrape", function (request, response) {
    axios.get("https://www.skiracing.com/stories").then(function (response) {

        var $ = cheerio.load(response.data);
        //var tempResult = [];

        $(".article-tease").each(function (i, element) {

            var article = {};
            article.title = $(element).find("h2").text().trim();
            article.link = $(element).find("a").attr("href").trim();
            article.summary = $(element).find("p").text().trim();
            article.image = $(element).find("img").attr("src").trim();
            article.article_date = $(element).find(".article-date").text().trim();

            db.Article.findOne({ title: article.title })
                .then(function (dbArticle) {
                    if (!dbArticle) {
                        console.log("article not fouund");
                        db.Article.create(article)
                            .then(function(newArticle) {
                                console.log(newArticle);
                            })
                            .catch(function(err){
                                console.log(err);
                            });
                    }
                    else{
                        console.log(dbArticle);
                    }
                })
                .catch(function (err) {
                    response.json(err);
                });
        });
    });
    // Send a message to the client
    response.send("Scrape Complete");
});

// POST route for saving a notes associated to an Article
router.post("/submit/:id", function(req, res) {
    // Create a Note and attach it to the Article
    console.log("req params id "+req.params.id);
    console.log("req body "+ req.body);
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

// Route for getting all Articles from the db
//Grab the notes that go with article and sort the articles by date descending
router.get("/articles", function (req, res) {
    db.Article.find({})
        .populate("notes")
        .sort({ article_date: -1 })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Delete article by id
router.get("/delete/:id", function(req, res) {
    //Find article then delete the notes that belong to it then the article
    db.Article.findById(req.params.id)
     .then(function(dbArticle){

        dbArticle.notes.map(note => 
            db.Note.findByIdAndDelete(note)
            .then(function(dbNote){
                console.log(dbNote);
            })
            .catch(function (err) {
                res.send(err);
            }));

        db.Article.findByIdAndDelete(req.params.id)
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function (err){
                res.send(err);
            });

     })
     .catch(function (err) {
        res.json(err);
    });

  });

// Export routes for server.js to use.
module.exports = router;