const ytsr = require('ytsr')
module.exports = {
  endpoint:"search",
  async execute(req, res) {
    if (req.query.search_query) {
      let limited = 50
      if (req.query.limit) limited = parseInt(req.query.limit)
      let result = await ytsr(req.query.search_query, {limit:limited})
      return res.send(result)
    } else return res.send('No search terms provided. Add search terms as as search_query.')
  }
}