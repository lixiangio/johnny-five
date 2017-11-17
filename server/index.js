let io = require('socket.io')()
let batchImport = require('batch-import')

let { controllers } = batchImport({
   "controllers": {
      "path": "server/controllers/"
   }
})

io.on('connection', function (socket) {

   for (let key in controllers) {
      let controller = controllers[key]
      if (typeof controller === "function") {
         controller(socket)
      }
   }

})

// webSocket在board ready事件触发后启动
App.server = function () {
   io.listen(80)
}
