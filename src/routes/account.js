const express = require("express");
const { getMeTheBalance, allAccountHolders, transfer, findAUser } = require("../controllers/accountController");
const { isLoggedIn } = require("../middlewares/User");
const router = express.Router();
router.route('/balance').get(isLoggedIn , getMeTheBalance);
router.route('/allAccounts').get(isLoggedIn , allAccountHolders);
router.route('/getaccount').get(isLoggedIn , findAUser);
router.route('/transfer').post(isLoggedIn , transfer);
module.exports = router;