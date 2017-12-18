module.exports = {
   sensor(data) {
      for (let key in data) {
         let item = data[key]
         let limit = item.limit
         if (limit) {
            limit.difference = limit.max - limit.min
         }
      }
   }
}