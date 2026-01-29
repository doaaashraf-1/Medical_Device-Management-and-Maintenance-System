const mongoose=require("mongoose");
const maintenanceReqSchema=new mongoose.Schema({
    deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedEngineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "In Progress", "Completed"],
    default: "Pending"
  }
}, { timestamps: true });

const MaintenanceReq=mongoose.model("MaintenanceReq",maintenanceReqSchema)

module.exports=MaintenanceReq;