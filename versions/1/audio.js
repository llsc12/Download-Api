const ytdl = require('ytdl-core')
module.exports = {
  endpoint:"audio",
  execute(req, res) {
    let vidURL = req.query.url
    if (!vidURL) return res.send({error:'No URL provided. Add url as query.'})
    if (!vidURL.includes('youtu')) return res.send({error:'Invalid URL provided. Add YouTube URL as query.'})
    res.set('Content-Type', 'application/octet-stream')
    res.set('Content-Disposition', 'attachment; filename="audio.webm"')
    try {
    ytdl(vidURL, {filter: 'audioonly', quality: 'highestaudio'})
    .on('error', (e) => {return res.send({error:'API Error: '+e})})
    .pipe(res)
    }
    catch (e) {return res.send({error:'API Error: '+e})}
  }
}