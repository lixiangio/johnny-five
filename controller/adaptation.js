module.exports = function () {

   let { five, config } = this
   let { sensor, actuator } = config
   let { A0: a0, A1: a1 } = sensor

   let A0 = new five.Sensor({
      pin: 'A0',
      freq: 250,
   })

   let A1 = new five.Sensor({
      pin: 'A1',
      freq: 250,
   })

   // let button = new five.Button(8)

   // let P10 = new five.Pin(10)
   // let P11 = new five.Pin(11)

   A0.on("data", function () {

      if (A0.value < a0.stroke.min) {
         a0.stroke.min = A0.value
      }
      if (A0.value > a0.stroke.max) {
         a0.stroke.max = A0.value
      }

      if (A1.value < a1.stroke.min) {
         a1.stroke.min = A1.value
      }
      if (A1.value > a1.stroke.max) {
         a1.stroke.max = A1.value
      }

      console.log(sensor.A0)
      console.log(sensor.A1)

   })

}