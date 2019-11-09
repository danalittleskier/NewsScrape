var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  article_date: {
    type: Date
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  notes: [
    { 
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
