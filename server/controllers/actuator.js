module.exports = socket => {

   let { Led, Button, Sensor, Actuator } = App

   socket.on('config', function (data) {
      console.log(data)
   })

   setInterval(function () {

      socket.emit('sensor', {
         S0: Sensor.S0.value,
         S1: Sensor.S1.value
      })

   }, 100)

}