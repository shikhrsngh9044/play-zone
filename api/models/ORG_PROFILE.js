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
  ], //Single matches

  organised_tournaments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TOURNAMENT"
    }
  ], //Tournaments

  blocked_players: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "USER"
    }
  ],

  organiser_clan: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "USER"
    }
  ] //Organiser's clan
});

module.exports = mongoose.model("ORG_PROFILE", orgProfileSchema);
