"use strict"

let { config, Led, Button, Sensor } = App
let { L12 } = Led
let { B10, B11 } = Button

// 工作指示灯，闪烁表示暂停
L12.blink(500)

// 暂停按钮
B11.on("press", function () {

   if (App.run) {
      App.run = false
      L12.blink(500)
      console.log("暂停")
   } else {
      App.run = true
      L12.stop().on()
      console.log("工作")
   }

})