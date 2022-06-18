const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');

let data = {
  currentIP: '',
  detectedDate: new Date(),
};

const getStoredData = (cb) => {
  fs.readFile('./ip.json', (err, fileData) => {
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
  fs.writeFile('./ip.json', JSON.stringify(data), (err) => {
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
    console.info('<----- IP Chagned ----->');
    console.info('Date & time of change: ', currentDateTime);
    console.info('Old Date & time: ', data.detectedDate);
    console.info('Latest IP: ', latestIP);
    console.info('Old IP: ', data.currentIP);
    console.info('<--------------------->');
    data.currentIP = latestIP;
    data.detectedDate = currentDateTime;
    storeNewIP();
  }
};

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function () {
  // Every minute check the IP to see if it has changed.
  getIPUsingAPI();
});
