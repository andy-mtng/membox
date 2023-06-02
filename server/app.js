// Imports
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const memoriesRouter = require("./routes/memoriesRoutes");
const userRouter = require("./routes/userRoutes");

// Constants
const port = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/memories", memoriesRouter);
app.use("/user", userRouter);
app.get("*", (req, res) => {
    res.status(404).json({ message: "Route not found." });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "membox-db"})
    .then(() => {
        console.log("Connected to MongoDB.");
    })
    .catch((error) => {
        console.log("Failed to connect to MongoDB: ", error);
    });

app.listen(port, () => {
    console.log(`App is listening on port ${port}.`);
});