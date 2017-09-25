window.onload = function() {
  const button = document.getElementById("send");
  const chat = document.getElementById("chat");
  const message = document.getElementById("message");
  const chatDiv = document.getElementById("chat_div");
  const pubnub = new PubNub({
    subscribeKey: "SUBSCRIBE KEY HERE",
    publishKey: 'PUBLISH KEY HERE',
    ssl: true
  });

  //move to the bottom of the chat
  const moveToBottomOfChat = function () {
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }

  // func that display a message with object as an input
  const displayMessage = function (message) {
    let splitTime = message.time.split(' ');
    let newMessage = document.createElement('LI');
    let timeMessage = document.createElement('SPAN');
    timeMessage.setAttribute('class', 'bluetext');
    timeMessage.innerHTML = splitTime[1] + ' ' + splitTime[2];
    let sendMessage = document.createElement('SPAN');
    sendMessage.innerHTML = ': '+ message.message;
    newMessage.appendChild(timeMessage);
    newMessage.appendChild(sendMessage);
    chat.appendChild(newMessage);
  }

  // get all messages from the chat
  const getAllMessage = function () {
    axios.get('/allMessages')
      .then(function (response) {
        response.data.forEach((message)=>{
          displayMessage(message);
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getAllMessage();

  // add a new message
  const addMesssage = function () {
    if(message.value.length === 0){
      alert('Please Enter a Value')
    } else {
      let createdMessage = {
        time: (new Date).toLocaleString(),
        message: message.value
      }
      pubnub.publish( {
        message: createdMessage,
        channel: 'cricket_health_chat'
      }, function (status, response) {
        if(status.statusCode === 200){
          console.log('Message Send')
        } else {
          // error with sending message
          console.log(status)
        }
      });
      message.value = '';
      moveToBottomOfChat();
    }
  }

  // listening to incoming messages from a channel
  pubnub.addListener({
    status: function (status) {
      if(status.category === "PNConnectedCategory"){
      // console.log('status', status)
      }
    },
    message: function (message) {
      displayMessage(message.message);
    }
  });

  //subscript to a channel
  pubnub.subscribe({
    channels: ['cricket_health_chat']
  }); 

  // adding event listener for clicking on button
  button.addEventListener('click', addMesssage);
  // adding event listener for enter key
  message.addEventListener('keydown', (event)=>{
    if(event.keyCode === 13){
      addMesssage();
    }
  })

}