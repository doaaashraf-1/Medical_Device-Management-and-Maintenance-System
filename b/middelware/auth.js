const authorize=(...roles)=>
(req,res,next)=>{
    if(!roles.includes(req.user.role))
        return res.json({ msg: "Access Denied" });
    next();
};
module.exports=authorize;