const Joi = require("joi");
const User = require("../models/userModel");

// const handleSchema = Joi.string().min(5).max(30).required();

const checkExistingHandle = async (newHandle, helpers) => {
    console.log('Custom validation rule executed');
    console.log('newHandle:', newHandle);
    try {
        const exists = await User.findOne({ handle: newHandle });

        if (exists) {
            console.log("Handle already exists");
            return helpers.message("Handle must be unique");
        }
        return newHandle;
    } catch (error) {
        console.log("INSIDE HANDLESCHEMA", error);
        throw new Error("Database error.");
    }
}

const handleSchema = Joi.object({
    handle: Joi.string()
        .min(5)
        .max(30)
        .required()
        // .external(checkExistingHandle)
})

module.exports = handleSchema;