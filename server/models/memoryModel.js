const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Memory", memorySchema);