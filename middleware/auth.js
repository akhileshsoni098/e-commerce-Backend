
//......................... Authentication ........................

const ErrorHandler = require("../utils/errorhandler")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

 exports.isAuthenticatedUser = async (req,res,next)=>{
    try{

        const { token } = req.cookies

if(!token){
    return next(new ErrorHandler("Please login to access this resource", 401))
}

const decoded = jwt.verify(token, process.env.JWT_SECRET)

  req.user =  await User.findById(decoded.id)

  next()

    }catch(err){
        res.status(500).send({status:false, message:err.message})
    }

}


//===================================== authorizattion =====================================


exports.authorizeRoles = (...roles)=>{
    return (req, res , next)=>{

        if(!roles.includes(req.user.role)){

 return next(new ErrorHandler (`Role: ${req.user.role} is not allowed to access this resource`,403))
 
        }
        next() 
    }
}




