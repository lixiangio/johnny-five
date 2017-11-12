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
      let item = config.led[pin]
      if (item.default === true) {
         Led[`L${pin}`].on()
      } else {
         Led[`L${pin}`].off()
      }
   }

   // 创建按钮
   for (let pin in config.button) {
      let item = config.button[pin]
      item.pin = pin
      Button[`B${pin}`] = new five.Button(item)
   }

   // 创建传感器
   for (let pin in config.sensor) {
      Sensor[`S${pin}`] = new five.Sensor(`A${pin}`)
      let item = config.sensor[pin]
      // 将百分比limit转换为实际值，并赋值到对应的传感器实例上
      if (item.limit) {
         let difference = item.stroke.max - item.stroke.min
         Sensor[`S${pin}`].limit = {
            min: item.stroke.min + Math.round(difference * (item.limit.min * 0.01)),
            max: item.stroke.min + Math.round(difference * (item.limit.max * 0.01)),
            expect: item.stroke.min + Math.round(difference * (item.limit.expect * 0.01)),
         }
      }
   }

   // 创建执行器
   for (let pin in config.actuator) {
      Actuator[`A${pin}`] = new five.Pin(pin)
   }

   require("./control.js")

})
