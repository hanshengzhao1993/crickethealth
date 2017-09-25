const path = require('path');
const PubNub = require('pubnub');
const express = require('express');
const bodyParser = require('body-parser');
const messageDB = require('./database/dbindex');
const pubnub = new PubNub({
    subscribeKey: 'SUBSCRIBE KEY HERE',
    publishKey: 'PUBLISH KEY HERE',
    ssl: true
  });

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// static files
app.use(express.static(path.join(__dirname, '/../public')));

// get all messages
app.get('/allMessages', function (req, res) {
  // get all the messages from the database
  messageDB.find({}, function (err, allMessages) {
    if(err){
      console.log(err)
    } else {
      res.send(allMessages)
    }
  })
})

// pubnub open to the channel
pubnub.addListener({
  status: function (status) {
    if(status.category === "PNConnectedCategory"){
    // console.log('status', status)
    }
  },
  message: function (message) {
    // add new message to DB
    var newMessage = new messageDB(message.message);
    newMessage.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('added new message');
      }
    });
  }
});


pubnub.subscribe({
  channels: ['cricket_health_chat']
}); 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})