let five = require("johnny-five")
let board = new five.Board()
let production = require("./production.js")
let calibrate = require("./calibrate.js")

module.exports = async App => {

   let { config } = App
   App.five = five
   App.board = board


   board.on("ready", function () {

      // 生产模式
      if (config.init) {
         production(App)
      }
      // 适配模式
      else {
         calibrate(App)
      }

   })

}

