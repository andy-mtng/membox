const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }, 
    token_type: {
        type: String,
        enum: ["password", "signup"],
        required: true
    },
    expires: {
        type: Date,
        expires: 60 * 24 * 24
    }
});

tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);