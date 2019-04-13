const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  max_player: {
    type: Number,
    required: true
  },
  min_player: {
    type: Number,
    required: true
  }
});

module.exports = Game = mongoose.model("GAME", GameSchema);
