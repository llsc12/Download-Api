module.exports = {
  name:'ready',
  execute(client) {
    console.log("Download API Bot online now!")
    if (!client.user.avatarURL()) client.user.setAvatar('https://llsc12.ml/assets/favicon.png')
    if (client.user.username !== 'Download API') client.user.setUsername('Download API')
    client.user.setPresence({
      status: 'dnd',
      activity: {
        name: 'dl!help',
        type: 'PLAYING'
      }
    })
  }
}