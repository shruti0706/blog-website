
const express = require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Journaling is a wonderfully meditative practice. It helps you reflect on your day, plan for the future, and get creative juices flowing for more directed writing.Sometimes it feels like we had a bad day, but we can’t figure out why. Reflective journaling at the end of the day can help you make sense of what went wrong – and what went right! ";
const aboutContent = "The daily log is when you journal about your day-to-day: what you did, what you ate, who you saw and spoke with. Whatever you want. It’s a working way to log your life. The best part about this journaling habit is that you literally have a hand-written record of what you’ve done on any given day… And believe me when I tell you that it comes in handy.";

const contactContent = "Developer- Shruti Agrawal";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shruti:test123@blogcluster.jja6i.mongodb.net/blogDB");

const postSchema= {
  title: String,
  content : String
};

const Post =mongoose.model("Post",postSchema);

app.get("/", function(req, res) {

  Post.find({}, function(err, posts){
  res.render("home.ejs", {
    startingContent: homeStartingContent,
    posts: posts
  });
});
});


app.get("/compose", function(req, res) {
  res.render("compose.ejs");
});

app.post("/compose", function(req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){

  if (!err){
    res.redirect("/");
  }
});
});

app.get("/posts/:postId",function(req,res){
const requestedPostId =req.params.postId;

Post.findOne({_id:requestedPostId },function(err,post){
  res.render("post.ejs", {
    title : post.title,
    content: post.content
  });
});
});

app.get("/contact", function(req, res) {
  res.render("contact.ejs", {
    contactContent: contactContent
  });
});

app.get("/about", function(req, res) {
  res.render("about.ejs", {
    aboutContent: aboutContent
  });
});

let port=process.env.PORT;
if(port== null || port== ""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
