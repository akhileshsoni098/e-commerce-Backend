const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
// const {mongodbObjId} = require("../middleware/error")
const { isValidObjectId } = require("mongoose");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//============================== create Product Admin ========================

exports.createProduct = async (req, res, next) => {
  try {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).send({ status: true, product });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//===================== get all products ============================

exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query;

    res.status(200).json({
      status: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// Get All Product (Admin)
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//================ get product data ===================================

exports.getProductDetails = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .send({ status: false, message: "Not valid Object Id" });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).send({ status: true, product });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//======================== update product admin ==============================

exports.updateProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .send({ status: false, message: "Not valid Object Id" });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }
    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).send({ status: true, product });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ======================== delete product admin ========================================

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .send({ status: false, message: "Not valid Object Id" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .send({ status: false, message: "product deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//=================== create new review and Update Review ===============

exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // =======================  avarge rating =========================
    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).send({ status: true });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ==================== get all reviews of a product  =============

exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).send({
      status: true,
      reviews: product.reviews,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// =========== Delete Reviews ====================

exports.deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    // === avg rating get effected when rating deleted ...

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).send({
      status: true,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
