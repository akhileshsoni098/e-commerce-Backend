
const app = require("./app")

const dotenv = require("dotenv")

const connectDatabase = require("./config/database")
// Handling Uncaught Exception ==> clg(youtube) and you tube is not defined for that i use this

process.on("uncaughtException", (err)=>{
  console.log(`Error: ${err.message}`)  
  console.log( `Shuttting down the server due to Uncaught Exception` );
  process.exit(1)
})



//config

dotenv.config({path: "./config/config.env"})
 
  // connecting to database

  connectDatabase()


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