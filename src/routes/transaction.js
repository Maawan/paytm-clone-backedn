const express = require("express");
const { isLoggedIn } = require("../middlewares/User");
const { getTransactions, getAllTransactions } = require("../controllers/transactionController");
const router = express.Router();


router.route('/get').get(isLoggedIn , getTransactions)
router.route('/getAll').get(isLoggedIn , getAllTransactions)
module.exports = router;