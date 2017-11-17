"use strict"

let fs = require("fs")
let { config, Led, Button, Sensor } = App
let { L12, L13 } = Led
let { B10, B11 } = Button

App.work = require("./work.js")
App.stop = function () { }

B11.stop = false
B11.on("press", function () {

   // 生产模式下短按，执行运行/暂停操作
   if (B11.stop) {
      B11.stop = false
      App.action = App.work
      L13.stop().on()
      console.log("工作")
   } else {
      B11.stop = true
      App.action = App.stop
      L13.blink(500)
      console.log("暂停")
   }

})


if (config.init) {
   App.action = App.work
} else {
   App.action = App.stop
}