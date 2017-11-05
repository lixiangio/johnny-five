let http = require("http")

module.exports = async App => {

   http.createServer(function (request, response) {

      response.writeHead(200, { 'Content-Type': 'text/plain' });

      response.end(JSON.stringify(App.config));

   }).listen(80)

}
