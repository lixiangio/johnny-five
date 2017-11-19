"use strict"

let { config, board, } = App

board.on("ready", function () {

   // 解析配置文件并初始化io引脚
   require("./builder")(config)

   // 控制面板
   require("./control.js")

   // 业务逻辑
   require("./logic.js")

   // 循环监测
   this.loop(config.wait, function () {
      if (App.run) App.logic()
      // if (S1.value !== lastData.S1) {
      //    // App.socket.emit('news', { S1: S1.value });
      // }
   })

   // 启用webSocket接口
   App.server()

})
