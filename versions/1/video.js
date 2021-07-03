const ytdl = require('ytdl-core')
module.exports = {
  endpoint:"video",
  execute(req, res) {
    let vidURL = req.query.url
    if (!vidURL) return res.send({error:'No URL provided. Add url as query.'})
    if (!vidURL.includes('youtu')) return res.send({error:'Invalid URL provided. Add YouTube URL as query.'})
    res.set('Content-Type', 'application/octet-stream')
    res.set('Content-Disposition', 'attachment; filename="video.mp4"')
    try {
    ytdl(vidURL, {filter: 'videoonly', quality: 'highestvideo'})
    .on('error', (e) => {return res.send({error:'API Error: '+e})})
    .pipe(res)
    }
    catch (e) {return res.send({error:'API Error: '+e})}
  }
}