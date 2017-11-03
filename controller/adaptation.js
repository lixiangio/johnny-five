module.exports = function () {

   let { five, config } = this
   let { sensor, actuator } = config
   let { A0: a0, A1: a1 } = sensor

   let before = {
      'B8': 0
   }

   let A0 = new five.Sensor({
      pin: 'A0',
      // freq: 250,
   })

   let A1 = new five.Sensor({
      pin: 'A1',
      // freq: 250,
   })

   let B8 = new five.Button(8)
   let L9 = new five.Led(9)

   let P12 = new five.Pin(12)
   let P13 = new five.Pin(13)

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

      if (B8.value !== before.B8) {
         if (B8.value === 1) {
            L9.on()
         } else {
            L9.off()
         }
         before.B8 = B8.value
         console.log(B8.value)
      }

      console.log(a0.stroke)
      console.log(a1.stroke)
      // console.log(A0.value)

   })

}