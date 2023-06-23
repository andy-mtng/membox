const Joi = require("joi");

const memorySchema = Joi.object({
    title: Joi.string()
        .max(20)
        .required(),

    description: Joi.string()
        .max(80),

    date: Joi.date()
        .required(),

    isCoreMemory: Joi.boolean(),

    user_id: Joi.object(),

    memoryImage: Joi.object({
        data: Joi.string().required(),
        contentType: Joi.string().valid("image/jpeg", "image/png").required()
    })

})

module.exports = memorySchema;