module.exports = socket => {

   let { Led, Button, Sensor, Actuator } = App

   setInterval(function () {

      socket.emit('sensor', {
         S0: Sensor.S0.value,
         S1: Sensor.S1.value,
      })

   }, 100)



   socket.on('config', function (data, xx) {
      console.log(data, xx)
   })

}