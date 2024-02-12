const mongoose = require("mongoose");
const { db_url } = require("../sampleEnv");
module.exports = function(){
    console.log("ok --- " + db_url);
    mongoose.connect("mongodb+srv://Maawan:maawanisin11@cluster0.h0bx124.mongodb.net/").then(console.log("DB Connected ")).catch((err)=>{
        console.log("Error in connecting to db");
    })
}