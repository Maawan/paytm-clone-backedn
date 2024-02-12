const express = require("express");
const { signup, signin, profile } = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/User");
const router = express.Router();
router.route('/create-user').post(signup);
router.route('/login').post(signin);
router.route('/profile').get(isLoggedIn , profile);
module.exports = router;