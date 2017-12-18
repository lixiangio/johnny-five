"use strict"

/**
 * 根据配置文件创建传感器对象
 */
let { five, Led, Button, Sensor, Actuator } = App

let method = {
   // 指示灯
   led(config) {
      for (let pin in config) {
         Led[`L${pin}`] = new five.Led(pin)
         let item = config[pin]
         if (item.default === true) {
            Led[`L${pin}`].on()
         } else {
            Led[`L${pin}`].off()
         }
      }
   },
   // 按钮
   button(config) {
      for (let pin in config) {
         let item = config[pin]
         item.pin = pin
         Button[`B${pin}`] = new five.Button(item)
      }
   },
   // 传感器
   sensor(config) {
      for (let pin in config) {
         Sensor[`S${pin}`] = new five.Sensor(`A${pin}`)
      }
   },
   // 执行器
   actuator(config) {
      for (let pin in config) {
         Actuator[`A${pin}`] = new five.Pin(pin)
      }
   }
}

module.exports = configs => {
   for (let name in configs) {
      let action = method[name]
      if (action) {
         action(configs[name])
      }
   }
}
