const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/message');


const db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var messageSchema = mongoose.Schema({
  message: String,
  time: String
});

var message = mongoose.model('message', messageSchema);

module.exports = message;