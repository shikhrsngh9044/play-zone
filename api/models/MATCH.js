const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  organiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ORG_PROFILE"
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GAME"
  },
  team_mode: {
    type: String
  },                                                              //single ,duo , 4-squad
  max_participant_count: {
    type: Number
  },                                                              // max player or team in a match
  min_participant_count: {
    type: Number
  },                                                              // min player or team
  is_tournament: {
    type: Boolean,
    default: false
  },                                                              //false- single match true- tournament match
  tournament: {
    type: mongoose.Schema.Types.ObjectId,                         // if this match is in tournament.this match will not will be shown in single match list
    ref: "TOURNAMENT"
  },                                                              
  players: [{                                                     // players array who are accepted to play the match
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  }],
  requests: [{                                                    // players array who are request to org to play the match
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  }],

  winner_list: [{                                                     //winner list for  match 
    team_rank: { type: Number },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER"
    },
    team_players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER"
    }]
  }],

  teams: [{                                                       // for team registration
    team_name: { type: String },
    team_players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER"
    }],
    accept_status: {
      type: Boolean,
      default: false
    }
  }],

  match_date: {
    type: Date
  },

  payment_status: {                                                       //status will be active only when he pays the fee to us. default will be false
    type: Boolean,
    default: false
  }, 

  completion_status: {
    type: Boolean,
    default: false
  }, //completion status will be used in tournament to show which match is completed. default will be false
  //it will be changed to true when winners declared and prize money is distributed

  public_access: {
    type: Boolean,
    default: true
  }, // public accessbility (default will be public)

  match_time: {
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  },

  card_image: {
    type: String
  },

  result_iamge: [{
    image: String
  }]
}, { timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' } });

module.exports = mongoose.model("MATCH", matchSchema);
