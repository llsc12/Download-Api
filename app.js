/*
________________________________________________________________________________________________________________________________________________________
|                                                                                                                                                      |
| ██╗  ██╗ ██████╗ ██╗    ██╗    ██████╗ ██╗██████╗     ██╗    ██╗███████╗     ██████╗ ███████╗████████╗    ██╗  ██╗███████╗██████╗ ███████╗██████╗    |
| ██║  ██║██╔═══██╗██║    ██║    ██╔══██╗██║██╔══██╗    ██║    ██║██╔════╝    ██╔════╝ ██╔════╝╚══██╔══╝    ██║  ██║██╔════╝██╔══██╗██╔════╝╚════██╗   |
| ███████║██║   ██║██║ █╗ ██║    ██║  ██║██║██║  ██║    ██║ █╗ ██║█████╗      ██║  ███╗█████╗     ██║       ███████║█████╗  ██████╔╝█████╗    ▄███╔╝   |
| ██╔══██║██║   ██║██║███╗██║    ██║  ██║██║██║  ██║    ██║███╗██║██╔══╝      ██║   ██║██╔══╝     ██║       ██╔══██║██╔══╝  ██╔══██╗██╔══╝    ▀▀══╝    |
| ██║  ██║╚██████╔╝╚███╔███╔╝    ██████╔╝██║██████╔╝    ╚███╔███╔╝███████╗    ╚██████╔╝███████╗   ██║       ██║  ██║███████╗██║  ██║███████╗  ██╗      |
| ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝     ╚═════╝ ╚═╝╚═════╝      ╚══╝╚══╝ ╚══════╝     ╚═════╝ ╚══════╝   ╚═╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝  ╚═╝      |
|______________________________________________________________________________________________________________________________________________________|

*/

const config = require("./configuration.json"), express = require('express'), discord = require('discord.js'), chalk = require('chalk'), fs = require("fs")

const srv = express()
require('./express.js').express(srv)

if (config.bot_token) {
  console.log('\nStarting Discord bot')
  const client = new discord.Client()
  const eventFiles = fs.readdirSync('./bot/events').filter(file => file.endsWith('.js'));
  const commandFolders = fs.readdirSync('./bot/commands')
  client.commands = new discord.Collection();
  client.cooldowns = new discord.Collection();
  client.msgOwners = new discord.Collection();

  client.login(config.bot_token);

  // Load Events
  for (const file of eventFiles) {
    const event = require(`./bot/events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args))
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args))
    }
    console.log(chalk.hex('#808080')(`Loaded event `)+chalk.hex('#3c850c')(`${file} - ${require(`./bot/events/${file}`).name} event`))
  }

  // Load Commands
  for (const folder of commandFolders) {
    if (folder.endsWith('.js')) {
      console.log(chalk.red(`File (${folder}) not in subdirectory, please move it. File has been ignored.`))
      return
    }
    if (folder == '.DS_Store') return fs.unlinkSync(`./bot/commands/${folder}`)
    const commandFiles = fs.readdirSync(`./bot/commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./bot/commands/${folder}/${file}`);
      client.commands.set(command.name, command);
      console.log(chalk.hex('#808080')(`Loaded command `)+chalk.hex('#3c850c')(`${file} - ${require(`./bot/commands/${folder}/${file}`).name}`))
    }
  }
}
