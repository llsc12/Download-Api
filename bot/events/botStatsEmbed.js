const discord = require('discord.js')
module.exports = {
  name:"messageReactionAdd",
  execute(client, reaction, user) {
    if (reaction.message.content.includes("Bot Stats") && reaction.message.author == client.user && user != client.user && reaction.emoji.name == '🔄') {
      reaction.users.remove(user.id)
      const embed = new discord.MessageEmbed()
      .setTitle("Bot Statistics")
      .setDescription("Thanks for adding me! llsc12 is happi kek")
      .addField('Servers I\'m In', client.guilds.cache.size, true)
      .addField('Members I\'m Serving', client.guilds.cache.reduce((a, g) => a + g.memberCount, 0), true)
      .addField('Members in this guild', reaction.message.guild.memberCount, true)
      .setColor("GREEN")
      .setFooter('Last Refreshed')
      .setTimestamp()
      reaction.message.edit(embed)
    }
  }
}
