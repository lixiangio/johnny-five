let fs = require("fs")
let { config, Led, Button } = App
let { L12, L13 } = Led
let { B10, B11 } = Button

App.production = require("./production.js")
App.calibrate = require("./calibrate.js")
App.stop = require("./stop.js")

B10.stop = false
B10.on("press", function () {

   // 适配模式下禁止操作
   if (L12.value === 0) {

      // 生产模式下短按，执行运行/暂停操作
      if (App.action === App.production) {
         App.action = App.stop
         L13.blink(500)
         B10.stop = true
         console.log("暂停")
      } else {
         App.action = App.production
         L13.stop().on()
         B10.stop = false
         console.log("工作")
      }

   }

})

B11.lastState = 0
B11.lock = false
B11.on("press", function () {
   // 记录按下时的时间
   B11.time = Date.now()
})

B11.on("hold", function () {

   let now = Date.now()

   if (B11.lock === false) {

      // 长按，表示模式切换
      if (now - B11.time > 3000) {

         // 由适配模式切换到生产模式
         if (L12.value) {

            config.init = true
            let json = JSON.stringify(config, null, 4)
            fs.writeFile("./arduino/config.json", json, function (err) {
               if (err) {
                  return console.log(err)
               }
            })
            L12.off()
            
            if (B10.stop) {
               App.action = App.stop
               console.log('切换为生产模式 - 暂停状态')
            } else {
               App.action = App.production
               console.log('切换为生产模式 - 工作状态')
            }
            

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

            console.log('切换为适配模式')

         }

         // 每次触发后上锁，直到释放按钮后才解锁
         B11.lock = true

      }

   }

})

B11.on("release", function () {
   B11.lock = false
})

if (config.init) {
   // 生产模式
   App.action = App.production
} else {
   // 适配模式
   App.action = App.calibrate
}

setInterval(function () {
   B11.lastState = B11.value
   App.action()
}, config.rate)