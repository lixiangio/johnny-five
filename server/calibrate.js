let { config, Led, Sensor } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor

module.exports = function () {

   if (S0.value < s0.limit.min) {
      s0.limit.min = S0.value
   }

   if (S0.value > s0.limit.max) {
      s0.limit.max = S0.value
   }

   if (S1.value < s1.limit.min) {
      s1.limit.min = S1.value
   }

   if (S1.value > s1.limit.max) {
      s1.limit.max = S1.value
   }

}