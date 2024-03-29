const express = require("express");
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const transporter = require('../../config/mail')
const userAvatarUpload = require('../../helper/userAvatarUpload');
const USER = require('../../models/USER');


//@type     POST
//@route    /api/user/register
//@desc     route for register user.
//@access   public
exports.registerUser = async ( req, res, next ) => {
  try {
    // all input validation through joi validation
    var valid = await Joi.validate(req.body, Joi.object().keys({
      email : Joi.string().email().required(),
      password: Joi.string().min(6).max(15).required(),
      name: Joi.string().required(),
      user_name: Joi.string().required(),
      contact: Joi.string().regex(/^[1-9]{1}[0-9]{9}$/).required(),
      games: Joi.array().items(Joi.object().keys({
        game: Joi.string().min(24).max(24).required(),
        level: Joi.string().required(),
        in_game_id: Joi.string().required()
      })),
    }));

    //password hashing
    let hash = await bcrypt.hash(valid.password, 10);

    // creation of new user object on successful input validdation
    let user = new USER({
      _id: new mongoose.Types.ObjectId(),
      email: valid.email,
      password: hash,
      name: valid.name,
      user_name: valid.user_name,
      contact: valid.contact,
      games: valid.games
    });

    // saving the new user to database
    let newUser = await user.save();

    // send otp
    // await sendOTP( newUser.email );

    //response to the user
    return res.status(201).json({
      message: 'success',
      data: newUser
    })
  } catch (error) {
    if(error.isJoi){
      error.status = 400;
    }
    if(error.code == 11000){
      error.status = 409;
    }
    next(error)
  }
}

//@type     POST
//@route    /api/user/pre-register
//@desc     route to send otp and verify email.
//@access   public

exports.preUserRegistration = async (req ,res ,next) => {
  try {
    var valid = await Joi.validate(req.body, Joi.object().keys({
      email : Joi.string().email().required(),
      user_name: Joi.string().required(),
    }));

    let user = await USER.findOne({}).or([{email: valid.email}, {user_name: valid.user_name}]);

    if(user && (user.email == valid.email)){
      return res.status(409).json({
        message: `user already exist with email : ${valid.email}`,
      });
    }else if(user && (user.user_name == valid.user_name)){
      return res.status(409).json({
        message: `user already exist with user name : ${valid.user_name}`,
      });
    }else {
       // generate otp
      let otp = await Math.random().toString(36).substr(2, 8);  //substr(2, length)

      // mail option creation
      const mailOptions = {
        from: '"Play Zone" '+'<'+process.env.GMAIL_USER+'>', // sender address
        to: email, // list of receivers
        subject: 'Password Reset Key: Play Zone', // Subject line
        // mailSetup.mailSetup(agronomist_name, otp)
        html: `
          <h1>Hello ${email}</h1>
          <h3>Use this key to reset your password</h3>
          <span>Reset Key: </span><b>${otp}</b>
          <br><br>
        `
      }
      
      await transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          let error = new Error();
          error.status = 404;
          error.message = err;
          next(error);
        }
      });

      return res.status(409).json({
        message: `otp had been sent!`,
        otp: otp
      });
    }
  } catch (e) {
    next(e);
  }
}

//@desc     function to send otp to user mail
//@access   private

async function sendOTP (email) {

  // generate otp
  let otp = await Math.random().toString(36).substr(2, 8);  //substr(2, length)

  // mail option creation
  const mailOptions = {
    from: '"Play Zone" '+'<'+process.env.GMAIL_USER+'>', // sender address
    to: email, // list of receivers
    subject: 'Password Reset Key: Play Zone', // Subject line
    // mailSetup.mailSetup(agronomist_name, otp)
    html: `
      <h1>Hello ${email}</h1>
      <h3>Use this key to reset your password</h3>
      <span>Reset Key: </span><b>${otp}</b>
      <br><br>
    `
  }

  await transporter.sendMail(mailOptions, function (err, info) {
    if(err){
      let error = new Error();
      error.status = 404;
      error.message = err;
      next(error);
    }else{
      USER.updateOne({ email: email }, { $set: { otp: otp } })
      .exec()
      .then(result => {
        return result;
      })
      .catch(err => {
        throw Error(err)
      });
    }
  });
}

//@type     patch
//@route    /api/user/verify
//@desc     route to verify user.
//@access   public
exports.verifyUser = async (req ,res ,next) => {
  try {
    var valid = await Joi.validate(req.body, Joi.object().keys({
      email : Joi.string().email().required(),
      otp: Joi.string().min(8).max(8).required(),
    }));

    let user = await USER.findOne({email : valid.email});

    if(!user){
      return res.status(404).json({
        message: 'user not exist',
      })
    }

    if(user.otp == valid.otp){
      var token = await jwt.sign(
        {
          email: user.email,
          _id: user._id,
          user_type: 'user'
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.TOKEN_EXPIRE_TIME
        }
      );
    }else{
      return res.status(404).json({
        message: 'wrong otp'
      })
    }

    user.otp = undefined
    user.verified = true

    user =  await user.save();

    return res.status(200).json({
      message: 'success',
      token:token,
      data: user
    })    
  } catch (error) {
    next(error)
  }
}


//@type     POST
//@route    /api/user/login
//@desc     route for login user.
//@access   public
exports.login = async (req ,res ,next) => {
  try {
    var valid = await Joi.validate(req.body, Joi.object().keys({
      email : Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }));

    let user = await USER.findOne({email : valid.email});

    if(!user){
      return res.status(404).json({
        message: 'user not exist',
      })
    }

    let isValid = await bcrypt.compare(valid.password, user.password);

    if(isValid && user.verified){
      var userData = {
        email: user.email,
        _id: user._id,
        user_type: 'user'
      }
      if(user.org_profile){
         userData.org_profile = user.org_profile 
        }
      var token = await jwt.sign(
        userData,
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.TOKEN_EXPIRE_TIME
        }
      );
    }else{
      return res.status(404).json({
        message: 'email or password is wrong!'
      })
    }
    user.password = undefined;
    if(user.otp){
      user.otp = undefined
    }

    return res.status(200).json({
      message: 'success',
      token: token,
      data: user
    });

  } catch (error) {
    next(error)
  }
}


//@type     PATCH
//@route    /api/user/update/userId
//@desc     route for update user information.
//@access   private
exports.update = async (req ,res ,next) => {
  try {
    //for development
    var validId = await Joi.validate(req.params, Joi.object().keys({
      userId: Joi.string().min(24).max(24).required()
    }));

    // production
    // var validId = req.body.userData._id ;

    var valid = await Joi.validate(req.body, Joi.object().keys({
      name: Joi.string().required(),
      user_name: Joi.string(),
      contact: Joi.string().regex(/^[1-9]{1}[0-9]{9}$/).required(),
      games: Joi.array().items(Joi.object().keys({
        game: Joi.string().min(24).max(24).required(),
        level: Joi.string().required(),
        in_game_id: Joi.string().required()
      })),
    }));

    let user = await USER.findOne({_id : validId.userId});

    if(!user){
      return res.status(404).json({
        message: 'user not exist',
      })
    }

    user.name = valid.name;
    user.user_name = valid.user_name;
    user.contact = valid.contact;
    user.games = valid.games;

    await user.save()

    return res.status(200).json({
      message: 'success',
      data: user
    });

  } catch (error) {
    next(error)
  }
}


//@type     PATCH
//@route    /api/user/avatar/userId
//@desc     route for update user information.
//@access   private
exports.avatar = async (req ,res ,next) => {
  try {
    var oldAvatar = undefined;
    var validId = await Joi.validate(req.params, Joi.object().keys({
      userId: Joi.string().min(24).max(24).required()
    }));

    let user = await USER.findOne({_id : validId.userId});

    if(!user){
      return res.status(404).json({
        message: 'user not exist',
      })
    }

    if(user.avatar){
      oldAvatar = user.avatar;
    }

    await userAvatarUpload(req, res, (err)=>{
      if(err){
        throw err;
      }else if(req.file == undefined){
        return res.status(400).json({
          message: 'No file selected'
        })
      }else{
        user.avatar = req.file.path;
      }
    });

    await user.save();
    //removing avatar file if exist
    if(oldAvatar)
    fs.unlink(oldAvatar , (err)=>{
      if(err){
        throw err;
      }
    })

    return res.status(200).json({
      message: 'success',
      data: req.body
    });

  } catch (error) {
    next(error)
  }
}

//@type     post
//@route    /api/user/send-otp-request
//@desc     route to request to send otp to email address.
//@access   public

exports.userOTP = async (req ,res ,next) => {
  try {
    var valid = await Joi.validate(req.body, Joi.object().keys({
      email : Joi.string().email().required(),
    }));

    let user = await USER.findOne({email: valid.email});
    if(user){
       await sendOTP(valid.email);
    }

    return res.status(200).json({
      message: 'Otp send!',
    })
  } catch (error) {
    next(error);
  } 
}

//@type     post
//@route    /api/user/reset-password
//@desc     route to request to send otp to email address.
//@access   public

exports.userPasswordReset = async (req ,res ,next) => {
  try {
  var valid = await Joi.validate(req.body, Joi.object().keys({
    email : Joi.string().email().required(),
    otp : Joi.string().min(8).max(8).required(),
    password: Joi.string().min(6).max(15).required()
  }));

  let user = await USER.findOne({email : valid.email});

  if(user.otp == valid.otp){
    user.otp = undefined;
    user.password = await bcrypt.hash(valid.password, 10);
  }

  await user.save();

  return res.status(200).json({
    message: 'Password Reset !!'
  })
  } catch (error) {
  next(error)
  }
}


