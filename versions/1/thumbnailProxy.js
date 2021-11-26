const fetch = require('node-fetch');
//const axios = require('axios');
module.exports = {
  endpoint:'thumbnails',
  async execute(req, res) {
    let imgpath = req.query.path
    if (!imgpath) return res.send({error:'No path provided. Add path as query.'})
    res.set('Content-Type', 'image/jpeg')
    imgpath = `https://i.ytimg.com/${imgpath}`

    //fetch image path and pipe it to res
    try {
      let response = await fetch(imgpath);
      let image = await response.body;
      image.pipe(res);
    } catch (e) {
      res.send({error: `Unknown error occurred`}) 
    }
    /*
    axios({
      url: imgpath,
      responseType: 'stream',
    }).then(
      response =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(res)
            .on('finish', () => resolve())
            .on('error', e => reject(e));
        }),
    );
    */
  }
}