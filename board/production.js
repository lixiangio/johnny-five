let { five, config, Led, Sensor, Actuator } = App
let { sensor: { 0: s0, 1: s1 } } = config
let { S0, S1 } = Sensor
let { A8, A9 } = Actuator

let trend = 0 // 趋势，0、正常，1、升，-1、降

// 调节等待时间，以秒为单位
let interval = 60 * 1000

// 上次调整记录
let last = {
   S0: 100,//前池水位传感器
   S1: 100,//一号阀门位置传感器
   date: new Date()//调整时间
}

module.exports = function Action() {

   // 高于警戒值
   if (S0.value > s0.limit.max) {

      // 电机行程保护
      if (S1.value >= s1.stroke.max) {
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

      trend = 1

   }

   // 低于警戒值
   else if (S0.value < s0.limit.min) {

      // 电机行程保护
      if (S1.value <= s1.stroke.min) {
         if (A9.value === 1) {
            A8.low()
            A9.low()
         }
         return
      }

      // 等待状态，小于60秒不执行
      // let date = new Date()
      // if (date - last.date < interval) {
      //    return
      // }

      // 趋势判断(如果增长率大于2%，则不用调节)
      // let change = S0.value - last.S0
      // if (change > 2) {
      //    return
      // }

      // 多级调价
      // if (S1.value < last.S1 + 5) {
      //    A8.low()
      //    A9.high()
      //    return
      // }

      if (A9.value === 0) {
         A8.low()
         A9.high()
      }

      trend = -1

   }

   // 正常范围内
   else {

      // 由高位切换至正常范围
      if (trend === 1) {
         if (S0.value < s0.limit.expect) {
            trend = 0
            if (A8.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

      // 由低位切换至正常范围
      else if (trend === -1) {
         if (S0.value > s0.limit.expect) {
            trend = 0
            if (A9.value === 1) {
               A8.low()
               A9.low()
            }
         }
      }

   }

   if (A8.value) {
      log = '加'
   } else if (A9.value) {
      log = '减'
   } else {
      log = '停'
   }

   console.log(log, '前池水位：' + S0.value, '阀门开度：' + S1.value, trend, A8.value)

}