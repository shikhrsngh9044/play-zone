const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
    type: String,
  },
	password: {
    type: String,
  },
	name: {
    type: String,
  },
	user_name: {
    type: String,
  },
	otp: {
    type: String,
    default: null
  },
	account_status: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  avatar: { type: String },
  org_profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ORG_PROFILE'
  },
  games: [{
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GAME' },
    level: { type: String }
  }],
  palyedGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GAMES'
  }],
}, { timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' } });


// removing password field from the user object
userSchema.post('save', async function () {
  this.password = undefined
})


module.exports = mongoose.model('USER', userSchema);