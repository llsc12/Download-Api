const discord = require('discord.js'), enmap = require('enmap')
module.exports = {
  name:"stats",
  description:"Bot statistics like servers I'm in",
  execute(client, message) {
    const data = new enmap({name:'botdata', dataDir:'./bot/data'})
    const embed = new discord.MessageEmbed()
    .setTitle("Bot Statistics")
    .setDescription("Thanks for adding me! llsc12 is happi kek")
    .addField('Servers I\'m In', client.guilds.cache.size, true)
    .addField('Members I\'m Serving', client.guilds.cache.reduce((a, g) => a + g.memberCount, 0), true)
    .addField('Members in this guild', message.guild.memberCount, true)
    .addField('Total Received Messages', data.get('msgCounterTotal'), true)
    .addField('Total Received Commands', data.get('cmdCounterTotal'), true)
    .setColor("GREEN")
    .setFooter('Last Refreshed')
    .setTimestamp()
    message.channel.send('Bot Stats').then(x => {
      x.edit(embed)
      x.react('🔄')
    })
  }
}