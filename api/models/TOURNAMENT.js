const mongoose = require("mongoose");

const tourSchema = mongoose.Schema({
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
  }, //single ,duo , 4-squad

  max_participant_count: {
    type: Number
  },
  min_participant_count: {
    type: Number
  }, // min player or team

  pool_type: {
    type: Number,
    default: 2
  }, //pool type-> 2 , 3 , 4, 6, 8

  match_count: {
    type: Number,
    default: 3
  }, //will be changed according to the pool types

  parallel_matches: {
    type: Boolean,
    default: false
  }, //if main organizer want that matches at each should be played parallely.
  //then he should choose sub organizers for each match.at each level of tour.
  //no sub organizer should be repeated.

  //if parallel_matches value is false he will not be able to come in winner's list and
  //he have to exlude himself from winner's or top players list of each match.and
  //ranking will prepared exluding the organizer.and Each match's sub organizer will be main organizer.

  sub_organiser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  }], //if parallel_mathes value is "true" then each one of them will be assigned to the single match which he will host.
  //if main organizer is in winner's list and got promoted to next match.then he can reassign himself

  matches: [{
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MATCH"
    },
    completion_status: {
      type: Boolean,
      default: false
    },
    level: {                                                      // level of match in tournament
      type: String
    }
  }],

  winner_list: [{                                                 //winner list for tournament 
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

  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  }],

  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
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

  payment_status: {
    type: Boolean,
    default: true
  }, //status will be active only when he pays the fee to us. default will be false

  completion_status: {
    type: Boolean,
    default: false
  }, //completion status will be used in tournament to show which match is completed. default will be false
  //it will be changed to true when winners declared and prize money is distributed

  public_access: {
    type: Boolean,
    default: true
  }, // public accessbility (default will be public)

  time: {
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

module.exports = mongoose.model("TOURNAMENT", tourSchema);
