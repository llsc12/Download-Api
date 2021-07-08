const discord = require('discord.js')
module.exports = {
  name:'credits',
  aliases:['about'],
  cooldown:5,
  description:'A shoutout to everyone who contributed!',
  execute(client, message){
    const creditembed = new discord.MessageEmbed()
			.setTitle('Credits')
			.setURL('https://discord.gg/TRc3vENjCW')
			.setColor('#1abc9c')
			.setDescription('Thanks to all the lovely people below, this bot was born!')
			.addField('**Lead Developer**', 'llsc12', true)
			.addField('**Developer**', 'Matt', true)
			.addField('**Illustrator**', 'Squid', true)
			.addField('**Animator**', 'ScratchHacker', true)
			.addField('**Readme Developer**', 'Superbro', true)
			.addField('**Ava** ❤️', 'Ava ❤️', true)
      .addField('\nDownload API', `This bot was built from the framework of [Aquacious](https://aquacious.github.io)`)
			.setFooter('Aquacious', `https://github.com/llsc12/Aquacious/raw/main/aicon.gif`)
			message.channel.send(creditembed)
  }
}