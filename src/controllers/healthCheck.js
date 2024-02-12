const Wrapper = require("../middlewares/Wrapper");

exports.health = Wrapper(async function(req , res , next){
    res.status(200).json({
        message : "Yup, Server is running fine"
    })
})