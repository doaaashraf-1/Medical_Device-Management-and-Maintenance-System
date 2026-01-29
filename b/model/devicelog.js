const mongoose=require("mongoose");
const deviceLogSchema =new mongoose.Schema({
   deviceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Device",
    required:true,
   },
   changedby:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   oldStatus:{
    type: String,
    enum: ["Working", "Fault", "Under Maintenance"],
    required: true
   },
   newStatus:{
    type: String,
    enum: ["Working", "Fault", "Under Maintenance"],
    required: true
   },
   notes: {
    type: String,
  }
},{timestamps:true})
  
const DeviceLog=mongoose.model("DeviceLog",deviceLogSchema)
module.exports=DeviceLog;