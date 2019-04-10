const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  description: { type: String },
  game: { type: mongoose.Schema.Types.ObjectId },
  team_mode: { type: String },              //single ,duo , 4-squad
  max_player_count: { type: Number },       // max player or team in a match
  min_player_count: { type: Number },       // min player or team
  players: [{ type: mongoose.Schema.Types.ObjectId }],
  teams: [{
    team_name: { type: String },
    team_players: [ { type: mongoose.Schema.Types.ObjectId, ref: 'USER' } ],
  }],
  winners: [{ 
    player: { type: mongoose.Schema.Types.ObjectId },
    rank: { type: Number }
  }],
  match_date: { type: Date },
  status: { type: Boolean, default: true },
  public_access: { type: Boolean ,default: true},   // public accessbility (default will be public)
  time: { 
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  },
  card_image: { type: String },
  organisor: { type: mongoose.Schema.Types.ObjectId },
  timestamps: {
    created_at: { type: Date, default: Date.now },
    updated_at: { type: String }
  }
});

module.exports = mongoose.model('MATCH', matchSchema);