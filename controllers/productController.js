 
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






