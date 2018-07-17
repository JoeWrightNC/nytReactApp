// Call Server Dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const routes = require("./routes");

// Create Express Server Instance
const app = express();
// Sets an initial port. We'll use this later in our listener
const PORT = process.env.PORT || 3001;

// Utilize Morgan for Continuous Server Logging
app.use(logger("dev"));

//Body Parsing Middleware for Express in Node.JS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Add routes, both API and view
app.use(routes);

// If deployed, use the deployed database. Otherwise use the local database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytBookReviews";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build/static"));
}

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/static/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
