"use strict"

let { five, config, Led, Sensor, Actuator } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor
let { A8, A9 } = Actuator

S0.status = 0 // 状态切换，0、正常，1、升，-1、降
// S0.lastStatus = 0 // 记录切换为正常状态之前的状态
// S0.lastTime = Date.now() // 记录切换为正常状态时的时间戳

let interval = 60 * 1000// 调整间隔周期
let lastTime = 0 // 上次调整时间
let lastValue = 0 // 记录上次调整值
let difference = (s1.limit.max - s1.limit.min) / 10 // 差值计算

App.logic = function () {

   // 高于最大公差
   if (S0.value > s0.limit.max) {

      S0.status = 1

      // 电机最大行程保护
      if (S1.value >= s1.range.max) {
         if (A8.value === 1) {
            A8.low()
            A9.low()
         }
         return
      }

      // 每间隔1分钟触发一次
      let nowTime = Date.now()
      if (nowTime - lastTime > interval) {
         // 如果前后对比，趋势为升或持平则减
         if (S0.value - lastValue >= 0) {
            if (S1.value - S1.lastValue <= difference) {
               A8.high()
            } else {
               A8.low()
               lastTime = nowTime// 时间锁
               S1.lastValue = S1.value
            }
         }
      }

   }

   // 低于最小公差
   else if (S0.value < s0.limit.min) {

      S0.status = -1

      // 电机行程保护
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

      // 趋势判断(如果增长率大于2%，则不用调节)
      // let change = S0.value - lastData.S0
      // if (change > 2) {
      //    return
      // }

      // 多级调价
      // if (S1.value < lastData.S1 + 5) {
      //    A8.low()
      //    A9.high()
      //    return
      // }

      if (A9.value === 0) {
         A8.low()
         A9.high()
      }

   }

   // 公差范围内
   else {

      // 由高于公差切换至正常公差
      if (S0.status === 1) {
         // 如果越过目标值则切换到正常状态
         if (S0.value < s0.limit.expect) {
            S0.status = 0
            S0.lastStatus = 1
            S0.lastTime = Date.now()
            if (A8.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

      // 由低于公差切换至正常公差
      else if (S0.status === -1) {
         // 如果越过目标值则切换到正常状态
         if (S0.value > s0.limit.expect) {
            S0.status = 0
            S0.lastStatus = -1
            S0.lastTime = Date.now()
            if (A9.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

   }

   // let log = ''

   // if (A8.value) {
   //    log = '加'
   // } else if (A9.value) {
   //    log = '减'
   // } else {
   //    log = '停'
   // }

   // last.S0 = S0.value
   // last.S1 = S1.value

   // console.log(log, '前池水位：' + S0.value, '阀门开度：' + S1.value, '趋势：' + status, '私服电机反转：' + A8.value)

}