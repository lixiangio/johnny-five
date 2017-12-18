let config = require('./config.json')
let tools = require("./tools.js")
let five = require("johnny-five")
let board = new five.Board()

global.App = {
   config,
   five,
   board,
   run: false,
   Led: {},
   Button: {},
   Sensor: {},
   Actuator: {},
}

// 传感器配置项目预处理
tools.sensor(config.sensor)

// Arduino
require("./arduino/")

// Web控制台
require("./server/")
