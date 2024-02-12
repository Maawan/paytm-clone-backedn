require("dotenv").config();
const connectToDb = require("./config/db")
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const user = require("./routes/user")
const account = require("./routes/account")
const transaction = require("./routes/transaction")
const { health } = require("./controllers/healthCheck")
const app = express();
connectToDb();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(cors());
app.use('/api/v1/user/' , user);
app.use('/api/v1/account/' , account)
app.use('/api/v1/transactions/' , transaction)
app.get('/healthcheck/aws' , health)
module.exports = app;