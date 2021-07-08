const discord = require('discord.js'), fs = require('fs'), enmap = require('enmap')
module.exports = {
  name:"messageReactionAdd",
  execute(client, reaction, user) {
    const data = new enmap({ name: "botdata", dataDir:"./bot/data"});
    function deniedEmbed(err) {
      const deniedEmbed = new discord.MessageEmbed()
      .setTitle('Error')
      .setDescription(err)
      .setThumbnail('https://images-ext-1.discordapp.net/external/9yiAQ7ZAI3Rw8ai2p1uGMsaBIQ1roOA4K-ZrGbd0P_8/https/cdn1.iconfinder.com/data/icons/web-essentials-circle-style/48/delete-512.png?width=461&height=461')
      .setColor('RED')
      .setTimestamp();
      return deniedEmbed
    }
    if (!client.msgOwners.get(reaction.message.id)) return
    if (client.msgOwners.get(reaction.message.id).includes("Help Menu") && reaction.message.author == client.user && user != client.user) {
      reaction.users.remove(user.id)
      if (!client.msgOwners.get(reaction.message.id).slice('Help Menu '.length, `Help Menu ${user.id} `.length).includes(user.id)) return user.send(deniedEmbed('You didn\'t instate this command and hence cannot add reactions'))
      const helpEmbed = new discord.MessageEmbed()
      .setTitle('Help Menu')
      .setDescription(`Showing directory *\`./commands/\`*\n\n***${fs.readdirSync('./bot/commands/').join('\n')}***`)
      .setThumbnail(`https://llsc12.ml/assets/favicon.png`)
      .setColor('BLUE')
      .setFooter('Aquacious',`https://llsc12.ml/assets/favicon.png`)
  
      var prefix = 'dl!'
      let rawDirectory = fs.readdirSync('./bot/commands')
      let directory = new Array()
      rawDirectory.forEach(n => directory[directory.length] = n)
      directory.unshift('Home')
      let currentPage = client.msgOwners.get(reaction.message.id).slice(`Help Menu ${user.id} `.length)
      if (reaction.emoji.name == '◀️') var nextPage = directory[directory.indexOf(currentPage)-1]
      if (reaction.emoji.name == '▶️') var nextPage = directory[directory.indexOf(currentPage)+1]
      if (reaction.emoji.name == '🏠') var nextPage = directory[0]
      if (reaction.emoji.name == '⏹') return reaction.message.delete()

      if (nextPage !== 'Home' && nextPage !== undefined) {
        let workingDirectory = fs.readdirSync(`./bot/commands/${nextPage}/`)
        var cmdsText = new Array()
        if (!workingDirectory[0]) cmdsText[0] = `*A tumbleweed tumbles...*\n\nThis category seems to be empty.\nCheck back later maybe?\n`
        else workingDirectory.forEach(fileName => {
          command = require(`./../commands/${nextPage}/${fileName}`)
          if (command.hidden) return
          cmdsText[cmdsText.length] = `**${prefix}${command.name}**\n${command.description}`
        })
        var nextPageEmbed = new discord.MessageEmbed()
        .setTitle('Help Menu')
        .setDescription(`Showing directory *\`./bot/commands/${nextPage}\`*\n\n${cmdsText.join('\n')}`)
        .setThumbnail(`https://llsc12.ml/assets/favicon.png`)
        .setColor('BLUE')
        .setFooter('Aquacious',`https://llsc12.ml/assets/favicon.png`)
      } else {
        if (currentPage == 'Home' && reaction.emoji.name == '◀️') {
          nextPage = rawDirectory[rawDirectory.length-1]
          let workingDirectory = fs.readdirSync(`./bot/commands/${nextPage}/`)
          var cmdsText = new Array()
          if (!workingDirectory[0]) cmdsText[0] = `*A tumbleweed tumbles...*\n\nThis category seems to be empty.\nCheck back later maybe?\n`
          else workingDirectory.forEach(fileName => {
            command = require(`./../commands/${nextPage}/${fileName}`)
            if (command.hidden) return
            cmdsText[cmdsText.length] = `**${prefix}${command.name}**\n${command.description}`
          })
          var nextPageEmbed = new discord.MessageEmbed()
          .setTitle('Help Menu')
          .setDescription(`Showing directory *\`./bot/commands/${nextPage}\`*\n\n${cmdsText.join('\n')}`)
          .setThumbnail(`https://llsc12.ml/assets/favicon.png`)
          .setColor('BLUE')
          .setFooter('Aquacious',`https://llsc12.ml/assets/favicon.png`)
        }
        else {
          var nextPageEmbed = helpEmbed
          nextPage = 'Home'
        }
      }

      let embed = nextPageEmbed
      client.msgOwners.set(reaction.message.id ,'Help Menu '+user.id+` ${nextPage}`)
      reaction.message.edit(embed)

    }
  }
}