const zod = require("zod");
const Wrapper = require("../middlewares/Wrapper");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { default: mongoose } = require("mongoose");

exports.signup = Wrapper(async function(req , res , next){
    console.log(req.body);
    const {name , email , password} = req.body;
    const schema = zod.object({
        email : zod.string().email(),
        password : zod.string().min(6),
        name : zod.string().min(1)
    })
    const response = schema.safeParse(req.body);
    if(!response.success){
        return res.status(411).json({
            message : "Invalid Input"
        })
    }
    if(!name || !email || !password){
        return res.status(400).json({
            message : "Name,email and Password are required"
        })
    }
    const checkMail = await User.findOne({email});
    if(checkMail){
        return res.status(409).json({
            message : "Account with this email already exists"
        })
    }
    const user = await User.create({
        name,
        email,
        password
    })
    const token = user.getJwtToken();
    const options = {
        expires : new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
        httpOnly : true
    }
    await user.save();
    await Transaction.create({
        to : user._id,
        amount : 500,
        from : user._id,
        createdAt : new Date().getTime()
    })
    res.status(200).cookie('token',token,options).json({
        message : "Your account has been successfully created",
        token,
        user
    })
})

exports.signin = Wrapper(async function(req , res , next){
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(401).json({
            message : "Email and password is required for login"
        })
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({
            message : "Invalid credentials"
        })
    }
    
    const isValidated = await user.validatePassword(password);
    const options = {
        expires : new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
        httpOnly : true
    }
    if(isValidated){
        const token = user.getJwtToken();
        return res.status(200).cookie('token',token,options).json({
            message : "You are successfully logged in",
            token,
            user
        })
    }
    return res.status(401).json({
        message : "Invalid credentials"
    })
})

exports.profile = Wrapper(async function(req , res , next){
    if(!req.email){
        return res.status(401).json({
            message : "Oops ! You are not logged in"
        })
    }
    const user = await User.findOne({email : req.email});
    const token = await user.getJwtToken();
    if(user){
        return res.status(200).json({
            user,
            token
        })
    }
})