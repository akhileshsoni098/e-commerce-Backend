
const express = require("express")
const errorMiddileware = require("./middleware/error")
const app = express()

app.use(express.json())
//Route imports
const products = require("./routes/productRoute")

app.use("/api/v1",products)

// middleware for errors

app.use(errorMiddileware)


module.exports = app