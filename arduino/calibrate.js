let { config, Led, Sensor } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor

module.exports = function () {

   if (S0.value < s0.range.min) {
      s0.range.min = S0.value
   }

   if (S0.value > s0.range.max) {
      s0.range.max = S0.value
   }

   if (S1.value < s1.range.min) {
      s1.range.min = S1.value
   }

   if (S1.value > s1.range.max) {
      s1.range.max = S1.value
   }

   console.log(s0.range)
   
   // console.log(s1.range)
   // console.log(S0.value, S1.value)

}