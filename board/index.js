let fs = require("fs")
let five = require("johnny-five")
let board = new five.Board()
let config = require('./config.json')
let production = require("./production.js")
let calibrate = require("./calibrate.js")

board.on("ready", function () {

   // 生产模式
   if (config.init) {
      production({ five, config })
   }
   // 适配模式
   else {
      calibrate({ five, config })
   }

})
