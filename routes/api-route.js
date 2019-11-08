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
router.post("/submit", function(req, res) {
    // Create a new Book in the database
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Book was created successfully, find one library (there's only one) and push the new Book's _id to the Library's `books` array
        // { new: true } tells the query that we want it to return the updated Library -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function(dbArticle) {
        // If the Library was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Export routes for server.js to use.
module.exports = router;