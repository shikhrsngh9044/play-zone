const express = require("express");
const Joi = require('joi');
const mongoose = require('mongoose');
const fs = require('fs');
const ORG_PRO = require('../models/ORG_PROFILE');
const USER = require('../models/USER');

exports.createOrgPro = async (req ,res ,next) => {
  try {
    let orgPro = await new ORG_PRO({
      _id: new mongoose.Types.ObjectId(),
      user: req.userData._id
    });
    orgPro = await orgPro.save();

    var user = await USER.findOne({_id : req.userData._id});

    if(!user.org_profile){
      user.org_profile = orgPro._id;
    }else{
      return res.status(409).json({
        message: 'you are already a organiser'
      })
    }
    console.log('user :' ,user);
    user = await user.save();

    return res.status(200).json({
      message: 'success',
      data: {
        user: user,
        org: orgPro
      }
    })
  } catch (error) {
    next(error)
  }
}