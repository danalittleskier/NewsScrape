var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");

var router = express.Router();
//Require all models
var db = require("../models");


//Find all articles and return them
router.get("/", function (req, res) {
    db.Article.find({})
        .populate("notes")
        .sort({ article_date: -1 })
        .then(function (dbArticles) {
            //res.json(dbArticle);
            res.render("index", {
                msg: "Welcome!",
                articles: dbArticles
              });
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/scrape", function (request, response) {
    axios.get("https://www.skiracing.com/stories").then(function (response) {

        var $ = cheerio.load(response.data);

        $(".article-tease").each(function (i, element) {

            var article = {};
            article.title = $(element).find("h2").text().trim();
            article.link = $(element).find("a").attr("href").trim();
            article.summary = $(element).find(".article-excerpt").find("p").text().trim();
            article.image = $(element).find("img").attr("src").trim();
            article.article_date = $(element).find(".article-date").text().trim();

            db.Article.findOne({ title: article.title })
                .then(function (dbArticle) {
                    if (!dbArticle) {
                        console.log("article not fouund");
                        db.Article.create(article)
                            .then(function (newArticle) {
                                console.log(newArticle);
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    }
                    else {
                        console.log(dbArticle);
                    }
                })
                .catch(function (err) {
                    response.json(err);
                });
        });
    });
    return response.send("Scrape is done");
});

// POST route for saving a notes associated to an Article
router.post("/submit/:id", function (req, res) {
    // Create a Note and attach it to the Article
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Delete all articles from database
router.delete("/deleteAll", function (req, res) {
    db.Article.deleteMany({})
        .then(function (removed) {
            //res.deletedCount;
            res.json(removed);
        })
        .catch(function (err) {
            res.json(err);
        });
});


//Delete article by id
router.get("/delete/:id", function (req, res) {
    //Find article then delete the notes that belong to it then the article
    db.Article.findById(req.params.id)
        .then(function (dbArticle) {
            //For each note in the article remove it
            dbArticle.notes.map(note =>
                db.Note.findByIdAndDelete(note)
                    .then(function (dbNote) {
                        console.log(dbNote);
                    })
                    .catch(function (err) {
                        res.send(err);
                    }));

            db.Article.findByIdAndDelete(req.params.id)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                    res.send(dbArticle);
                })
                .catch(function (err) {
                    res.send(err);
                });
        })
        .catch(function (err) {
            res.json(err);
        });

});

//Delete note by id
router.get("/remove/:id", function (req, res) {
    console.log("delete note " + req.params.id);
    db.Note.findByIdAndDelete(req.params.id)
        .then(function (dbNote) {
            res.send(dbNote);
        })
        .catch(function (err) {
            res.send(err);
        });
});

// Update just one note by an id
router.put("/update/:id", function (req, res) {
    db.Note.findOneAndUpdate(
        { _id: req.params.id },
        {
            title: req.body.title,
            body: req.body.body
        })
        .then(function (dbNote) {
            res.send(dbNote);
        })
        .catch(function (err) {
            res.send(err);
        });

});
// Export routes for server.js to use.
module.exports = router;