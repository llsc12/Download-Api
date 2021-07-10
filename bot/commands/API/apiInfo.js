const { MessageEmbed } = require("discord.js")

module.exports = {
  name:'api',
  aliases:['url', 'apiinfo', 'sourceurl'],
  execute(client, message, args) {
    message.channel.send(new MessageEmbed().setTitle('The API').setDescription('[The API](https://llsc12.ml) is the backend that powers this bot and a few other things, and anyone can use it for free in their work! \nThe API allows for many things, such as bypassing age verification or bypassing network restrictions in places of school or work.\nA [Viewing Site](https://llsc12.ml/watch?v=E5HRvQNg4pQ) also exists which takes advantage of the API already. \nNone of the video is stored anywhere and is directly streamed from YouTube, passed through the API Server and sent to your browser or project! \nThe entire project is available for free on [GitHub](https://github.com/llsc12/download-api) for you to use and contribute to!').setColor('RED'))
  }
}