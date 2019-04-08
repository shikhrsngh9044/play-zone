const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: {
    type: String,
  },
	description: {
    type: String,
  }
});

module.exports = mongoose.model('TODO', todoSchema);