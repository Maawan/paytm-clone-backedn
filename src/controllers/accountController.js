const Wrapper = require("../middlewares/Wrapper");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.getMeTheBalance = Wrapper(async function(req , res , next){
    console.log("Its reaching here");
    const user = await User.findOne({email : req.email});
    return res.status(200).json({
        _id : user._id,
        balance : user.amount
    })
})

exports.allAccountHolders = Wrapper(async function(req , res , next){
    const {filter} = req.query;
    console.log(filter + " ");
    const users = await User.find().select("-amount -role -createdAt -__v");
    console.log(req.user + " o oopp " + req.email);
    const result = users.filter((ele) => {
        
        return ele.email !== req.email && (ele.name.toLowerCase().includes(filter.toLowerCase()) || ele.email.toLowerCase().includes(filter.toLowerCase()) || ele._id == filter )
    })
    res.status(200).json(
        filter === undefined ? users : result
    )
})

exports.findAUser = Wrapper(async function(req , res , next){
    const { id } = req.query;

    try {
        const user = await User.findOne({_id : id}).select("-amount -role -createdAt -__v");
        if(user) {
            return res.status(200).json(user);
        }else{
            return res.status(400).json({
                message : "No user found"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message : "No user found"
        })
    }
})
exports.transfer = Wrapper(async function(req , res , next){
    console.log("Reached here");
    const { to , amount } = req.body;
    let a;
    try {
        a =  parseInt(amount);
    } catch (error) {
        return res.status(403).json({
            message : "Invalid input"
        })
    } 
    if(!to || !amount) {
        return res.status(401).json({
            message : "Invalid request"
        })
    }
    const user1 = await User.findOne({email : req.email});
    const user2 = await User.findOne({_id : to});
    if(user1.amount < amount){
        return res.status(403).json({
            message : "Insufficient Balance"
        })
    }
    if(user1._id == to){
        return res.status(403).json({
            message : "You cannot transfer money to yourself"
        })
    }
    user1.amount -= a;
    user2.amount += a;
    const trans = await Transaction.create({
        from : user1._id,
        to : user2._id,
        amount : parseInt(a),
        createdAt : new Date().getTime()
    })
    await user1.save();
    await user2.save();
    return res.status(200).json({
        message : "Amount Transfered Successfully :)",
        transaction_id : trans._id
    })
    
})