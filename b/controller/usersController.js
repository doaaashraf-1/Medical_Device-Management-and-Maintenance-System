const User=require("../model/User");
//get all users
async function getAllusers(req,res){
    try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}
//get all engineers
async function getEngineers(req,res){
    try {
    const engineers = await User.find({ role: 'engineer' }).select('-password');
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}
//get all customers
async function getCustomers(req,res){
    try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}
//delete user
async function deleteUser(req,res){
    try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    
    res.json({ msg: 'user deleted' });
  } catch (error) {
    res.status(500).json({  msg: error.message });
  }
}
module.exports={getAllusers,getEngineers,getCustomers,deleteUser}