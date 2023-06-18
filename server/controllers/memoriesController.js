const memoryModel = require("../models/memoryModel");
const fs = require('fs');

const getMemories = (req, res) => {
    const user = req.user;
    memoryModel.find({ user_id: user._id })
        .then((memoryDocuments) => {
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
    const imageBuffer = fs.readFileSync(req.file.path);
    newMemory.memoryImage = {
        data: imageBuffer.toString("base64"),
        contentType: req.file.mimetype
    }

    const newMemoryforDB = new memoryModel(newMemory);
    
    fs.unlink(req.file.path, (error) => {
        if (error) {
            console.log("Error deleting memory image.");
        } else {
            newMemoryforDB.save()
                .then(() => {
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
    })
}

// Delete a memory
const deleteMemory = (req, res) => {
    const delId = req.query.delId;
    memoryModel.deleteOne({ _id: delId })
        .then(() => {
            console.log("Memory deleted from the DB.");
            res.status(200).json({
                message: "Memory successfully deleted.",
                error: "",
                validationErrors: "",
                type: "success"
            })
        })
        .catch(() => {
            console.log("Error deleting memory from the DB");
            res.status(500).json({
                message: "",
                error: "An error occured deleting the memory.",
                validationErrors: "",
                type: "error"
            });
        });
} 

// Edit a memory
const editMemory = (req, res) => {
    const editId = req.query.editId;
    const editedMemory = req.body;
    memoryModel.updateOne({ _id: editId }, editedMemory)
        .then(() => {
            console.log("Memory edited in the DB.");
            res.status(200).json({
                message: "Memory successfully edited.",
                error: "",
                validationErrors: "",
                type: "success"
            })
        })
        .catch(() => {
            console.log("Error editing memory from the DB");
            res.status(500).json({
                message: "",
                error: "An error occured editing the memory.",
                validationErrors: "",
                type: "error"
            });
        });
}

module.exports = {
    getMemories: getMemories,
    createMemory: createMemory,
    deleteMemory: deleteMemory,
    editMemory: editMemory
}