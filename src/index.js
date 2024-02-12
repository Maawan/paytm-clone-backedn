const app = require("./app");
require("dotenv").config();

app.get("/" , (req , res) => {
    res.send("Server running fine... :)")
})

app.listen(3232 , () => {
    console.log("Server has starteed on 3232");
})