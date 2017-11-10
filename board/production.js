let { five, Config, Button, Led, Sensor, Actuator } = App
let { sensor: { A0: a0, A1: a1 } } = Config
let { B11 } = Button
let { L12, L13 } = Led
let { A0, A1 } = Sensor

let P10 = new five.Pin(10)// 加
let P11 = new five.Pin(11)// 减

let { A8, A9 } = Actuator


// 水位变化方向，0、正常，1、加水，-1、减水
let trend = 0

// 调节等待时间，以秒为单位
let interval = 60 * 1000

// 上次调整记录
let last = {
   A0: 100,//前池水位传感器
   A1: 100,//一号阀门位置传感器
   date: new Date()//调整时间
}

module.exports = function Action() {

   // 高于警戒值
   if (A0.value > a0.limit.max) {

      // 电机行程保护
      if (A1.value >= a1.stroke.max) {
         if (P10.value === 1) {
            P10.low()
            P11.low()
         }
         return
      }

      if (P10.value === 0) {
         P10.high()
         P11.low()
      }

      trend = 1

   }

   // 低于警戒值
   else if (A0.value < a0.limit.min) {

      // 电机行程保护
      if (A1.value <= a1.stroke.min) {
         if (P11.value === 1) {
            P10.low()
            P11.low()
         }
         return
      }

      // 等待状态，小于60秒不执行
      // let date = new Date()
      // if (date - last.date < interval) {
      //    return
      // }

      // 趋势判断(如果增长率大于2%，则不用调节)
      // let change = A0.value - last.A0
      // if (change > 2) {
      //    return
      // }

      // 多级调价
      // if (A1.value < last.A1 + 5) {
      //    P10.low()
      //    P11.high()
      //    return
      // }

      if (P11.value === 0) {
         P10.low()
         P11.high()
      }

      trend = -1

   }

   // 正常范围内
   else {

      // 由高位切换至正常范围
      if (trend === 1) {
         if (A0.value < a0.limit.expect) {
            trend = 0
            if (P10.value === 1) {
               P10.low()
               P11.low()
            }
         }
      }

      // 由低位切换至正常范围
      else if (trend === -1) {
         if (A0.value > a0.limit.expect) {
            trend = 0
            if (P11.value === 1) {
               P10.low()
               P11.low()
            }
         }
      }

   }

   if (P10.value) {
      log = '加'
   } else if (P11.value) {
      log = '减'
   } else {
      log = '停'
   }

   console.log(log, '前池水位：' + A0.value, '阀门开度：' + A1.value, trend, P10.value)

}