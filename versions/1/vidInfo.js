const ytdl = require('ytdl-core')
module.exports = {
  endpoint:"getInfo",
  async execute(req, res) {
    let vidURL = req.query.url
    if (!vidURL) return res.send({error:'No URL provided. Add url as query.'})
    let details = await ytdl.getBasicInfo(vidURL).catch(e => {return res.send({error:'API Error: '+e})})
    let dictionary = 
    {
      videoDetails:details.videoDetails,
      related_videos:details.related_videos,
      player_response:{
        microformat:details.player_response.microformat,
        videoDetails:details.player_response.videoDetails,
        playabilityStatus:details.player_response.playabilityStatus,
        playerConfig:{
          audioConfig:details.player_response.playerConfig.audioConfig,
          streamSelectionConfig:details.player_response.playerConfig.streamSelectionConfig,
          mediaCommonConfig:details.player_response.playerConfig.mediaCommonConfig
        },
      },
      page:details.page
    }
    res.send(dictionary)
  }
}