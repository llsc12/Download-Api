const Discord = require('discord.js')
module.exports = {
	name: 'ping',
  description: 'Ping!',
	async execute(client, message, args) {
    message.delete()
    const pingmsg = await message.channel.send("Pinging...");
    await pingmsg.edit(`Calculating...`);
    pingmsg.delete();
    let ping = pingmsg.createdTimestamp - message.createdTimestamp
    if (ping <= 150) {
      var color = '#33ff33';
    } else if (ping > 150 && ping < 250) {
      var color = '#ff7700';
    } else {
      var color = '#ff0000'
    }
    const pingembed = new Discord.MessageEmbed()
    .setTitle('Current Bot Ping')
    .addField('Websocket Heartbeat', `${client.ws.ping}ms`, true)
    .addField('Roundtrip Latency',`${ping}ms`, true)
    .setColor(color)
    .setFooter('Requested by '+message.author.tag, message.author.displayAvatarURL({dynamic: true}));
    message.channel.send(pingembed).then(m => {m.delete({timeout:30000})})
	},
};