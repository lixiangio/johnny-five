let Config = require('./config/board.json')
let five = require("johnny-five")
let board = new five.Board()

global.App = {
   five,
   board,
   Config,
}

// arduino
require("./board/")

// web控制台
require("./console/")
