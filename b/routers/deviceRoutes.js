const express=require("express");
const router=express.Router();
const passport=require("passport")
const{creatDevice,updateDevice,getDevices,getDeviceById,deleteDeviceById}=require("../controller/deviceController")
const authorize=require("../middelware/auth")

router.post("/create",passport.authenticate("jwt", { session: false }),
authorize("admin"),creatDevice);

router.put("/update/:id",passport.authenticate("jwt", { session: false }),
authorize("admin"),updateDevice);

router.get("/",passport.authenticate("jwt", { session: false }),getDevices);

router.get("/:id",passport.authenticate("jwt", { session: false }),getDeviceById);

router.delete("/:id",passport.authenticate("jwt", { session: false }),
authorize("admin"),deleteDeviceById);

module.exports=router;