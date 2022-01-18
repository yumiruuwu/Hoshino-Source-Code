const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Xem trạng thái của bot!',
    async execute (client, message) {
        const pingEmbed = new MessageEmbed()
        .setTitle('Ping pong :3')
        .setColor('RANDOM')
        .setDescription(`**__Độ trễ của bot:__** ${Date.now() - message.createdTimestamp}ms\n**__Độ trễ phản hồi từ server:__** ${Math.round(client.ws.ping)} ms`)
        .setTimestamp()
        
        return message.reply({ embeds: [pingEmbed] }).catch(err => {
            console.log(err);
        });
    }
}