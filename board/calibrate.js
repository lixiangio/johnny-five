let fs = require("fs")
let { config, Led, Sensor } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor

module.exports = function () {

   if (S0.value < s0.stroke.min) {
      s0.stroke.min = S0.value
   }

   if (S0.value > s0.stroke.max) {
      s0.stroke.max = S0.value
   }

   if (S1.value < s1.stroke.min) {
      s1.stroke.min = S1.value
   }

   if (S1.value > s1.stroke.max) {
      s1.stroke.max = S1.value
   }

   // console.log(s0.stroke)
   // console.log(s1.stroke)
   // console.log(Math.random())
   console.log(S0.value, S1.value)

}