const User=require("../model/User");
const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken")
const {registerSchema}=require("./validation/authvalidate")

//register
async function register(req,res){
    try {
         const {error}=registerSchema.validate(req.body);
         if(error)return res.status(400).json({ msg: error.details[0].message })

        const {name,email,password,role}=req.body;

        const user=await User.findOne({email})

        if (user)return res.status(401).json({msg:"User already exist"})

        const hashPassword= await bcrypt.hash(password,10);
        const newUser=await User.create({
            name,
            email,
            password:hashPassword,
            role
        })
        
        res.status(200).json({msg:"User registered sucess"})
          
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
///log in
async function logIn(req,res){
    try {
        const token=jwt.sign({ id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        res.status(200).json({
            msg: "Login Success",
            token,
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
         });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// Get current user
async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

module.exports={register,logIn,getCurrentUser};

