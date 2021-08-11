const fetch = require('node-fetch')
module.exports = {
  endpoint:"routinehub",
  async execute(req, res) {
    if (req.query.rhid) {
      let api = await fetch(`https://routinehub.co/api/v1/shortcuts/${req.query.rhid}/versions/latest`)
      return res.send(await api.json())
    } else return res.send('No rhid provided. Add rhid as query.')
  }
}