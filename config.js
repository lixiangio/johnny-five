// 参数配置文件
module.exports = {
   // 输入
   enter: {
      'A0': {
         name: '前池水位传感器',
         min: 0,
         max: 100,
      },
      'A1': {
         name: '一号阀门位置传感器',
         min: 0,// 最小值
         max: 100,// 最大值
         rate: { min: 30, max: 50 },// 位移速率
      },
   },
   // 输出
   output: {
      "P10": {
         name: '一号阀门私服电机加水',
         value: 0,
      },
      "P11": {
         name: '一号阀门私服电机减水',
         value: 0,
      },
   },
   // 修正系数
   correct: {
      time: {
         name: '前池水位变化速率',
         value: 0,
      },
   },
}