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
    expiresAt: {
        type: Date, 
        default: Date.now,
        required: true    
    }
}, {timestamps: true});

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

module.exports = mongoose.model("Token", tokenSchema);