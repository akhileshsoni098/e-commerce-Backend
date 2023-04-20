
// ============================== User/Admin routes =======================================



const express = require("express")
const { registerUser, loginUser, logout } = require("../controllers/userController")

const router = express.Router()

//=========================== user/admin Registration =====================================

router.route("/register").post(registerUser)

//===================== login User/admin =================================================

router.route("/login").post(loginUser)

//===================== logout User/admin =================================================

router.route("/logout").get(logout)



module.exports = router 