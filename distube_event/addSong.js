//const Discord = require('discord.js');

module.exports = (client, queue, song) => {

    queue.textChannel.send(`Đã thêm **${song.name}** vào hàng chờ!`)
    
}