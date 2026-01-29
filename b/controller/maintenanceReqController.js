const MaintenanceReq=require("../model/maintenanceReq")
const {createmaintenanceeReqSchema,assignEngineerSchema,updateRequestStatusSchema}=require("./validation/maintenanceReqvalidate");
const Device=require("../model/devices")
const DeviceLog=require("../model/devicelog")


//create maintenance Req by customer
async function createMaintenanceReq(req,res){
    try {
        const {error}=createmaintenanceeReqSchema.validate(req.body);
        if(error)return res.status(400).json({msg:error.details[0].message})
        
        const{deviceId,issueDescription}=req.body;
        const device=await Device.findById(deviceId) ;
        if (!device) return res.status(404).json({msg:"device not found"})
        
        const oldStatus = device.status;

        const Request=await MaintenanceReq.create({
            deviceId,
            hospitalId: req.user._id,
            issueDescription
        })

        device.status = "Fault";
        await device.save();

       await DeviceLog.create({
        deviceId: device._id,
        changedby: req.user._id,
        oldStatus,
        newStatus: "Fault",
        notes: "Maintenance request created"
        });
     
      res.status(201).json({
      msg: "Maintenance request created successfully",
      Request
      });
    } catch (error) {
         res.status(500).json({
         msg: error.message
        });
    }
}
//assign engineer
async function assignEngineer(req,res){
 try {
    const {error}=assignEngineerSchema.validate(req.body)
   if(error)return res.status(400).json({msg:error.details[0].message})
        
      const { engineerId } = req.body;

      const request = await MaintenanceReq.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ msg: "Request not found" });
      }
      request.assignedEngineer = engineerId;
      request.status = "Assigned";
      await request.save();

      const device = await Device.findById(request.deviceId);
      const oldStatus = device.status;

      device.status = "Under Maintenance";
      await device.save();

      await DeviceLog.create({
        deviceId: device._id,
        changedby: req.user._id,
        oldStatus,
        newStatus: "Under Maintenance",
        notes: "Engineer assigned"
      });

      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

//get all maintenance requests
async function getMaintenanceRequests(req, res) {
  try {
    let filter = {};
    if (req.user.role === "customer") {
      filter.hospitalId = req.user._id;
    }
    else if (req.user.role === "engineer") {
      filter.assignedEngineer = req.user._id;
    }
    
    const requests = await MaintenanceReq.find(filter)
      .populate('deviceId')
      .populate('hospitalId', 'name')
      .populate('assignedEngineer', 'name');
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

}
//update status
async function updateRequestStatus(req, res) {
  try {
    const { error } = updateRequestStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const { status } = req.body;
    const { id } = req.params;

    const request = await MaintenanceReq.findById(id);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // Authorization
    if (request.assignedEngineer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    request.status = status;
    await request.save();

    const device = await Device.findById(request.deviceId);
    const oldStatus = device.status;

    // Device status mapping
    if (status === "In Progress") {
      device.status = "Under Maintenance";
    }

    if (status === "Completed") {
      device.status = "Working";
    }

    if (oldStatus !== device.status) {
      await DeviceLog.create({
        deviceId: device._id,
        changedby: req.user._id,
        oldStatus,
        newStatus: device.status,
        notes: `Maintenance request ${status}`
      });
    }
    await device.save();

    res.status(200).json({
      msg: "Maintenance status updated",
      request,
      deviceStatus: device.status
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}
module.exports={createMaintenanceReq,assignEngineer,updateRequestStatus,getMaintenanceRequests};