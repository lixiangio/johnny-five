let five = require("johnny-five")

let min = 85
let max = 95
let expect = 90

module.exports = function () {

   let P10 = new five.Pin(10)// 加
   let P11 = new five.Pin(11)// 减

   let A0 = new five.Sensor({
      pin: 'A0',
      freq: 250,
   })

   let A1 = new five.Sensor({
      pin: 'A1',
      freq: 250,
   })

   let button = new five.Button(8);

   // //前池水位监听
   A0.on("data", function () {
      console.log(button.value)
   })

}