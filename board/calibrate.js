let fs = require("fs")

let { Config, Button, Led, Sensor } = App
let { sensor: { 0: s0, 1: s1 } } = Config
let { B10, B11 } = Button
let { L12, L13 } = Led
let { S0, S1 } = Sensor

B11.lastState = 0
B11.lock = false

module.exports = function () {

   if (B11.value === 0) {

      if (B11.value === B11.lastState) {

         if (Date.now() - B11.time > 3000) {

            if (B11.lock === false) {
               // 由适配模式切换到生产模式
               if (L12.value) {
                  let json = JSON.stringify(Config, null, 4)
                  fs.writeFile("./config/board.json", json, function (err) {
                     if (err) {
                        return console.log(err)
                     }
                  })
                  L12.off()
                  // App.Action = App.production
               }
               // 由生产模式切换到适配模式
               else {
                  L12.on()
                  // App.Action = App.calibrate
               }
            }
            B11.lock = true

         }

      }

      // 状态切换，如果当前状态与上一次状态不一致，则视为状态变更
      else {
         B11.time = Date.now()
         B11.lock = false
      }
   }

   B11.lastState = B11.value

   if (S0.value < s0.stroke.min) {
      s0.stroke.min = S0.value
   }

   if (S0.value > s0.stroke.max) {
      s0.stroke.max = S0.value
   }

   if (S1.value < s1.stroke.min) {
      s1.stroke.min = S1.value
   }

   if (S1.value > s1.stroke.max) {
      s1.stroke.max = S1.value
   }

   // console.log(B11.value)

   // console.log(s0.stroke)
   // console.log(s1.stroke)
   // console.log(Math.random())
   // console.log(S0.value, S1.value)

}