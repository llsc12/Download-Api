const fetch = require('node-fetch')
module.exports = {
  endpoint:"shortcuts",
  async execute(req, res) {
    if (req.query.id) {
      let api = await fetch(`https://www.icloud.com/shortcuts/api/records/${req.query.id}`)
      return res.send(await api.json())
    } else return res.send('No id provided. Add id as query.')
  }
}