// let http = require("http")

// let server = http.createServer(function (request, response) {

//    response.writeHead(200, { 'Content-Type': 'text/plain' });

//    response.end(JSON.stringify(App.config));

// }).listen(80)

// socket(server)

// App.calibrate = require("./calibrate.js")
let http = require('http')
let socket = require('socket.io');
let fs = require('fs');

let app = http.createServer((req, res) => {
   fs.readFile(__dirname + '/index.html',
      function (err, data) {
         if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
         }

         res.writeHead(200);
         res.end(data);
      });
})

app.listen(3000);

let io = socket(app);

io.on('connection', function (socket) {

   App.socket = socket

   socket.on('myEvent', function (data) {
      console.log(data);
   });

   // setTimeout(function () {
   //    setInterval(function () {
   //       socket.emit('news', { S0: App.Sensor.S0.value });
   //    }, 100);
   // }, 3000);

});