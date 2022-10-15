const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const Push = require('pushover-notifications')

const ipDataFile = '/data/ip.json';

let data = {
  currentIP: '',
  detectedDate: new Date(),
};

const getStoredData = (cb) => {
  try {
    if (!fs.existsSync(ipDataFile)) {
      fs.copyFileSync('./ip.json', ipDataFile)
      console.log("Created data file...");
    }
  } catch(err) {
    console.error(err)
  }

  fs.readFile(ipDataFile, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
};

const storeNewIP = () => {
  // Our IP address has changed so lets store it
  fs.writeFile(ipDataFile, JSON.stringify(data), (err) => {
    if (err) console.log('Error writing file:', err);
  });
};

const getIPUsingAPI = () => {
  // Get the IP from the API
  axios
    .get('https://api.ipify.org')
    .then(function (response) {
      // handle success
      compareIP(response.data);
    })
    .catch(function (error) {
      /* If there is an error then it is highly likely that it's due to 
         the connection being down, so just return for now. */
      return;
    });
};

const compareIP = (latestIP) => {
  // Compare the stored IP from the one returned by an API call
  getStoredData((err, data) => {
    if (err) {
      return;
    }
  });

  if (data.currentIP !== latestIP) {
    currentDateTime = new Date().toLocaleString('en-GB', {
      timeZone: 'Europe/London',
    });
    console.info('<----- Current IP ----->');
    console.info('Date & time of change: ', currentDateTime);
    console.info('Latest IP: ', latestIP);
    console.info('Old Date & time: ', data.detectedDate);
    console.info('Old IP: ', data.currentIP);
    console.info('<--------------------->');
    data.currentIP = latestIP;
    data.detectedDate = currentDateTime;
    storeNewIP();
    sendPushoverMsg(latestIP, currentDateTime);
  }
};

const sendPushoverMsg = (ip, currentDateTime) => {
  var p = new Push( {
    user: process.env.PUUserKey,
    token: process.env.PUToken,
  })
  
  var msg = {
    message: 'Your IP is currently ' + ip + '.',
    title: "Your current IP",
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

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function () {
  // Every minute check the IP to see if it has changed.
  getIPUsingAPI();
});
