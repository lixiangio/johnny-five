let io = require('socket.io')()
let batchImport = require('batch-import')

let { controllers } = batchImport({
   "controllers": {
      "path": "server/controllers/"
   }
})

// 用户建立连接
io.on('connection', function (socket) {

   for (let key in controllers) {
      let controller = controllers[key]
      if (typeof controller === "function") {
         controller(socket)
      }
   }

   // console.log(io.sockets.sockets)

})



io.use(function (socket, next) {
   // console.log(socket)
   next();
});

// webSocket在board ready事件触发后启动
App.server = function () {
   io.listen(80)
}
