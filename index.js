let App = {
   config: require('./config/board.json'),
}

require("./board/")(App)

require("./server/")(App)