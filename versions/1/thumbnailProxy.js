module.exports = {
  endpoint:'thumbnails',
  async execute(req, res) {
    const fetch = require('node-fetch');
    const axios = require('axios');
    let imgpath = req.query.path
    if (!imgpath) return res.send({error:'No path provided. Add path as query.'})
    res.set('Content-Type', 'image/jpeg')
    imgpath = `https://i.ytimg.com/${imgpath}`
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
  }
}