let { five, board, Config } = App

board.on("ready", async function () {

   // 创建指示灯
   App.Led = {}
   for (let pin in Config.led) {
      App.Led[`L${pin}`] = new five.Led(pin)
      App.Led[`L${pin}`].on()
   }

   // 创建按钮
   App.Button = {}
   for (let pin in Config.button) {
      App.Button[`B${pin}`] = new five.Button(pin)
   }

   // 创建传感器
   App.Sensor = {}
   for (let pin in Config.sensor) {
      App.Sensor[`S${pin}`] = new five.Sensor(`A${pin}`)
   }

   // 创建执行器
   App.Actuator = {}
   for (let pin in Config.actuator) {
      App.Actuator[`A${pin}`] = new five.Relay(pin)
      // App.Actuator[`A${pin}`].close()
   }

   // 检查指示灯
   await new Promise(function (resolve, reject) {
      setTimeout(resolve, 2000)
   }).then(() => {
      for (let pin in Config.led) {
         let item = Config.led[pin]
         if (!item.default) {
            App.Led[`L${pin}`].off()
         }
      }
   })

   App.production = require("./production.js")
   App.calibrate = require("./calibrate.js")

   if (Config.init) {
      // 生产模式
      App.Action = App.production
   } else {
      // 适配模式
      App.Action = App.calibrate
   }

   setInterval(function () {
      App.Action()
   }, 200)

})
