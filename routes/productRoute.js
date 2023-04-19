const express = require("express")
const { getAllProducts, createProduct, updateProduct,deleteProduct, getProductDetails } = require("../controllers/productController")

const router = express.Router()



//===== create product =======
router.route("/product/new").post(createProduct)
//====== get product =======
router.route("/product").get(getAllProducts)
//======== update product ...======
router.route("/product/:id").put(updateProduct)
// ======= delete product ====
router.route("/product/:id").delete(deleteProduct)
// get particular 
router.route("/product/:id").get(getProductDetails)



module.exports = router