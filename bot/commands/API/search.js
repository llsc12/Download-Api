const discord = require('discord.js'), fetch = require('node-fetch'), ytdl = require('ytdl-core')
const ytsr = require('ytsr')
module.exports = {
  name:'search',
  description:"Search for videos on YouTube",
  usage:"search <query>",
  cooldown:3,
  aliases:['query'],
  async execute(client, message, args) {
    if (!args[0]) return message.channel.send('You need to provide search terms!').then(x => x.delete({timeout:4000}))
    let searchTerms = args.join(" ")
    let searchMsg = await message.channel.send(new discord.MessageEmbed().setTitle(`Getting results for *${searchTerms}*`).setDescription('Give us a minute please!').setColor('BLUE'))
    let json = await ytsr(searchTerms, {limit:8})
    let embed = new discord.MessageEmbed()
    .setTitle(`Results for *${searchTerms}*`)
    .setAuthor(message.author.username, message.author.avatarURL())
    json.items.forEach(result => {
      if (result.type !== 'video') return
      embed.addField(result.title, `[${result.author.name}](${result.author.url})\n${result.views} views\nDuration: ${result.duration}\nUploaded ${result.uploadedAt}\n\n[View in YouTube](${result.url})\n[View in API](https://llsc12.ml/watch?v=${result.id})\n[Download](https://llsc12.ml/api/v1/download?url=${result.url})\n[Download Video Only](https://llsc12.ml/api/v1/video?url=${result.url})\n[Download Audio Only](https://llsc12.ml/api/v1/audio?url=${result.url})`)
    })
    searchMsg.edit(embed)
  }
}