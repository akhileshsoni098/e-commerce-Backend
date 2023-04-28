
const app = require("./app")
const cloudinary = require("cloudinary");


const connectDatabase = require("./config/database")


// Handling Uncaught Exception ==> clg(youtube) and you tube is not defined for that i use this
process.on("uncaughtException", (err)=>{
  console.log(`Error: ${err.message}`)  
  console.log( `Shuttting down the server due to Uncaught Exception` );
  process.exit(1)
})



//config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/config.env" });
}
 
  // connecting to database

  connectDatabase()


  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


const server =   app.listen(process.env.PORT,()=>{
 
    console.log(`Server is runnning on http://localhost: ${process.env.PORT}`)
}) 



// unhandled promise rejection 
process.on("unhandledRejection", err =>{
  console.log(`Error: ${err.message}`)
  console.log(`Shuttting down the server due to unhandled Promise Rejection`);
server.close(()=>{
  process.exit(1)
})
})