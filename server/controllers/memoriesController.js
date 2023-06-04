const memoryModel = require("../models/memoryModel");

const getMemories = (req, res) => {
    const user = req.user;
    memoryModel.find({ user_id: user._id })
        .then((memoryDocuments) => {
            console.log("Memories successfully fetched from the DB.");
            res.status(200).json({
                memories: memoryDocuments,
                message: "",
                error: "",
                validationErrors: "",
                type: "success"
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                memories: [],
                message: "",
                error: "Failed to fetch memories.",
                validationErrors: "",
                type: "error"
            });
        })
}

const createMemory = (req, res) => {
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
            // if (error instanceof mongoose.Error.validationErrors) {
            //     res.status(500).json({
            //         message: "",
            //         error: "",
            //         validationErrors: error.errors,
            //         type: ""
            //     });
            // }

            res.status(500).json({
                message: "",
                error: "An error occured saving the memory.",
                validationErrors: "",
                type: "error"
            });
        });
}

// Delete a memory

// Edit a memory

module.exports = {
    getMemories: getMemories,
    createMemory: createMemory
}