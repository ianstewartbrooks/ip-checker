const Push = require('pushover-notifications')

const sendPushoverMsg = (ip, currentDateTime) => {
    const user = process.env.PUUserKey
    const token = process.env.PUToken

    console.info("Token: ", token);
    console.info("User Key: ", user);

    const p = new Push( {
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
    
    p.send( msg, function( err, result ) {
      if ( err ) {
        throw err
      }
    
      console.log("Message sent to Pushover", result )
    })
  };

  exports.sendPushoverMsg = sendPushoverMsg