const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
    type: String,
    unique: true
  },
	password: {
    type: String,
  },
	name: {
    type: String,
  },
	user_name: {
    type: String,
    unique: true
  },
  contact: {
    type: String,
    unique: true
  },
	otp: {
    type: String,
    default: undefined
  },
	account_status: {
    type: Boolean,
    default: true
  },
  avatar: { type: String },
  org_profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ORG_PROFILE'
  },
  games: [{
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GAME' },
    level: { type: String },
    in_game_id: { type: String },
  }],
  palyedGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GAMES'
  }],
}, { timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' } });


//This is called a pre-hook, before the user information is saved in the database
//this function will be called, we'll get the plain text password, hash it and store it.
userSchema.pre('save', async function(next){
  //'this' refers to the current document about to be saved
  const user = this;
  //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  //your application becomes.
  const hash = await bcrypt.hash(this.password, 10);
  //Replace the plain text password with the hash and then store it
  this.password = hash;
  //Indicates we're done and moves on to the next middleware
  next();
});

// removing password field from the user object
userSchema.post('save', async function () {
  this.password = undefined
})

//We'll use this later on to make sure that the user trying to log in has the correct credentials
userSchema.methods.isValidPassword = async function(password){
  const user = this;
  //Hashes the password sent by the user for login and checks if the hashed password stored in the 
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

module.exports = mongoose.model('USER', userSchema);