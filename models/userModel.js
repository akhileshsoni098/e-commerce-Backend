const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:[true, "please Entter Your Name"],
    maxLength:[30, "Name cannot exceed 30 characters"],
    minLength:[4, "Name should have more than 4 characters"]
},
email:{
    type:String,
    required:[true, "please Entter Your Email"],
    unique:true,
    validate:[validator.isEmail, "Please Entter a valid Email"]
},
password:{
    type:String,
    required:[true, "please Entter Your Password"],
    minLength:[8, "password should have more than 8 characters"],
    select:false
},
avatar:{
        public_id:{
    type:String,
    required:true
        },
        url:{
            type:String,
            required:true
                }
    },

    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

})

// ============================= hashing password =============================
userSchema.pre("save", async function(next){

if(!this.isModified("password")){
    next()
}

    this.password = await bcrypt.hash(this.password,10)
})

//=========================== jwt token ================================================

userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{

    expiresIn:process.env.JWT_EXPIRE
    })

}

//================================ compare password or dcrypting password  ========================

userSchema.methods.comparePassword = async function (enteredPassword){
    console.log(enteredPassword, +  "||" + this.password)
    return (await bcrypt.compare(enteredPassword, this.password))
  
}

//========================== Generating Password Reset Token ======================





module.exports = mongoose.model("User", userSchema)



