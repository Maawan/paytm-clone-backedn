const jwt = require("jsonwebtoken");
const Wrapper = require("./Wrapper");
const User = require("../models/User")
exports.isLoggedIn = Wrapper(async function(req , res , next){
    let token = "";
    if(req.cookies.token){
        token = req.cookies.token;
    }
    if(req.header("Authorization") && req.header("Authorization").startsWith("Bearer ")){
        token = req.header("Authorization").replace("Bearer " , "");
    }
    if(!token){
        return res.status(401).json({
            message : "You are not logged in",
            errorCode : 121
        })
    }
    try {
        
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        // console.log(decoded.email + " weoifn");
        // console.log("Ok...");
        console.log("email found to be " + decoded.email)
        const user = await User.findOne({email : decoded.email})
        console.log("User found " , user);
        if(!user){
            return res.status(401).json({
                message : "Invalid token"
            })
        } 
        req.email = decoded.email;
        req.user = user._id;
        next();
    } catch (error) {
        return res.status(401).json({
            message : "Invalid token"
        })
    }

})