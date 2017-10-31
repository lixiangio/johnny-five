let fs = require("fs")
let five = require("johnny-five")
let board = new five.Board()
let config = require('./config.json')

board.five = five
board.config = config

let production = require("./controller/production.js")
let adaptation = require("./controller/adaptation.js")

// 生产模式
if (config.init) {
   board.on("ready", production)
}
// 适配模式
else {
   board.on("ready", adaptation)
}