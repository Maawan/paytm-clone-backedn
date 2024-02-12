const mongoose = require("mongoose");
const { number } = require("zod");

const User = require("../models/User")
const transactionSchema = mongoose.Schema({
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        required : true
    },
    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date,
        default : new Date().getTime()
    }
})
module.exports = mongoose.model("Transaction" , transactionSchema);