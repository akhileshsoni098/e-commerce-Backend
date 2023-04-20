const ErrorHandler = require("../utils/errorhandler")
const { isValidObjectId } = require("mongoose")
const User = require("../models/userModel")

// Register User 


exports.registerUser = async (req,res,next)=>{
try{

    const {name , email , password} = req.body
    const user = await User.create({
        name,email,password,
       avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl"
        }
    })
const token = user.getJWTToken() 

    res.status(201).send({status:true, token})


}catch(err){
    res.status(500).send({status:false , message:err.message})
}

}


// Log In User


exports.loginUser = async (req,res,next)=>{
    try{

const {email, password} = req.body

 

}catch(err){
    res.status(500).send({status:false , message:err.message})
}


}









