let config = require('./config.json')
let five = require("johnny-five")
let board = new five.Board()

global.App = {
   five, board, config,
   Led: {},
   Button: {},
   Sensor: {},
   Actuator: {},
}

let { Led, Button, Sensor, Actuator } = App

board.on("ready", async function () {

   // 创建指示灯
   for (let pin in config.led) {
      Led[`L${pin}`] = new five.Led(pin)
      Led[`L${pin}`].on()
   }

   // 创建按钮
   for (let pin in config.button) {
      Button[`B${pin}`] = new five.Button(pin)
   }

   // 创建传感器
   for (let pin in config.sensor) {
      Sensor[`S${pin}`] = new five.Sensor(`A${pin}`)
   }

   // 创建执行器
   for (let pin in config.actuator) {
      Actuator[`A${pin}`] = new five.Pin(pin)
   }

   // 检查指示灯
   await new Promise(function (resolve, reject) {
      setTimeout(resolve, 2000)
   }).then(() => {
      for (let pin in config.led) {
         let item = config.led[pin]
         if (!item.default) {
            Led[`L${pin}`].off()
         }
      }
   })

   let control = require("./control.js")
   App.production = require("./production.js")
   App.calibrate = require("./calibrate.js")

   if (config.init) {
      // 生产模式
      App.action = App.production
   } else {
      // 适配模式
      App.action = App.calibrate
   }

   setInterval(function () {

      control()

      App.action()

   }, 100)

})
