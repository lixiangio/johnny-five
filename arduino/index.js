"use strict"

let config = require('./config.json')
let five = require("johnny-five")
let board = new five.Board()

global.App = {
   five,
   board,
   config,
   Led: {},
   Button: {},
   Sensor: {},
   Actuator: {},
}

board.on("ready", function () {

   require("./builder")(config)

   require("./control.js")

   // 循环监测
   this.loop(config.wait, function () {
      App.action()
   })

})
