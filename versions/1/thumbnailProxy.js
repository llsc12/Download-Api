const fetch = require('node-fetch'), ytdl = require('ytdl-core');
//const axios = require('axios');
module.exports = {
  endpoint:'thumbnails',
  async execute(req, res) {
    let imgpath = req.query.path
    let imgid = req.query.id
    if (!imgpath && !imgid) return res.send({error:'No path provided. Add path as query.'})

    if (imgpath) {
      imgpath = `https://i.ytimg.com/${imgpath}`
      //fetch image path and pipe it to res
      try {
        let response = await fetch(imgpath);
        let image = await response.body;
        res.set('Content-Type', 'image/jpeg')
        image.pipe(res);
      } catch (e) {
        res.send({error: `Unknown error occurred`}) 
      }
    } else if (imgid) {
      //fetch image id and pipe it to res
      try {
        let vidinfo = await ytdl.getInfo(imgid)
        let index = vidinfo.videoDetails.thumbnails.length -1
        while (vidinfo.videoDetails.thumbnails[index].url.endsWith(".webp")) {
          index=index-1
        }
        let vidimgurl = vidinfo.videoDetails.thumbnails[index].url
        res.send(vidimgurl)
      } catch (e) {
        res.send({error: `Unknown error occurred`}) 
      }
    }
  }
}