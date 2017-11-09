let production = require("./production.js")
let calibrate = require("./calibrate.js")

module.exports = App => {

   let { five, board, Config, Button, Sensor, Led } = App

   board.on("ready", async function () {

      // 创建LED指示灯
      for (let pin in Config.led) {
         Led[`L${pin}`] = new five.Led(pin)
      }

      // 创建按钮
      for (let pin in Config.button) {
         Button[`B${pin}`] = new five.Button(pin)
      }

      // 创建传感器
      for (let pin in Config.sensor) {
         Sensor[pin] = new five.Sensor(pin)
      }

      // 指示灯检查
      await new Promise(function (resolve, reject) {
         setTimeout(resolve, 2000)
      }).then(() => {
         for (let pin in Config.led) {
            let item = Config.led[pin]
            if (!item.default) {
               Led[`L${pin}`].off()
            }
         }
      })

      if (Config.init) {
         // 生产模式
         production(App)
      } else {
         // 适配模式
         calibrate(App)
      }

   })

}

