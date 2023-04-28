
const express = require("express")
const cookieParser = require("cookie-parser")
const errorMiddileware = require("./middleware/error")
const app = express()

app.use(express.json())
app.use(cookieParser())

//Route imports
const products = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")
app.use("/api/v1",order)
app.use("/api/v1",products)
app.use("/api/v1",user)
app.use("/api/v1", payment);





// middleware for errors

app.use(errorMiddileware)


module.exports = app