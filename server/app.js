// Imports
require("dotenv").config()
const express = require("express");

// Constants
const port = 5000;

const app = express();

app.get("/", (req, res) => {
    console.log("Hello world!");
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}.`);
})