let fs = require("fs")
let { config, Led, Button } = App
let { L12, L13 } = Led
let { B11 } = Button
B11.lastState = 0
B11.lock = false

// 开关控制面板
module.exports = function () {

   if (B11.value === 0) {

      if (B11.value === B11.lastState) {

         if (Date.now() - B11.time > 3000) {

            if (B11.lock === false) {
               // 由适配模式切换到生产模式
               if (L12.value) {
                  config.init = true
                  let json = JSON.stringify(config, null, 4)
                  fs.writeFile("./board/config.json", json, function (err) {
                     if (err) {
                        return console.log(err)
                     }
                  })
                  L12.off()
                  App.action = App.production
                  console.log('生产模式')
               }
               // 由生产模式切换到适配模式
               else {
                  L12.on()
                  App.action = App.calibrate

                  // 传感器初始化
                  for (let pin in config.sensor) {
                     let item = config.sensor[pin]
                     item.stroke = {
                        min: 1024,
                        max: 0,
                     }
                  }

                  console.log('适配模式')
               }
            }

            B11.lock = true

         }

      }

      // 状态切换，如果当前状态与上一次状态不一致，则为状态变更
      else {
         B11.time = Date.now()
         B11.lock = false
      }

   }

   B11.lastState = B11.value

}