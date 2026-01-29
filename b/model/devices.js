const mongoose=require("mongoose");
const deviceSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    serialId:{
        type:String,
        required:true,
        unique:true
    },
    hospitalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:['Working', 'Fault', 'Under Maintenance'],
        default:"Working"
    },
    location:{
        type:String
    }
},{timestamps:true})
  
const Device=mongoose.model("Device",deviceSchema)
module.exports=Device;