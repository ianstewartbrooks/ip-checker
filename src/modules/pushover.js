const Push = require('pushover-notifications')

const sendPushoverMsg = (ip, currentDateTime) => {
    const user = process.env.PUUserKey
    const token = process.env.PUToken

    const pushover = new Push( {
      user: user,
      token: token,
    })
    
    const msg = {
      message: 'Your IP is ' + ip + '.',
      title: "Your IP address",
      sound: 'magic',
      device: 'iphone11ProMax',
      priority: 1
    }
    
    pushover.send( msg, function( err, result ) {
      if ( err ) {
        throw err
      }
    
      console.log("Message sent to Pushover successfully", result )
    })
  };

  exports.sendPushoverMsg = sendPushoverMsg