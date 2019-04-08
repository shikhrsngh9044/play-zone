const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  description: { type: String },
  game: { type: mongoose.Schema.Types.ObjectId },
  play_mode: { type: String },              //single ,duo , 4-squad
  max_player_count: { type: Number },
  min_player_count: { type: Number },
  players: [{ type: mongoose.Schema.Types.ObjectId }],
  winners: [{ type: mongoose.Schema.Types.ObjectId }],
  match_date: { type: Date },
  status: { type: Boolean, default: true },
  public_access: { type: Boolean ,default: false},   // public accessbility (default will be private)
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
    created_at: { type: Date, default: Date.now },
    updated_at: { type: String }
  }
});

module.exports = mongoose.model('MATCH', matchSchema);