const ErrorHandler = require("../utils/errorhandler");
const { isValidObjectId } = require("mongoose");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
//========================== Register User ========================

exports.registerUser = async (req, res, next) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ========================== Log In User ==========================

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password"); // in model select is false so that...

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//=================================== LogOut User ================================================

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),

      httpOnly: true,
    });

    res.status(200).send({ status: true, message: "Logged Out" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ====================================== forgot password =============================

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // get resetPassword Token

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n  ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it `;

    //=============== send email to confirm user to reset password  ======
    try {
      await sendEmail({
        email: user.email,

        subject: `Ecommerce Password Recovery`,

        message,
      });
      // console.log(sendEmail.email)

      res.status(200).send({
        status: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHander(error.message, 500));
    }

    //=====================
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// console.log(forgotPassword)

//=============== Reset Password  ========================

exports.resetPassword = async (req, res, next) => {
  try {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password doesn't match", 400));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//================== get user Details ====================

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // id becoz login payload me id liya h

    res.status(200).send({ staus: true, user });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// ====== update user password  =====

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password doesn't match ", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//==================== Update user Profile=======================

exports.updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.body.avatar !== "") {
      const user = await User.findById(req.user.id);

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).send({ status: true });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//=============================== get all Users ====================
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).send({ status: true, users });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//=============================== get Single  User (admin) ====================
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with id:${req.params.id}`)
      );
    }

    res.status(200).send({ status: true, user });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//==================== Update user  Role (admin)=======================

exports.updateUserRole = async (req, res, next) => {
  try {
    let data = req.body;
    let { name, email, role } = data;

    const newUserData = {
      name: name,
      email: email,
      role: role,
    };
    // we will add cloudinary later

    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      return next(new ErrorHandler("This Email is already exist", 400));
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).send({ status: true });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//==================== Delete user  (admin)=======================

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    //we will remove cloudinary later
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with id:${req.params.id}`)
      );
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await User.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .send({ status: true, message: "User Deletted Successfully " });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
