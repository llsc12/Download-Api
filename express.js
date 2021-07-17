module.exports = {
  express(srv) {
    const express = require('express'), fs = require('fs'), path = require('path'), config = require('./configuration.json')

    for (const versionFolder of fs.readdirSync('./versions')) {
      // iterate through all api versions and add to srv for each endpoint of each version
      if (versionFolder.match(/[0-9]+/)) {
        let endpoints = new Array() // to generate the endpoints list for all version pages
        for (const file of fs.readdirSync(`./versions/${versionFolder}/`)) {
          const loaded = require(`./versions/${versionFolder}/${file}`)
          if (!loaded.endpoint || !loaded.execute) return
          endpoints.push(`/api/v${versionFolder}/${loaded.endpoint}`)
          console.log('Loaded Endpoint '+loaded.endpoint)
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

    // Now that the api is done loading, make a new subdirectory of pages

    for (let page of fs.readdirSync('./web')) {
      if (page == '.DS_Store') return fs.unlinkSync(`./web/${page}`)
      let pageContents = fs.readdirSync('./web/'+page)
      pageContents.forEach(file => {
        if (file == 'index.html') {
          srv.all(`/${page}`, (req, res) => {
            res.sendFile(path.join(__dirname, `/web/${page}/${file}`))
          })
        } else if (file == '.DS_Store') {
          fs.unlinkSync(`./web/${page}/${file}`)
        } else {
          srv.all(`/${page}/${file}`, (req, res) => {
            res.sendFile(path.join(__dirname, `/web/${page}/${file}`))
          })
        }
      })
      console.log(`Loaded Webpage ${page}`)
    }


    let portnumber = 4000
    if (config.port) portnumber = config.port
    console.log('Running on local port '+portnumber)
    srv.listen(portnumber)
  }
}