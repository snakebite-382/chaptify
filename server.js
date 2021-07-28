const express = require("express");
const path = require("path");

// create our app and get our port
const App = express();
const PORT = process.env.PORT || 5000;

// get a path to frontend static files based on if in production or not
const STATIC_PATH = process.env.NODE_ENV == "production" ? "frontend/build" : "frontend/public";

// serve files from our frontend first
App.use(express.static(path.join(__dirname, STATIC_PATH)));

// API
// then process any api requests

// then any requests not caught by the API or the frontend files is a 404 however 404s are handled by react router so we send the index.html page which will then handle the 404 with react router
App.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, STATIC_PATH + '/index.html'));
});

// start our app on the specified port and log that the port is open
App.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
})