// Imports
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const memoriesRouter = require("./routes/memoriesRoutes");

// Constants
const port = 5000;

const app = express();

// Middleware
app.use("/memories", memoriesRouter);

app.get("*", (req, res) => {
    res.status(404).json({ message: "Route not found." });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB.");
    })
    .catch((error) => {
        console.log("Failed to connect to MongoDB: ", error);
    });

app.listen(port, () => {
    console.log(`App is listening on port ${port}.`);
});