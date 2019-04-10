const express = require("express");
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
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
      password: Joi.string().min(6).required(),
      name: Joi.string().required(),
      user_name: Joi.string(),
      contact: Joi.string().regex(/^[1-9]{1}[0-9]{9}$/).required(),
      games: Joi.array().items(Joi.object().keys({
        game: Joi.string().min(24).max(24).required(),
        level: Joi.string().required(),
        in_game_id: Joi.string().required()
      })),
    }));

    // creation of new user object on successful input validdation
    let user = new USER({
      _id: new mongoose.Types.ObjectId(),
      email: valid.email,
      password: valid.password,
      name: valid.name,
      user_name: valid.user_name,
      contact: valid.contact,
      games: valid.games
    });

    // saving the new user to database
    let newUser = await user.save();

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

    if(isValid){
      var token = await jwt.sign(
        {
          email: user.email,
          _id: user._id
        },
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
    var validId = await Joi.validate(req.params, Joi.object().keys({
      userId: Joi.string().min(24).max(24).required()
    }));

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