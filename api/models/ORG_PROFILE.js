<<<<<<< HEAD
const mongoose = require("mongoose");

const orgProfileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  },

  organised_matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MATCH"
    }
  ],

  blocked_players: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "USER"
    }
  ],

  organiser_teams: [
    [
      {
        type: mongoose.Schema.ObjectId,
        ref: "USER"
      }
    ]
  ]
});

module.exports = mongoose.model("ORG_PROFILE", orgProfileSchema);
=======
const mongoose = require('mongoose');

const orgProfileSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER'
  },
  organised_matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MATCH'
  }],
  
});

module.exports = mongoose.model('ORG_PROFILE', orgProfileSchema);
>>>>>>> 93313f04b99e5292ddb0c9021041724735e90c1c
