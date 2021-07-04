const ytpl = require('ytpl');
module.exports = {
  endpoint:"playlistData",
  async execute(req, res) {
    function urlParse (url) {
      // thanks to Intelli :)
      let urlquery = url.split('?')[1]
      if (!urlquery) return []
      let params = urlquery.split('&')
      let array = new Array()
      for (each of params) {
        let split = each.split('=')
        array[split[0]]=split[1]
      }
      return array
    }

    let playURL = req.query.url
    let list = req.query.list

    if (!playURL) return res.send({error:'No URL provided. Add url as query.'})
    if (playURL.includes('list') || list) {
      if (!list && playURL.includes('list')) {
        list = urlParse(playURL)["list"]
      }
      let playlist = await ytpl(list, {limit:Infinity})
      res.send(playlist)
    } else return res.send({error:"Invalid URL provided. Is not a playlist URL."})
  }
}
