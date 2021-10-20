/*
This module creates an HTTPS web server and serves static content
from a specified directory on a specified port.
To generate a new cert:
  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
To remove the passphrase requirement:
  openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
Or just include the "passphrase" option when configuring the HTTPS server.
Sources:
- http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
- https://expressjs.com/en/starter/static-files.html
*/

const fs = require('fs');
const https = require('https');
const express = require('express');
var robot = require("robotjs");

const app = express();
app.use(express.static('dist'));
app.get('/', function(req, res) {
  return res.end('<p>This server serves up static files.</p><a href="https://192.168.43.47:8443/desktop.html">Here</a>');
});

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

app.get('/screenshot', function(req, res) {
  var width = 1920
  var height = 1080
  var time = (new Date()).getTime()
  var image = robot.screen.capture(0, 0, width, height)
  console.log((new Date()).getTime() - time)
  console.log(image)
  /*
  getBase64(file).then(
    data => console.log(data)
  );*/
  image.image[0]
  return res.end(image.image);
});

const options = {
  key: fs.readFileSync('key.pem', 'utf8'),
  cert: fs.readFileSync('cert.pem', 'utf8'),
  passphrase: process.env.HTTPS_PASSPHRASE || ''
};
const server = https.createServer(options, app);

server.listen(8443);

console.log("serving at 8443")


// testing


var width = 1920
var height = 1080
var time = (new Date()).getTime()
var image = robot.screen.capture(0, 0, width, height)
console.log((new Date()).getTime() - time)
console.log(image)
/*
getBase64(file).then(
  data => console.log(data)
);*/
console.log(image.image[0])
