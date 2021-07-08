module.exports = {
  name:'guildslist',
  description:'DMs me guilds the bot is in',
  hidden:true,
  execute(client, message) {
    if (message.author.id != '381538809180848128') return
			message.delete()
			let list = new Array()
			client.guilds.cache.forEach(guild => {
				list[list.length + 1 ] = (`${guild.name} - ${guild.owner} (${guild.memberCount})\n`)
				if (list.length == 10) {
					message.author.send(list.join(""))
					list = new Array()
				}
			})
			if (list.length !== 0) message.author.send(list.join(""))
  }
}