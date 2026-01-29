const Joi = require("joi");
// create maintenance Req
const createmaintenanceeReqSchema=Joi.object({
  deviceId: Joi.string().required(),
  issueDescription: Joi.string().min(10).required() 
})
//assign engineer 
const assignEngineerSchema=Joi.object({
  engineerId:Joi.string().required()
})
//update status by engineer
const updateRequestStatusSchema = Joi.object({
  status: Joi.string().valid("Pending", "Assigned", "In Progress", "Completed").required()
});
module.exports={createmaintenanceeReqSchema,assignEngineerSchema,updateRequestStatusSchema}