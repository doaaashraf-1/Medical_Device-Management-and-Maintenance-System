const Device=require("../model/devices");
const {creatdeviceSchema,updatedeviceschema}=require("./validation/devicevalidate")
const DeviceLog=require("../model/devicelog")

//creat device 
async function creatDevice(req,res) {
    try{
        //validate
        const { error } = creatdeviceSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

        const {name,serialId,hospitalId,status,location}=req.body;
        const device =await Device.create({
            name,
            serialId,
            hospitalId,
            status: status || 'Working',
            location
        });
        res.status(201).json({
           msg: 'Device created successfully',
           device: device
        })
    }catch(error){
        res.status(500).json({
            msg: error.message
          });
    }
}
// update device and log status changes
async function updateDevice(req,res){
   try {
     ///validate
     const {error}=updatedeviceschema.validate(req.body);
     if(error)return res.status(400).json({msg:error.details[0].message})
     //data
    const {name, serialId, hospitalId,status,location,notes}=req.body;
    const {id}=req.params;
    const device=await Device.findById(id)
    if(!device)return res.status(404).json({msg:"Device not found"})
     
    const oldStatus = device.status;

    const newupdate=await Device.findByIdAndUpdate(id,{
        name:name,
        serialId:serialId,
        hospitalId:hospitalId,
        status:status,
        location
    },{new:true})
    
    let deviceLog = null;

    if( req.body.status && req.body.status!== oldStatus ){
       
        deviceLog =await DeviceLog.create({
               deviceId:newupdate._id,
               changedby:req.user._id,
               oldStatus:oldStatus,
               newStatus:newupdate.status,
               notes:notes||" "
        })
    }

    res.status(200).json({
        msg:"Device updated successfully",
        newupdate,
        deviceLog:deviceLog
        
    })
   } catch (error) {
    res.status(500).json({
        msg: error.message
      });
   }  
};

//get devices(admin&customer)
async function getDevices(req, res) {
  try {
    let filter = {};

    if (req.user.role === "customer") {
      filter.hospitalId = req.user._id;
    }
    const devices = await Device.find(filter)
      .populate("hospitalId", "name email");

    res.status(200).json({
      devices
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
}
// get device by id
async function getDeviceById(req,res){
    try {
        const {id} =req.params;

        const device =await Device.findById(id).populate('hospitalId', 'name hospitalName');

        if (!device)return res.status(404).json({msg:"device not found"})
        
        res.status(200).json({
                device
        })
    } catch (error) {
        res.status(500).json({
      msg: error.message
    });
    }
}


//delete device by id
async function deleteDeviceById(req,res){
    try {
        const {id} =req.params;

        const device =await Device.findByIdAndDelete(id);

        if (!device)return res.status(404).json({msg:"device not found"})
        

        res.status(200).json({
            msg:"Device deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
      msg: error.message
    });
    }
}

module.exports={creatDevice,updateDevice,getDevices,getDeviceById,deleteDeviceById};