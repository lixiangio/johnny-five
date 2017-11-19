"use strict"

let { five, config, Led, Sensor, Actuator } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor
let { A8, A9 } = Actuator

let status = 0 //趋势，0、正常，1、升，-1、降

// 调节等待时间，以秒为单位
let interval = 60 * 1000

// 上次调整记录
let lastData = {
   S0: 100,//前池水位传感器
   S1: 100,//一号阀门位置传感器
   date: new Date(),//调整时间
}

App.logic = function () {

   // if (S1.value !== lastData.S1) {
   //    // App.socket.emit('news', { S1: S1.value });
   // }

   // 高于正常范围
   if (S0.value > s0.limit.max) {

      status = 1

      // 电机行程保护
      if (S1.value >= s1.range.max) {
         if (A8.value === 1) {
            A8.low()
            A9.low()
         }
         return
      }

      if (A8.value === 0) {
         A8.high()
         A9.low()
      }

   }

   // 低于正常范围
   else if (S0.value < s0.limit.min) {

      status = -1

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

   // 正常范围
   else {

      // 由高位切换至正常范围
      if (status === 1) {
         // 如果跨过期望值则停止
         if (S0.value < s0.limit.expect) {
            status = 0
            if (A8.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

      // 由低位切换至正常范围
      else if (status === -1) {
         // 如果跨过理想值则停止
         if (S0.value > s0.limit.expect) {
            status = 0
            if (A9.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

   }

   let log = ''

   if (A8.value) {
      log = '加'
   } else if (A9.value) {
      log = '减'
   } else {
      log = '停'
   }

   lastData.S0 = S0.value
   lastData.S1 = S1.value

   // console.log(log, '前池水位：' + S0.value, '阀门开度：' + S1.value, '趋势：' + status, '私服电机反转：' + A8.value)

}