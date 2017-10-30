let fs = require("fs")
let runBuffer = fs.readFileSync('run.json')
let config = JSON.parse(runBuffer.toString())

let five = require("johnny-five")
let board = new five.Board()

let production = require("./controller/production.js")
let adaptation = require("./controller/adaptation.js")

// 生产模式
if (!config.init) {
   board.on("ready", production)
}
// 自适应模式
else {
   board.on("ready", adaptation)
}