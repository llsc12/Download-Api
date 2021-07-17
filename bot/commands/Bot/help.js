const discord = require('discord.js'), fs = require('fs')
module.exports = {
	name: 'help',
	description: 'Advanced Dynamic Help Command (ADHC)',
  usage:'help [command]',
	async execute(client, message, args) {
    var prefix = 'dl!'
    message.delete()
    if (!args[0]) {
      const helpEmbed = new discord.MessageEmbed()
      .setTitle('Help Menu')
      .setDescription(`Showing directory *\`./bot/commands/\`*\n\n***${fs.readdirSync('./bot/commands/').join('\n')}***`)
      .setThumbnail(`https://llsc12.ml/assets/favicon.png`)
      .setColor('BLUE')
      .setFooter('Download API',`https://llsc12.ml/assets/favicon.png`)

      message.channel.send(helpEmbed).then(async x => {
        client.msgOwners.set(x.id ,'Help Menu '+message.author.id+` Home`)
        await x.react("◀️")
        await x.react("▶️")
        await x.react("🏠")
        await x.react("⏹")
        x.delete({timeout:240000})
      })
    } else {
      const searchTerms = args.join(' ')
      let searchResults = new Array()
      let categoryDirectories = new Array()
      fs.readdirSync('./bot/commands').forEach(c => categoryDirectories[categoryDirectories.length] = c)
      categoryDirectories.forEach(categoryName => {
        cmdFileNames = fs.readdirSync(`./bot/commands/${categoryName}`)
        cmdFileNames.forEach(cmdName => {
          let cmd = require(`./../${categoryName}/${cmdName}`)
          if (!cmd.name) return
          if (cmd.hidden && !cmd.searchable) return
          if (cmd.name.includes(searchTerms)) return searchResults[searchResults.length] = cmd
          if (cmd.aliases) if (cmd.aliases.includes(searchTerms)) return searchResults[searchResults.length] = cmd
          if (cmd.description) if (cmd.description.includes(searchTerms)) return searchResults[searchResults.length] = cmd
        })
      })
      if (!searchResults[0]) return message.channel.send('No matching commands found.').then(x => x.delete({timeout:5000}))
      let names = new Array()
      searchResults.forEach(x=>names[names.length]=`${names.length+1}. ${x.name}`)
      let selected = 0
      
      if (names.length >= 2) {
        let selectMsg = await message.channel.send(
          new discord.MessageEmbed()
          .setTitle("Found Commands")
          .setDescription(names.slice(0,10).join('\n'))
          .setColor("BLUE")
          .setFooter('Select a command via the number next to it, send 0 to return',`https://llsc12.ml/assets/favicon.png`)
        )
        try {
          response = await message.channel.awaitMessages(msg => 0 < parseInt(msg.content) && parseInt(msg.content) < names.slice(0,10).length+1 && msg.author.id == message.author.id, {
            max: 1,
            time: 30000,
            errors: ['time']
          })
        } catch(e) {
          selectMsg.delete()
          return message.channel.send("Selection timed out.").then(x => x.delete({timeout:5000}))
        }
        response.first().delete()
        selectMsg.delete()
        if (parseInt(response.first().content)==0) return message.channel.send('Cancelled.').then(x => x.delete({timeout:5000}))
        selected = parseInt(response.first().content)-1
      }
      let selectedHelpCommand = searchResults[selected]
      if (selectedHelpCommand.aliases) var aliases = selectedHelpCommand.aliases.join(', ')
      else var aliases = `No aliases exist for ${prefix+selectedHelpCommand.name}`
      if (selectedHelpCommand.usage) var usage = prefix+selectedHelpCommand.usage
      else var usage = `Not Provided`
      let embed = new discord.MessageEmbed()
      .setTitle(prefix+selectedHelpCommand.name)
      .setDescription(selectedHelpCommand.description)
      .addField("Aliases", aliases)
      .setColor("BLUE")
      .addField('Usage', usage)
      .setFooter('Download API',`https://llsc12.ml/assets/favicon.png`)

      message.channel.send(embed)
    }
	},
};