const ytdl = require('ytdl-core')
module.exports = {
  endpoint:"video",
  async execute(req, res) {
    let vidURL = req.query.url
    if (!vidURL) return res.send({error:'No URL provided. Add url as query.'})
    let details = await ytdl.getBasicInfo(vidURL).catch(e => {return res.send({error:'API Error: '+e})})
    let vid = ytdl(vidURL, {filter: 'videoonly', quality: 'highestvideo'})
    .on('error', (e) => {return res.send({error:'API Error: '+e})})
    res.set('Content-Type', 'video/mp4')
    res.set('Content-Disposition', 'attachment; filename="video.mp4"')
    vid.pipe(res)
  }
}