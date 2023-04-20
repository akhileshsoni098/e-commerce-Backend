
const express = require("express")
const cookieParser = require("cookie-parser")
const errorMiddileware = require("./middleware/error")
const app = express()

app.use(express.json())
app.use(cookieParser())

//Route imports
const products = require("./routes/productRoute")
const user = require("./routes/userRoute")

app.use("/api/v1",products)
app.use("/api/v1",user)
// middleware for errors

app.use(errorMiddileware)


module.exports = app