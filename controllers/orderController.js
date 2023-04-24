const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const { isValidObjectId } = require("mongoose");

//========================== create new Order =====================

exports.newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
  
    res.status(201).json({
      success: true,
      order,
    });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ================================ get single order(admin) ==========

exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400))
    }

    res.status(200).send({
      status: true,
      order,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//================== get my orders/ loggedIn user order =================================

exports.myOrders = async (req, res, next) => {
    try {

      const orders = await Order.find({user:req.user.id})
  // if(orders.length==0) {
  //   return   next(new ErrorHandler("Order not found with this id", 400))
  // }
      res.status(200).send({ 
        status: true,
        orders,
      });
    } catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };
  

  // ===================== get all orders (admin)==========


  exports.getAllOrders = async (req, res, next) => {
    try {

      const orders = await Order.find()

  // if(orders.length==0){
  //   return   next(new ErrorHandler("Order not found with this id", 400))
  // }

let totalAmount = 0
orders.forEach((order)=>{
  totalAmount += order.totalPrice
})
      res.status(200).send({ 
        status: true,
        totalAmount,
        orders,
      });
    } catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };

// ======================= update order status -- Admin ==============


exports.updateOrder = async (req, res, next) => {
  try {

    const order = await Order.findById(req.params.id)

// if(order.length==0) {
//   return   next(new ErrorHandler("Order not found with this id", 400))
// }

if(order.orderStatus==="Delivered"){
  return next(new ErrorHandler("you have already delivered this order", 400))
}

order.orderItems.forEach(async (order) =>{
 await  updateStock(order.product, order.quantity);
})

order.orderStatus = req.body.status


if(req.body.status == "Delivered"){
  order.deliveredAt = Date.now()
}


await order.save({validateBeforeSave:false})

    res.status(200).send({ 
      status: true,
      
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ===== update stock function for above api ====
async function updateStock(id,quantity){

  const product = await Product.findById(id)
console.log(product.stock)
product.Stock -= quantity

await product.save({validateBeforeSave:false})

}



// ==========delete order  ---- Admin==================


exports.deleteOrder = async (req, res, next) => {
  try {

    const order = await Order.findById(req.params.id)

if(order.length==0){
  return   next(new ErrorHandler("Order not found with this id", 400))
}

await Order.findByIdAndDelete(req.params.id)

    res.status(200).send({ 
      status: true,
    
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};




