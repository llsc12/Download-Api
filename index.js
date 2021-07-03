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

const Discord = require('discord.js'), si = require("systeminformation"), nodeOS = require("os"), config = require("./config.json"), fs = require("fs"), ytdl = require('ytdl-core'), express = require('express'), path = require('path');
3
if (config.bot_token) {
  const client = new Discord.Client()
  client.login(config.bot_token);
}

const srv = express()
console.log('Started API')

for (const versionFolder of fs.readdirSync('./versions')) {
  if (versionFolder.match(/[0-9]+/)) {
    let endpoints = new Array()
    for (const file of fs.readdirSync(`./versions/${versionFolder}/`)) {
      const loaded = require(`./versions/${versionFolder}/${file}`)
      if (!loaded.endpoint || !loaded.execute) return
      endpoints.push(`/api/v${versionFolder}/${loaded.endpoint}`)
      console.log('loaded '+loaded.endpoint)
      srv.all(`/api/v${versionFolder}/${loaded.endpoint}`, (...args) => loaded.execute(...args))
      delete require.cache[require.resolve(`./versions/${versionFolder}/${file}`)];
    }
    srv.all(`/api/v${versionFolder}`, (req, res) => {
      res.send(endpoints)
    })
  } else {
    fs.unlinkSync(`./versions/${versionFolder}`)
  }
}

srv.all(`/`, (req, res) => {
  let verFolders = new Array()
  for (folder of fs.readdirSync('./versions')) verFolders.push(folder)
  let latestVer = Math.max(...verFolders)

  res.send(`
  <p><a href="/api/v${latestVer}">Click to see latest endpoints</a></p>
  <p><a href="/watch">Click to use the GUI</a></p>
  <p><a href="https://github.com/llsc12/download-api">Click to check out the GitHub Repo</a></p>

  <title>Download API</title>
  <meta content="Download API" property="og:title">
  <meta content="YouTube API written in NodeJS" property="og:description">
  <meta content="https://avatars.githubusercontent.com/u/42747613" property="og:image">
  <meta content="#00FFF4" data-react-helmet="true" name="theme-color">

  `)
})

srv.all('/api', (req, res) => {
  let verFolders = new Array()
  for (folder of fs.readdirSync('./versions')) verFolders.push(folder)
  let latestVer = Math.max(...verFolders)

  res.redirect(307, `/api/v${latestVer}`)
})

srv.all('/watch', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'))
})
srv.all('/watch/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/style.css'))
})
srv.all('/favicon.png', (req, res) => {
  res.sendFile(path.join(__dirname, '/favicon.png'))
})
let portnumber = 3000
if (config.port) portnumber = config.port
srv.listen(portnumber)

