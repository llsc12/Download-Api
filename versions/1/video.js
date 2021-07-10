const ytdl = require('ytdl-core')
module.exports = {
  endpoint:"video",
  async execute(req, res) {
    let vidURL = req.query.url
    if (!vidURL) return res.send({error:'No URL provided. Add url as query.'})
    let details = await ytdl.getBasicInfo(vidURL).catch(e => {return res.send({error:'API Error: '+e})})
    if (!details.page) {return res.send({error:'API Error: Page not available'})}
    let vid = ytdl(vidURL, {filter: 'videoonly', quality: 'highestvideo'})
    .on('error', (e) => {return res.send({error:'API Error: '+e})})
    res.set('Content-Type', 'application/octet-stream')
    res.set('Content-Disposition', 'attachment; filename="video.mp4"')
    vid.pipe(res)
  }
}