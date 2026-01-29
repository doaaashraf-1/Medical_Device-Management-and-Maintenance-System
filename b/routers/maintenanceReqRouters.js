const express=require("express");
const router=express.Router();
const passport=require("passport");
const authorize=require("../middelware/auth");
const {createMaintenanceReq,assignEngineer,updateRequestStatus,getMaintenanceRequests}=require("../controller/maintenanceReqController")

router.get("/",passport.authenticate("jwt", { session: false }),getMaintenanceRequests);

router.post("/create",passport.authenticate("jwt", { session: false }),
authorize("customer"),createMaintenanceReq);

router.post("/assign/:id",passport.authenticate("jwt", { session: false }),
authorize("admin"),assignEngineer)

router.patch( "/:id/status", passport.authenticate("jwt", { session: false }), 
authorize("engineer"),updateRequestStatus);

module.exports=router;

