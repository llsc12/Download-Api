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
      
      res.sendFile(path.join(__dirname, `/root.html`))
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

    /*
    setInterval(async () => {
      const exec = require('child_process').exec;
      exec('du -s -h ./cache', (error, stdout, stderr) => {
        if (error) console.log(`Error: ${error}`);
        else {
          let lines = stdout.split('\n')
          let size = lines[0].split('\t')[0].slice(0, 3)
          size = parseFloat(size)
          console.log(size)
          if (size > 20) {
            fs.readdirSync('./cache').forEach(file => {
              fs.unlinkSync(`./cache/${file}`)
            })
            console.log('Cache cleared')
          }
        }
      })
    }, 60000)
    */
  }
}