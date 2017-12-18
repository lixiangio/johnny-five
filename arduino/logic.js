"use strict"

let { five, config, Led, Sensor, Actuator } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor
let { A8, A9 } = Actuator

// 水位传感器初始值
S0.status = 0 // 状态切换，0:正常，1:加，-1:减
S0.model = false // 模式开关，false：监听模式，true:控制模式

let d0 = s0.limit.difference / 100
let d1 = s1.limit.difference / 100

App.logic = function () {

   // 高于上限
   if (S0.value > s0.limit.max) {

      // 执行器最大行程保护
      if (S1.value >= s1.limit.max) {
         A8.low()
         A9.low()
      }
      // 减水
      else {
         A8.high()
         A9.low()
      }

   }

   // 低于下限
   else if (S0.value < s0.limit.min) {

      // 执行器最小行程保护
      if (S1.value <= s1.limit.min) {
         A8.low()
         A9.low()
      }
      // 减水
      else {
         A8.low()
         A9.high()
      }

   }

   // 正常范围
   else {

      // 使用等比例公差调节法，在允许范围内保持同步
      let proportion0 = (S0.value - s0.limit.min) / d0
      let proportion1 = (S1.value - s1.limit.min) / d1
      let tolerance = proportion0 - proportion1
      console.log(proportion0, proportion1, tolerance, S0.lock)

      // 模式切换
      if (S0.model) {
         // 监听模式，浮动公差为+-10%
         console.log("监")
         if (tolerance > 10) {
            S0.model = false
         } else if (tolerance < -10) {
            S0.model = false
         }
      } else {
         // 调节模式，浮动公差为+-2%
         if (tolerance > 2) {
            A8.low()
            A9.high()
            console.log("加")
         } else if (tolerance < -2) {
            A8.high()
            A9.low()
            console.log("减")
         } else {
            A8.low()
            A9.low()
            S0.model = true
         }
      }

   }

}