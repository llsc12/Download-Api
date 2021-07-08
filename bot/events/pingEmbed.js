const discord = require('discord.js')
module.exports = {
  name:'message', 
  execute(client, message, args) {
    if (!message.guild || message.author.bot) return;
    let prefix = 'dl!'
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
      let eb = new discord.MessageEmbed()
      .setTitle('Hey! I\'m Download API!')
      .setDescription(`My prefix in this guild is currently **${prefix}**`)
      .setTimestamp()
      .setColor('BLUE')
      .setThumbnail(`https://llsc12.ml/assets/favicon.png`)
      message.channel.send(eb)
      return;
    }
  }
}