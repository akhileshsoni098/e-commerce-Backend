
// ============================== User/Admin routes =======================================



const express = require("express")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")


const router = express.Router()

//=========================== user/admin Registration =====================================

router.route("/register").post(registerUser)

//===================== login User/admin =================================================

router.route("/login").post(loginUser)

//====================== Forgot Password ================================

router.route("/password/forgot").post(forgotPassword)

//====================== reset Password ================================

router.route("/password/reset/:token").put(resetPassword)

//===================== logout User/admin =================================================

router.route("/logout").get(logout) 

// ========================== get user Details ====================

router.route("/me").get( isAuthenticatedUser, getUserDetails)

// ======================== update password ===========

router.route("/password/update").put(isAuthenticatedUser, updatePassword)

// ======================== update user Profile  =====================

router.route("/me/update").put(isAuthenticatedUser, updateProfile)

//===================== get all Users ===========================
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"), getAllUser)

// ======= get single User ===========================
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"), getSingleUser)

// ============= user update role (admin) ======================
router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateUserRole)

//============ delete user (admin)

router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteUser)


module.exports = router  