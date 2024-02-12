const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {v4} = require("uuid");
const jwt = require("jsonwebtoken")
const { number } = require("zod");
const { JWT_SECRET, JWT_EXPIRY } = require("../sampleEnv");
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role : {
        type : String,
        default : "non-premium user"
    },
    amount : {
        type : Number,
        default : 500
    },
    photo_id : String,
    forgorPasswordToken : String,
    forgotPasswordExpiry : Date,
    createdAt : {
        type : Date,
        default : Date.now()
    }
    
})

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password , 10);
})

userSchema.methods.validatePassword = async function(userSendPassword){
    return await bcrypt.compare(userSendPassword , this.password);
}

userSchema.methods.getJwtToken = function () {
    return jwt.sign(
      {
        email: this.email,
      },
      "helloWorldThisisMohdMawanAhmad",
      {
        expiresIn: "3d",
      }
    );
  };

userSchema.methods.getForgotPasswordToken = function(){
    this.forgorPasswordToken = v4();
    this.forgotPasswordExpiry = Date.now() + (20 * 60 * 1000);
    return this.forgorPasswordToken;
}  

module.exports = mongoose.model("User" , userSchema);