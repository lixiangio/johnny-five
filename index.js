let config = require('./config.json')
let five = require("johnny-five")
let board = new five.Board()

global.App = {
   config,
   five,
   board,
   Led: {},
   Button: {},
   Sensor: {},
   Actuator: {},
}

// Arduino
require("./arduino/")

// Web控制台
require("./server/")
