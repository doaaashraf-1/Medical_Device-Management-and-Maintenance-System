const Joi = require("joi")
//creat device
const creatdeviceSchema=Joi.object({
    name:Joi.string().min(3).required(),
    serialId:Joi.string().min(7).required(),
    hospitalId:Joi.string().required(),
    status:Joi.string().required(),
    location:Joi.string().required()
})
//update device
const updatedeviceschema=Joi.object({
    name:Joi.string().min(3).required(),
    serialId:Joi.string().min(7).required(),
    hospitalId:Joi.string().required(),
    status:Joi.string().required(),
    location:Joi.string().required()
})
module.exports={creatdeviceSchema,updatedeviceschema};