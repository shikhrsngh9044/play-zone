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