const memoryModel = require("../models/memoryModel");
const fs = require('fs');
const memorySchema = require("../schemaValidation/memorySchema");

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

    const validationResult = memorySchema.validate(newMemory);
    console.log("Server-side validation result", validationResult);

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

const editMemory = (req, res) => {
    const editId = req.query.editId;
    const editedMemory = req.body;
    console.log("editID", editId);
    console.log("editedMemory", editedMemory);
    console.log("req.file", req.file);

    if (req.file) {
        const imageBuffer = fs.readFileSync(req.file.path);
        editedMemory.memoryImage = {
            data: imageBuffer.toString("base64"),
            contentType: req.file.mimetype
        }

        fs.unlink(req.file.path, (error) => {
            if (error) {
                console.log("Error deleting temporary image while editing memory.");
            }
        });
    }

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