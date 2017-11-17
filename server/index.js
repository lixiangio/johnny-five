let io = require('socket.io')()

io.on('connection', function (socket) {

   let { Led, Button, Sensor, Actuator } = App
   console.log(99)

   socket.on('myEvent', function (data) {
      console.log(data)
   })

   setInterval(function () {

      socket.emit('news', {
         S0: Sensor.S0.value,
         S1: Sensor.S1.value
      })

   }, 100)

})

App.server = function () {
   io.listen(80)
}
