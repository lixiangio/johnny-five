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

   let { L12, L13 } = Led
   let { B11 } = Button
   B11.lastState = 0
   B11.lock = false
   
   let production = require("./production.js")
   let calibrate = require("./calibrate.js")

   if (config.init) {
      // 生产模式
      App.action = production
   } else {
      // 适配模式
      App.action = calibrate
   }

   setInterval(function () {

      // 控制输入
      if (B11.value === 0) {

         if (B11.value === B11.lastState) {

            if (Date.now() - B11.time > 3000) {

               if (B11.lock === false) {
                  // 由适配模式切换到生产模式
                  if (L12.value) {
                     config.init = true
                     let json = JSON.stringify(config, null, 4)
                     fs.writeFile("./config.json", json, function (err) {
                        if (err) {
                           return console.log(err)
                        }
                     })
                     L12.off()
                     App.action = production
                     console.log('生产模式')
                  }
                  // 由生产模式切换到适配模式
                  else {
                     L12.on()
                     App.action = calibrate
                     console.log('适配模式')
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
      
      App.action()

   }, 100)

})
