const passport=require("passport");
const User = require("../model/User");
const localStrategy=require("passport-local").Strategy;
const {Strategy:JwtStrategy,ExtractJwt}=require("passport-jwt")
const bcrypt=require("bcrypt")
//local
passport.use(
    new localStrategy({usernameField:"email"},async (email,password,done)=> {
       try {
        const user =await User.findOne({email});
        if(!user)return done(null,false,{msg:"User not found"})
        
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch)return done(null,false,{msg:"Wrong password"})

        return done(null,user);  

       } catch (error) {
         return done (error)
        } 
    })
)
//jwt

passport.use(
    new JwtStrategy({jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),secretOrKey:process.env.JWT_SECRET},
    async(payload,done)=>{
        try{
            const user=await User.findById(payload.id)
            if(!user) return done(null,false);
            return done(null,user);
        }catch(error){
            return done(error)
        };
    })
);
module.exports=passport;