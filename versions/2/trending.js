const ytrend = require("yt-trending-scraper")
module.exports = {
  endpoint:"trending",
  async execute(req, res) {
    const pages = ["default", "gaming", "music"]
    const cc = req.query.cc || "UK"
    const page = req.query.page || "default"
    if (!pages.includes(page)) {
      const trending = await ytrend.trending(cc)
      res.json(trending)
    }
    const params = {
      geoLocation: cc.toUpperCase(),
      parseCreatorOnRise: false,
      page: 'music'
    }
    const trending = await ytrend.scrape_trending_page(params)
    let videos = []
    trending.forEach(video => {
      if (video.type == "video") {videos.push(video)}
    })
    res.send(videos)
  }
}