const ytdl = require('ytdl-core'), fs = require('fs'), path = require('path'), exec = require('child_process').exec;
module.exports = {
  endpoint:"audio",
  async execute(req, res) {
    const cacheSize = require('./../../configuration.json').cacheSize
    let vidURL = req.query.url
    if (!vidURL) return res.send({error:'No URL provided. Add url as query.'})
    let err;
    let details = await ytdl.getBasicInfo(vidURL).catch(e => {err = e})
    if (err) return res.send({error: `${err}`})
    //check if file exists

    res.set('Content-Type', 'audio/mp3')
    res.set('Content-Disposition', `attachment; filename="${details.videoDetails.title}.mp3"`)
    if (fs.existsSync(`./cache/${details.videoDetails.videoId}.mp3`)) {
      res.sendFile(path.join(__dirname, '../../cache/'+details.videoDetails.videoId+'.mp3'))
    } else {
      // check cache before starting a download 
      exec('du -s -h ./cache', (error, stdout, stderr) => {
        if (error) console.log(`Error: ${error}`);
        else {
          let lines = stdout.split('\n')
          let size = lines[0].split('\t')[0].slice(0, 3)
          if (lines[0].split('\t')[0].includes('G')) {
            size = parseFloat(size)
            if (size > cacheSize) {
              fs.readdirSync('./cache').forEach(file => {
                fs.unlinkSync(`./cache/${file}`)
              })
            }
          }
        }
      })

      // run command to download video to cache folder and then sendfile to res
      let cmd = `cd cache && yt-dlp -f 'ba' -x --audio-format mp3 "${vidURL}" -o '%(id)s.%(ext)s'`
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          res.send({error: `Unknown error occurred.`})
          return;
        } else {
          res.sendFile(path.join(__dirname, '../../cache/'+details.videoDetails.videoId+'.mp3'))
        }
      });
    }
  }
}