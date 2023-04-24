const express = require("express")

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder} = require("../controllers/orderController")

const router = express.Router()

// ============ create new order ==========================
router.route("/order/new").post(isAuthenticatedUser,newOrder)


//========================== get single order ==============

router.route("/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder)

//====================== get my order / login user order =======
router.route("/orders/me").get(isAuthenticatedUser, myOrders)
//=====================get all order by admin===============
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"), getAllOrders)
//================ update order by admin ============================
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateOrder)
//=============  delete order by admin ==================
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteOrder)



module.exports = router  