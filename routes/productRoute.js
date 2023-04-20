
//========================= Routes for Products ====================================================

const express = require("express")

const { getAllProducts, createProduct, updateProduct,deleteProduct, getProductDetails } = require("../controllers/productController")

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

const router = express.Router()



//======================================= create product (Admin) =======================================================

router.route("/product/new").post( isAuthenticatedUser, authorizeRoles("admin") , createProduct)

//====================================== get product ============================================================

router.route("/product").get( getAllProducts)

//======================================== update product (admin) =======================================================

router.route("/product/:id").put( isAuthenticatedUser, authorizeRoles("admin") ,updateProduct)

// ====================================== delete product (admin) ========================================================

router.route("/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin") ,deleteProduct)

// =======================  get particular ======================================================================

router.route("/product/:id").get(getProductDetails)



module.exports = router