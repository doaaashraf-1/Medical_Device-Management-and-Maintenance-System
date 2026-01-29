const joi=require("joi");

const registerSchema=joi.object({
    name:joi.string().min(3).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required(),
    role:joi.string().valid("admin", "customer","engineer").required()
})
module.exports={registerSchema};