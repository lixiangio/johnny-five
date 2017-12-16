"use strict"

let { five, config, Led, Sensor, Actuator } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor
let { A8, A9 } = Actuator

let lastTime = Date.now() // 上次调节时间戳
let interval = 60 * 1000// 调节间隔周期
let lock = false// 状态锁

// 水位传感器初始值
S0.status = 0 // 状态切换，0、正常，1、升，-1、降
S0.lastStatus = 0 // 切换为正常状态之前的状态
S0.lastValue = 0 // 上次调整值

// 执行器传感器初始值
S1.lastValue = 0 // 上次调整值


let xx = (s1.range.max - s1.range.min) / s1.series
console.log(xx)

App.logic = function () {

   // 时间周期，每间隔60s触发一次
   let nowTime = Date.now()
   if (nowTime - lastTime < interval) {
      if (lock) return
   } else {
      lock = !lock
   }

   lastTime = nowTime

   // 高于上限
   if (S0.value > s0.limit.max) {

      S0.status = 1

      // 趋势判断，如果前后对比趋势为升或持平则减
      if (S0.value - S0.lastValue >= 0) {
         // 执行器最大行程保护
         if (S1.value >= s1.range.max) {
            if (A8.value === 1) {
               A8.low()
               A9.low()
            }
            return
         }


         A8.high()
         S1.lastValue = S1.value
      }

   }

   // 低于下限
   else if (S0.value < s0.limit.min) {

      S0.status = -1

      // 执行器最小行程保护
      if (S1.value <= s1.range.min) {
         if (A9.value === 1) {
            A8.low()
            A9.low()
         }
         return
      }

      // 等待状态，小于60秒不执行
      // let date = new Date()
      // if (date - lastData.date < interval) {
      //    return
      // }

      if (A9.value === 0) {
         A8.low()
         A9.high()
      }

   }

   // 正常范围内
   else {

      // 由上限切换至正常范围
      if (S0.status === 1) {
         // 如果越过目标值则切换到正常状态
         if (S0.value < s0.limit.expect) {
            S0.status = 0
            S0.lastStatus = 1
            if (A8.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

      // 由下限切换至正常范围
      else if (S0.status === -1) {
         // 如果越过目标值则切换到正常状态
         if (S0.value > s0.limit.expect) {
            S0.status = 0
            S0.lastStatus = -1
            if (A9.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

   }

}