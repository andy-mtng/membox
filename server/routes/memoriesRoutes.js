const express = require("express");
const router = express.Router();
const memoryModel = require("../models/memoryModel");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/", (req, res) => {
    res.json({ message: "Memories get." });
});

router.post("/", (req, res) => {
    const user = req.user;
    const newMemory = req.body;
    newMemory.user_id = user._id;
    console.log("New created memory:", newMemory);

    const newMemoryforDB = new memoryModel(newMemory);
    
    newMemoryforDB.save()
        .then((savedMemory) => {
            console.log("Memory saved to the DB.");
            res.status(200).json({
                message: "New memory created!",
                error: "",
                validationErrors: "",
                type: "success"
            });
        })
        .catch((error) => {
            console.log("Error saving memory to the DB " + error);
            res.status(500).json({
                message: "",
                error: "An error occured saving the memory.",
                validationErrors: "",
                type: "error"
            });
        });
});

module.exports = router;