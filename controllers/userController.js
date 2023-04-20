const ErrorHandler = require("../utils/errorhandler")
const { isValidObjectId } = require("mongoose")
const User = require("../models/userModel")
const sendToken = require("../utils/jwtToken")



//========================== Register User ========================

exports.registerUser = async (req,res,next)=>{

try{

    const {name, email, password} = req.body

    const user = await User.create({

        name,email,password,

       avatar:{   
            public_id:"this is a sample id",
            url:"profilepicUrl"
        }

    })
    
    sendToken(user,201,res)

}catch(err){

    res.status(500).send({status:false , message:err.message})

}

}


// ========================== Log In User ==========================


exports.loginUser = async (req,res,next)=>{

    try{

const {email, password} = req.body

 // checking if user has given password and email both

 if(!email || !password){

    return next(new ErrorHandler("Please Enter Email & Password", 400))
 }

 const user = await User.findOne({email}).select("+password")  // in model select is false so that...

if(!user){

    return next(new ErrorHandler("Invalid email or password", 401))

}

const isPasswordMatched = await user.comparePassword(password)

if(!isPasswordMatched){

    return next(new ErrorHandler("Invalid email or password", 401))

}

sendToken(user,200,res)

}catch(err){

    res.status(500).send({status:false , message:err.message})

}
}

//=================================== LogOut User ================================================

exports.logout = async (req, res, next)=>{

try{

    res.cookie("token" , null, {

        expires: new Date(Date.now()),

        httpOnly:true

    })

    res.status(200).send({status:true , message:"Logged Out"})

}catch(err){

    res.status(500).send({status:false , message:err.message})

}

}








