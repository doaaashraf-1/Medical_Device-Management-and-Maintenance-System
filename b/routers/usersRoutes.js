const express=require("express");
const router=express.Router();
const passport=require("passport");
const authorize=require("../middelware/auth");
const {getAllusers,getCustomers,getEngineers,deleteUser}=require("../controller/usersController")

router.get("/",passport.authenticate("jwt", { session: false }),
authorize("admin"),getAllusers)

router.get("/engineer",passport.authenticate("jwt", { session: false }),
authorize("admin"),getEngineers)

router.get("/customer",passport.authenticate("jwt", { session: false }),
authorize("admin"),getCustomers)

router.delete("/delete/:id",passport.authenticate("jwt", { session: false }),
authorize("admin"),deleteUser)

module.exports=router;