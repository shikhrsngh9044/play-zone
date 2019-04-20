const express = require("express");
const Joi = require('joi');
const mongoose = require('mongoose');
const fs = require('fs');
const MATCH = require('../models/MATCH');

/**
 * @type    POST
 * @route   /api/match/register
 * @desc    route to register a match
 * @access  private
 */
exports.createMatch = async (req ,res ,next) => {
  try {
    // all input validation through joi validation
    var valid = await Joi.validate(req.body, Joi.object().keys({
      title: Joi.string().min(4).max(100).required(),
      description: Joi.string().min(20).max(500).required(),
      game: Joi.string().min(24).max(24).required(),
      team_mode: Joi.string().min(3).max(10).required(),
      max_participant_count: Joi.number().integer().required(),
      min_participant_count: Joi.number().integer().required(),
      is_tournament: Joi.boolean().truthy('1').falsy('0').insensitive(false).required(),
      match_date: Joi.string().required(),
      match_time: Joi.object().keys({
        start: Joi.string(),
        end: Joi.string()
      }),
    }));

    let match = await new MATCH({
      _id: new mongoose.Types.ObjectId(),
      organiser: req.userData._id,
      title: valid.title,
      description: valid.description,
      game: valid.game,
      team_mode: valid.team_mode,
      max_participant_count: valid.max_participant_count,
      min_participant_count: valid.min_participant_count,
      is_tournament: valid.is_tournament,
      match_date: valid.match_date,
      match_time: {
        start: valid.match_time.start,
        end: valid.match_time.end
      },
    })

    let newMatch = await match.save();

    return res.status(200).json({
      message: 'success',
      data: newMatch
    })
  } catch (error) {
    next(error);
  }
}

/**
 * @type    PATCH
 * @route   /api/match/add-participants
 * @desc    route to add players or teams
 * @access  private
 */

exports.addParticipants = async (req ,res ,next) => {
  try {
    var valid = await Joi.validate(req.body, Joi.object().keys({
      match_id: Joi.string().min(24).max(24).required(),
      players: Joi.array().items(Joi.string().min(24).max(24)),
      teams: Joi.array().items(Joi.object().keys({
        team_name: Joi.string().required(),
        team_players: Joi.array().items(Joi.string().min(24).max(24)),
        accept_status: Joi.boolean().truthy('1').falsy('0').insensitive(false)
      })),
    }));

    var match = await MATCH.findOne({_id: valid.match_id});

    if(match.team_mode == 'single' && valid.players){
      var updatedMatch = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{ $push: { palyers: {player:valid.players ,accept_status :true}}}, {safe: true ,new: true});
    }else if(match.team_mode == 'duo' && valid.teams){
      var updatedMatch = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{ $push: { teams:  valid.teams}} , {safe: true ,new: true});
    }else if(match.team_mode == 'squad'  && valid.teams) {
      var updatedMatch = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{ $push: { teams:  valid.teams}} , {safe: true ,new: true});
    }else {
      return res.status(404).json({
        message: 'match should have at least one team mode and shoud have according data. '
      })
    }

    // updateMatch = await match.save();

    return res.status(200).json({
      message: 'updated!',
      data: updatedMatch
    })

  } catch (error) {
    next(error);
  }
}

/**
 * @type    PATCH
 * @route   /api/match/register
 * @desc    route to add players or teams
 * @access  private
 */

 exports.removeParticipants = async (req ,res ,next) => {
  try {
    var valid = await Joi.validate(req.body, Joi.object().keys({
      match_id: Joi.string().min(24).max(24).required(),
      remove_players: Joi.array().items(Joi.string().min(24).max(24)),
      remove_teams: Joi.array().items(Joi.object().keys({
        team_name: Joi.string().required(),
        team_players: Joi.array().items(Joi.string().min(24).max(24)),
        accept_status: Joi.boolean().truthy('1').falsy('0').insensitive(false),
        _id: Joi.string().min(24).max(24).required()
      }))
    }));
  
    var match = await MATCH.findOne({_id: valid.match_id});
  
    if(match.team_mode == 'single' && valid.remove_players){
      var updatedMatch = await Promise.all((valid.remove_players).map(async (player) => {
        try {
          let result = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{$pull: { 'players': { player: player }}}, {safe: true ,new: true ,useFindAndModify: false});
          return result;
        } catch (e) {
          return e;
        }
      }))
      // console.log('done');
    }else if(match.team_mode == 'duo' && valid.remove_teams){
      var updatedMatch = await Promise.all((valid.remove_teams).map(async (team) => {
        try {
          let result = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{$pull: { 'teams': {'_id': team._id} } }, {safe: true ,new: true ,useFindAndModify: false});
          return result;
        } catch (e) {
          return e;
        }
      }))
      // console.log('done');

    }else if(match.team_mode == 'squad' && valid.remove_teams){
      var updatedMatch = await Promise.all((valid.remove_teams).map(async (team) => {
        try {
          let result = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{$pull: { 'teams': {'_id': team._id} } }, {safe: true ,new: true ,useFindAndModify: false});
          return result;
        } catch (e) {
          return e;
        }
      }))
      // console.log('done');    }else {
      return res.status(404).json({
        message: 'match should have at least one team mode and shoud have according data. '
      })
    }
  
    return res.status(200).json({
      message: 'updated!',
      data: updatedMatch
    })
  } catch (error) {
    next(error);
  }
 }


 /**
 * @type    PATCH
 * @route   /api/match/participant-request
 * @desc    route to request to organiser for match participant
 * @access  private
 */

exports.requestForMatch = async (req, res, next) => {
  try {
    // validation
    var valid = await Joi.validate(req.body, Joi.object().keys({
      match_id: Joi.string().min(24).max(24).required(),
      team: {
        team_name: Joi.string().min(2).max(150).required(),
        team_players: Joi.array().items(Joi.string().min(24).max(24)).required()
      }
    }));

    var match = await MATCH.findOne({_id: valid.match_id});

    if(match.team_mode == 'single' && valid.players){
      var updatedMatch = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{$push: { players:  { player: req.userData._id }} }, {safe: true ,new: true ,useFindAndModify: false});
    }else {
      var updatedMatch = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{$push: { teams:  valid.team} }, {safe: true ,new: true ,useFindAndModify: false});
    }

    return res.status(200).json({
      message: 'success!',
      data: updatedMatch
    })

  } catch (e) {
    next(e);
  }
}


 /**
 * @type    PATCH
 * @route   /api/match/participant-accept
 * @desc    route for organiser to accept request for match 
 * @access  private
 */

exports.orgAcceptParticipant = async (req ,res ,next) => {
  try {
    var valid = await Joi.validate(req.body, Joi.object().keys({
      match_id: Joi.string().min(24).max(24).required(),
      players: Joi.array().items(Joi.string().min(24).max(24)),
      teams: Joi.array().items(Joi.string().min(24).max(24)),
    }));

    var match = await MATCH.findOne({_id: valid.match_id ,organiser: req.userData.org_profile});

    if(match){
      console.log('match : ',match);
      if(match.team_mode == 'single' && valid.players){
        var updatedMatch = await Promise.all((valid.players).map(async (player) => {
          try {
            
            let result = await MATCH.findOneAndUpdate({_id: valid.match_id , 'players.player' : player} ,{$set: { 'players.$.accept_status': true }}, {safe: true ,new: true ,useFindAndModify: false});
            return result;
          } catch (e) {
            return e;
          }
        }))
  
        // var updatedMatch = await MATCH.findOneAndUpdate({_id: valid.match_id , 'players.player' : valid.player_id} ,{$set: { 'players.$.accept_status': true }}, {safe: true ,new: true ,useFindAndModify: false});
      } 
      if((match.team_mode == 'duo' || match.team_mode == 'squad') && valid.teams){
        var updatedMatch = await Promise.all((valid.teams).map(async (team) => {
          try {
            console.log('team : ',team);
            let result = await MATCH.findOneAndUpdate({_id: valid.match_id , 'teams._id': team} ,{$set: { 'teams.$.accept_status': true }}, {safe: true ,new: true ,useFindAndModify: false});
            return result;
          } catch (e) {
            return e;
          }
        }))
  
        // var updatedMatch = await MATCH.findOneAndUpdate({_id: valid.match_id} ,{$push: { teams:  valid.team} }, {safe: true ,new: true ,useFindAndModify: false});        
      }
      return res.status(200).json({
        message: 'success!',
        data: updatedMatch
      })
    }else {
      let error = new Error();
      error.status = 404;
      error.message = 'match not found!'
      next(error);
    }

  } catch (e) {
    next(e);
  }
}


 /**
 * @type    get
 * @route   /api/match/get-single-match
 * @desc    route to get single match with matchId 
 * @access  public
 */

exports.getSingleMatch = async (req, res ,next) => {
  try {
    var valid = await Joi.validate(req.params, Joi.object().keys({
      matchId: Joi.string().min(24).max(24).required(),
    }));

    var match = await MATCH.findOne({_id: valid.matchId ,public_access: true ,payment_status: true});
    if(match){
      return res.status(200).json({
        message: 'success!',
        data: match
      });
    }else{
      let error = new Error();
      error.status = 404;
      error.message = 'match not found'
    }
  } catch (e) {
    next(e);
  }
}

 /**
 * @type    get
 * @route   /api/match/org/get-single-match
 * @desc    route for organiser to get single match 
 * @access  private
 */

exports.orgGetSingleMatch = async (req, res ,next) => {
  try {
    var valid = await Joi.validate(req.params, Joi.object().keys({
      matchId: Joi.string().min(24).max(24).required(),
    }));

    var match = await MATCH.findOne({_id: valid.matchId ,organiser: req.userData.organiser});
    if(match){
      return res.status(200).json({
        message: 'success!',
        data: match
      });
    }else{
      let error = new Error();
      error.status = 404;
      error.message = 'match not found'
    }
  } catch (e) {
    next(e);
  }
}

 /**
 * @type    get
 * @route   /api/match/get-all-match
 * @desc    route for all to get all match 
 * @access  public
 */

exports.getAllMatch = async (req, res ,next) => {
  try {
    var valid = await Joi.validate(req.params, Joi.object().keys({
      matchId: Joi.string().min(24).max(24).required(),
    }));

    var matches = await MATCH.find({public_access: true ,payment_status: true});
    if(match){
      return res.status(200).json({
        message: 'success!',
        data: matches
      });
    }else{
      let error = new Error();
      error.status = 404;
      error.message = 'matches not found'
    }
  } catch (e) {
    next(e);
  }
}
 /**
 * @type    get
 * @route   /api/match/org/get-all-match
 * @desc    route for organiser to get all match 
 * @access  public
 */

exports.orgGetAllMatch = async (req, res ,next) => {
  try {
    var valid = await Joi.validate(req.params, Joi.object().keys({
      matchId: Joi.string().min(24).max(24).required(),
    }));

    var matches = await MATCH.find({organiser: req.userData.organiser});
    if(match){
      return res.status(200).json({
        message: 'success!',
        data: matches
      });
    }else{
      let error = new Error();
      error.status = 404;
      error.message = 'matches not found'
    }
  } catch (e) {
    next(e);
  }
}

