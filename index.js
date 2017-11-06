let Config = require('./config/board.json')
let five = require("johnny-five")
let board = new five.Board()

let App = {
   five,
   board,
   Config,
   Button: {},
   Sensor: {},
   Led: {},
}

// web控制台
require("./server/")(App)

// 硬件
require("./board/")(App)
