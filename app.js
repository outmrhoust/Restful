/* This is importing the modules that we need to use in our project. */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

/* Setting the view engine to ejs. */
app.set("view engine", "ejs");

/* Parsing the body of the request. */
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/* Telling the server to use the public folder as a static folder. */
app.use(express.static("public"));

/* Connecting to the database. */
mongoose.connect("mongodb://localhost:27017/wikiDB");

/* Creating a schema for the articles. */
const articlesSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

/* Creating a model for the articles. */
const Article = mongoose.model("Article", articlesSchema);
/* A chain of methods that are used to handle the requests. */
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (err) {
        res.send(err);
      } else {
        res.send(articles);
      }
    });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save((err) => {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  });
app
  .route("/articles/:anyArticle")
  .get((req, res) => {
    Article.findOne({ title: req.params.anyArticle }, (err, articles) => {
      if (articles) {
        res.send(articles);
      } else {
        res.send("no article found");
      }
    });
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.anyArticle },
      { content: req.body.content },
      (err) => {
        if (!err) {
          res.send("success");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.anyArticle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("success");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.anyArticle }, (err) => {
      if (!err) {
        res.send("successfully deleted");
      } else {
        res.send(err);
      }
    });
  });

/* Starting the server. */
app.listen(process.env.PORT || 4000, function () {
  console.log("Server started");
});
