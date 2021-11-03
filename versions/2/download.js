const ytdl = require('ytdl-core'), fs = require('fs'), path = require('path');
module.exports = {
  endpoint:"download",
  async execute(req, res) {
    let vidURL = req.query.url
    if (!vidURL) return res.send({error:'No URL provided. Add url as query.'})
    let err;
    let details = await ytdl.getBasicInfo(vidURL).catch(e => {err = e})
    if (err) return res.send({error: `${err}`})
    //check if file exists

    if (fs.existsSync(`./cache/${details.videoDetails.videoId}.mp4`)) {
      res.set('Content-Type', 'video/mp4')
      res.set('Content-Disposition', `attachment; filename="${details.videoDetails.videoId}.mp4"`)
      res.sendFile(path.join(__dirname, '../../cache/'+details.videoDetails.videoId+'.mp4'))
    } else {
      res.set('Content-Type', 'video/mp4')
      res.set('Content-Disposition', `attachment; filename="${details.videoDetails.videoId}.mp4"`)
      ytdl(vidURL, {filter: 'audioandvideo', quality: 'highestvideo'})
      .on('error', (e) => {return res.send({error:'API Error: '+e})})
      .pipe(res)
      .on('finish', () => {
        // if inProgress.mp4 file exists, return
        if (fs.existsSync(`./cache/${details.videoDetails.videoId}.inProgress.mp4`)) return
        ytdl(vidURL, {filter: 'audioandvideo', quality: 'highestvideo'})
        .pipe(fs.createWriteStream(`./cache/${details.videoDetails.videoId}.inProgress.mp4`))
        .on('finish', () => {
          fs.rename(`./cache/${details.videoDetails.videoId}.inProgress.mp4`, `./cache/${details.videoDetails.videoId}.mp4`, (err) => {
            if (err) throw err;
          })
        })
      })
    }
  }
}