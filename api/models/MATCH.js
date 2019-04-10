const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String
  },
  description: {
    type: String 
  },
  game: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  team_mode: {                                                                  //single ,duo , 4-squad
    type: String 
  },              
  max_player_count: {                                                           // max player or team in a match
    type: Number 
  },       
  min_player_count: {                                                           // min player or team 
    type: Number 
  },       
  players: [{                                                                   // players if match mode is single or solo
    type: mongoose.Schema.Types.ObjectId 
  }],
  request: [{                                                                   // list of participant players equested
    type: mongoose.Schema.Types.ObjectId                                        // for match but payment not verified
  }],
  teams: [{                                                                     // team details if match mode is duo or squad
    team_name: { type: String },
    team_players: [ { type: mongoose.Schema.Types.ObjectId, ref: 'USER' } ],
  }],
  result: [{                                                                    // result if match mode is solo
    player: { type: mongoose.Schema.Types.ObjectId },
    rank: { type: Number }
  }],
  team_result: [{                                                               // result if match mode is duo or squad
    team_name: { type: String },
    team_players: [ { type: mongoose.Schema.Types.ObjectId, ref: 'USER' } ],
    rank: { type: Number }
  }],
  match_date: { 
    type: Date 
  },
  status: { 
    type: Boolean, 
    default: true 
  },
  public_access: {                                                               // public accessbility (default will be public)
    type: Boolean ,
    default: true
  },   
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
  organisor: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  timestamps: {
    created_at: { 
      type: Date, default: Date.now 
    },
    updated_at: { 
      type: String 
    }
  }
});

module.exports = mongoose.model('MATCH', matchSchema);