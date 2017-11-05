module.exports = function ({ five, config }) {

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

   let button_adapter = new five.Button(8)

   let led_power_supplyr = new five.Pin(11)
   let led_fault = new five.Pin(10)
   let led_adapter = new five.Pin(9)

   setTimeout(function () {
      led_adapter.high()
      led_fault.high()
   }, 1000)

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

      // let tolerance = 1 - A1.value / a1.stroke.max
      // if (tolerance < 0.005 || tolerance < -0.005) {
      //    console.log(tolerance)
      // }

      if (button_adapter.value !== before.B8) {
         if (button_adapter.value === 1) {
            led_adapter.low()
         } else {
            led_adapter.high()
         }
         before.B8 = button_adapter.value
         console.log(button_adapter.value)
      }

      // console.log(a0.stroke)
      // console.log(a1.stroke)
      // console.log(A0.value)

   })

}