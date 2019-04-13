const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  organiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ORG_PROFILE"
  },

  is_tournament: {
    type: Boolean,
    default: false
  }, //false- single match true- tournament match

  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TOURNAMENT"
  }, // if this match is in tournament.this match will not will be shown in single match list

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

  max_player_count: {
    type: Number
  }, // max player or team in a match

  min_player_count: {
    type: Number
  }, // min player or team

  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER"
    }
  ],

  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER"
    }
  ],

  teams: [
    {
      team_name: { type: String },
      team_players: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "USER"
        }
      ]
    }
  ],

  winners: [
    {
      rank: { type: Number },
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
      }
    }
  ],

  match_date: {
    type: Date
  },

  status: {
    type: Boolean,
    default: false
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

  timestamps: {
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: String
    }
  }
});

module.exports = mongoose.model("MATCH", matchSchema);
