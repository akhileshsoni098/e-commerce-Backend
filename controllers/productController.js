 
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorhandler")
// const {mongodbObjId} = require("../middleware/error")
const { isValidObjectId } = require("mongoose")
const ApiFeatures = require("../utils/apiFeatures")

//============================== create Product Admin ========================

exports.createProduct = async (req, res, next)=>{
try{

    //========== userId  decoded token ================

    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).send({status:true , product})

}catch(err){

    res.status(500).send({status:false , message:err.message})

}
  
}




//===================== get all products ============================

exports.getAllProducts = async (req,res)=>{ 
    try{

        const resultPerPage = 5

const productCount = await Product.countDocuments()

     const apiFeatures = new ApiFeatures(Product.find(), req.query)
     .search().filter().pagination(resultPerPage)
    

    const products = await apiFeatures.query

    res.status(200).send({status:true , products , productCount})
    
    }catch(err){
        res.status(500).send({status:false , message:err.message})
    }

}

//================ get product data ===================================

exports.getProductDetails = async (req,res, next)=>{
    try{

        if(!isValidObjectId(req.params.id)){
          return  res.status(400).send({status:false , message:"Not valid Object Id"})
        }

        let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("product not found" , 404))
    }

res.status(200).send({status:true, product})

}catch(err){
        res.status(500).send({status:false , message:err.message})
    }
}


//======================== update product admin ==============================


exports.updateProduct = async(req,res,next)=>{
    try{
        if(!isValidObjectId(req.params.id)){
            return  res.status(400).send({status:false , message:"Not valid Object Id"})
          }

        let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("product not found", 404))
    }
    // console.log("1",product)
 product = await Product.findByIdAndUpdate(req.params.id, req.body , {new:true , runValidators:true, useFindAndModify:false})
// console.log("2",product)
res.status(200).send({status:true , product})

    }catch(err){
        res.status(500).send({status:false , message:err.message})
    }
   
}

// ======================== delete admin ========================================


exports.deleteProduct = async(req, res , next)=>{
try{  
    if(!isValidObjectId(req.params.id)){
        return  res.status(400).send({status:false , message:"Not valid Object Id"})
      }

    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("product not found", 404))
    }
 await Product.findByIdAndDelete(req.params.id)

res.status(200).send({status:false , message:"product deleted successfully"})


 }catch(err){
        res.status(500).send({status:false , message:err.message})
    }
}


//=================== create new review and Update Review ===============


exports.createProductReview = async (req,res,next)=>{
    try{


        const {rating , comment , productId} = req.body
const review = {
    user:req.user.id,
    name:req.user.name,
rating: Number(rating),
comment,
}

const product = await Product.findById(productId)

const isReviewed = product.reviews.find((rev) =>rev.user.toString() === req.user._id.toString())

if(isReviewed){
 product.reviews.forEach((rev) => {
    if(rev.user.toString() === req.user._id.toString()){
        (rev.rating = rating), (rev.comment = comment)
    }
 })

}
else{
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
}


// =======================  avarge rating =========================
let avg = 0
product.ratings = product.reviews.forEach((rev) =>{
    avg += rev.rating
})

product.ratings = avg/product.reviews.length

await product.save({validateBeforeSave: false})

res.status(200).send({status:true ,})



}catch(err){
        res.status(500).send({status:false , message:err.message})
    }
}


// ==================== get all reviews of a product  =============




exports.getProductReviews = async (req,res,next) => {
try{
    const product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).send({
        status:true,
        reviews:product.reviews
    })

}catch(err){
    res.status(500).send({status:false , message:err.message})
}
}






// =========== Delete Reviews ====================

exports.deleteReview = async (req,res,next) => {
    try{
        const product = await Product.findById(req.query.productId)
    
        if(!product){
            return next(new ErrorHandler("Product not found", 404))
        }
    
const reviews = product.reviews.filter( rev => rev._id.toString() !== req.query.id.toString() )


// === avg rating get effected when rating deleted ...
let avg = 0

reviews.forEach((rev) =>{
    avg += rev.rating
})

 const  ratings = avg/ reviews.length

const numOfReviews = reviews.length

await Product.findByIdAndUpdate(req.query.productId,{ reviews, ratings, numOfReviews},{new:true, runValidators:true, useFindAndModify:false })

        res.status(200).send({
            status:true
        })
    
    }catch(err){
        res.status(500).send({status:false , message:err.message})
    }
    }







