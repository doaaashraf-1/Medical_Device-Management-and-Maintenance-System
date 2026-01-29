require("dotenv").config();
const mongoose=require("mongoose");
const cors = require("cors");
const passport = require("./config/passport");
const express=require("express");
const app=express();
const port=process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(passport.initialize());


async function dbconnect() {
    try {
        await mongoose.connect(process.env.db_url);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}
dbconnect();

const authRouter=require("./routers/authRoutes")
const usersRoutes=require("./routers/usersRoutes")
const deviceRouter=require("./routers/deviceRoutes")
const maintenanceReqRouter=require("./routers/maintenanceReqRouters")

app.use("/auth",authRouter)
app.use("/users",usersRoutes)
app.use("/device",deviceRouter)
app.use("/maintenance",maintenanceReqRouter)

app.listen(port,()=>{
    console.log(`server is running ${port}`);
});