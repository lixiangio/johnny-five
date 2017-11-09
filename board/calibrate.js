let fs = require("fs")

module.exports = App => {

   let { Config, Button, Led, Sensor } = App

   let { sensor: { A0: a0, A1: a1 } } = Config
   let { B11, } = Button
   let { L12, L13 } = Led
   let { A0, A1, } = Sensor

   B11.before = 0

   A0.on("data", function () {

      if (B11.value === B11.before) {
         if (B11.value) {
            if (!B11.time) {
               B11.time = Date.now()
            }
            if (Date.now() - B11.time > 3000) {
               if (L12.value) {
                  let json = JSON.stringify(Config, null, 4)
                  fs.writeFile("./config/board.json", json, function (err) {
                     if (err) {
                        return console.log(err)
                     }
                  })
                  L12.off()
               } else {
                  // 切换到生产模式
                  L12.on()
               }
            }
         } else {
            B11.time = 0
         }
      }

      B11.before = B11.value

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

      console.log(B11.value)

      // console.log(a0.stroke)
      // console.log(a1.stroke)
      // console.log(Math.random())
      // console.log(A0.value, A1.value)

   })


}