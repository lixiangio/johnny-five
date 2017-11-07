let fs = require("fs")

module.exports = App => {

   let { Config, Button, Led, Sensor } = App

   let { sensor: { A0: a0, A1: a1 } } = Config
   let { B8, } = Button
   let { L9, } = Led
   let { A0, A1, } = Sensor

   B8.before = 0

   A0.on("data", function () {

      if (B8.value === B8.before) {
         if (B8.value) {
            if (!B8.time) {
               B8.time = Date.now()
            }
            if (Date.now() - B8.time > 3000) {
               if (L9.value) {
                  let json = JSON.stringify(Config, null, 4)
                  fs.writeFile("./config/board.json", json, function (err) {
                     if (err) {
                        return console.log(err)
                     }
                  })
                  L9.off()
               } else {
                  // 切换到生产模式
                  L9.on()
               }
            }
         } else {
            B8.time = 0
         }
      }

      B8.before = B8.value

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

      console.log(a0.stroke)
      console.log(a1.stroke)
      console.log(A0.value, A1.value)

   })


}