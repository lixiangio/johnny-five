"use strict"

let { config, board, } = App

board.on("ready", function () {

   require("./builder")(config)

   require("./control.js")

   // 循环监测
   this.loop(config.wait, function () {
      App.action()
   })

})
