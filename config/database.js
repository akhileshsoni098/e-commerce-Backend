const mongoose = require("mongoose")
// mongodb+srv://SagarMaan:yHJBlRWQ0FdJmdj6@chaudhary-shaab-db.cueddss.mongodb.net/MovieApp?retryWrites=true&w=majority"


const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true, useUnifiedTopology:true})

.then(()=>{console.log("mongoDb is connected....")})

} 


module.exports = connectDatabase ;